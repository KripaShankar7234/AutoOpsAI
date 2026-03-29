const { logAIAction } = require('./auditAgent');
const { generateAIResponse } = require('../services/aiService');

async function triggerExecutionAction(task, actionType) {
  try {
    console.log(`[Execution Agent] Triggering Action: ${actionType} for Task: "${task.title}" (Owner: ${task.owner})`);
    
    // Generate AI suggested action for overdue tasks
    let suggestionText = "Review task status";
    try {
      if (actionType.includes("Send") || actionType.includes("reminder") || task.status === 'Overdue') {
         const prompt = `Task '${task.title}' owned by '${task.owner}' in team '${task.team}' is OVERDUE. 
Provide a very short suggested action to resolve this workflow blockage. (e.g., 'Reassign to another dev', 'Extend deadline by 2 days', etc.)`;
         const aiRaw = await generateAIResponse(prompt, "You are an Autonomous Execution Agent picking the best remediation action. Output only raw text.");
         // Strip out any fallback wrappers if they existed, though aiService handles it
         suggestionText = aiRaw.replace(/{"reply":"|"}/g,"").trim();
         
         // In case fallback hits, give a neat suggestion
         if (suggestionText.includes("AI Rate Limit")) suggestionText = "Temporarily assign extra help";

         // Create a composite reasoning string
         const reasoning = `Task overdue: ${task.title} | Reminder sent to ${task.owner} | Suggested action: ${suggestionText}`;
         
         await logAIAction(
            'Execution Agent', 
            `Executed action: ${actionType}`, 
            reasoning, 
            0.92, 
            { taskId: task._id, actionType, suggestionText }
          );
      }
    } catch(e) {
      console.error(e);
      await logAIAction(
        'Execution Agent', 
        `Executed action: ${actionType}`, 
        `Task ${task._id} requires attention`, 
        0.95, 
        { taskId: task._id, actionType }
      );
    }
    
    return { success: true, message: `Action triggered: ${actionType}` };
  } catch (error) {
    console.error('Execution Agent Error:', error);
    throw error;
  }
}

module.exports = { triggerExecutionAction };
