import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/scan', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Fallback Mock for Hackathon Demo if Gemini API key is missing
    if (!process.env.GEMINI_API_KEY) {
      console.log('Using mock Gemini response for hackathon demo');
      return res.json({
        identifiedTopic: "Kinematics (Physics)",
        steps: [
          "Step 1: Identify the given values. Initial velocity (u) = 0, Acceleration (a) = 9.8 m/s², Time (t) = 5s.",
          "Step 2: Use the kinematic equation v = u + at.",
          "Step 3: Substitute the values: v = 0 + (9.8)(5).",
          "Step 4: Calculate the final velocity v = 49 m/s."
        ],
        finalAnswer: "49 m/s",
        formulasUsed: ["v = u + at", "s = ut + 1/2at^2"],
        pitfalls: "Students often forget that initial velocity is 0 when an object is dropped from rest."
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a strict AI Tutor for JEE, NEET, and JEE Advanced exams in India.
A student has uploaded an image. 
First, evaluate if the image is an actual math, physics, or chemistry problem related to the JEE/NEET syllabus. 
If the image is NOT related (e.g., a random chart, economic value, selfie, or unrelated text), you MUST return this exact JSON:
{
  "identifiedTopic": "Not Related",
  "steps": ["This image does not appear to be a physics, chemistry, or mathematics problem related to the JEE or NEET syllabus."],
  "finalAnswer": "Please upload a valid question.",
  "formulasUsed": [],
  "pitfalls": ""
}

If it IS a valid JEE/NEET problem, break down the solution into clear, numbered steps.
Format your output exactly as JSON:
{
  "identifiedTopic": "Topic Name (Subject)",
  "steps": [
    "Step 1...",
    "Step 2..."
  ],
  "finalAnswer": "The final result or equation",
  "formulasUsed": ["Formula 1"],
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
    
    text = text.replace(/```json/gi, '').replace(/```/gi, '').trim();

    const parsedJson = JSON.parse(text);
    res.json(parsedJson);

  } catch (error) {
    console.error('Error in AI Doubt Scanner:', error);
    res.status(500).json({ error: 'Failed to process image with Gemini AI' });
  }
});

export default router;
