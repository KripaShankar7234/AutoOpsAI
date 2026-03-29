const Task = require('../models/Task');
const { logAIAction } = require('./auditAgent');
const { triggerExecutionAction } = require('./executionAgent');

async function monitorWorkflows() {
  try {
    const tasks = await Task.find({ status: { $in: ['Pending', 'In Progress'] } });
    const overdueTasks = [];
    const currentDate = new Date();
    
    for (const task of tasks) {
      const taskDate = new Date(task.createdAt);
      const diffTime = Math.abs(currentDate - taskDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      // For demo purposes, we consider tasks overdue if they are older than 2 days
      if (diffDays > 2 || task.deadline.toLowerCase().includes('past')) {
        task.status = 'Overdue';
        await task.save();
        overdueTasks.push(task);
        
        await logAIAction('Workflow Monitoring Agent', `Marked task ${task._id} as Overdue`, 'Task inactive or delayed detected', 0.9, { taskId: task._id });
        await triggerExecutionAction(task, 'Sending reminder to ' + task.owner);
      }
    }
    
    return {
      totalActive: tasks.length,
      overdue: overdueTasks.length,
      bottlenecksDetected: overdueTasks.length > 0,
      overdueTaskDetails: overdueTasks
    };
  } catch (error) {
    console.error('Monitor Agent Error:', error);
    throw error;
  }
}

module.exports = { monitorWorkflows };
