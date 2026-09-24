import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRouter from './routes/auth.js';
import chatRouter from './routes/chat.js';
import evaluateRouter from './routes/evaluate.js';
import doubtRoutes from './routes/doubt.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
// Set limits high for Base64 image payloads
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/evaluate', evaluateRouter);
app.use('/api/doubt', doubtRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Reverse Tutor MVP API is running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
