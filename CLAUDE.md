# CLAUDE.md — AI Shame Trial (roast-wall-standalone)

## Project overview
Full-stack AI Shame Trial app — users submit testimony, receive an AI verdict, and are added to the public "Hall of the Convicted". React frontend, Node/Express backend, MongoDB Atlas persistence. Deployed on Render.com.

**Current brand:** AI Shame Trial / Public AI Trial (rebranded from "Roast Wall" in Phase 1, 2026-06-22)

## Do NOT do any of these
- Touch Render config or redeploy
- Change MongoDB connection strings or Atlas settings
- Rotate or expose secrets (ADMIN_TOKEN, MONGO_URL)
- Connect or activate payment flows
- Push to `main` without explicit user approval

## Key URLs (read-only reference)
- App: https://roast-wall-standalone.onrender.com
- Wall: https://roast-wall-standalone.onrender.com/wall
- Health: https://roast-wall-standalone.onrender.com/health

## Local dev
```bash
npm install
npm run dev        # starts both server and client
```

## Structure
```
server/            Express API (TypeScript)
roast-wall/        React frontend (Vite)
tsconfig.server.json
```

## Environment variables (never commit values)
- `MONGO_URL` — MongoDB Atlas connection string
- `ADMIN_TOKEN` — admin auth token (rotated; do not expose)
- `PORT` — set by Render automatically
