import { NextResponse } from 'next/server'
import { connect } from '../../../../lib/mongo'
import Judge from '../../../../lib/models/Judge'
import Admin from '../../../../lib/models/Admin'
import { comparePassword, signToken } from '../../../../lib/auth'

export async function POST(req) {
  await connect()
  const { email, password, role } = await req.json()
  if(role === 'judge') {
    const user = await Judge.findOne({ email })
    if(!user) return NextResponse.json({ error: 'not found' }, { status:404 })
    const ok = await comparePassword(password, user.passwordHash)
    if(!ok) return NextResponse.json({ error: 'bad credentials' }, { status:401 })
    const token = signToken({ id: user._id, role: 'judge', email: user.email })
    const res = NextResponse.json({ ok: true, role: 'judge' })
    res.cookies.set('token', token, { httpOnly: true, path: '/' })
    return res
  } else if(role === 'admin') {
    const user = await Admin.findOne({ email })
    if(!user) return NextResponse.json({ error: 'not found' }, { status:404 })
    const ok = await comparePassword(password, user.passwordHash)
    if(!ok) return NextResponse.json({ error: 'bad credentials' }, { status:401 })
    const token = signToken({ id: user._id, role: 'admin', email: user.email })
    const res = NextResponse.json({ ok: true, role: 'admin' })
    res.cookies.set('token', token, { httpOnly: true, path: '/' })
    return res
  } else {
    // team login
    const Team = (await import('../../../../lib/models/Team')).default
    const team = await Team.findOne({ email })
    if(!team) return NextResponse.json({ error:'not found' }, { status:404 })

    // If team has a passwordHash stored, require password validation. Otherwise fall back to email-only login
    if(team.passwordHash) {
      if(!password) return NextResponse.json({ error: 'password required' }, { status: 400 })
      const ok = await comparePassword(password, team.passwordHash)
      if(!ok) return NextResponse.json({ error: 'bad credentials' }, { status:401 })
    }

    const token = signToken({ id: team._id, role: 'team', email: team.email })
    const res = NextResponse.json({ ok: true, role: 'team' })
    res.cookies.set('token', token, { httpOnly: true, path: '/' })
    return res
  }
}
