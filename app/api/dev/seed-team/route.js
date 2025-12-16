import { NextResponse } from 'next/server'
import { connect } from '../../../../lib/mongo'
import Team from '../../../../lib/models/Team'
import { hashPassword } from '../../../../lib/auth'

export async function GET(req) {
  const allowedInDev = process.env.NODE_ENV !== 'production'
  const secret = req.nextUrl.searchParams.get('secret')
  if(!allowedInDev && secret !== process.env.SEED_SECRET){
    return NextResponse.json({ error: 'not allowed' }, { status: 403 })
  }

  await connect()
  const email = process.env.SEED_TEAM_EMAIL || 'atharva_s@gmail.com'
  const pw = process.env.SEED_TEAM_PW || 'atharva123'
  const passwordHash = await hashPassword(pw)
  const existing = await Team.findOne({ email })
  if(existing){
    existing.passwordHash = passwordHash
    existing.teamName = existing.teamName || 'Seed Team'
    await existing.save()
    return NextResponse.json({ ok: true, updated: true, email })
  }
  await Team.create({ teamName: 'Seed Team', members: ['Atharva'], email, projectTitle: 'Demo Project', problemStatement: 'Seeded project', techStack: 'Next.js', driveLink: '', passwordHash })
  return NextResponse.json({ ok: true, created: true, email })
}
