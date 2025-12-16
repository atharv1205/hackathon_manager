import dotenv from 'dotenv'
dotenv.config()

import { connect } from '../lib/mongo.js'
import Team from '../lib/models/Team.js'
import { hashPassword } from '../lib/auth.js'

const EMAIL = process.env.SEED_TEAM_EMAIL || 'atharva_s@gmail.com'
const PW = process.env.SEED_TEAM_PW || 'atharva123'

async function run(){
  try{
    console.log('Connecting to DB...')
    await connect()
    const existing = await Team.findOne({ email: EMAIL })
    const passwordHash = await hashPassword(PW)
    if(existing){
      existing.passwordHash = passwordHash
      existing.teamName = existing.teamName || 'Seed Team'
      await existing.save()
      console.log('Updated existing team:', EMAIL)
    } else {
      await Team.create({ teamName: 'Seed Team', members: ['Atharva'], email: EMAIL, projectTitle: 'Demo Project', problemStatement: 'Seeded project', techStack: 'Next.js', driveLink: '', passwordHash })
      console.log('Created team:', EMAIL)
    }
    process.exit(0)
  }catch(e){
    console.error('Error seeding team:', e.message || e)
    process.exit(1)
  }
}

run()
