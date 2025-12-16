import { NextResponse } from 'next/server'
import { connect } from '../../../../lib/mongo'
import Team from '../../../../lib/models/Team'
import Judge from '../../../../lib/models/Judge'
import Score from '../../../../lib/models/Score'

export async function GET() {
  await connect()
  const teams = await Team.countDocuments()
  const judges = await Judge.countDocuments()
  const submissions = await Score.distinct('team').then(r=>r.length)
  const leaderboard = await Score.aggregate([
    { $group: { _id: '$team', avg: { $avg: '$finalScore' } } },
    { $lookup: { from: 'teams', localField: '_id', foreignField: '_id', as: 'team' } },
    { $unwind: '$team' },
    { $project: { teamName: '$team.teamName', avg: 1 } },
    { $sort: { avg: -1 } },
    { $limit: 10 }
  ])
  return NextResponse.json({ teams, judges, submissions, leaderboard })
}
