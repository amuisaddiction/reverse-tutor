import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './routes/chat.js';
import evaluateRouter from './routes/evaluate.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRouter);
app.use('/api/evaluate', evaluateRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
