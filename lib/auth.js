import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}
export function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); } catch(e) { return null; }
}
export async function hashPassword(pw) { return bcrypt.hash(pw, 10); }
export async function comparePassword(pw, hash) { return bcrypt.compare(pw, hash); }
