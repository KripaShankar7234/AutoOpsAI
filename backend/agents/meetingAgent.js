const { generateAIResponse } = require('../services/aiService');

const SYSTEM_PROMPT = `You are a Meeting Intelligence Agent.
Extract key decisions and tasks from the meeting transcript.
Return JSON exactly like:
{
  "decisions": [
    "Launch beta website"
  ],
  "tasks": [
    {
      "title": "Design landing page",
      "owner": "KripaShankar",
      "team": "Frontend",
      "deadline": "25 March",
      "priority": "High"
    }
  ]
}
Note for team, guess from context: 'Frontend', 'Backend', 'QA', 'Design', 'Operations', or 'General'.
Note for priority, guess from context: 'High', 'Medium', or 'Low'.`;

async function analyzeMeetingTranscript(transcript) {
  const prompt = `Analyze this meeting transcript and extract decisions and tasks:\n\n${transcript}`;
  try {
    const responseText = await generateAIResponse(prompt, SYSTEM_PROMPT);
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Meeting Intelligence Agent Error:', error);
    throw error;
  }
}

module.exports = { analyzeMeetingTranscript };
