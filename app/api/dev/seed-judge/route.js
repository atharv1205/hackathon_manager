import { NextResponse } from 'next/server'
import { connect } from '../../../../lib/mongo'
import Judge from '../../../../lib/models/Judge'
import { hashPassword } from '../../../../lib/auth'

export async function GET(req) {
  // allow only in development or when a secret matches
  const allowedInDev = process.env.NODE_ENV !== 'production'
  const secret = req.nextUrl.searchParams.get('secret')
  if(!allowedInDev && secret !== process.env.SEED_SECRET){
    return NextResponse.json({ error: 'not allowed' }, { status: 403 })
  }

  await connect()
  const email = process.env.SEED_JUDGE_EMAIL || 'atharva@gmail.com'
  const pw = process.env.SEED_JUDGE_PW || 'atharva123'
  const passwordHash = await hashPassword(pw)
  const existing = await Judge.findOne({ email })
  if(existing){
    existing.passwordHash = passwordHash
    existing.name = existing.name || 'Atharva'
    await existing.save()
    return NextResponse.json({ ok: true, updated: true, email })
  }
  await Judge.create({ name: 'Atharva', email, passwordHash })
  return NextResponse.json({ ok: true, created: true, email })
}
