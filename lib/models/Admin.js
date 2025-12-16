import mongoose from 'mongoose';
const AdminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
});
export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
