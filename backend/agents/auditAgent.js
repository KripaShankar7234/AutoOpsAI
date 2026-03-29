const AuditLog = require('../models/AuditLog');

async function logAIAction(agentName, action, reason, confidence, relatedData = {}) {
  try {
    const log = new AuditLog({
      agent: agentName,
      action,
      reason,
      confidence,
      relatedData
    });
    await log.save();
    return log;
  } catch (error) {
    console.error('Audit Agent Error:', error);
  }
}

module.exports = { logAIAction };
