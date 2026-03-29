const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  agent: { type: String, required: true },
  action: { type: String, required: true },
  reason: { type: String, required: true },
  confidence: { type: Number, required: true },
  relatedData: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
