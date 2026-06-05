# Testing Workflow & Automation Trigger

This document explains the "Memory" system that triggers tests automatically.

## 🔄 The Automation Trigger (Memory)
We use a **Git Pre-Push Hook** to act as a quality gate.

### How it works:
1. When you run `git push`, the script at `.git/hooks/pre-push` is executed.
2. It runs `npx playwright test`.
3. If any test fails, the push is **aborted**, preventing broken code from reaching production.
4. If all tests pass, the push proceeds normally.

### Activation:
To activate this trigger on your machine, run:
```bash
chmod +x .git/hooks/pre-push
```

## 📊 Interpreting Results
- **🟢 Pass:** All systems are functional.
- **🔴 Fail:** A regression has been detected. Check the `playwright-report/` folder for:
    - **Screenshots:** Captured at the exact moment of failure.
    - **Videos:** A full recording of the automated browser session.
    - **Traces:** Deep logs of network calls and UI interactions.
