# STAGE 2.5 RISK REGISTER: PRACTICE ARENAS
## Technical Risk Identification, Security Assessment, Architectural Mitigation Strategies, and Contingency Plans

**Project:** Typing Trainer, Windows Desktop Application  
**Phase:** 3  
**Stage:** 2.5 (Practice Arenas: Typing Test, Learning Mode, Developer Mode)  
**Approved Baseline Commit:** `691c7b132c78ada8be9201852798ee993716ccde`  
**Execution Mode:** Risk Assessment & Planning Only (No Implementation Authorized)  
**Author:** Antigravity (Lead Engineer)  
**Product Owner:** Fairoz  

---

## 1. Technical Risk Matrix Overview

| Risk ID | Risk Category | Risk Summary | Probability | Impact | Severity Score | Status |
|---|---|---|:---:|:---:|:---:|:---:|
| **R-01** | Performance | High-Frequency Keystroke Input Jitter / React Re-render Lag at 120+ WPM | Medium | High | **HIGH** | Mitigated by Architecture |
| **R-02** | Database | SQLite Write Latency / Lock Contention during Large Telemetry Batch Ingestion | Low | High | **MEDIUM** | Mitigated by Architecture |
| **R-03** | Data Integrity | Line Ending (`CRLF` vs `LF`) and Indentation Whitespace Drift in Developer Mode | High | Medium | **HIGH** | Mitigated by Architecture |
| **R-04** | Reliability | Offline Session Loss upon Sudden Desktop Window Exit or Backend Crash | Medium | High | **HIGH** | Mitigated by Architecture |
| **R-05** | State Sync | Curriculum Star Rating Desynchronization between Client Cache and Database | Low | Medium | **LOW** | Mitigated by Architecture |
| **R-06** | Security | Unsafe Code Execution or XSS from Malicious Imported Code Files | Low | Critical | **HIGH** | Mitigated by Architecture |
| **R-07** | Performance | DOM Memory Bloat during Long Multi-Part Code File Practice | Low | Medium | **LOW** | Mitigated by Architecture |

---

## 2. Detailed Technical Risk Assessments & Mitigations

### R-01: High-Frequency Keystroke Input Jitter / React Re-render Lag
- **Description:** A typist typing at 120–150 WPM produces 10–13 keystrokes per second. If each key event triggers a full React component re-render across the entire arena tree, input latency will spike above 16 ms, causing dropped frames and sluggish caret gliding.
- **Root Cause:** Passing high-frequency keystroke state (cursor index, buffer array, live WPM) through broad React context or parent props.
- **Mitigation Strategy:**
  1. Localize high-frequency state updates to isolated leaf components (`ActiveWordSpan`, `LiquidCaret`) using selective Zustand subscriptions (`useTypingEngineStore(state => state.cursorIndex)`).
  2. Compute live Gross/Net WPM on a throttled 250 ms ticker rather than on every individual keystroke.
  3. Ensure keystroke capture executes natively in `<div tabIndex={0}>` with `preventDefault()` on Backspace and Space to eliminate browser reflow delays.
- **Contingency:** If profiling shows frame drops on lower-spec hardware, fall back to direct DOM ref updates for the liquid caret position during active words.

---

### R-02: SQLite Write Latency during Key Telemetry Batch Ingestion
- **Description:** A typical 60-second typing test generates telemetry entries for 30–50 distinct characters. If inserted row-by-row via individual JDBC statements, SQLite may experience write latency.
- **Root Cause:** SQLite write transaction overhead on Windows desktop filesystems.
- **Mitigation Strategy:**
  1. Batch insert all `KeyTelemetryEntity` rows using Spring Data JPA `saveAll()` within the existing `@Transactional` boundary.
  2. The database is already configured in WAL (`Write-Ahead Logging`) mode with `busy_timeout = 5000ms`, allowing concurrent reads during telemetry writes.
  3. Index `key_telemetry(key_char, recorded_at)` and `key_telemetry(session_id)` ensures fast queries for D6 engine.
- **Contingency:** If telemetry volume grows, cap telemetry ingestion to the top 40 most active keys per session.

---

### R-03: Line Ending (`CRLF` vs `LF`) and Indentation Drift in Developer Mode
- **Description:** Code files created on Windows use `\r\n` (CRLF), whereas Linux/macOS files use `\n` (LF). If not normalized, invisible `\r` carriage returns will cause unexpected caret offsets, false error counts, and broken line matching in SCR-603.
- **Root Cause:** Operating system line ending variations in custom uploaded files.
- **Mitigation Strategy (Dual Representation Architecture):**
  1. Store the exact raw byte stream as `raw_source_bytes` in SQLite for uncorrupted download/export.
  2. Normalize all line breaks in the working text buffer strictly to `\n` (LF) upon file import:
     `const workingText = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');`
  3. Convert Tabs to 4 standard spaces (`\t` $\rightarrow$ `    `) for consistent character-by-character caret navigation.
  4. In Smart Auto-Advance mode, upon pressing Enter, calculate the indentation level of the target line and automatically advance the caret across leading spaces.
