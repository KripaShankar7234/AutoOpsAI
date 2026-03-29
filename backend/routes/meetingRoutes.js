const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const { analyzeMeetingTranscript } = require('../agents/meetingAgent');
const { createTasksFromExtraction } = require('../agents/taskAgent');
const { logAIAction } = require('../agents/auditAgent');

router.post('/analyze', async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) return res.status(400).json({ error: 'Transcript is required' });

    const meeting = new Meeting({ transcript });
    await meeting.save();

    const aiResult = await analyzeMeetingTranscript(transcript);
    
    meeting.decisions = aiResult.decisions || [];
    await meeting.save();
    
    await logAIAction('Meeting Intelligence Agent', 'Extracted decisions and tasks', 'Transcript analyzed', 0.90, { meetingId: meeting._id });

    let createdTasks = [];
    if (aiResult.tasks && aiResult.tasks.length > 0) {
       createdTasks = await createTasksFromExtraction(aiResult.tasks, meeting._id);
       meeting.extractedTasks = createdTasks.map(t => t._id);
       await meeting.save();
    }

    res.json({
      message: 'Meeting analyzed successfully',
      meetingId: meeting._id,
      decisions: aiResult.decisions,
      tasks: createdTasks
    });
  } catch (error) {
    console.error('API Error /meeting/analyze:', error);
    res.status(500).json({ error: 'Failed to analyze meeting' });
  }
});

router.get('/', async (req, res) => {
  try {
    const meetings = await Meeting.find().populate('extractedTasks').sort({ createdAt: -1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

module.exports = router;
