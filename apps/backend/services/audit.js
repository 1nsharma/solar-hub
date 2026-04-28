/**
 * Audit Service - System-wide Action Logging
 */
const db = require('../db');

class AuditService {
  async log(actorId, action, entityType, entityId, oldValue = null, newValue = null) {
    console.log(`[AuditLog] ${action} on ${entityType} ${entityId} by ${actorId}`);
    try {
      await db.query(
        'INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, old_value, new_value) VALUES ($1, $2, $3, $4, $5, $6)',
        [actorId, action, entityType, entityId, oldValue, newValue]
      );
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  }
}

module.exports = new AuditService();
