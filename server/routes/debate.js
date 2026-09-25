import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Curated fallback topics for the demo
const FALLBACK_TOPICS = [
  "Friction on an inclined plane",
  "Conservation of Angular Momentum",
  "Thermodynamics - Isothermal vs Adiabatic processes",
  "Electrostatics - Electric field inside a conductor"
];

router.get('/topic', async (req, res) => {
  // TODO: Priority 2 - fetch from Weakest Node endpoint
  const randomTopic = FALLBACK_TOPICS[Math.floor(Math.random() * FALLBACK_TOPICS.length)];
  res.json({ topic: randomTopic });
});

router.post('/generate', async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are designing a 'Debate Arena' for JEE/NEET students. 
Topic: ${topic}

Create a tricky multiple-choice question on this topic.
There must be two main options:
1. The Correct Answer
2. The Trap Answer (a plausible wrong answer students often fall for due to a common misconception).

Then, write two short, highly convincing arguments (3-4 sentences max):
Argument A: Defends one of the options (e.g., Option 1).
Argument B: Defends the OTHER option (e.g., Option 2).
One persona must defend the Correct Answer, and the other must defend the Trap Answer. 
DO NOT reveal which is correct in the arguments. Both must sound absolutely certain.

Return exactly this JSON format:
{
  "question": "The text of the MCQ question",
  "optionA": {
    "text": "The text of the first option",
    "isCorrect": true/false
  },
  "optionB": {
    "text": "The text of the second option",
    "isCorrect": true/false
  },
  "argumentA": "The convincing argument defending Option A",
  "argumentB": "The convincing argument defending Option B"
}
Return ONLY valid JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/gi, '').replace(/```/gi, '').trim();

    res.json(JSON.parse(text));
  } catch (error) {
    console.error('Error generating debate:', error);
    res.status(500).json({ error: 'Failed to generate debate' });
  }
});

router.post('/evaluate', async (req, res) => {
  try {
    const { question, chosenOptionText, correctOptionText, justification, confidence } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `A student just participated in a debate arena for this question:
Question: "${question}"
Correct Answer: "${correctOptionText}"

The student chose: "${chosenOptionText}"
Their justification: "${justification}"
Their confidence level (1-10): ${confidence}

Evaluate their choice and justification.
1. Are they correct?
2. If they fell for the trap, explain the misconception they fell for.
3. If they are correct, evaluate if their justification is sound, or if they guessed lucky.
4. Provide an 'insight' sentence about their confidence (e.g., "You were 9/10 confident, but fell for the classic trap!").

Return exactly this JSON format:
{
  "isCorrect": true/false,
  "feedback": "Detailed feedback explaining the physics/math",
  "insight": "Short punchy sentence about their choice and confidence"
}
Return ONLY valid JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/gi, '').replace(/```/gi, '').trim();

    res.json(JSON.parse(text));
  } catch (error) {
    console.error('Error evaluating debate:', error);
    res.status(500).json({ error: 'Failed to evaluate debate' });
  }
});

export default router;
