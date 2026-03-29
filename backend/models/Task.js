const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: String, required: true },
  team: { type: String, enum: ['Frontend', 'Backend', 'QA', 'Design', 'Operations', 'General'], default: 'General' },
  deadline: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Overdue'], default: 'Pending' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
