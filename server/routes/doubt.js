import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock-key');

router.post('/scan', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    // Initialize the model (using 1.5-flash as it is fast and supports multimodality on the free tier)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert AI Tutor for JEE and NEET exams. 
A student has uploaded an image of a math, physics, or chemistry problem.
First, identify the exact topic and subject.
Then, break down the solution into clear, numbered steps.
Format your output exactly as JSON:
{
  "identifiedTopic": "Topic Name (Subject)",
  "steps": [
    "Step 1...",
    "Step 2...",
    "..."
  ],
  "finalAnswer": "The final result or equation",
  "formulasUsed": ["Formula 1", "Formula 2"],
  "pitfalls": "Common mistakes students make here"
}
Return ONLY valid JSON without any markdown formatting blocks like \`\`\`json.`;

    const imageParts = [
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType || "image/jpeg"
        }
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let text = response.text();
    
    // Clean up potential markdown formatting in case Gemini disobeys "no markdown"
    text = text.replace(/```json/gi, '').replace(/```/gi, '').trim();

    const parsedJson = JSON.parse(text);

    res.json(parsedJson);

  } catch (error) {
    console.error('Error in AI Doubt Scanner:', error);
    res.status(500).json({ error: 'Failed to process image with Gemini AI' });
  }
});

export default router;
