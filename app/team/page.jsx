import { connect } from '../../lib/mongo'
import Team from '../../lib/models/Team'

export default async function TeamsPage() {
  await connect()
  const teams = await Team.find().lean()
  return (
    <div>
      <h2 className="heading">Registered Teams</h2>
      <div>
        {teams.map(t => (
          <div key={t._id} className="card">
            <div className="font-bold">{t.teamName}</div>
            <div className="text-sm">{t.projectTitle}</div>
            <div className="mt-2">
              <a className="text-sm" href={t.driveLink} target="_blank" rel="noreferrer">Open Drive</a>
            </div>
            <div className="text-xs text-gray-600 mt-2">Members: { (t.members||[]).join(', ') }</div>
          </div>
        ))}
      </div>
    </div>
  )
}
