import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { createApp, logger } from './app.js';
import { closeDatabase, getDatabase } from './db/client.js';
import * as objectStorage from './shared/object-storage.js';

const port = Number(process.env.PORT || 3000);
const nodeEnv = process.env.NODE_ENV || 'development';
let server;
let shutdownPromise;
let shutdownFailure = false;

async function shutdown(signal, fatalError = null) {
  if (fatalError) shutdownFailure = true;
  if (shutdownPromise) return shutdownPromise;

  shutdownPromise = (async () => {
    logger.info({ signal }, 'API shutdown started');
    let failed = shutdownFailure;

    if (server) {
      try {
        if (!server.listening) {
          await new Promise((resolve) => {
            const onReady = () => {
              server.off('listening', onReady);
              server.off('error', onReady);
              resolve();
            };
            server.once('listening', onReady);
            server.once('error', onReady);
          });
        }
        if (server.listening) {
          await new Promise((resolve, reject) => {
            server.close((error) => (error ? reject(error) : resolve()));
          });
        }
      } catch (error) {
        failed = true;
        logger.error({ err: error }, 'HTTP server shutdown failed');
      }
    }

    try {
      await closeDatabase();
    } catch (error) {
      failed = true;
      logger.error({ err: error }, 'Database shutdown failed');
    }

    process.exitCode = failed || shutdownFailure ? 1 : 0;
    logger.info('API shutdown complete');
  })();

  return shutdownPromise;
}

async function bootstrap() {
  try {
    const db = getDatabase();
    await db.execute(sql`select 1`);
    if (shutdownPromise) return;
    logger.info({ nodeEnv }, 'Database connection established');

    const app = createApp();
    server = app.listen(port);
    await new Promise((resolve, reject) => {
      const onListening = () => {
        server.off('error', onError);
        resolve();
      };
      const onError = (error) => {
        server.off('listening', onListening);
        reject(error);
      };
      server.once('listening', onListening);
      server.once('error', onError);
    });
    if (shutdownPromise) return;
    logger.info({ port, nodeEnv }, 'School SMIS API listening');

    void objectStorage
      .verifyBucketConnection()
      .then((bucket) => logger.info({ bucket, nodeEnv }, 'Neon Object Storage bucket connected'))
      .catch((error) =>
        logger.error({ err: error, nodeEnv }, 'Neon Object Storage bucket connection failed'),
      );
  } catch (error) {
    logger.fatal({ err: error, nodeEnv }, 'Failed to start API server');
    await shutdown('startup failure', error);
  }
}

process.once('SIGINT', () => void shutdown('SIGINT'));
process.once('SIGTERM', () => void shutdown('SIGTERM'));
process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'Uncaught exception');
  void shutdown('uncaughtException', error);
});
process.on('unhandledRejection', (error) => {
  logger.fatal({ err: error }, 'Unhandled promise rejection');
  void shutdown('unhandledRejection', error);
});

void bootstrap();
