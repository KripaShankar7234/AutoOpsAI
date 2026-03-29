const Task = require('../models/Task');
const { generateAIResponse } = require('../services/aiService');

async function predictProjectRisks() {
  try {
    const tasks = await Task.find({});
    
    // Build context
    const totalTasks = tasks.length;
    const overdueTasks = tasks.filter(t => t.status === 'Overdue').length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const completionRate = totalTasks === 0 ? 100 : Math.round((completedTasks/totalTasks)*100);

    const context = `Total Tasks: ${totalTasks}, Completed: ${completedTasks}, Overdue: ${overdueTasks}, Rate: ${completionRate}%. Active Tasks: ${tasks.filter(t => t.status !== 'Completed').map(t => t.title).join(', ')}`;

    const prompt = `Project State: ${context}\nAssess the risk of delay to this project. Provide exactly a JSON output containing "completionProbability" (number between 0 and 100), "riskDetected" (string describing the primary risk), and "suggestedAction" (string action).`;
    const sysInstruction = `You are an AI Project Risk Predictor. Return only a raw JSON object string like {"completionProbability": 72, "riskDetected": "API delay", "suggestedAction": "Add developer"}. Do not use markdown.`;

    const rawResponse = await generateAIResponse(prompt, sysInstruction);
    let riskData = { completionProbability: 50, riskDetected: "Unknown", suggestedAction: "Review tasks manually" };
    try {
      riskData = JSON.parse(rawResponse.replace(/```json|```/gi, "").trim());
    } catch(err) {
      console.error('Failed to parse risk agent json response', err);
    }
    
    return riskData;
  } catch(error) {
    console.error('Risk Predictor Error:', error);
    return { completionProbability: 100, riskDetected: "None", suggestedAction: "None" };
  }
}

module.exports = { predictProjectRisks };
