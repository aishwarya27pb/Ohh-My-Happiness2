# Testing Engine Documentation

Welcome to the **Ohh My Happiness** testing engine. This suite uses Playwright to ensure high quality across UI, API, and Security layers.

## 📁 Directory Structure
- `tests/e2e/specs/`: All automated test scripts.
- `docs/testing/`: Documentation and maintenance guides.
- `TEST_PLAN.md`: The master tracking document for coverage.
- `playwright-report/`: Generated after tests run (contains videos/screenshots of failures).

## 🚀 Quick Start
Run all tests:
```bash
npm test
```

Run tests with visual UI:
```bash
npm run test:ui
```

## 🛡️ Core Suites
1. **Customer Flow:** Validates browsing, cart, and COD checkout.
2. **Admin Operations:** Validates the OMS dashboard, charts, and logistics tools.
3. **Security Audit:** Ensures `/admin` routes are protected from unauthorized access.
