const express = require('express');
const router = express.Router();
const { monitorWorkflows } = require('../agents/monitorAgent');
const { predictProjectRisks } = require('../agents/riskAgent');
const AuditLog = require('../models/AuditLog');
const Task = require('../models/Task');
const { generateAIResponse } = require('../services/aiService');

router.get('/health', async (req, res) => {
  try {
    const analysis = await monitorWorkflows();
    const riskAnalysis = await predictProjectRisks();
    
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const healthScore = totalTasks === 0 ? 100 : Math.round((completedTasks / totalTasks) * 100);

    res.json({
      ...analysis,
      riskAnalysis,
      healthScore,
      message: 'Workflow monitored successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to monitor workflows' });
  }
});

router.get('/audit', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const tasks = await Task.find();
    
    // Calculate team risks
    const teamsData = {};
    const ownerData = {};
    
    tasks.forEach(task => {
      // 1. Team stats
      const t = task.team || 'General';
      if (!teamsData[t]) teamsData[t] = { total: 0, overdue: 0, completed: 0 };
      teamsData[t].total++;
      if (task.status === 'Overdue') teamsData[t].overdue++;
      if (task.status === 'Completed') teamsData[t].completed++;
      
      // 2. Owner stats
      const o = task.owner;
      if (!ownerData[o]) ownerData[o] = { tasks: 0, completed: 0, delays: 0 };
      ownerData[o].tasks++;
      if (task.status === 'Completed') ownerData[o].completed++;
      if (task.status === 'Overdue') ownerData[o].delays++;
    });

    const teamRisks = Object.keys(teamsData).map(k => {
       const stats = teamsData[k];
       let risk = 'Low Risk';
       if (stats.overdue > 0 && stats.overdue < 3) risk = 'Medium Risk';
       if (stats.overdue >= 3) risk = 'High Risk';
       const completionRate = stats.total === 0 ? 0 : Math.round((stats.completed/stats.total)*100);
       return { team: k, risk, overdue: stats.overdue, completionRate };
    });

    const productivity = Object.keys(ownerData).map(k => {
      return { 
        name: k, 
        totalTasks: ownerData[k].tasks, 
        completionRate: Math.round((ownerData[k].completed / ownerData[k].tasks)*100),
        delays: ownerData[k].delays 
      };
    });

    res.json({
      teamRisks,
      productivity
    });
  } catch(error) {
    console.error(error);
    res.status(500).json({error: 'Analytics failed'});
  }
});

router.post('/simulate', async (req, res) => {
  try {
    const { scenario } = req.body;
    const tasks = await Task.find();
    
    const prompt = `
Given this scenario: "${scenario}"
And current active tasks in the company:
${tasks.map(t => `- ${t.title} (Owner: ${t.owner}, Status: ${t.status}, Dependencies: ${t.dependencies.length})`).join('\n')}

Output JSON analyzing the impact:
{
  "impacts": ["Frontend integration delayed by 2 days", "QA testing delayed by 1 day"],
  "completionProbability": 63,
  "suggestedMitigation": "Assign additional backend developer."
}`;

    const aiText = await generateAIResponse(prompt, "You are a Project Architecture Simulator measuring delays. Output only JSON.");
    
    // In case rate limit string comes back instead of JSON, parse gracefully
    let simulationOut = { impacts: ["Analyzing scenario...", "Calculating offsets"], completionProbability: 50, suggestedMitigation: "Reduce scope" };
    try {
      const cleanedJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanedJson);
      // Ensure all keys exist
      simulationOut = {
        impacts: parsedData.impacts || ["Unable to extract impacts cleanly."],
        completionProbability: parsedData.completionProbability || 50,
        suggestedMitigation: parsedData.suggestedMitigation || "Please refine your prompt to the AI."
      };
    } catch(e) {
      if (typeof aiText === 'string') simulationOut.suggestedMitigation = aiText;
    }
    
    res.json(simulationOut);
  } catch(error) {
    res.status(500).json({ error: 'Failed to simulate scenario' });
  }
});

module.exports = router;
