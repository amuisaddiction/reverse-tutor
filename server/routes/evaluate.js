import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { topic, misconception, transcript, userMessage } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a strict learning evaluator.
Topic: ${topic}
Hidden misconception of the student: ${misconception}
Conversation transcript: ${transcript}
Latest tutor explanation: ${userMessage}

Did the tutor address the misconception well?
Return ONLY a raw valid JSON object. No markdown formatting, no preamble. Schema:
{ 
  "score_delta": 0-25,
  "clarity": 1-10,
  "analogy_used": true/false,
  "gap_addressed": true/false,
  "reason": "short explanation of your score"
}`;

    const result = await model.generateContent(prompt);
    const content = result.response.text();
    
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
