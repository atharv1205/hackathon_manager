import { cookies } from 'next/headers'
import { verifyToken } from '../../../lib/auth'
import { redirect } from 'next/navigation'
import { connect } from '../../../lib/mongo'
import Team from '../../../lib/models/Team'

export default async function TeamManagePage(){
  // server guard: must be a team
  const token = cookies().get('token')?.value
  const payload = token ? verifyToken(token) : null
  if(!payload || payload.role !== 'team') return redirect('/login')

  await connect()
  const team = await Team.findById(payload.id).lean()
  if(!team) return <div className="card">Team not found</div>

  return (
    <div className="card max-w-2xl">
      <h2 className="heading">Your Team Dashboard</h2>
      <div className="mb-3">
        <div className="font-bold text-lg">{team.teamName}</div>
        <div className="text-sm text-gray-600">{team.projectTitle}</div>
        <div className="mt-2 text-xs text-gray-500">Members: {(team.members||[]).join(', ')}</div>
      </div>

      <div>
        <h3 className="font-bold">Project</h3>
        <p className="text-sm">{team.problemStatement}</p>
        <div className="mt-2">Drive Link: <a href={team.driveLink} className="text-blue-600" target="_blank" rel="noreferrer">Open</a></div>
      </div>

      <div className="mt-4 text-sm text-gray-600">If you need to update details, use the registration page to re-submit or contact an organizer.</div>
    </div>
  )
}
