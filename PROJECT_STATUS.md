# PROJECT_STATUS.md
As of 2026-06-22

## Phase 1 — AI Shame Trial rebrand — LIVE IN PRODUCTION

- Landing page: shows "Stand trial for your life choices." — old "Get roasted by AI" headline gone
- Wall: renamed to "Hall of the Convicted"
- Form: all labels rewritten as court testimony prompts; submit button is "I plead guilty — begin the trial"
- Certificate: shows "CONVICTED:" prefix, "Mercy of the court:", "AI Shame Trial — Official Verdict" footer
- Share buttons: Share on X, Copy sentence, Copy verdict link — all live on certificate page
- Branch: viral-shame-trial-phase1 merged via PR #1, then deleted from GitHub
- MongoDB records: #000001 and #000002 survived the deploy — no data loss

## Phase 2 — Generator content upgrade — LIVE IN PRODUCTION

- Deployed commit: 5062d04 (merged via PR #2, branch phase2-generator-content, deleted after merge)
- TITLES: absurd conviction charges per tone (4 per tone, 16 total) — fully rewritten
- ROAST_LINES: court findings using defendant's own testimony — fully rewritten
- COMPLIMENTS: mercy-of-the-court lines (8 total) — fully rewritten
- CAPTIONS: #AIShameTrial share captions — old "Million AI Roast Wall" hashtag removed
- certificateText: reads "AI SHAME TRIAL — OFFICIAL VERDICT" and "tried, convicted, and sentenced"
- No interface, signature, or schema changes — RoastInput, RoastTone, GeneratedRoast, generateRoast() all unchanged
- Test verdict #000006 confirmed Phase 2 content works:
  - Verdict uses AI court / conviction language ✓
  - Mercy of the court text present ✓
  - Share caption includes #AIShameTrial ✓
- Existing records #000001 through #000005 survived — no data loss

## Live and stable

- /health returns: status ok, app running, database ready, storage mongo
- Persistence verified: records #000001 through #000005 survived Phase 1 and Phase 2 deploys
- ADMIN_TOKEN was rotated after old token was exposed
- Old MongoDB user talns33_db_user was deleted; active user is roastwall-prod
- Payment UI is placeholder/demo only — no real payment processing wired

## Infrastructure

| Item     | Value                                                  |
|----------|--------------------------------------------------------|
| Hosting  | Render.com                                             |
| Database | MongoDB Atlas, cluster0.xh5fx4o.mongodb.net            |
| DB name  | roastwall                                              |
| DB user  | roastwall-prod                                         |
| GitHub   | https://github.com/talns33-a11y/roast-wall-standalone  |

## Known limitations / not done

- Payment flow is demo only
- No automated tests
- No CI/CD pipeline beyond Render auto-deploy on push to main
