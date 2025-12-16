'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage(){
  const [role, setRole] = useState('team')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status,setStatus] = useState('')
  const router = useRouter()

  async function submit(e){
    e.preventDefault()
    setStatus('Logging in...')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ email, password, role })
    })
    const j = await res.json()
    if(res.ok){
      setStatus('OK')
      // simple role based redirect
      if(role === 'judge') {
        await router.push('/judge')
        try { router.refresh() } catch(e){}
      }
      else if(role === 'admin') {
        await router.push('/admin')
        try { router.refresh() } catch(e){}
      }
      else {
        await router.push('/team/manage')
        try { router.refresh() } catch(e){}
      }
    } else {
      setStatus(j.error || 'Login failed')
    }
  }

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="heading">Login</h2>
      <p className="text-sm mb-3">Choose your role and log in to continue.</p>
      <form onSubmit={submit}>
        <label className="label">Role</label>
        <select className="input" value={role} onChange={(e)=>setRole(e.target.value)}>
          <option value="team">Team (student)</option>
          <option value="judge">Judge</option>
          <option value="admin">Organizer</option>
        </select>

        <label className="label">Email</label>
        <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />

        {/* password only used for judge/admin; teams currently login via email only on server */}
        <label className="label">Password</label>
        <input type="password" className="input" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="(Judges/Admins only)" />

        <div className="mt-2 flex gap-2">
          <button className="btn" type="submit">Login</button>
          <a className="text-sm text-gray-600 self-center" href="/team/register">Register Team</a>
        </div>
      </form>
      <div className="mt-3 text-sm">{status}</div>
    </div>
  )
}
