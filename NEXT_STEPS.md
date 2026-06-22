# NEXT_STEPS.md

## Before touching any code

1. **Read the codebase first.** Understand `server/index.ts`, `server/api.ts`, and the frontend entry point before making changes.
2. **Run locally and confirm it works.** `npm install` then `npm run dev`. Check the wall loads and health endpoint responds.
3. **Confirm what you're changing and why.** The app is live and stable — every change risks a broken deploy.

## Suggested next work (in priority order)

### High value, low risk
- [ ] Add real input validation / rate limiting on the POST /roast endpoint
- [ ] Add a simple admin UI to delete roasts (currently requires raw API calls with ADMIN_TOKEN)
- [ ] Write at least one smoke test for the health and POST endpoints

### Medium
- [ ] Wire up a real payment provider (Stripe) — currently placeholder only
- [ ] Add a CI check (GitHub Actions) so broken builds don't auto-deploy to Render

### Low / future
- [ ] Pagination on the wall (currently loads all roasts)
- [ ] Moderation queue before roasts go public

## How to make a safe code change
1. Make change locally
2. Test with `npm run dev`
3. Commit to a feature branch (not main)
4. Open a PR, review the diff
5. Merge to main only when confident — Render deploys immediately on merge
