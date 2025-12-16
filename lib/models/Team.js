import mongoose from 'mongoose';
const TeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  members: [String],
  email: String,
  passwordHash: String,
  projectTitle: String,
  problemStatement: String,
  techStack: String,
  driveLink: String,
  // aggregated scoring info
  avgScore: { type: Number, default: 0 },
  scoresCount: { type: Number, default: 0 },
  lastScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.models.Team || mongoose.model('Team', TeamSchema);
