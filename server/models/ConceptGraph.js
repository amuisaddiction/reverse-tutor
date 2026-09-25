import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  masteryScore: { type: Number, default: 50 }, // 0 to 100
  type: { type: String, enum: ['root', 'prerequisite'], default: 'prerequisite' }
});

const linkSchema = new mongoose.Schema({
  source: { type: String, required: true }, // id of source node
  target: { type: String, required: true }  // id of target node
});

const conceptGraphSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  nodes: [nodeSchema],
  links: [linkSchema]
}, { timestamps: true });

export default mongoose.model('ConceptGraph', conceptGraphSchema);
