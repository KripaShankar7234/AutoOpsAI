const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { generateAIResponse } = require('../services/aiService');


router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('meetingId')
      .populate('dependencies', 'title status')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.get('/prioritized', async (req, res) => {
  try {
    const tasks = await Task.find({ status: { $ne: 'Completed' } });
    if (tasks.length === 0) return res.json([]);

    const taskList = tasks.map(t => ({ id: t._id, title: t.title, deadline: t.deadline }));
    const prompt = `Here are active tasks: ${JSON.stringify(taskList)}. Rank them by importance considering urgency, impact, and standard software project dependencies. Return ONLY a JSON array of objects, e.g., [{"id":"...", "reason":"..."}].`;
    const sysInst = `You are a Smart Task Prioritization Agent. Rank tasks and output ONLY valid JSON.`;
    
    const rawAi = await generateAIResponse(prompt, sysInst);
    let rankedIds = [];
    try {
      const parsed = JSON.parse(rawAi.replace(/```json|```/gi, "").trim());
      rankedIds = parsed.map(p => p.id);
    } catch(e) {
      rankedIds = tasks.map(t => t._id.toString());
    }

    // Sort original tasks based on AI's ranked IDs
    const sortedTasks = [...tasks].sort((a, b) => {
      let idxA = rankedIds.indexOf(a._id.toString());
      let idxB = rankedIds.indexOf(b._id.toString());
      if (idxA === -1) idxA = 999;
      if (idxB === -1) idxB = 999;
      return idxA - idxB;
    });

    res.json(sortedTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});


router.post('/create', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

module.exports = router;
