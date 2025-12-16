'use client'
import { useEffect, useState } from 'react'
import JudgeCreate from './JudgeCreate'

export default function AdminJudges(){
  const [judges, setJudges] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(false)

  async function load(){
    setLoading(true)
    try{
      const res = await fetch('/api/judges')
      const j = await res.json()
      setJudges(j.judges || [])
    }catch(e){ console.error(e) }
    setLoading(false)
  }

  useEffect(()=>{ load() },[])

  return (
    <div>
      <h3 className="font-bold mb-2">Judges</h3>
      <div className="flex items-center gap-2 mb-3">
        <button className="btn" onClick={()=>setShowCreate(s=>!s)}>{showCreate ? 'Close' : 'Add Judge'}</button>
        <button className="btn-outline" onClick={load}>Refresh</button>
      </div>
      {showCreate && (
        <div className="mb-4"><JudgeCreate /></div>
      )}
      <div>
        {loading ? <div className="text-sm muted">Loading...</div> : (
          <div className="space-y-2">
            {judges.map(j=> (
              <div key={j._id} className="p-2 border rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{j.name || j.email}</div>
                  <div className="text-sm muted">{j.email}</div>
                </div>
                <div className="text-xs text-gray-500">Joined: {new Date(j.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
