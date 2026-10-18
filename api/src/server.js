import 'dotenv/config';
import { createApp, logger } from './app.js';
import { closeDatabase, getDatabase } from './db/client.js';
import * as logoStorage from './services/logoStorage.js';

const port = Number(process.env.PORT || 3000);
const nodeEnv = process.env.NODE_ENV || 'development';
const app = createApp({ db: getDatabase() });

const server = app.listen(port, () => {
  logger.info({ port, nodeEnv }, 'School SMIS API listening');
});

void logoStorage
  .verifyBucketConnection()
  .then((bucket) =>
    logger.info({ bucket, nodeEnv }, 'Neon Object Storage bucket connected'),
  )
  .catch((error) => {
    logger.error({ err: error, nodeEnv }, 'Neon Object Storage bucket connection failed');
  });

async function shutdown(signal) {
  logger.info({ signal }, 'API shutdown started');
  server.close(async (error) => {
    if (error) {
      logger.error({ err: error }, 'HTTP server shutdown failed');
      process.exitCode = 1;
    }
    try {
      await closeDatabase();
    } catch (databaseError) {
      logger.error({ err: databaseError }, 'Database shutdown failed');
      process.exitCode = 1;
    }
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
