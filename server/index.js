import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
<<<<<<< HEAD

import { sequelize, connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import evaluateRoutes from './routes/evaluate.js';
import doubtRoutes from './routes/doubt.js';
=======
import chatRouter from './routes/chat.js';
import evaluateRouter from './routes/evaluate.js';
import authRouter from './routes/auth.js';
import mongoose from 'mongoose';
>>>>>>> pr-1

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
// Set limits high for Base64 image payloads
app.use(express.json({ limit: '10mb' }));

<<<<<<< HEAD
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/evaluate', evaluateRoutes);
app.use('/api/doubt', doubtRoutes);
=======
app.use('/api/chat', chatRouter);
app.use('/api/evaluate', evaluateRouter);
app.use('/api/auth', authRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
>>>>>>> pr-1

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Reverse Tutor MVP API is running' });
});

// Sync Database and Start Server
connectDB().then(async () => {
  // Sync models to DB (creates tables if they don't exist)
  await sequelize.sync(); 
  console.log('âœ… All models were synchronized successfully.');
  
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
