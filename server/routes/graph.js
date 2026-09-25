import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ConceptGraph from '../models/ConceptGraph.js';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Default seed graph for Physics if user has no graph yet
const SEED_GRAPH = {
  nodes: [
    { id: "kinematics", label: "Kinematics", masteryScore: 60, type: "root" },
    { id: "projectile_motion", label: "Projectile Motion", masteryScore: 40, type: "root" },
    { id: "vector_resolution", label: "Vector Resolution", masteryScore: 30, type: "prerequisite" },
    { id: "relative_velocity", label: "Relative Velocity", masteryScore: 50, type: "prerequisite" },
    { id: "newtons_laws", label: "Newton's Laws", masteryScore: 70, type: "root" }
  ],
  links: [
    { source: "kinematics", target: "projectile_motion" },
    { source: "vector_resolution", target: "projectile_motion" },
    { source: "relative_velocity", target: "kinematics" },
    { source: "newtons_laws", target: "kinematics" }
  ]
};

// Middleware to mock a user ID for the MVP
const mockUserId = (req, res, next) => {
  req.userId = 'demo_user_123'; 
  next();
};

// Get the user's graph
router.get('/', mockUserId, async (req, res) => {
  try {
    let graph = await ConceptGraph.findOne({ userId: req.userId });
    if (!graph) {
      graph = new ConceptGraph({ userId: req.userId, ...SEED_GRAPH });
      await graph.save();
    }
    res.json(graph);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get the weakest node (for Debate Arena integration)
router.get('/weakest', mockUserId, async (req, res) => {
  try {
    const graph = await ConceptGraph.findOne({ userId: req.userId });
    if (!graph || graph.nodes.length === 0) {
      return res.json({ topic: "Rotational Motion" }); // fallback
    }
    
    // Sort nodes by masteryScore ascending
    const sortedNodes = [...graph.nodes].sort((a, b) => a.masteryScore - b.masteryScore);
    res.json({ topic: sortedNodes[0].label, id: sortedNodes[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Process a mistake and update the graph via Gemini
router.post('/update', mockUserId, async (req, res) => {
  try {
    const { surfaceTopic, mistakeDescription } = req.body;
    let graph = await ConceptGraph.findOne({ userId: req.userId });
    
    if (!graph) {
      graph = new ConceptGraph({ userId: req.userId, nodes: [], links: [] });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      A student made a mistake in Physics on the surface topic "${surfaceTopic}".
      The specific mistake context was: "${mistakeDescription}".
      
      Identify 1-2 root-cause prerequisite concepts that the student likely misunderstood, causing this error.
      Output ONLY a valid JSON object in this exact format:
      {
        "prerequisites": [
          { "id": "snake_case_id", "label": "Human Readable Label" }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    let rawText = result.response.text();
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(rawText);

    // Update the graph
    // Ensure surface node exists
    const surfaceId = surfaceTopic.toLowerCase().replace(/\s+/g, '_');
    if (!graph.nodes.find(n => n.id === surfaceId)) {
      graph.nodes.push({ id: surfaceId, label: surfaceTopic, masteryScore: 40, type: 'root' });
    } else {
      // Penalty for making a mistake
      const node = graph.nodes.find(n => n.id === surfaceId);
      node.masteryScore = Math.max(0, node.masteryScore - 10);
    }

    // Add prerequisites and links
    parsed.prerequisites.forEach(prereq => {
      if (!graph.nodes.find(n => n.id === prereq.id)) {
        // New prerequisite detected, initialize with low score
        graph.nodes.push({ id: prereq.id, label: prereq.label, masteryScore: 20, type: 'prerequisite' });
      } else {
        const node = graph.nodes.find(n => n.id === prereq.id);
        node.masteryScore = Math.max(0, node.masteryScore - 5);
      }
      
      // Link surface topic to prereq (dependency arrow)
      const linkExists = graph.links.some(l => l.source === prereq.id && l.target === surfaceId);
      if (!linkExists) {
        graph.links.push({ source: prereq.id, target: surfaceId });
      }
    });

    await graph.save();
    res.json(graph);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
