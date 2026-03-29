const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { generateAIResponse } = require('../services/aiService');

router.post('/', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Fetch context (Tasks and stats)
    const tasks = await Task.find({});
    
    const contextStr = tasks.map(t => 
      `- ${t.title} [Owner: ${t.owner}] [Status: ${t.status}] [Deadline: ${t.deadline}]`
    ).join('\n');

    const prompt = `User Query: "${query}"\n\nCurrent Project Context (Tasks):\n${contextStr || 'No active tasks.'}`;
    const sysInstruction = `You are the AutoOps AI Manager Chat Agent. You answer questions about the current project status based on the provided JSON context. 
Your response should be concise, professional, and directly address the user's query. Return the response as a JSON object with a single "reply" field string, like {"reply": "..."}. Do not return markdown formatted text, just the raw JSON.`;

    const rawResponse = await generateAIResponse(prompt, sysInstruction);
    let result = { reply: "I'm sorry, I couldn't process that request." };
    try {
        result = JSON.parse(rawResponse);
    } catch(e) {
        // If not JSON, just wrap it
        result = { reply: rawResponse.replace(/```json|```/gi, "").trim() };
    }

    res.json({ reply: result.reply });
  } catch (err) {
    console.error('Error in chat route:', err);
    if (err.status === 429) {
      // Instead of an error, gracefully fail in-character for the demo
      return res.json({ reply: 'I am currently analyzing too many tasks across the organization! (Google GenAI Rate Limit Exceeded). Please give me a minute to process the backlog and try asking me again.' });
    }
    res.status(500).json({ error: 'Server error analyzing chat query: ' + err.message });
  }
});

module.exports = router;
