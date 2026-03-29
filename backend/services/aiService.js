const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock-key' }); 

async function generateAIResponse(prompt, systemInstruction) {
  if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY found. Returning mock response.");
      return JSON.stringify({
          decisions: ["Mock Decision"],
          tasks: [{ title: "Mock Task", owner: "System", deadline: "Tomorrow" }]
      });
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
      }
    });
    return response.text;
  } catch (error) {
    console.error('Error in AI Service:', error);
    
    // Fallback for hackathon demo to prevent breaking UI
    if (error.status === 429 || error.message?.includes('429')) {
      console.warn("Rate limit hit. Returning friendly mock fallback.");
      // Best-effort JSON that won't break anything.
      return JSON.stringify({
        reply: "I'm currently assisting too many managers! (AI Rate Limit Hit). Please let me take a breather and ask again in a minute.", 
        completionProbability: 80, 
        riskDetected: "Currently pacing AI analysis mode", 
        suggestedAction: "Wait a moment for API limits to reset",
        decisions: ["Postponed meeting extraction due to rate limit"],
        tasks: [{ title: "[System Demo] Resume later", owner: "Team", deadline: "Today" }]
      });
    }

    throw error;
  }
}


module.exports = { generateAIResponse };
