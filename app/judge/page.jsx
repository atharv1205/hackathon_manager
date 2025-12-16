import { cookies } from 'next/headers'
import { verifyToken } from '../../lib/auth'
import { redirect } from 'next/navigation'
import JudgePanel from './JudgePanel'

export default function JudgePage() {
  // server-component guard: require judge role
  try {
    const token = cookies().get('token')?.value
    const payload = token ? verifyToken(token) : null
    if(!payload || payload.role !== 'judge') {
      return redirect('/login')
    }
  } catch (e) {
    return redirect('/login')
  }

  // render client UI which handles fetching and scoring
  return <JudgePanel />
}
