# Master Test Plan: Ohh My Happiness

This document tracks all manual and automated test cases for the Ohh My Happiness platform.

## 🏁 Quality Goals
- 100% Coverage for Launch-Critical flows (Checkout, Admin Access).
- Zero-regression policy on new code changes.
- High-performance UI (all pages load < 2s).

---

## 🛍️ Customer Flow (E2E)
| ID | Scenario | Priority | Type | Status |
|---|---|---|---|---|
| C001 | Browse products and view details | High | Automation | 🟢 Ready |
| C002 | Add products to cart and update quantities | High | Automation | 🟢 Fixed |
| C003 | **Checkout Flow: Cash on Delivery (COD)** | Critical | Automation | 🟢 Fixed |
| C004 | Order Confirmation page visibility | High | Automation | 🟢 Ready |
| C005 | User Signup/Login (OTP & Password) | High | Automation | 🟢 Ready |

---

## 👑 Admin Operations (E2E)
| ID | Scenario | Priority | Type | Status |
|---|---|---|---|---|
| A001 | Admin Secure Login (Bypass) | Critical | Automation | 🟢 Fixed |
| A002 | View Order Dashboard and Visual Charts | Medium | Automation | 🟢 Fixed |
| A003 | **Order Logistics: Status Update** | High | Automation | 🟢 Ready |
| A004 | **Print Shipping Label** | High | Automation | 🟢 Ready |
| A005 | Product Management (Add/Edit/Delete) | High | Automation | 🟢 Ready |

---

## 🛡️ Security & API
| ID | Scenario | Priority | Type | Status |
|---|---|---|---|---|
| S001 | Unauthorized access to `/admin` routes | Critical | Security | 🟢 Fixed |
| S002 | SQL Injection / Parameter tampering check | High | Security | 🟢 Pending |
| S003 | API: Verify OTP rate limiting | Medium | API | 🟢 Pending |
| S004 | API: Valid session requirement for orders | Critical | API | 🟢 Pending |

---

## 🔄 Automation Trigger (Memory)
- **Git Hook:** `pre-push` script to run Playwright suite.
- **Reporting:** Automatic generation of HTML reports on failure.
- **Traceability:** Screenshots and videos captured for every failed run.
