import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/start', async (req, res) => {
  try {
    const { topic } = req.body;
    
    // Generate a tricky MCQ based on the topic
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a single tricky JEE/NEET level multiple choice question about "${topic}".
    Provide the correct answer, and a highly plausible "trap" answer that students usually fall for.
    Format as JSON: { "question": "...", "options": ["...", "...", "...", "..."], "correctOption": 0, "trapOption": 1 }`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const mcq = JSON.parse(text);
    
    res.json(mcq);
  } catch (error) {
    console.error('Debate start error:', error);
    res.status(500).json({ error: 'Failed to generate debate topic' });
  }
});

router.post('/turn', async (req, res) => {
  try {
    const { persona, question, options, correctOption, trapOption, history } = req.body;
    const isPersonaA = persona === 'A';
    
    // Persona A argues for the correct option. Persona B argues for the trap option.
    const targetOption = isPersonaA ? correctOption : trapOption;
    const optionText = options[targetOption];
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a confident JEE/NEET student debating a physics/chemistry/math question.
    Question: ${question}
    You must argue passionately that the answer is: "${optionText}".
    DO NOT break character. DO NOT admit you might be wrong.
    Keep your argument to 2-3 sentences. Make it sound convincing using scientific principles.
    
    Previous chat history:
    ${history.map(h => `${h.persona}: ${h.text}`).join('\n')}
    
    Your response:`;
    
    const result = await model.generateContent(prompt);
    res.json({ text: result.response.text().trim() });
  } catch (error) {
    console.error('Debate turn error:', error);
    res.status(500).json({ error: 'Failed to generate debate argument' });
  }
});

router.post('/judge', async (req, res) => {
  try {
    const { question, correctOption, options, studentJustification } = req.body;
    const correctText = options[correctOption];
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `A student just watched two AI personas debate a tricky question.
    Question: ${question}
    Correct Answer: ${correctText}
    
    The student's justification for their choice was: "${studentJustification}"
    
    Provide a brief, encouraging 1-2 sentence evaluation of their reasoning. Point out if they fell for the classic trap, or if they nailed the actual underlying concept.`;
    
    const result = await model.generateContent(prompt);
    res.json({ insight: result.response.text().trim() });
  } catch (error) {
    console.error('Debate judge error:', error);
    res.status(500).json({ error: 'Failed to evaluate justification' });
  }
});

export default router;
