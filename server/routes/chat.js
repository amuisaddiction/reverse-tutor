import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

router.post('/', async (req, res) => {
  try {
    const { topic, misconception, messages } = req.body;

    const systemPrompt = `You are Ravi, a Class 11 student who is confused about ${topic}.
Your hidden misconception is: ${misconception}
You genuinely believe this misconception is correct.
Rules:
- Never admit the misconception directly until score >= 90
- Ask follow-up questions that reveal your confusion
- React authentically when explanations partially help
- Keep language casual, like a student texting a friend
- Max 3 sentences per reply
Do NOT break character.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 256,
      system: systemPrompt,
      messages: messages,
    });

    res.json({ message: response.content[0].text });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
});

export default router;
