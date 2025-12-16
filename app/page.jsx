export default function Home() {
  return (
    <div className="card home-card">
      <h2 className="heading home-heading">Welcome to Hackathon Manager</h2>

      <p className="mb-4 text-gray-700">
        Simple platform for team registration, judge evaluation, and organizer leaderboard.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 border rounded home-box">
          <h3 className="font-semibold text-lg mb-1">Step 1 — Login</h3>
          <p className="text-sm text-gray-600 mb-3">
            Choose if you're a team (student), judge, or organizer.
          </p>
          <a className="btn primary-btn" href="/login">Login</a>
        </div>

        <div className="p-4 border rounded home-box">
          <h3 className="font-semibold text-lg mb-1">New team? Register</h3>
          <p className="text-sm text-gray-600 mb-3">
            Register your team and upload project materials.
          </p>
          <div className="flex gap-2">
            <a className="btn primary-btn" href="/team/register">Register Team</a>
            <a className="btn secondary-btn" href="/team">View Teams</a>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 text-xs text-gray-600 text-center subtle-note">
        If you are a judge or organizer, login first to reach your panel.
      </div>
    </div>
  )
}
