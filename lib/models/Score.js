import mongoose from 'mongoose';
const ScoreSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  judgeEmail: String,
  innovation: Number,
  impact: Number,
  feasibility: Number,
  execution: Number,
  presentation: Number,
  comment: String,
  finalScore: Number,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.models.Score || mongoose.model('Score', ScoreSchema);
