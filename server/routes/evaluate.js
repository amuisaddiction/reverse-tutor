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
    const { topic, misconception, transcript, userMessage } = req.body;

    const systemPrompt = `You are a strict learning evaluator.
Topic: ${topic}
Hidden misconception: ${misconception}
Conversation transcript: ${transcript}
Latest user message: ${userMessage}

Return ONLY valid JSON. No preamble. Schema:
{ "score_delta": 0-25, "clarity": 1-10, 
  "analogy_used": bool, "gap_addressed": bool, "reason": string }`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        { role: 'user', content: 'Evaluate the latest user message and return the JSON.' }
      ],
    });

    const content = response.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const evaluation = JSON.parse(jsonMatch[0]);
      res.json(evaluation);
    } else {
      throw new Error("Failed to parse JSON from AI response.");
    }
  } catch (error) {
    console.error('Evaluate API Error:', error);
    res.status(500).json({ error: 'Failed to evaluate response', score_delta: 0, reason: 'Evaluation failed.' });
  }
});

export default router;
