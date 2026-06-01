# Brief Documentation of Work Done
**Candidate:** Ajay Kumar | **Assessment:** Automation & QA Developer Take-Home Skills Assessment

---

## Task 1 — QA & Debug Report

Manually tested the **Conduit (RealWorld)** demo web application at `https://demo.realworld.io` and identified **5 reproducible bugs** documented in `Task1_QA_Report_Ajay_Kumar.pdf`:

| # | Bug | Severity |
|---|-----|----------|
| 1 | Broken Profile Avatar URL Validation | Low |
| 2 | Double Form Submission on Slow Networks | Medium |
| 3 | Expired JWT Session Handling | **High** |
| 4 | Tag Filter Query Sanitization Failure | Medium |
| 5 | Weak Registration Password Validation | **High** |

**Root-Cause Analysis (Bug #3):** The API client lacks a global HTTP interceptor. When a JWT expires, the backend returns `401 Unauthorized` but the frontend state never resets — causing a split-brain where the user appears logged in but all actions silently fail. **Fix:** A global Axios response interceptor that clears the token, dispatches `LOGOUT`, and redirects to `/login?expired=true`.

---

## Task 2 — n8n API Integration Workflow

Built the workflow **`Task2_Workflow_Ajay_Kumar.json`** in n8n:

- **Trigger:** Schedule Trigger (every 1 hour)
- **Flow:** Calls the GitHub Search API → filters the top JavaScript repository by stars → enriches it with the GitHub Languages API → evaluates popularity (threshold: 100,000 stars) → posts a formatted digest to a **Telegram bot**
- **Error Handling:** A dedicated Error Trigger sub-flow catches any node failure and sends a structured alert to Telegram (workflow name, failed node, error message)
- **Security:** Zero hardcoded credentials — all secrets stored in n8n's credential manager

---

## Bonus — Uptime Monitor Workflow

Built the workflow **`Bonus_UptimeMonitor_Ajay_Kumar.json`** in n8n:

- **Trigger:** Schedule Trigger (every 5 minutes)
- **Flow:** Sends an HTTP GET request to `https://demo.realworld.io` → checks if the response status code is `200` → if not, fires a Telegram alert with the URL, status code, response time, and timestamp
- **Resilience:** Configured with 3 automatic retries (10-second delay), `Never Error` mode to handle non-200 responses gracefully, and full response metadata capture

---

## Repository

All deliverables are published at: **https://github.com/Ajayvinjarapu/qa-automation-assessment**
