import mongoose from 'mongoose';

const tutorSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  topic: { type: String, required: true },
  misconception: { type: String, required: true },
  messages: [{ role: String, content: String }],
  score: { type: Number, default: 20 },
  clarity: { type: Number, default: 0 },
  analogy_used: { type: Boolean, default: false },
  gap_addressed: { type: Boolean, default: false },
  isComplete: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('TutorSession', tutorSessionSchema);
