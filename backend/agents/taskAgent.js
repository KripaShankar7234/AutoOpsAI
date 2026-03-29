const Task = require('../models/Task');
const { logAIAction } = require('./auditAgent');

async function createTasksFromExtraction(extractedTasks, meetingId) {
  const createdTasks = [];
  try {
    for (const taskData of extractedTasks) {
      const task = new Task({
        title: taskData.title,
        owner: taskData.owner,
        team: taskData.team || 'General',
        deadline: taskData.deadline,
        priority: taskData.priority || 'Medium',
        meetingId: meetingId
      });
      await task.save();
      createdTasks.push(task);
      
      await logAIAction('Task Creation Agent', `Created task: ${task.title}`, 'Task extracted from meeting', 0.95, { taskId: task._id });
    }
    return createdTasks;
  } catch (error) {
    console.error('Task Creation Agent Error:', error);
    throw error;
  }
}

module.exports = { createTasksFromExtraction };
