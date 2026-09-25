import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRouter from './routes/auth.js';
import chatRouter from './routes/chat.js';
import evaluateRouter from './routes/evaluate.js';
import doubtRoutes from './routes/doubt.js';

import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['https://reverse-tutor.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(cookieParser());
// Set limits high for Base64 image payloads
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/evaluate', evaluateRouter);
app.use('/api/doubt', doubtRoutes);

// Priority 3: Secure Session Cookie Map
app.post('/api/exam/start', (req, res) => {
  const { durationInSeconds } = req.body;
  const endTime = Date.now() + (durationInSeconds * 1000);
  res.cookie('session_start_time', endTime.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none'
  });
  res.status(200).json({ success: true, endTime });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Priority 1: Cold-Start Inertia Mitigation
app.get('/health', (req, res) => res.status(200).json({ status: "online", timestamp: new Date() }));
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Reverse Tutor MVP API is running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
