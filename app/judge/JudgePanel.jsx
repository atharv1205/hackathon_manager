'use client'
import { useEffect, useState } from 'react'

export default function JudgePanel() {
  const [teams, setTeams] = useState([])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({innovation:5,impact:5,feasibility:5,execution:5,presentation:5,comment:''})
  const [scoresMap, setScoresMap] = useState({}) // teamId -> most recent score by me
  const [myEmail, setMyEmail] = useState(null)

  useEffect(()=>{
    // load teams and current user + scores
    async function init(){
      const [teamsRes, userRes, scoresRes] = await Promise.all([
        fetch('/api/teams'),
        fetch('/api/auth/me'),
        fetch('/api/scores')
      ])
      const teamsData = await teamsRes.json()
      const userData = await userRes.json()
      const scoresData = await scoresRes.json()
      setTeams(teamsData.teams||[])
      const email = userData?.payload?.email
      setMyEmail(email)

      // make map of latest score by this judge for each team
      const scores = scoresData?.scores || []
      const myScores = scores.filter(s => s.judgeEmail === email)
      const map = {}
      myScores.forEach(s => {
        const id = String(s.team?._id || s.team)
        // keep the latest by createdAt
        if(!map[id] || new Date(map[id].createdAt) < new Date(s.createdAt)) map[id] = s
      })
      setScoresMap(map)
    }
    init()
  },[])
  function open(t){ setSelected(t) }
  function setField(k,v){ setForm(prev=>({...prev,[k]:v})) }
  async function submit() {
    if(!selected) return
    const body = { teamId: selected._id, judgeEmail: myEmail, ...form }
    const res = await fetch('/api/scores', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    if(res.ok) { 
      const j = await res.json()
      const s = j.score
      // update local scores map to reflect newly submitted score
      setScoresMap(prev => ({ ...prev, [String(s.team)]: s }))
      // refresh teams and scores so other judges see updates and team aggregates update
      try{
        const [teamsRes, scoresRes] = await Promise.all([fetch('/api/teams'), fetch('/api/scores')])
        const teamsData = await teamsRes.json()
        const scoresData = await scoresRes.json()
        setTeams(teamsData.teams || [])
        // update scores map from latest data
        const map = {}
        const email = myEmail
        (scoresData.scores || []).filter(s=>s.judgeEmail===email).forEach(s=>{
          const id = String(s.team?._id || s.team)
          if(!map[id] || new Date(map[id].createdAt) < new Date(s.createdAt)) map[id] = s
        })
        setScoresMap(map)
      }catch(e){ console.warn(e) }
      alert('Score submitted'); setSelected(null)
    }
    else { alert('Error') }
  }
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="card md:col-span-1">
        <h3 className="font-bold">Teams</h3>
        <div className="mt-2 space-y-2">
          {teams.map(t=>(
            <div key={t._id} className="p-2 border rounded flex justify-between items-center" style={{cursor:'pointer'}} onClick={()=>open(t)}>
              <div>
                <div className="font-semibold">{t.teamName}</div>
                <div className="text-sm">{t.projectTitle}</div>
              </div>
              <div className="text-right">
                {scoresMap[String(t._id)] ? (
                  <div className="text-sm text-slate-700">Your final: <strong>{scoresMap[String(t._id)].finalScore.toFixed(2)}</strong></div>
                ) : (
                  <div className="text-xs text-gray-400">Not scored yet</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card md:col-span-2">
        {selected ? (
          <>
            <h3 className="font-bold">{selected.teamName}</h3>
            <p className="text-sm">{selected.problemStatement}</p>
            <div className="mt-2">
              <a className="btn" href={selected.driveLink} target="_blank" rel="noreferrer">Open Drive</a>
            </div>
            <div className="mt-4 space-y-2">
              <label className="label">Innovation</label>
              <div className="flex items-center gap-3">
                <input type="range" min="1" max="10" value={form.innovation} onChange={e=>setField('innovation',Number(e.target.value))} />
                <input type="number" min="1" max="10" value={form.innovation} onChange={e=>setField('innovation',Number(e.target.value))} className="w-16 input" />
              </div>
              <label className="label">Impact</label>
              <div className="flex items-center gap-3">
                <input type="range" min="1" max="10" value={form.impact} onChange={e=>setField('impact',Number(e.target.value))} />
                <input type="number" min="1" max="10" value={form.impact} onChange={e=>setField('impact',Number(e.target.value))} className="w-16 input" />
              </div>
              <label className="label">Feasibility</label>
              <div className="flex items-center gap-3">
                <input type="range" min="1" max="10" value={form.feasibility} onChange={e=>setField('feasibility',Number(e.target.value))} />
                <input type="number" min="1" max="10" value={form.feasibility} onChange={e=>setField('feasibility',Number(e.target.value))} className="w-16 input" />
              </div>
              <label className="label">Execution</label>
              <div className="flex items-center gap-3">
                <input type="range" min="1" max="10" value={form.execution} onChange={e=>setField('execution',Number(e.target.value))} />
                <input type="number" min="1" max="10" value={form.execution} onChange={e=>setField('execution',Number(e.target.value))} className="w-16 input" />
              </div>
              <label className="label">Presentation</label>
              <div className="flex items-center gap-3">
                <input type="range" min="1" max="10" value={form.presentation} onChange={e=>setField('presentation',Number(e.target.value))} />
                <input type="number" min="1" max="10" value={form.presentation} onChange={e=>setField('presentation',Number(e.target.value))} className="w-16 input" />
              </div>
              <div className="mt-2">
                <strong>Calculated final score: </strong>
                {((Number(form.innovation)+Number(form.impact)+Number(form.feasibility)+Number(form.execution)+Number(form.presentation))/5).toFixed(2)}
              </div>
              <label className="label">Comments</label>
              <textarea className="input" value={form.comment} onChange={e=>setField('comment',e.target.value)} />
              <div className="mt-2">
                  <button className="btn" onClick={submit}>Submit Score</button>
                  <button className="ml-2 btn" onClick={()=>setSelected(null)}>Close</button>
                </div>
              { /* show the existing score by me if present */ }
              {scoresMap[String(selected._id)] && (
                <div className="mt-3 p-3 border rounded bg-slate-50">
                  <div className="font-semibold">Your last score for this team:</div>
                  <div>Final: <strong>{scoresMap[String(selected._id)].finalScore.toFixed(2)}</strong></div>
                  <div className="text-sm text-gray-600">Submitted: {new Date(scoresMap[String(selected._id)].createdAt).toLocaleString()}</div>
                  <div className="text-sm mt-1">Comments: {scoresMap[String(selected._id)].comment || '-'}</div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div>Select a team to evaluate</div>
        )}
      </div>
    </div>
  )
}
