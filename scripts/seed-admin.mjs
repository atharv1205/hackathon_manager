import dotenv from 'dotenv'
dotenv.config()

import { connect } from '../lib/mongo.js'
import Admin from '../lib/models/Admin.js'
import { hashPassword } from '../lib/auth.js'

const EMAIL = process.env.SEED_ADMIN_EMAIL || 'atharva_d@gmail.com'
const PW = process.env.SEED_ADMIN_PW || 'atharva123'

async function run(){
  try{
    console.log('Connecting to DB...')
    await connect()
    const existing = await Admin.findOne({ email: EMAIL })
    const passwordHash = await hashPassword(PW)
    if(existing){
      existing.passwordHash = passwordHash
      existing.name = existing.name || 'Atharva D'
      await existing.save()
      console.log('Updated existing admin:', EMAIL)
    } else {
      await Admin.create({ name: 'Atharva D', email: EMAIL, passwordHash })
      console.log('Created admin:', EMAIL)
    }
    process.exit(0)
  }catch(e){
    console.error('Error seeding admin:', e.message || e)
    process.exit(1)
  }
}

run()
