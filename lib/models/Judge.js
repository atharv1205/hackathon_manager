import mongoose from 'mongoose';
const JudgeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.models.Judge || mongoose.model('Judge', JudgeSchema);
