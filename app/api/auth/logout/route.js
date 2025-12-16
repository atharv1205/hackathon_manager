import { NextResponse } from 'next/server'

export async function GET() {
  // clear cookie and return JSON so a client fetch() can handle it
  const res = NextResponse.json({ ok: true })
  res.cookies.set('token', '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
