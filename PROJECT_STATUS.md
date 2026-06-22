# PROJECT_STATUS.md

## As of 2026-06-22

### Phase 1 — AI Shame Trial rebrand — LIVE IN PRODUCTION

- **Landing page:** shows "Stand trial for your life choices." — old "Get roasted by AI" headline gone
- **Wall:** renamed to "Hall of the Convicted"
- **Form:** all labels rewritten as court testimony prompts; submit button is "I plead guilty — begin the trial"
- **Certificate:** shows "CONVICTED:" prefix, "Mercy of the court:", "AI Shame Trial — Official Verdict" footer
- **Share buttons:** Share on X, Copy sentence, Copy verdict link — all live on certificate page
- **Branch:** `viral-shame-trial-phase1` merged via PR #1, then deleted from GitHub
- **MongoDB records:** #000001 and #000002 survived the deploy — no data loss

### Live and stable
- `/health` returns: status ok, app running, database ready, storage mongo
- Persistence verified: roasts #000001 and #000002 survived restart and Phase 1 deploy
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
- Social captions still reference "Million AI Roast Wall" — can be updated in Phase 2
