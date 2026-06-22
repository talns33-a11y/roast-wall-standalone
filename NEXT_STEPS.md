# NEXT_STEPS.md

## Before touching any code

1. **Read the codebase first.** Understand `server/index.ts`, `server/api.ts`, and the frontend entry point before making changes.
2. **Run locally and confirm it works.** `npm install` then `npm run dev`. Check the wall loads and health endpoint responds.
3. **Confirm what you're changing and why.** The app is live and stable — every change risks a broken deploy.

## Completed

- [x] **Phase 1 — AI Shame Trial rebrand** (merged 2026-06-22, PR #1)
  - Landing page, nav, form, certificate, wall — all rebranded to trial/verdict language
  - Three share actions on certificate: Share on X, Copy sentence, Copy verdict link
  - Build passed, deployed to Render, validated live — no data loss

## Suggested next work (in priority order)

### Phase 2 — Content and generator upgrade
- [ ] Rewrite social captions in `roast-generator.ts` to use `#AIShameTrial` (currently still say "Million AI Roast Wall")
- [ ] Rewrite TITLES, ROAST_LINES, COMPLIMENTS arrays with trial/verdict/charge language to match new UI theme
- [ ] Update `certificateText` in the generator to say "AI Shame Trial" instead of "THE MILLION AI ROAST WALL"

### High value, low risk
- [ ] Add real input validation / rate limiting on the POST /roast endpoint
- [ ] Add a simple admin UI to delete verdicts (currently requires raw API calls with ADMIN_TOKEN)
- [ ] Write at least one smoke test for the health and POST endpoints
- [ ] Add OG meta tags to `/certificate/:id` so sharing the URL shows a rich preview on Twitter/iMessage

### Medium
- [ ] Wire up a real payment provider (Stripe) — currently placeholder only
- [ ] Add a CI check (GitHub Actions) so broken builds don't auto-deploy to Render

### Low / future
- [ ] Pagination on the wall (currently loads all records)
- [ ] Moderation queue before verdicts go public

## How to make a safe code change
1. Make change locally
2. Test with `npm run dev`
3. Commit to a feature branch (not main)
4. Open a PR, review the diff
5. Merge to main only when confident — Render deploys immediately on merge
