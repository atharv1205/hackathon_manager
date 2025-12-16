import { NextResponse } from 'next/server'
import { connect } from '../../../lib/mongo'
import Judge from '../../../lib/models/Judge'
import { hashPassword, verifyToken } from '../../../lib/auth'
import { cookies } from 'next/headers'

export async function GET() {
  await connect()
  const judges = await Judge.find().lean()
  return NextResponse.json({ judges })
}

export async function POST(req) {
  await connect()
  try {
    // Only allow admins to create judges
    try {
      const token = cookies().get('token')?.value
      const payload = token ? verifyToken(token) : null
      if(!payload || payload.role !== 'admin') return NextResponse.json({ error: 'forbidden' }, { status:403 })
    } catch(e) { return NextResponse.json({ error: 'forbidden' }, { status:403 }) }

    const { name, email, password } = await req.json()
    if(!email || !password) return NextResponse.json({ error: 'email & password required' }, { status: 400 })
    const existing = await Judge.findOne({ email })
    if(existing) return NextResponse.json({ error: 'exists' }, { status: 400 })
    const passwordHash = await hashPassword(password)
    const j = new Judge({ name, email, passwordHash })
    await j.save()
    return NextResponse.json({ ok: true })
  } catch(e) { return NextResponse.json({ error: e.message }, { status:500 }) }
}
