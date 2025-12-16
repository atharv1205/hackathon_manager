import { NextResponse } from 'next/server'
import { connect } from '../../../lib/mongo'
import Score from '../../../lib/models/Score'
import Team from '../../../lib/models/Team'

export async function GET() {
  await connect()
  const scores = await Score.find().populate('team').lean()
  return NextResponse.json({ scores })
}

export async function POST(req) {
  await connect()
  try {
    const { teamId, judgeEmail, innovation, impact, feasibility, execution, presentation, comment } = await req.json()
    if(!teamId) return NextResponse.json({ error: 'teamId required' }, { status:400 })
    const final = [innovation, impact, feasibility, execution, presentation].map(Number).reduce((a,b)=>a+b,0)/5
    const s = new Score({ team: teamId, judgeEmail, innovation, impact, feasibility, execution, presentation, comment, finalScore: final })
    await s.save()
    // Update team aggregated stats so other users see the latest evaluation immediately
    try {
      // use the statically imported Team model above
      // compute new avg and count for that team
      const agg = await Score.aggregate([
        { $match: { team: s.team } },
        { $group: { _id: '$team', avg: { $avg: '$finalScore' }, count: { $sum: 1 } } }
      ])
      if(agg && agg.length){
        await Team.findByIdAndUpdate(s.team, { avgScore: agg[0].avg, scoresCount: agg[0].count, lastScore: s.finalScore })
      } else {
        await Team.findByIdAndUpdate(s.team, { avgScore: s.finalScore, scoresCount: 1, lastScore: s.finalScore })
      }
    } catch(e) {
      console.warn('Failed to update team aggregates', e)
    }

    return NextResponse.json({ ok: true, score: s })
  } catch(e) { return NextResponse.json({ error: e.message }, { status:500 }) }
}
