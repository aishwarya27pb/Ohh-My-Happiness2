# Troubleshooting & Maintenance

## 🛠 Common Scenarios

### 1. "Tests pass locally but fail on push"
Ensure your local server is running or that the `webServer` command in `playwright.config.ts` is correct for your environment.

### 2. "A UI change broke a test"
If you intentionally changed the UI (e.g., renamed a button), you must update the test script in `tests/e2e/specs/`. 
- Use `npm run test:ui` to debug the failing selector visually.

### 3. "Supabase Connection Errors"
The tests require a valid connection to your Supabase instance. Ensure your `.env.local` variables are set correctly.

## 🧹 Maintenance Checklist
- [ ] Review `TEST_PLAN.md` after adding new major features.
- [ ] Run `npx playwright install` after updating Playwright versions.
- [ ] Clean up `playwright-report/` occasionally to save disk space.
