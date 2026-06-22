# NEXT_STEPS.md

## Before touching any code

Read the codebase first. Understand server/index.ts, server/api.ts, and the frontend entry point before making changes.

Run locally and confirm it works. `npm install` then `npm run dev`. Check the wall loads and health endpoint responds.

Confirm what you're changing and why. The app is live and stable — every change risks a broken deploy.

## Completed

### Phase 1 — AI Shame Trial rebrand (merged 2026-06-22, PR #1)

- Landing page, nav, form, certificate, wall — all rebranded to trial/verdict language
- Three share actions on certificate: Share on X, Copy sentence, Copy verdict link
- Build passed, deployed to Render, validated live — no data loss
- Branch viral-shame-trial-phase1 deleted after merge

### Phase 2 — Generator content upgrade (merged 2026-06-22, PR #2, commit 5062d04)

- TITLES, ROAST_LINES, COMPLIMENTS arrays rewritten with AI court/conviction language
- CAPTIONS updated to use #AIShameTrial (old "Million AI Roast Wall" hashtag removed)
- certificateText updated to "AI SHAME TRIAL — OFFICIAL VERDICT"
- Test verdict #000006 confirmed Phase 2 content: court language ✓, mercy text ✓, #AIShameTrial ✓
- Existing records #000001–#000005 survived — no data loss
- Branch phase2-generator-content deleted after merge

## Suggested next work (in priority order)

### High value, low risk

- Add real input validation / rate limiting on the POST /roast endpoint
- Add a simple admin UI to delete verdicts (currently requires raw API calls with ADMIN_TOKEN)
- Write at least one smoke test for the health and POST endpoints
- Add OG meta tags to /certificate/:id so sharing the URL shows a rich preview on Twitter/iMessage

### Medium

- Wire up a real payment provider (Stripe) — currently placeholder only
- Add a CI check (GitHub Actions) so broken builds don't auto-deploy to Render

### Low / future

- Pagination on the wall (currently loads all records)
- Moderation queue before verdicts go public

## How to make a safe code change

1. Make change locally
2. Test with `npm run dev`
3. Commit to a feature branch (not main)
4. Open a PR, review the diff
5. Merge to main only when confident — Render deploys immediately on merge
