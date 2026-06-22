# DEPLOYMENT.md

## How the app is deployed

### Render.com (current hosting)
- Render watches the `main` branch of the GitHub repo
- Every push to `main` triggers an automatic redeploy
- **Do not push to main unless you intend to deploy**

### Environment variables on Render (set in Render dashboard — never in code)
- `MONGO_URL` — full Atlas connection string including credentials
- `ADMIN_TOKEN` — bearer token for admin endpoints
- `PORT` — set automatically by Render (do not hardcode)

### MongoDB Atlas
- Cluster: cluster0.xh5fx4o.mongodb.net
- Database: roastwall
- User: roastwall-prod (least-privilege, created after old user was deleted)
- IP allowlist: set to allow Render's outbound IPs (or 0.0.0.0/0 if open)

## Build & start commands (as configured on Render)
Refer to Render dashboard for exact commands. Typical pattern:
```
build:  npm install && npm run build
start:  npm start
```

## Do not touch
- Do not change build commands without testing locally first
- Do not add new environment variables to Render without documenting here
- Do not redeploy manually unless the auto-deploy is broken
