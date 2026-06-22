# CLAUDE.md — Roast Wall Standalone

## Project overview
Full-stack roast/comment wall app. React frontend, Node/Express backend, MongoDB Atlas persistence. Deployed on Render.com.

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
