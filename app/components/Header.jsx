 'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Header({ role: serverRole, email: serverEmail }){
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState(serverRole)
  const [email, setEmail] = useState(serverEmail)
  async function logout(e){
    e.preventDefault()
    if(loading) return
    setLoading(true)
    try{
      const res = await fetch('/api/auth/logout')
      // ensure cookie cleared server-side; proceed to navigate
      if(!res.ok) console.warn('logout request failed')
      // update local header state right away
      setRole(null)
      setEmail(null)
    } catch(err){
      console.error('logout request error', err)
    } finally {
      setLoading(false)
      // navigate to landing and refresh server components to pick up new cookie state
      router.push('/')
      try { router.refresh() } catch(e) {}
    }
  }

  // keep header in sync with server: fetch /api/auth/me on mount
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/auth/me')
        const j = await res.json()
        if(!mounted) return
        if(j?.authenticated) {
          setRole(j.payload?.role || null)
          setEmail(j.payload?.email || null)
        } else {
          setRole(null)
          setEmail(null)
        }
      } catch (e) {
        // ignore
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // update local state when server-provided props change (navigation / SSR updates)
  useEffect(() => {
    setRole(serverRole)
    setEmail(serverEmail)
  }, [serverRole, serverEmail])

  return (
    <nav className="flex gap-4 mt-2 items-center">
      <a href="/" className="text-sm">Home</a>
      {/* only show login when user is not authenticated */}
      {!role && <a href="/login" className="text-sm">Login</a>}
      <a href="/team/register" className="text-sm">Team Register</a>
      <a href="/team" className="text-sm">Teams</a>
      {role === 'judge' && <a href="/judge" className="text-sm">Judge Panel</a>}
      {role === 'team' && <a href="/team/manage" className="text-sm">My Team</a>}
      {role === 'admin' && <a href="/admin" className="text-sm">Organizer</a>}
      {role && (
        <>
          <span className="text-sm muted">{email}</span>
          <button onClick={logout} disabled={loading} className={`text-sm ml-2 ${loading ? 'text-gray-400' : 'text-red-600'}`}>
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </>
      )}
    </nav>
  )
}
