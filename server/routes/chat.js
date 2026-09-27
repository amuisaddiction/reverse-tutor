import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import TutorSession from '../models/TutorSession.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock-key');

// Middleware to mock a user ID for the MVP
const mockUserId = (req, res, next) => {
  req.userId = 'demo_user_123';
  next();
};

// 1. CREATE SESSION
router.post('/session', mockUserId, async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required' });

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Generate an appropriate misconception
    const misPrompt = `You are an expert physics/math teacher. Identify a very common, highly plausible, and deeply ingrained misconception that a high school student might have about the topic: "${topic}". 
Return ONLY the misconception as a single clear sentence. Do not include quotes or explanations.`;
    const misRes = await model.generateContent(misPrompt);
    const misconception = misRes.response.text().trim();

    // Generate initial message
    const initPrompt = `You are Ravi, a Class 11 student who is struggling with "${topic}".
Your hidden misconception is: "${misconception}".
Write a short opening message (1-2 sentences) to your tutor asking for help with the topic.
Do NOT reveal the exact misconception yet, just express general confusion or ask a basic question that hints at your flawed thinking. Keep it casual like a student texting.`;
    const initRes = await model.generateContent(initPrompt);
    const initialMessage = initRes.response.text().trim();

    // Store securely in DB
    const session = new TutorSession({
      userId: req.userId,
      topic,
      misconception,
      messages: [{ role: 'ai', content: initialMessage }]
    });
    await session.save();

    res.json({
      sessionId: session._id,
      topic,
      initialMessage
    });

  } catch (error) {
    console.error('Chat Session Init Error:', error);
    res.status(500).json({ error: 'Failed to initialize session' });
  }
});

// 2. PROCESS MESSAGE
router.post('/message', mockUserId, async (req, res) => {
  try {
    const { sessionId, userMessage } = req.body;
    
    const session = await TutorSession.findOne({ _id: sessionId, userId: req.userId });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Append user's message
    session.messages.push({ role: 'user', content: userMessage });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const transcript = session.messages.map(m => `${m.role === 'user' ? 'Tutor' : 'Student'}: ${m.content}`).join('\n');

    // EVALUATE
    const evalPrompt = `You are an expert teacher evaluator assessing a tutor's performance.
Topic: ${session.topic}
Student's Hidden Misconception: ${session.misconception}

Here is the conversation transcript:
${transcript}

Evaluate the Tutor's latest message based on how well they are addressing the student's hidden misconception using the Feynman technique.
Return ONLY a raw JSON object with no markdown formatting.
Schema:
{
  "score_delta": <integer between -10 and 30. High positive if they clearly identify and correct the misconception. Negative if they confuse the student more or just give formulas without intuition.>,
  "clarity": <integer 1 to 10>,
  "analogy_used": <boolean>,
  "gap_addressed": <boolean>
}`;

    const evalRes = await model.generateContent(evalPrompt);
    let evalText = evalRes.response.text().replace(/```json/gi, '').replace(/```/gi, '').trim();
    const evaluation = JSON.parse(evalText);

    // Update Session State
    session.score = Math.min(100, Math.max(0, session.score + (evaluation.score_delta || 0)));
    session.clarity = evaluation.clarity || 0;
    session.analogy_used = evaluation.analogy_used || false;
    session.gap_addressed = evaluation.gap_addressed || false;
    
    if (session.score >= 100) {
      session.isComplete = true;
    }

    // GENERATE AI RESPONSE
    let aiMessage = "I completely understand it now! Thank you so much for explaining it this way.";
    
    if (!session.isComplete) {
      const chatPrompt = `You are Ravi, a Class 11 student who is confused about ${session.topic}.
Your hidden misconception is: ${session.misconception}
You genuinely believe this misconception is correct.

Here is the conversation so far:
${transcript}

Rules:
- Act like a confused student texting their tutor for help.
- Never admit the misconception directly until the tutor points it out or perfectly explains the flaw.
- If the tutor explains poorly, ask a follow-up question that reveals your confusion.
- If the tutor explains well, react authentically and adjust your understanding.
- Max 2-3 sentences.
- DO NOT break character.

Respond as Ravi to the Tutor's latest message:`;

      const chatRes = await model.generateContent(chatPrompt);
      aiMessage = chatRes.response.text().trim();
    }

    // Append AI message
    session.messages.push({ role: 'ai', content: aiMessage });
    await session.save();

    res.json({
      message: aiMessage,
      evaluation: {
        score: session.score,
        clarity: session.clarity,
        analogy: session.analogy_used,
        gapAddressed: session.gap_addressed
      },
      isComplete: session.isComplete,
      misconception: session.score >= 80 ? session.misconception : null
    });

  } catch (error) {
    console.error('Chat Message Processing Error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

export default router;
