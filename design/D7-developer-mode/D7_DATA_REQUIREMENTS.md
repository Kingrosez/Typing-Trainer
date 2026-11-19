# D7 DATA REQUIREMENTS & SCHEMA SPECIFICATIONS
**Typing Trainer — Windows Desktop Application**  
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 2 UX Architecture & Functional Specifications*  
*Document Version: 3.0.0 | Date: 2026-11-18 | Status: COMPLETE & RECONCILED (AWAITING PRODUCT OWNER APPROVAL)*

---

## 1. Executive Summary

This document specifies the relational data model, Flyway schema migrations, IndexedDB offline outbox contracts, dual content representation, and D6 telemetry window integration required to support **Developer Mode (Module 06)**.

All database operations strictly adhere to local-first principles ([`ARCHITECTURE.md`](file:///d:/Windows%20app/Typing%20Trainer/ARCHITECTURE.md)):
- Spring Boot 3 + SQLite database embedded in the user's local application data directory.
- Keystroke events captured in volatile React memory with zero database writes during active typing.
- Completed session persistence via IndexedDB offline outbox (`pending_session_outbox`) and idempotent asynchronous batch `POST /api/v1/developer/sessions`.
- Dual content representation: original unmodified UTF-8 bytes preserved for export; normalized working representation used for typing exercises and bounded deterministic pagination.
- Strict UTF-8 validation and inert plaintext treatment of custom code files up to 500 KB ceiling.

---

## 2. Entity-Relationship Model

```
┌─────────────────────────┐          ┌─────────────────────────┐
│         USERS           │          │   DEVELOPER_SNIPPETS    │
├─────────────────────────┤          ├─────────────────────────┤
│ id (PK)                 │          │ id (PK)                 │
│ username                │          │ language                │
│ created_at              │          │ tier (1 to 4)           │
└────────────┬────────────┘          │ category                │
             │ 1                     │ title                   │
             │                       │ raw_source_bytes (BLOB) │
             │ N                     │ raw_byte_size           │
             ▼                       │ source_code (Working LF)│
┌─────────────────────────┐          │ line_count              │
│DEVELOPER_LANG_PROGRESS  │          │ char_count              │
├─────────────────────────┤          │ symbol_density          │
│ user_id (PK, FK)        │          │ complexity_score        │
│ language (PK)           │          │ license                 │
│ certification_stage     │          │ total_parts             │
│ total_lines_typed       │          │ part_number             │
│ best_wpm                │          │ start_line              │
│ avg_symbol_accuracy     │          │ end_line                │
│ last_practiced          │          │ parent_snippet_id (FK)  │
│ created_at              │          │ completed_parts_json    │
└─────────────────────────┘          │ last_active_part        │
                                     │ created_at              │
                                     └────────────┬────────────┘
                                                  │ 1
                                                  │
                                                  │ N
                                                  ▼
                                     ┌─────────────────────────┐
                                     │   DEVELOPER_SESSIONS    │
                                     ├─────────────────────────┤
                                     │ id (PK, UUID)           │
                                     │ user_id (FK)            │
                                     │ language                │
                                     │ snippet_id (FK)         │
                                     │ part_number             │
                                     │ total_parts             │
                                     │ net_wpm                 │
                                     │ raw_wpm                 │
                                     │ overall_accuracy        │
                                     │ symbol_accuracy         │
                                     │ keyword_accuracy        │
                                     │ duration_seconds        │
                                     │ lines_completed         │
                                     │ uncorrected_errors      │
                                     │ corrected_mistakes      │
                                     │ total_xp_awarded        │
                                     │ timestamp               │
                                     └─────────────────────────┘
```

---

## 3. SQLite DDL Migrations (Flyway Script: `V7__create_developer_mode_schema.sql`)

### 3.1 Table: `developer_snippets` (Curated & Custom Exercises with Multi-Part Pagination)
```sql
CREATE TABLE IF NOT EXISTS developer_snippets (
    id TEXT PRIMARY KEY,
    language TEXT NOT NULL,                -- 'typescript', 'python', 'java', 'sql', 'rust', 'javascript', 'json'
    tier INTEGER NOT NULL,                 -- 1: Foundations, 2: Idiomatic, 3: Production, 4: Architecture
    category TEXT NOT NULL,                -- 'SNIPPET', 'DELIMITER', 'OPERATOR', 'PROCEDURAL', 'CUSTOM_IMPORT'
    title TEXT NOT NULL,
    raw_source_bytes BLOB,                 -- Exact, unmodified uploaded UTF-8 byte stream
    raw_byte_size INTEGER NOT NULL,        -- Evaluated against 500 KB ceiling (<= 512,000 bytes)
    source_code TEXT NOT NULL,             -- Working representation: normalized code text (\n line endings)
    line_count INTEGER NOT NULL,
    char_count INTEGER NOT NULL,
    symbol_density REAL NOT NULL,          -- Percentage of symbols (0.0 to 100.0)
    complexity_score REAL NOT NULL,        -- Calculated Code Complexity Score (1.0 to 10.0)
    license TEXT NOT NULL DEFAULT 'MIT',   -- 'MIT', 'Apache-2.0', 'BSD-3-Clause', 'Custom'
    total_parts INTEGER NOT NULL DEFAULT 1,-- Number of paginated parts (Option A approved)
    part_number INTEGER NOT NULL DEFAULT 1,-- Part index (1 to total_parts)
    start_line INTEGER NOT NULL DEFAULT 1, -- 1-based start line in working representation
    end_line INTEGER NOT NULL DEFAULT 1,   -- 1-based end line in working representation (<= 20 lines/part)
    parent_snippet_id TEXT,                -- NULL for root snippet, references parent for parts
    completed_parts_json TEXT DEFAULT '[]',-- JSON array of completed part numbers e.g. '[1, 2]'
    last_active_part INTEGER DEFAULT 1,    -- Last practiced part index for resume workflow
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_snippet_id) REFERENCES developer_snippets(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_dev_snippets_lang_tier ON developer_snippets(language, tier, category);
CREATE INDEX IF NOT EXISTS idx_dev_snippets_parent ON developer_snippets(parent_snippet_id);
```

### 3.2 Dual Content Representation Architecture (Correction B)
1. **Original Source Representation:**
   - **Byte-for-Byte Fidelity:** The exact, unaltered UTF-8 byte sequence of the uploaded file is stored in `raw_source_bytes`.
   - **Ceiling Measurement:** The 500 KB limit is strictly measured against the **original uploaded file size** (`file.size <= 512,000 bytes`) *before* any decoding or normalization.
   - **Association:** Retained in the parent `developer_snippets` record. Available for export via API `GET /api/v1/developer/snippets/{id}/raw` or `"Download Original Source Code"` button in `SCR-604`.
2. **Working Representation:**
   - **Line Normalization:** For typing exercise execution, syntax tokenization, liquid caret rendering, and pagination, all `\r\n` (CRLF) and `\r` (CR) line terminators are normalized to `\n` (LF) in memory.
   - **Content Invariance:** Original visible characters, blank lines, indentation spaces, punctuation, comments, and character sequences are 100% preserved.
   - **Strict Line Mapping:** Line numbers in the working representation maintain a strict 1:1 mapping with the original source lines ($1 \dots N$).
   - **Pagination Invariance:** Pagination operates exclusively on the working representation. Generated child parts reference the parent snippet via `parent_snippet_id`, `part_number`, `start_line`, and `end_line`.
3. **Ingestion Validation Requirements Matrix:**
   - *LF-Only Input:* Decoded directly; working representation identical to original.
   - *CRLF Input:* Original byte sequence retained in `raw_source_bytes`; working representation normalizes `\r\n` to `\n`.
   - *CR-Only Input:* Original byte sequence retained; working representation normalizes `\r` to `\n`.
   - *Mixed Line Endings:* Original byte sequence retained; working representation standardizes on `\n`.
   - *Valid Non-ASCII UTF-8:* Unicode characters (e.g. international identifiers, comments, math symbols) fully preserved in both representations.
   - *Invalid UTF-8:* **Rejected upfront with an actionable error modal.** Non-UTF-8 byte sequences trigger an immediate abort; zero silent stripping, zero replacement with `\uFFFD`, zero corrupt repair.
   - *Empty Files (0 Bytes):* Rejected upfront with alert: *"Empty File: Selected file contains no text content."*
   - *Files Exceeding 500 KB ($> 512,000$ bytes):* Rejected upfront based on raw file byte size with error modal.

### 3.3 Table: `developer_sessions` (Completed Session Records)
```sql
CREATE TABLE IF NOT EXISTS developer_sessions (
    id TEXT PRIMARY KEY,                   -- Client-generated immutable UUID
    user_id TEXT NOT NULL,
    language TEXT NOT NULL,
    snippet_id TEXT,                       -- References developer_snippets(id)
    part_number INTEGER NOT NULL DEFAULT 1,-- Part index of exercise
    total_parts INTEGER NOT NULL DEFAULT 1,-- Total parts of parent snippet
    net_wpm REAL NOT NULL,
    raw_wpm REAL NOT NULL,
    overall_accuracy REAL NOT NULL,
    symbol_accuracy REAL NOT NULL,
    keyword_accuracy REAL NOT NULL,
    duration_seconds INTEGER NOT NULL,
    lines_completed INTEGER NOT NULL,
    uncorrected_errors INTEGER NOT NULL,
    corrected_mistakes INTEGER NOT NULL,
    base_xp INTEGER NOT NULL,
    xp_multiplier REAL NOT NULL,
    total_xp_awarded INTEGER NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (snippet_id) REFERENCES developer_snippets(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_dev_sessions_user_lang ON developer_sessions(user_id, language, timestamp);
```

---

## 4. Telemetry Persistence, Offline Outbox & Acknowledgement Contract

### 4.1 In-Memory Collection Phase (Client-Side)
- While the developer types in `SCR-603` (Multi-Line Code Syntax Typing Arena), all keystroke intervals, errors, corrections, and character transitions accumulate strictly in an in-memory Zustand buffer: `DevSessionEventBuffer`.
- **Zero network requests, zero IPC calls, and zero SQLite database writes** are dispatched during active typing. Keystroke capture latency remains $< 1\text{ ms}$.

### 4.2 Completed Session Assembly & Unique Identity
When the final line of code is completed in `SCR-603`:
1. The frontend generates a cryptographically unique client UUID: `sessionId` (e.g. `f81d4fae-7dec-11d0-a765-00a0c91e6bf6`).
2. The complete immutable session payload is assembled with `sessionId`, `partNumber`, and `totalParts`.

### 4.3 Pre-Submission IndexedDB Outbox Staging
3. Before initiating any HTTP or network request, the assembled payload is written synchronously into the frontend webview's local persistent storage (**IndexedDB object store: `pending_session_outbox`**) keyed by `sessionId`.
4. Survives power loss or crashes occurring immediately after completion.

### 4.4 Strict Persistence Acknowledgement Contract
5. An asynchronous `POST /api/v1/developer/sessions` request is dispatched to local Spring Boot.
6. **Strict Response Acknowledgement Contract:**
   - **HTTP 201 Created (Initial Creation):** Backend successfully inserts new session and records user rewards. The frontend immediately deletes the record from `pending_session_outbox` and updates UI state to `"Persisted"`.
   - **HTTP 200 OK with `duplicate: true` (Idempotent Repeated Submission):** Backend identifies that `sessionId` already exists in `developer_sessions` with identical payload data. Outbox removal is permitted **only when**:
     1. The session UUID matches the original pending session.
     2. The acknowledged payload data is verified to be identical to the submitted payload.
     3. The backend confirms the duplicate represents the same previously persisted session.
     When all three identity criteria are satisfied, the frontend deletes the record from `pending_session_outbox` and updates UI state to `"Persisted"`, without duplicate persistence or duplicate XP.
   - **HTTP 409 Conflict (Mismatched Payload Identity):** Backend detects that `sessionId` exists with a conflicting or altered payload. Conflicting payloads must **never be silently discarded or overwritten**. The item is permanently quarantined in IndexedDB with status `CONFLICT_DETECTED` and an actionable error alert is logged for user diagnostics. Outbox does not retry automatically.
   - **HTTP 400 or 422 (Validation Error):** The payload failed backend validation constraints. The item is quarantined in IndexedDB with status `VALIDATION_FAILED` to prevent endless retry loops.
   - **HTTP 401 or 403 (Authentication / Authorization Failure):** Backend per-launch token mismatch or authorization error. Quarantined in IndexedDB with status `AUTH_FAILED` and actionable security alert logged. Permanent auth failures are never silently treated as transient network retries.
   - **HTTP 5xx, 429, or Network Timeout:** Transient backend busy state (`SQLITE_BUSY`) or connection drop. The record remains in `pending_session_outbox` and triggers the **Retry Lifecycle**.
   - **Cardinal Governance Rule:** **Never remove an outbox record merely because a request was dispatched.** Removal is permitted ONLY upon confirmed HTTP 201 or 200 persistence acknowledgement.

### 4.5 Complete Retry Policy & Lifecycle

#### 1. Foreground Persistence Burst (Five Total HTTP Attempts)
The foreground burst consists of exactly **five HTTP attempts** (one initial request and four retries):

| Attempt | Description | Delay Before Attempt | Cumulative Elapsed Delay |
|:---:|---|:---:|:---:|
| **Attempt 1** | Initial request | Immediate ($0\text{ s}$) | $0.0\text{ s}$ |
| **Attempt 2** | First retry | $1.0\text{ s}$ | $1.0\text{ s}$ |
| **Attempt 3** | Second retry | $2.0\text{ s}$ | $3.0\text{ s}$ |
| **Attempt 4** | Third retry | $4.0\text{ s}$ | $7.0\text{ s}$ |
| **Attempt 5** | Fourth retry | $8.0\text{ s}$ | $15.0\text{ s}$ |

- During the burst, the UI scorecard status communicates progress: `Syncing... (Attempt N of 5)`.
- Total foreground burst retry delay: $1.0 + 2.0 + 4.0 + 8.0 = 15.0\text{ seconds}$.

#### 2. Foreground Exhaustion & Offline Queued Transition
- After Attempt 5 fails without acknowledgement:
  - Active foreground polling ceases immediately to prevent CPU spin.
  - The completed session **remains 100% durable** in IndexedDB `pending_session_outbox` (never discarded, never deleted).
  - Its stable UUID `sessionId` and exact payload are preserved.
  - No duplicate XP is awarded.
  - UI scorecard status transitions cleanly to: `⚠️ Saved locally (Offline). Will sync when connection is restored.`

#### 3. Background Retry Lifecycle
- **Periodic Interval:** Background retry begins after the foreground burst fails, checking the outbox every **30 seconds** (the D3 maximum backoff ceiling).
- **No Abandonment Ceiling:** The 30-second background cycle repeats periodically while the desktop application remains open. To prevent data loss, there is no arbitrary abandonment ceiling that deletes unpersisted sessions.
- **Attempt Tracking:** Background attempts do not spin a user-facing counter indefinitely. The UI status remains `Offline Queued`, while the outbox internally tracks `attemptCount` and `lastAttemptTimestamp`.
- **Application Startup Flush:** Upon application launch/restart, the initialization sequence automatically flushes all queued sessions in `pending_session_outbox` once Spring Boot signals healthy readiness.
- **Manual Retry Action:** Clicking `[ Retry Sync Now ]` in `SCR-605` or status bar immediately triggers a submission attempt without creating a duplicate session.

---

## 5. D6 Weak-Key Telemetry Integration & Rolling-Window Rules (Correction A & C)

To ensure mathematical and pedagogical integrity across modules, Developer Mode adheres strictly to the approved D6 telemetry architecture:

### 5.1 Ten Core Telemetry Integration Rules
1. **Intended-Key Attribution:** Every eligible keystroke is attributed to its target character (`intended_key`).
2. **Confusion Matrix Separation:** Incorrect keystrokes are recorded in `key_confusion_matrix(intended_key, actual_key, count)` via atomic upsert, tracking exact pairwise finger substitutions (e.g. `(` mistyped as `9`).
3. **Corrected Mistakes as Diagnostic Events:** When a student mistypes a key and corrects it with `Backspace`, the initial error remains permanently logged in diagnostic history (`is_correct = false, was_corrected = true`).
4. **Repeated Backspacing Invariance:** Striking `Backspace` multiple times across the same character position and retyping it does **not** create duplicate error records or inflate opportunity counts. Evaluated once per character position.
5. **Indentation Telemetry Exclusion:** Automatically inserted indentation spaces generate **0 eligible opportunities and 0 telemetry events**.
6. **Manual Indentation Inclusion:** In manual indentation mode, physically typed spacebar strokes follow standard D7/D4 event accounting and stream to D6 telemetry under `' '`.
7. **Cross-Session Accumulation:** Eligible opportunities and error counts accumulate across completed sessions in the SQLite database.
8. **Rolling-Window Definition:** For each target key independently, D6 evaluates the **most recent 100 eligible opportunities per key, subject to the maximum 14-calendar-day age limit**. Opportunities older than 14 days are evicted from weak-key calculations.
9. **Minimum Statistical Sample Threshold ($O_k \ge 20$):** A target key requires a minimum of **20 eligible opportunities ($O_k \ge 20$)** within its key-level rolling window before it can be assigned a diagnostic classification. Any key with $< 20$ opportunities is classified strictly as **`INSUFFICIENT_DATA`**. Sample size alone never determines classification.
10. **General Session Metric Independence:** General session metrics (Gross WPM, Net WPM, Overall Accuracy, Symbol Accuracy) apply to the session as a whole and are **fully calculated, displayed on the scorecard (`SCR-605`), and stored in `developer_sessions`** for all completed sessions (including $< 20$ chars). Valid session results are never suppressed.

### 5.2 Diagnostic Classification Process & Thresholds
For any target key $k$ meeting the eligibility gate:
1. **Calculate Eligible Opportunities:** Count eligible opportunities $O_k$ in the rolling window (most recent 100 eligible opportunities per key within 14 calendar days).
2. **Eligibility Check:** If $O_k < 20$, assign **`INSUFFICIENT_DATA`**. Do not calculate ranking.
3. **Calculate Error Rate:** If $O_k \ge 20$, calculate key error rate using approved D6 error attribution:
   $$ErrRate_k = \frac{E_k}{O_k} \times 100\%$$
4. **Apply Classification Thresholds:**
   - **`MASTERED`:** $ErrRate_k \le 3.0\%$
   - **`STABLE`:** $3.0\% < ErrRate_k \le 5.0\%$
   - **`DEVELOPING`:** $5.0\% < ErrRate_k \le 8.0\%$
   - **`WEAK_KEY`:** $ErrRate_k > 8.0\%$
5. **Prohibition:** Never infer a classification tier from sample size alone. A key with $O_k = 20$ is only eligible for evaluation; its error rate determines its tier.

### 5.3 Worked Diagnostic Classification Examples

| Example | Target Key Scope | Eligible Opportunities ($O_k$) | Errors ($E_k$) | Error Rate ($ErrRate_k$) | Expected Classification | Governing Evaluation Rule |
|:---:|---|:---:|:---:|:---:|---|---|
| **EX-01** | Sub-threshold key `[` | 12 | 3 | Not classified | **`Insufficient Data`** | Rule 9: $O_k < 20$ fails sample gate; error rate not evaluated. |
| **EX-02** | Flawless key `{` | 20 | 0 | $0.0\%$ | **`Mastered`** | Meets $O_k \ge 20$; $ErrRate \le 3.0\%$ qualifies for Mastered. |
| **EX-03** | Low-error key `;` | 20 | 1 | $5.0\%$ | **`Stable`** | Meets $O_k \ge 20$; $3.0\% < ErrRate \le 5.0\%$ qualifies for Stable. |
| **EX-04** | High-error key `(` | 20 | 2 | $10.0\%$ | **`Weak`** | Meets $O_k \ge 20$; $ErrRate > 8.0\%$ qualifies for Weak Key. |
| **EX-05** | Moderate-error key `&` | 100 | 6 | $6.0\%$ | **`Developing`** | Max window capacity (100); $5.0\% < ErrRate \le 8.0\%$ qualifies for Developing. |
| **EX-06** | 14-day expired key `>` | 5 (45 expired) | 0 | Not classified | **`Insufficient Data`** | 45 strokes older than 14 days evicted; active $O_k = 5 < 20 \rightarrow$ Insufficient Data. |
| **EX-07** | Corrected mistake key `P` | 25 | 1 | $4.0\%$ | **`Stable`** | Backspaced mistake permanently logged ($E_k = 1$); $ErrRate = 1/25 = 4.0\% \rightarrow$ Stable. |

---

## 6. Security & Privacy Guarantees

- **No Remote Transmission:** All telemetry remains strictly on local loopback `127.0.0.1`.
- **Inert Custom Code Storage:** User-imported code in `SCR-604` is stored in SQLite strictly as plain text; zero compilation, evaluation, or shell execution occurs (`SECURITY.md`).
- **500 KB File Ceiling:** Strict file size ceiling enforced upfront on raw bytes before decoding (`file.size <= 512,000 bytes`).
- **Strict UTF-8 Validation:** Non-UTF-8 byte sequences rejected upfront with actionable encoding error message without silent modification.
