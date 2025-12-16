# Hackathon Manager (Minimal)

This is a minimal Next.js (App Router) project for hackathon registration and judging.
Uses MongoDB Atlas (mongoose). Drive link only (no file upload).

To run:
1. Copy `.env.local` content and update `JWT_SECRET` if desired.
2. `npm install`
3. `npm run dev`
4. Open http://localhost:3000

APIs:
- POST /api/teams : register team
- GET /api/teams : list teams
- POST /api/judges : create judge
- POST /api/scores : submit score
- GET /api/scores : list scores
- POST /api/auth/login : login (judge/admin/team)

