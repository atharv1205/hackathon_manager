'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function JudgeCreate(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [status,setStatus] = useState('')
  const [loading,setLoading] = useState(false)
  const router = useRouter()

  async function submit(e){
    e.preventDefault()
    setLoading(true)
    setStatus('Creating judge...')
    try{
      const res = await fetch('/api/judges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const j = await res.json()
      if(res.ok){
        setStatus('Judge created')
        setName('')
        setEmail('')
        setPassword('')
        try{ router.refresh() } catch(e){}
      } else {
        setStatus(j?.error || 'Error')
      }
    } catch(e){ setStatus('Error'); console.error(e) }
    setLoading(false)
  }

  return (
    <div>
      <h3 className="font-bold mb-2">Create Judge</h3>
      <form onSubmit={submit} className="max-w-md">
        <label className="label">Name</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} />
        <label className="label">Email</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
        <label className="label">Password</label>
        <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="mt-2">
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Judge'}</button>
        </div>
      </form>
      <div className="mt-2 text-sm">{status}</div>
    </div>
  )
}
