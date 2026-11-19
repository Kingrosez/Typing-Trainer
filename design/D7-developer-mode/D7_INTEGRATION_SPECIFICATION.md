# D7 INTEGRATION SPECIFICATION: DEVELOPER MODE
**Typing Trainer — Windows Desktop Application**  
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 2 UX Architecture & Functional Specifications*  
*Document Version: 2.0.0 | Date: 2026-11-18 | Status: COMPLETE & RECONCILED (AWAITING PRODUCT OWNER APPROVAL)*

---

## 1. Executive Summary

This specification establishes the technical integration contracts, shared software components, REST API endpoints, and closed-loop data flows linking **Developer Mode (Module 06)** with the existing modules of the Typing Trainer modular desktop application.

All communications adhere to local-first desktop security principles ([`SECURITY.md`](file:///d:/Windows%20app/Typing%20Trainer/SECURITY.md)), binding strictly to `127.0.0.1`.

---

## 2. Cross-Module Integration Contracts

### 2.1 Contract 1: D3 Dashboard Integration
- **Navigation Routing:** Pinned in application sidebar with keyboard accelerator **`Ctrl + 5`** (aligned with D1 sidebar order and D3 approved global navigation accelerators; `Ctrl + 6` routes to Typing Games).
- **Widget 07 (Quick Practice Portal):** Card `"Developer Mode"` links to `/developer` (`SCR-601`).
- **Widget 09 (Personal Best Showcase):** Slot 3 displays `"Dev Mode Benchmark"` (Net WPM, Symbol Accuracy, Language, Date).
- **Widget 02 (Daily Practice Capsule):** 100% of physical active practice minutes accumulate toward daily target (20m).

### 2.2 Contract 2: D4 Typing Test Arena Integration
- **Keystroke Capture Engine:** Developer Mode directly inherits the high-frequency React event loop, ensuring sub-millisecond character matching.
- **Mathematical Standardization:** Uses the approved D4 Net WPM formulation:
  $$\mathbf{WPM_{net} = \max\left(0, \frac{(N_{total} / 5) - E_{uncorrected}}{t_{elapsed}}\right)}$$
  Where $N_{total} = N_{correct} + N_{incorrect}$ (excluding non-character keys, modifiers, and auto-inserted spaces).

### 2.3 Contract 3: D5 Learning Mode Integration
- **Ergonomic Finger Reach Anchors:** Micro-syntax drills reuse D5 touch-typing hand visualization rules and pastel keycap assignments.
- **Option A Base XP Model:** Adheres strictly to the D5 Daily Diminishing Returns policy (Attempts 1–3: 100%, 4–5: 50%, 6+: 0% Base XP).

### 2.4 Contract 4: D6 Skill Drills Closed-Loop Telemetry
- **Bidirectional Telemetry Pipeline:**
  ```
  Developer Mode (SCR-603)
            │
            ▼ (Batch Dispatched upon Session Completion)
  Spring Boot REST API (/api/v1/developer/sessions)
            │
            ├──► Insert to key_telemetry_window (Latest 100 rolling records per key)
            └──► Increment key_confusion_matrix (Pairwise miskeys: e.g. ';' -> ''')
            │
            ▼
  D6 Weak-Key Prioritization Index Evaluates:
  WPI_k = ErrRate_k * ln(O_k + 1)
            │
            ▼ (If Symbol Error Rate > 8% & Opps >= 20)
  D6 Skill Drills Studio (SCR-401) Flags Symbol as WEAK KEY
            │
            ▼
  User Clicks "Quick Drill" -> Remediation Executed in SCR-404 -> WPI Drops
  ```
- **Telemetry Threshold & Rolling-Window Rule:** For each target key independently, D6 evaluates the **most recent 100 eligible opportunities per key, subject to the maximum 14-calendar-day age limit**. General session metrics (Gross WPM, Net WPM, Overall Accuracy, Symbol Accuracy) are fully calculated and stored for all completed sessions (including $< 20$ chars). D6 key-level classification requires a minimum sample of $O_k \ge 20$ eligible opportunities *per target key* before assigning diagnostic tiers (`MASTERED`, `STABLE`, `DEVELOPING`, `WEAK_KEY`); keys with $< 20$ opportunities are classified strictly as `INSUFFICIENT_DATA`.

---

## 3. Backend REST API Endpoints (`/api/v1/developer`)

All endpoints bind strictly to `127.0.0.1` and follow standard DTO response formats aligned with `API_CONTRACT.md`.

### 3.1 `GET /api/v1/developer/languages`
- **Description:** Returns the catalog of supported programming languages with user proficiency telemetry.
- **Response Payload (200 OK):**
  ```json
  {
    "languages": [
      {
        "id": "typescript",
        "name": "TypeScript / JavaScript",
        "certificationStage": 3,
        "totalLinesTyped": 640,
        "bestWpm": 58.4,
        "avgSymbolAccuracy": 98.1,
        "activeTiers": [1, 2, 3, 4]
      },
      {
        "id": "python",
        "name": "Python",
        "certificationStage": 2,
        "totalLinesTyped": 380,
        "bestWpm": 48.0,
        "avgSymbolAccuracy": 96.4,
        "activeTiers": [1, 2, 3, 4]
      }
    ]
  }
  ```

### 3.2 `GET /api/v1/developer/snippets`
- **Parameters:** `language` (required), `tier` (optional, 1–4), `category` (optional).
- **Response Payload (200 OK):**
  ```json
  {
    "snippets": [
      {
        "id": "ts-curated-042",
        "language": "typescript",
        "tier": 3,
        "category": "SNIPPET",
        "title": "Async Fetch & Parse Handler",
        "sourceCode": "export async function fetchData<T>(url: string): Promise<T | null> {\n  try {\n    const res = await fetch(url);\n    if (!res.ok) return null;\n    return (await res.json()) as T;\n  } catch (e) { return null; }\n}",
        "lineCount": 9,
        "charCount": 218,
        "rawByteSize": 218,
        "startLine": 1,
        "endLine": 9,
        "symbolDensity": 22.4,
        "complexityScore": 5.8,
        "totalParts": 1,
        "partNumber": 1,
        "license": "MIT"
      }
    ]
  }
  ```

### 3.3 `POST /api/v1/developer/sessions`
- **Description:** Submits completed session telemetry; commits batch records to SQLite inside a single atomic transaction.
- **Request Payload:**
  ```json
  {
    "sessionId": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
    "language": "typescript",
    "snippetId": "ts-curated-042",
    "partNumber": 1,
    "totalParts": 5,
    "durationSeconds": 68,
    "netWpm": 56.4,
    "rawWpm": 58.2,
    "overallAccuracy": 97.8,
    "symbolAccuracy": 98.4,
    "keywordAccuracy": 100.0,
    "linesCompleted": 9,
    "uncorrectedErrors": 1,
    "correctedMistakes": 2,
    "baseXp": 28,
    "multiplier": 1.20,
    "totalXpAwarded": 34,
    "keystrokes": [
      { "targetKey": "{", "actualKey": "{", "isCorrect": true, "wasCorrected": false, "hesitationMs": 142 },
      { "targetKey": "P", "actualKey": "O", "isCorrect": false, "wasCorrected": true, "hesitationMs": 280 }
    ]
  }
  ```
- **Response Payload (201 Created - Initial Creation):**
  ```json
  {
    "sessionId": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
    "netWpm": 56.4,
    "symbolAccuracy": 98.4,
    "baseXp": 28,
    "multiplier": 1.20,
    "totalXpAwarded": 34,
    "dailyMinutesCredited": 2,
    "newPersonalBest": false,
    "saved": true,
    "duplicate": false
  }
  ```
- **Response Payload (200 OK - Idempotent Repeated Submission):**
  ```json
  {
    "sessionId": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
    "netWpm": 56.4,
    "symbolAccuracy": 98.4,
    "baseXp": 28,
    "multiplier": 1.20,
    "totalXpAwarded": 34,
    "dailyMinutesCredited": 2,
    "newPersonalBest": false,
    "saved": true,
    "duplicate": true
  }
  ```
- **Outbox Removal & Error Handling Contract:**
  - **HTTP 201 Created:** Initial insertion succeeds; records user rewards. Outbox entry immediately deleted from `pending_session_outbox`; status transitions to `"Persisted"`.
  - **HTTP 200 OK (`duplicate: true`):** Idempotent repeated submission. Outbox removal is permitted **only when**:
    1. The session UUID matches the original pending session.
    2. The acknowledged payload data is verified to be identical to the submitted payload.
    3. The backend confirms the duplicate represents the same previously persisted session.
    When all three identity criteria match, the outbox entry is safely deleted and status updates to `"Persisted"`; zero duplicate XP or records are created.
  - **HTTP 409 Conflict:** Conflicting payload submitted for existing `sessionId`. Conflicting payloads must **never be silently discarded or overwritten**. Quarantined in IndexedDB with status `CONFLICT_DETECTED`; diagnostic alert logged; no automatic retry.
  - **HTTP 400 / 422 Validation Error:** Malformed payload rejected by Jakarta Bean Validation. Quarantined in IndexedDB with status `VALIDATION_FAILED`; no infinite retry loops.
  - **HTTP 401 / 403 Authentication / Authorization Failure:** Local per-launch request token mismatch or forbidden origin. Quarantined in IndexedDB with status `AUTH_FAILED`; security error logged. Never silently retried as transient network failure.
  - **HTTP 5xx, 429, or Network Timeout:** Transient backend busy state (`SQLITE_BUSY`) or connection drop. Retained in `pending_session_outbox` for retry.
  - **Foreground Retry Burst (5 HTTP Attempts):** Attempt 1 (Immediate), Attempt 2 ($+1\text{s}$), Attempt 3 ($+2\text{s}$), Attempt 4 ($+4\text{s}$), Attempt 5 ($+8\text{s}$). Total 15s retry duration.
  - **Background Retry Lifecycle:** After Attempt 5 fails, polling stops, status updates to `Offline Queued`, and low-priority background timer checks outbox every 30 seconds without an arbitrary abandonment ceiling. Startup routine flushes outbox upon application launch. Manual retry (`[ Retry Sync Now ]`) executes an immediate attempt.
