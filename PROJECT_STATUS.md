# PROJECT_STATUS.md

## As of 2026-06-22

### Live and stable
- `/health` returns: status ok, app running, database ready, storage mongo
- Persistence verified: roasts #000001 and #000002 survived a server restart
- ADMIN_TOKEN was rotated after old token was exposed
- Old MongoDB user `talns33_db_user` was deleted; active user is `roastwall-prod`
- Payment UI is placeholder/demo only — no real payment processing wired

### Infrastructure
| Item | Value |
|------|-------|
| Hosting | Render.com |
| Database | MongoDB Atlas, cluster0.xh5fx4o.mongodb.net |
| DB name | roastwall |
| DB user | roastwall-prod |
| GitHub | https://github.com/talns33-a11y/roast-wall-standalone |

### Known limitations / not done
- Payment flow is demo only
- No automated tests
- No CI/CD pipeline beyond Render auto-deploy on push to main
