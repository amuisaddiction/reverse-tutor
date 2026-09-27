import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { topic, misconception, messages } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format previous messages for Gemini
    // We need to keep only the actual conversation.
    const historyText = messages.map(m => `${m.role === 'user' ? 'Tutor' : 'Student'}: ${m.content}`).join('\n');

    const systemPrompt = `You are Ravi, a Class 11 student who is confused about ${topic}.
Your hidden misconception is: ${misconception}
You genuinely believe this misconception is correct.

Rules:
- Act like a confused student texting their tutor for help.
- The user is the Tutor. You are the Student.
- Keep language casual.
- Never admit the misconception directly until the tutor points it out.
- If the tutor explains poorly, ask a follow up question that reveals your confusion.
- Max 2-3 sentences per reply.
- DO NOT BREAK CHARACTER.

Here is the conversation so far:
${historyText}

Student:`;

    const result = await model.generateContent(systemPrompt);
    res.json({ message: result.response.text().trim() });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
});

export default router;
