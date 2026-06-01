# Automation & QA Developer Take-Home Skills Assessment

This repository contains the deliverables for the Automation & QA Developer Take-Home Skills Assessment.

## Deliverables in this Directory

1.  **Task1_QA_Report_Ajay_Kumar.pdf**: The compiled QA and Debug Report for the Conduit (RealWorld) web application. Includes the 5-bug table and a deep-dive Root-Cause Analysis.
2.  **Task2_Workflow_Ajay_Kumar.json**: The exported JSON workflow for the n8n API Integration.
3.  **Bonus_UptimeMonitor_Ajay_Kumar.json**: The exported JSON workflow for the Uptime Monitor.
4.  **generate_report.js**: The Node.js generation script that compiles the PDF.

---

## Task 1 — Web App QA & Debug Report

*   **Target Application:** Conduit (RealWorld React-Redux Frontend / Express Backend)
*   **Bugs Documented:**
    1.  **Broken Profile Avatar URL Validation** (Severity: *Low*) — App fails to check image URL validity, resulting in broken image icons rendering in headers and comments.
    2.  **Double Form Submission on Slow Networks** (Severity: *Medium*) — Submit button is not disabled during asynchronous network operations, allowing users to publish duplicate posts.
    3.  **Expired JWT Session Handling** (Severity: *High*) — App fails to globally intercept `401 Unauthorized` responses when a user's token expires, creating a split-brain state where the user is visually logged in but all actions fail silently.
    4.  **Tag Filter Query Sanitization Failure** (Severity: *Medium*) — Lack of URL-encoding on sidebar tags causes tags containing spaces or special characters to trigger malformed HTTP requests.
    5.  **Weak Registration Password Validation** (Severity: *High*) — App registers accounts with single-character passwords and lacks a password confirmation input, leading to security and lockout risks.

### Root-Cause Analysis (Summary)
The **Expired JWT Session Handling** bug occurs because the API client lacks a global HTTP response interceptor. When an expired token causes the backend to return a `401 Unauthorized` status, the frontend state remains unchanged. The UI displays the authenticated header, but all backend queries fail. 
*   **Fix:** A global Axios response interceptor intercepts all `401` errors, clears the invalid token from `localStorage`, dispatches the `LOGOUT` action to clean local app state, and redirects the user to `/#/login?expired=true` with a clear user notice.

---

## Task 2 — n8n API Integration Workflow

### Architecture Flow
```
[Schedule Trigger] 
       │
       ▼
[Fetch Top JS Repos] (GitHub Search API)
       │
       ▼
[Keep Top Repo] (JS Code Node filters for top 1 repo)
       │
       ▼
[Fetch Repo Languages] (GitHub Repo Languages API - Enrichment)
       │
       ▼
[Merge Repo and Languages] (JS Code Node consolidates details)
       │
       ▼
[Check Popularity] (IF Node splits on stars > 100,000)
 ┌─────┴─────┐
 ▼ (True)    ▼ (False)
[Post Hot]  [Post Standard] (Telegram Notifications)
```

### Key Workflow Features
*   **APIs Used:**
    *   **GitHub Search API** (`/search/repositories`): Retrieves the most popular JavaScript repositories (ranked by stars).
    *   **GitHub Languages API** (`/languages`): Enriches the top repository by pulling the breakdown of its coding languages.
    *   **Telegram Bot API**: Receives markdown-formatted channel digests.
*   **Data Reshaping:**
    *   A JavaScript **Code node** handles filtering to keep only the top result to respect API rate limits.
    *   A second JavaScript **Code node** parses the language object output by GitHub (which maps languages to bytes) and returns the top 3 languages formatted as a comma-separated list.
*   **Credentials & Secrets Security:**
    *   No API tokens are hardcoded.
    *   The GitHub API calls reference a header credential `github-auth-cred`.
    *   The Telegram nodes reference a built-in Telegram API credential `telegram-bot-cred`.
*   **Global Error Handling:**
    *   An **Error Trigger** node catches node failures. When a node crashes, it routes execution to a dedicated node that posts a formatted alert to Telegram containing the workflow name, execution ID, failed node name, and the error details.
    *   The **Fetch Repo Languages** node has `Continue On Fail` checked. If the language fetch fails, the flow gracefully defaults the languages field to `"Unavailable"` and continues execution rather than crashing the workflow.

---

## Bonus Task — Uptime Monitor Workflow

### Key Workflow Features
*   **Trigger:** Runs automatically every 5 minutes.
*   **Ping Target:** Performs a `GET` request on the Conduit homepage (`https://demo.realworld.io`).
*   **Retry Logic:** If the ping fails due to network hiccups or timeout, n8n automatically retries **3 times** with a **10-second delay** between attempts before declaring the app down.
*   **Response-Time Tracking:** The HTTP request retrieves complete metadata (`neverError` and `metadata` are enabled), returning the response time in milliseconds.
*   **Alerting:** If the status code is anything other than `200`, the workflow routes to the False branch of the `Is Status 200?` conditional and fires an alert to Telegram containing the URL, status code, response time, and exact down timestamp.

---

## How to Set Up and Run

### 1. Run the local n8n Instance
Start n8n on your machine via `npx`:
```bash
npx n8n
```
Once started, navigate to `http://localhost:5678` in your browser to access the n8n editor canvas.

### 2. Import the Workflows
1.  In n8n, click on **Workflows** -> **Add Workflow** (or **New**).
2.  Click on the top-right menu (three dots) and select **Import from File**.
3.  Choose `Task2_Workflow_Ajay_Kumar.json` (or `Bonus_UptimeMonitor_Ajay_Kumar.json`).

### 3. Set Up Your Credentials in n8n
To run the workflows successfully, configure the following credentials under the **Credentials** menu in n8n:
1.  **GitHub Token Authentication (`github-auth-cred`)**:
    *   Type: **Header Auth**
    *   Header Name: `Authorization`
    *   Header Value: `token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN`
2.  **Telegram Bot API (`telegram-bot-cred`)**:
    *   Type: **Telegram API**
    *   Access Token: Paste your bot token from `@BotFather`.
    *   *Note: Inside the imported Telegram nodes on the canvas, you will need to paste your Chat ID into the "Chat ID" field so the bot knows where to send the messages.*

### 4. Re-compile the PDF Report (Optional)
If you wish to modify `generate_report.js` and re-compile the QA PDF report, run:
```bash
npm run generate-report
```
The PDF will be output directly in this folder.
