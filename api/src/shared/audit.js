import { randomUUID } from 'node:crypto';
import { getDatabase } from '../db/client.js';
import { auditLogs } from '../db/schema.js';

export async function recordAudit({
  action,
  actorId = null,
  schoolId = null,
  entityType,
  entityId = null,
  ipAddress = null,
  userAgent = null,
  traceId = randomUUID().replaceAll('-', ''),
  metadata = null,
}) {
  await getDatabase().insert(auditLogs).values({
    id: randomUUID(),
    action,
    actorId,
    schoolId,
    entityType,
    entityId: entityId === null ? null : String(entityId),
    ipAddress,
    userAgent,
    traceId,
    metadata,
  });
}
