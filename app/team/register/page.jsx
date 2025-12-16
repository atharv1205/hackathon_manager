'use client'
import { useState } from 'react'

export default function Register() {
  const [status, setStatus] = useState('')
  async function onSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.target)
    const membersRaw = form.get('members') || ''
    const members = membersRaw.split(',').map(s=>s.trim()).filter(Boolean)
    const body = {
      teamName: form.get('teamName'),
      members,
      email: form.get('email'),
      projectTitle: form.get('projectTitle'),
      problemStatement: form.get('problemStatement'),
      techStack: form.get('techStack'),
      driveLink: form.get('driveLink')
    }
    // driveLink is mandatory
    if (!body.driveLink) { setStatus('Drive link is required'); return }
    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const j = await res.json()
    if (res.ok) {
      setStatus('Registration Successful')
      e.target.reset()
    } else {
      setStatus(j?.error || 'Error')
    }
  }

  return (
    <div className="card">
      <h2 className="heading">Team Registration</h2>
      <form onSubmit={onSubmit} className="max-w-lg">
        <label className="label">Team Name</label>
        <input name="teamName" className="input" required />
        <label className="label">Team Members (comma separated)</label>
        <input name="members" className="input" placeholder="Alice, Bob" />
        <label className="label">Contact Email</label>
        <input name="email" type="email" className="input" required />
        <label className="label">Project Title</label>
        <input name="projectTitle" className="input" />
        <label className="label">Problem Statement</label>
        <textarea name="problemStatement" className="input" rows="4" />
        <label className="label">Tech Stack</label>
        <input name="techStack" className="input" />
        <label className="label">Google Drive Link (PPT) - mandatory</label>
        <input name="driveLink" className="input" placeholder="https://drive.google.com/..." required />
        <div className="mt-2">
          <button className="btn" type="submit">Submit Registration</button>
        </div>
      </form>
      <div className="mt-3">{status}</div>
    </div>
  )
}
