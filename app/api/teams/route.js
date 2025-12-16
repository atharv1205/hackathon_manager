import { NextResponse } from 'next/server'
import { connect } from '../../../lib/mongo'
import Team from '../../../lib/models/Team'

export async function GET() {
  await connect()
  const teams = await Team.find({}, { __v:0 }).lean()
  return NextResponse.json({ teams })
}

export async function POST(req) {
  await connect()
  try {
    const data = await req.json()
    // validation
    if(!data.teamName || !data.email || !data.driveLink) {
      return NextResponse.json({ error: 'teamName, email and driveLink are required' }, { status: 400 })
    }
    const team = new Team(data)
    await team.save()
    return NextResponse.json({ ok: true, team })
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
