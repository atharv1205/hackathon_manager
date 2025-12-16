import { NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/auth'

export async function GET(req) {
  const cookie = req.cookies.get('token')?.value
  if(!cookie) return NextResponse.json({ authenticated: false })
  const payload = verifyToken(cookie)
  if(!payload) return NextResponse.json({ authenticated: false })
  return NextResponse.json({ authenticated: true, payload })
}
