import { NextResponse } from 'next/server'
import { connect } from '../../../../lib/mongo'
import Admin from '../../../../lib/models/Admin'
import { hashPassword } from '../../../../lib/auth'

export async function GET(req) {
  const allowedInDev = process.env.NODE_ENV !== 'production'
  const secret = req.nextUrl.searchParams.get('secret')
  if(!allowedInDev && secret !== process.env.SEED_SECRET){
    return NextResponse.json({ error: 'not allowed' }, { status: 403 })
  }

  await connect()
  const email = process.env.SEED_ADMIN_EMAIL || 'atharva_d@gmail.com'
  const pw = process.env.SEED_ADMIN_PW || 'atharva123'
  const passwordHash = await hashPassword(pw)
  const existing = await Admin.findOne({ email })
  if(existing){
    existing.passwordHash = passwordHash
    existing.name = existing.name || 'Atharva D'
    await existing.save()
    return NextResponse.json({ ok: true, updated: true, email })
  }
  await Admin.create({ name: 'Atharva D', email, passwordHash })
  return NextResponse.json({ ok: true, created: true, email })
}
