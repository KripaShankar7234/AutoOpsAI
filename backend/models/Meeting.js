const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  transcript: { type: String, required: true },
  summary: { type: String },
  decisions: [{ type: String }],
  extractedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meeting', meetingSchema);