- **Contingency:** Provide an explicit "Toggle Indentation Mode" button in SCR-602 allowing users to switch between Smart Auto-Advance and Full Manual Spacebar Typing.

---

### R-04: Offline Session Loss upon Sudden Desktop Window Exit or Crash
- **Description:** If a user closes the desktop application immediately after completing a test before the REST request finishes, the completed session and XP could be lost.
- **Root Cause:** Asynchronous network lag between webview and local Spring Boot backend.
- **Mitigation Strategy:**
  1. Implement an in-memory Outbox queue in the frontend. When a test completes, the session is staged immediately in `localStorage` before initiating the API call.
  2. Upon receiving `201 Created` from `POST /api/v1/sessions`, the staged record is purged.
  3. On application startup, `AppProviders` checks for any un-synced outbox sessions and automatically posts them to the backend.
- **Contingency:** Tauri window close event hook (`onCloseRequested`) will block window exit for up to 2 seconds if an active session submission is in flight.

---

### R-05: Curriculum Star Rating Desynchronization
- **Description:** If local frontend store updates lesson progress optimistically but the backend fails to commit, the user might see unlocked lessons that revert upon page refresh.
- **Root Cause:** Premature optimistic client state updates without backend confirmation.
- **Mitigation Strategy:**
  1. Enforce authoritative backend confirmation: Lesson completion state is updated only after receiving `200 OK` from `POST /api/v1/learning/lessons/{id}/complete`.
  2. The response returns the authoritative updated star count, pass/fail status, and the identifier of the next unlocked lesson.
- **Contingency:** Provide a "Sync Progress" fallback in Settings that reconciles frontend state against `GET /api/v1/learning/progress`.

---

### R-06: Unsafe Code Execution or XSS from Malicious Imported Code Files
- **Description:** A user could import a `.js`, `.ts`, or `.html` file containing malicious scripts (`<script>`, `eval()`, malicious payloads). If rendered unsafely or executed, it could attempt cross-site scripting or local system exploits.
- **Root Cause:** Treating uploaded code files as executable software rather than inert plaintext strings.
- **Mitigation Strategy (Strict Plaintext Sandboxing):**
  1. **Zero Execution:** Uploaded code files are strictly treated as inert plaintext strings. No compiler, interpreter, TypeScript compiler API, Node.js `eval()`, `new Function()`, or shell subprocess will ever execute uploaded code.
  2. **Safe Plaintext Rendering:** Code lines are rendered as plaintext text nodes wrapped in styled `<span>` elements with static CSS token classes. HTML tags inside code are escaped using `textContent` / React JSX string interpolation.
  3. **Strict Content Security Policy (CSP):** The production Tauri CSP forbids `unsafe-eval` and forbids external script loading.
- **Contingency:** File parser immediately rejects files with non-UTF-8 binary headers.

---

### R-07: DOM Memory Bloat during Long Multi-Part Code File Practice
- **Description:** Uploading large code files (e.g. 500 KB, ~10,000 lines) could consume excessive memory if the entire tokenized syntax tree is held in DOM memory simultaneously.
- **Root Cause:** Rendering unpartitioned multi-line code in webview DOM.
- **Mitigation Strategy:**
  1. Enforce the **500 KB raw byte ceiling** strictly before file parsing.
  2. Enforce the **Deterministic Bounded Pagination Algorithm**: Files $> 30$ lines are strictly divided into balanced parts of $\le 20$ lines ($K = \lceil N / 20 \rceil$).
  3. The 5-Line Monospace Canvas (SCR-603) renders **only 5 lines at any given time** (Line $i-2$, $i-1$, active Line $i$, $i+1$, $i+2$), guaranteeing $O(1)$ constant DOM memory consumption regardless of file length.
- **Contingency:** Automatically garbage collect completed part buffers when switching parts.

---

## 3. Security, Reliability & Lifecycle Audit

In strict compliance with `SECURITY.md` and `AGENTS.md`:
1. **Tauri IPC Boundaries:** Desktop boundary strictly verified; memory IPC token handshake enforces that only the authorized desktop webview can call local backend APIs.
2. **Local Loopback Security:** Spring Boot binds strictly to `127.0.0.1` on a dynamically assigned port with CORS restricted to the Tauri custom origin.
3. **Input Scope Invariant:** Keystroke listeners are strictly bounded to active, focused practice containers. Zero global keyboard hooks or system-wide monitoring will ever be introduced.
4. **Child Process Lifecycle:** Tauri supervises the Java 21 child process using Windows Job Objects (`desktop/src-tauri/src/backend/job_object.rs`), guaranteeing clean termination and zero orphaned background processes upon desktop shutdown.
5. **No AI / Cloud Dependencies:** Zero cloud APIs, zero telemetry transmission, and zero Ollama / local LLM dependencies.
