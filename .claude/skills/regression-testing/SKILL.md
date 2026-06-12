---
name: regression-testing
description: Run the full regression suite (typecheck, lint, build, unit tests, Playwright e2e) after a code push or before merging. Use when the user asks to run regression tests, verify a push didn't break anything, or after `git push` completes.
allowed-tools: Bash(npm run:*) Bash(npx:*) Bash(git:*)
---

# Regression Testing

Runs after every push to `master` (or on request) to catch breakages before they reach
production. Static export build means there is no CI safety net — this is the safety net.

## When to run

- Immediately after a successful `git push` to `master`/a shared branch.
- Before telling the user a feature is "done" if the change touched shared components
  (Header, Footer, Cart/Wishlist contexts, layouts, Supabase actions).
- On explicit request ("run regression tests", "did that push break anything?").

## Steps

Run these in order; stop and report at the first failure rather than continuing.

1. **Typecheck**
   ```bash
   npx tsc --noEmit
   ```

2. **Lint**
   ```bash
   npm run lint
   ```

3. **Production build** (catches static export / generateStaticParams errors that
   typecheck and lint miss)
   ```bash
   npm run build
   ```

4. **Unit tests**
   ```bash
   npm run test:unit
   ```

5. **E2E regression suite** (Playwright). The webServer config in `playwright.config.ts`
   auto-starts `npm run dev`, so don't start a dev server manually first.
   ```bash
   npm run test
   ```
   If a focused run is more appropriate (e.g. only the change touched checkout), scope it:
   ```bash
   npx playwright test tests/e2e/specs/checkout.spec.ts
   ```

## After running

- Summarize pass/fail per step in a short table — don't paste full logs.
- On failure, identify whether the failure is caused by the just-pushed change (check
  `git log -1` / `git diff HEAD~1`) vs. a pre-existing flaky test, and say which.
- If Playwright leaves a `playwright-report/` or `test-results/` directory and the user
  doesn't need it, clean it up (`rm -rf playwright-report test-results`).
- Never push a fix for a regression-test failure without telling the user what broke and
  what you changed to fix it.
