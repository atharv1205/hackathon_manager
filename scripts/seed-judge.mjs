import dotenv from 'dotenv'
dotenv.config()

import { connect } from '../lib/mongo.js'
import Judge from '../lib/models/Judge.js'
import { hashPassword } from '../lib/auth.js'

const EMAIL = process.env.SEED_JUDGE_EMAIL || 'atharva@gmail.com'
const PW = process.env.SEED_JUDGE_PW || 'atharva123'

async function run(){
  try{
    console.log('Connecting to DB...')
    await connect()
    const existing = await Judge.findOne({ email: EMAIL })
    const passwordHash = await hashPassword(PW)
    if(existing){
      existing.passwordHash = passwordHash
      existing.name = existing.name || 'Atharva'
      await existing.save()
      console.log('Updated existing judge:', EMAIL)
    } else {
      await Judge.create({ name: 'Atharva', email: EMAIL, passwordHash })
      console.log('Created judge:', EMAIL)
    }
    process.exit(0)
  }catch(e){
    console.error('Error seeding judge:', e.message || e)
    process.exit(1)
  }
}

run()
