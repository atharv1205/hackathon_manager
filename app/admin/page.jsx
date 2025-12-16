import { connect } from '../../lib/mongo'
import Team from '../../lib/models/Team'
import Judge from '../../lib/models/Judge'
import Score from '../../lib/models/Score'
import AdminJudges from './AdminJudges'
import { cookies } from 'next/headers'
import { verifyToken } from '../../lib/auth'
import { redirect } from 'next/navigation'

export default async function Admin() {
  // server-side guard: only admin allowed
  const token = cookies().get('token')?.value
  const payload = token ? verifyToken(token) : null
  if(!payload || payload.role !== 'admin') return redirect('/login')

  await connect()
  const teamsCount = await Team.countDocuments()
  const judgesCount = await Judge.countDocuments()
  const submissionsCount = await Score.distinct('team').then(r=>r.length)
  const leaderboard = await Score.aggregate([
    { $group: { _id: '$team', total: { $sum: '$finalScore' }, avg: { $avg: '$finalScore' } } },
    { $lookup: { from: 'teams', localField: '_id', foreignField: '_id', as: 'team' } },
    { $unwind: '$team' },
    { $project: { teamName: '$team.teamName', total:1, avg:1 } },
    { $sort: { avg: -1 } },
    { $limit: 10 }
  ])
  return (
    <div>
      <h2 className="heading">Organizer Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="card">Total Teams: {teamsCount}</div>
        <div className="card">Total Judges: {judgesCount}</div>
        <div className="card">Submissions: {submissionsCount}</div>
      </div>
      <div className="card">
        <AdminJudges />
      </div>
      <div className="card">
        <h3 className="font-bold mb-2">Leaderboard</h3>
        <ol>
          {leaderboard.map((r)=>(
            <li key={r._id} className="mb-2">{r.teamName} — Avg: {r.avg.toFixed(2)}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}
