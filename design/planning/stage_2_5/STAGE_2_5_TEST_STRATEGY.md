# STAGE 2.5 TEST STRATEGY: PRACTICE ARENAS
## Multi-Layer Testing Architecture, Concrete Test Specifications, and Quality Acceptance Criteria

**Project:** Typing Trainer, Windows Desktop Application  
**Phase:** 3  
**Stage:** 2.5 (Practice Arenas: Typing Test, Learning Mode, Developer Mode)  
**Approved Baseline Commit:** `691c7b132c78ada8be9201852798ee993716ccde`  
**Execution Mode:** Test Strategy & Quality Planning Only (Implementation Authorization NOT GRANTED)  
**Author:** Antigravity (Lead Engineer)  
**Product Owner:** Fairoz  

---

## 1. Quality Acceptance Criteria (Issue 4)

In accordance with Product Owner instructions, fixed future test-count quotas are replaced with **rigorous, objective quality acceptance gates**:

1. **Regression Invariant:** All 58 existing backend tests (`mvnw test`) and all 88 existing frontend tests (`npm test`) continue to pass without failure or skipped assertions.
2. **New Coverage Invariant:** All newly implemented Stage 2.5 unit, component, and integration tests pass with 100% success rate.
3. **Static Analysis & Compilers:**
   - `tsc --noEmit` exits with **0 errors**.
   - `eslint .` exits with **0 errors**.
   - `npm run build` completes successfully and produces production assets in `desktop/dist/`.
   - `cargo check` and `cargo test` on `desktop/src-tauri/` pass with **0 errors and 0 warnings**.
4. **Backend Integration:** Database migrations, transactional rollback on failure, and idempotency on duplicate submission are verified against a live local SQLite database.
5. **Rigorous Verification Classification:**
   - **Automated Chromium Preview Tests (Playwright):** Verify DOM rendering, SVG circles, responsive CSS, and browser-level keyboard events.
   - **Native Tauri Desktop Verification:** Verifies the compiled `app.exe` Windows Job Object supervision, random loopback port binding (`127.0.0.1`), IPC token handshake (`X-TypingTrainer-Request-Token`), and full offline execution without internet connectivity.

---

## 2. Verified Existing Test Baseline (Executed & Passing)

The following test suites exist at commit `691c7b1` and have been verified by actual command execution:
- **Backend Tests:** **58 tests run, 0 failures, 0 errors** (`mvnw test` executed in 1m 01s).
  - `BackendStartupListenerTest` (2 tests): Port and handshake file generation.
  - `RequestTokenFilterTest` (7 tests): Token authentication and origin validation.
  - `SqlitePersistenceTest` (1 test): Flyway V1 and V2 migrations, SQLite WAL mode, busy timeout, foreign keys.
  - `DashboardControllerTest` & `DashboardServiceTest` (18 tests): W-01 through W-10 DTO mapping, timezone grouping, mock reward rollback.
  - `GamificationServiceTest` (10 tests): D5 Base Effort XP, quadratic level curve, reward idempotency, streaks.
  - `RecommendationServiceTest` & `D6ErrorAttributionAndMasteryTest` (12 tests): D6 6-state selection, WPI scoring, mastery gates.
  - `TypingSessionControllerTest` & `TypingSessionServiceTest` (8 tests): REST endpoints and benchmark validation.
- **Frontend Tests:** **18 test suites passed, 88 tests passed** (`npm test`).
  - Unit and component tests for all Dashboard widgets (W-01 through W-10), shell layout, and API client.

*Notice: All test cases detailed below represent planned test coverage to be implemented in Stage 2.5. None are claimed as currently passed.*

---

## 3. Concrete Test Cases: Headless Typing Engine Core

### 3.1 Typing Engine Calculation Edge Cases
File: `desktop/src/features/typing-engine/__tests__/metricCalculator.test.ts`
- **TC-ENG-01: Zero Duration:** Inputs typed with elapsed time $= 0.0\text{s} \rightarrow$ returns `0.0 Gross WPM`, `0.0 Net WPM`, `100.0% Accuracy` without `NaN` or divide-by-zero errors.
- **TC-ENG-02: Zero Input:** Timer expires with $0$ characters typed $\rightarrow$ returns `0.0 Gross WPM`, `0.0 Net WPM`, `100.0% Accuracy`.
- **TC-ENG-03: 100% Error Rate:** All characters typed are incorrect $\rightarrow$ returns `Accuracy = 0.0%`, `Net WPM = 0.0 WPM` (floored at zero).
- **TC-ENG-04: High WPM Precision:** 200 words ($1000\text{ strokes}$) in $60.0\text{s} \rightarrow$ returns exactly `200.0 Gross WPM`.

### 3.2 Backspace & Correction Accounting Invariants
File: `desktop/src/features/typing-engine/__tests__/backspaceAccounting.test.ts`
- **TC-ENG-05: Backspace $N_{\text{total}}$ Non-Contribution:**
  - Target: `"hello"`. User strokes: `h`, `e`, `l`, `x`, `Backspace`, `l`, `o`.
  - Asserts: $N_{\text{correct}} = 5$, $N_{\text{incorrect}} = 1$.
  - Asserts: $N_{\text{total}} = 6$ (Backspace is strictly excluded from $N_{\text{total}}$).
  - Asserts: Gross WPM uses $N_{\text{total}} = 6 / 5 = 1.2\text{ words}$, NOT $7 / 5$.
- **TC-ENG-06: Corrected Error Avoids 5-Stroke Word Penalty:**
  - In TC-ENG-05, because `x` was erased with Backspace before word submission, $E_{\text{uncorrected}} = 0$.
  - Asserts: Net WPM formula evaluates $(6 / 5) - 0 = 1.2\text{ words}$ (zero word penalty assessed!).
- **TC-ENG-07: Corrected Errors Reduce Accuracy:**
  - In TC-ENG-05, Asserts: $\text{Accuracy} = (5 / 6) \times 100 = 83.3\%$. (Proves mistake is not erased from accuracy).
- **TC-ENG-08: Uncorrected Error Assesses Full 5-Stroke Word Penalty:**
  - Target: `"test passage"`. User types `"text passage"` and commits Space without backspacing `x`.
  - Asserts: $E_{\text{uncorrected}} = 1$.
  - Asserts: Net WPM subtracts $1\text{ word}$ ($5\text{ strokes}$): $\text{Net Words} = (N_{\text{total}} / 5) - 1.0$.

### 3.3 Timing Precision & Pause Freezing
File: `desktop/src/features/typing-engine/__tests__/monotonicTimer.test.ts`
- **TC-ENG-09: Pause Duration Subtraction:**
  - Clock runs for $10\text{s}$, user presses `Esc` for $15\text{s}$ pause, clock runs for $10\text{s}$ more. Total wall time $= 35\text{s}$.
  - Asserts: $t_{\text{active}} = 20.0\text{s} \pm 0.05\text{s}$. Cumulative pause $= 15.0\text{s}$.
- **TC-ENG-10: Clock Immunity to OS Clock Changes:**
  - Simulating an artificial jump in `Date.now()` during test execution does not alter `performance.now()` duration.

---

## 4. Concrete Test Cases: Telemetry & D6 Weak-Key Aggregation

File: `desktop/src/features/typing-engine/__tests__/telemetryCollector.test.ts`
Backend File: `backend/src/test/java/com/typingtrainer/typing/service/TypingSessionServiceTest.java`

- **TC-TEL-01: Diagnostic Initial Error Attribution:**
  - Target key: `k`. User strikes `j` (incorrect), then presses Backspace and strikes `k`.
  - Asserts: Telemetry for key `k` records `opportunities: 1`, `errors: 1`. (Diagnostic error preserved).
- **TC-TEL-02: Key Isolation Invariant:**
  - Typing errors on key `q` do not increment error counts for adjacent key `w`.
- **TC-TEL-03: D6 Ingestion & Mastery Gate Verification:**
  - Submits 3 consecutive qualifying drill sessions ($O \ge 30$, error rate $\le 3.0\%$) via backend API.
  - Asserts: `RecommendationService.analyzeRecommendations()` classifies key as `"Mastered"` with overall status `"MASTERED"`.
- **TC-TEL-04: Telemetry Boundary - Exactly 100 Keys (Issue 1):**
  - Submits a session payload with exactly 100 distinct valid key summaries.
  - Asserts: Response is `200 OK`; exactly 100 records are persisted into `key_telemetry`.
- **TC-TEL-05: Telemetry Overflow Rejection - 101 Keys (Issue 1):**
  - Submits a session payload with 101 key summaries.
  - Asserts: Response is `400 Bad Request` with message `"Key telemetry batch cannot exceed 100 unique keys"`.
  - Asserts: Zero records are persisted; transaction rollback is verified.
- **TC-TEL-06: Unicode & Non-US Key Layout Input (Issue 1):**
  - Submits multi-byte UTF-8 character summaries (`ä`, `ö`, `ü`, `ß`, `é`, `ñ`, `ç`, `€`).
  - Asserts: Response is `200 OK`; UTF-8 strings are stored intact; D6 engine correctly aggregates opportunities and error rates for international characters.
- **TC-TEL-07: Duplicate Key Entry Rejection (Issue 1):**
  - Submits a payload containing duplicate `keyChar` entries (e.g. two objects with `keyChar: "e"`).
  - Asserts: Response is `400 Bad Request` ("Duplicate key telemetry entries detected").
- **TC-TEL-08: Client Telemetry Overflow Fallback (Issue 1):**
  - When client typing buffer encounters $> 100$ unique keys in an extraordinary multi-language passage.
  - Asserts: Client flags `telemetryOverflow = true`, omits `keyTelemetry` from API payload, and successfully saves session metrics without crash or silent truncation.

---

## 5. Concrete Test Cases: Practice Arenas

### 5.1 Learning Mode Curriculum & Star Thresholds (D5)
File: `desktop/src/features/learning-mode/__tests__/curriculumProgression.test.ts`
- **TC-LEA-01: 1-Star Threshold (Minimum Pass):** Accuracy $90.0\% \rightarrow 1\text{ Star}$. Lesson marked passed; unlocks Lesson $i+1$.
- **TC-LEA-02: 1-Star Fail Boundary:** Accuracy $89.9\% \rightarrow 0\text{ Stars}$. Lesson marked failed; Lesson $i+1$ remains locked.
- **TC-LEA-03: 2-Star Competent Threshold:** Accuracy $95.0\%$ + Target WPM met $\rightarrow 2\text{ Stars}$.
- **TC-LEA-04: 3-Star Mastery Threshold:** Accuracy $98.0\%$ + Target WPM met $\rightarrow 3\text{ Stars}$.
- **TC-LEA-05: Module Capstone Gate:** Module 1 Lesson 8 capstone requires $\ge 95\%$ accuracy to unlock Module 2 Lesson 1.
- **TC-LEA-06: Recovery on Replay:** Replaying a 3-star lesson and scoring 1 star preserves the existing 3-star rating in SQLite.

### 5.2 Developer Mode Chunking & File Validation (D7)
File: `desktop/src/features/developer-mode/__tests__/customImporter.test.ts`
- **TC-DEV-01: 500 KB Limit Enforcement:** Uploading a file of $512,001\text{ bytes}$ is rejected immediately with explicit size limit error before parsing.
- **TC-DEV-02: Strict UTF-8 Byte Validation:** Uploading an invalid binary/ISO-8859 byte sequence triggers a descriptive encoding validation error.
- **TC-DEV-03: Deterministic Bounded Pagination Table Verification:**
  - Validates exact mathematical partition ranges across the approved specification table:
    $N = 20 \rightarrow [20]$; $N = 30 \rightarrow [30]$; $N = 31 \rightarrow [16, 15]$; $N = 41 \rightarrow [14, 14, 13]$; $N = 49 \rightarrow [17, 16, 16]$; $N = 60 \rightarrow [20, 20, 20]$; $N = 61 \rightarrow [16, 15, 15, 15]$; $N = 79 \rightarrow [20, 20, 20, 19]$.
  - Asserts: No partition ever exceeds $20\text{ lines}$. All source lines are preserved in order without loss or duplication.
- **TC-DEV-04: Smart Auto-Advance on Enter:** In Smart Auto-Advance mode, pressing Enter on a block automatically advances the caret across leading indentation spaces.
- **TC-DEV-05: Rust-Owned Save Dialog & Safe Replacement Export (Issue 2):**
  - In desktop mode, invoking custom snippet export calls Rust `export_snippet_file`.
  - Asserts: Frontend does not pass any filesystem path.
  - Asserts: User cancellation in native dialog returns `{ success: false, cancelled: true }` with 0 bytes written.
  - Asserts: Extension whitelist enforced; invalid extensions rejected.
  - Asserts: Payloads $> 512,000\text{ bytes}$ rejected upfront with `Payload exceeds 500 KB limit`.
  - Asserts: Existing destination prompts OS replacement; writes to temporary sibling file, flushes buffers with `sync_all()`, and executes safe replacement pattern (no raw `std::fs::write` atomicity assumption).
- **TC-DEV-06: Browser Fallback Deferred Cleanup (Issue 3):**
  - In non-Tauri preview environments (headless Chromium/Vitest):
  - Spies on `URL.createObjectURL`, `URL.revokeObjectURL`, and programmatic anchor click.
  - Asserts: Blob MIME type is `text/plain;charset=utf-8`.
  - Asserts: Anchor download filename matches `${filename}.${extension}`.
  - Asserts: `URL.revokeObjectURL` is NOT executed synchronously on the immediate event tick, but deferred via timer to ensure the browser download manager completes retrieval.

---

## 6. Concrete Test Cases: Backend Persistence & Idempotency

File: `backend/src/test/java/com/typingtrainer/typing/service/TypingSessionServiceIntegrationTest.java`
- **TC-BAC-01: Atomic Transaction Rollback:**
  - Simulating an unchecked database exception during `key_telemetry` batch insert verifies that `typing_sessions`, `user_reward_ledger`, and `key_telemetry` all roll back completely. Zero partial writes exist.
- **TC-BAC-02: Session Submission Retry Idempotency:**
  - Sending the same `sessionId` twice returns the original response with HTTP 200/201 without incrementing `total_xp` twice or inserting duplicate telemetry rows.
- **TC-BAC-03: Flyway V3 Schema Migration Upgrade:**
  - Executes Flyway migration on an existing SQLite database containing V1 and V2 tables.
  - Verifies that `learning_progress`, `developer_snippets`, and `developer_snippet_stats` are created cleanly without errors.
  - Verifies that existing `key_telemetry` and session records remain completely unharmed.
- **TC-BAC-04: Concurrent Submission Handling:**
  - Verifies that SQLite WAL single-writer lock serializes concurrent write transactions without database corruption, resolving with standard `busy_timeout` handling.

---

## 7. End-to-End Workflow Testing (Playwright)

File: `e2e/practice_arenas.spec.ts`
- **TC-E2E-01: Typing Test $\rightarrow$ Dashboard Cross-Module Sync:**
  1. Opens `/typing-test`, selects 15s sprint, types text, completes test.
  2. Verifies SCR-203 scorecard displays Net WPM and 15s benchmark badge.
  3. Navigates to `/dashboard`.
  4. Verifies W-01 (XP), W-02 (Daily Goal ring progress), W-03 (Primary Metrics), W-08 (Level progress), W-09 (Personal Best 15s sprint), and W-10 (Recent sessions row) all reflect the new test session.
- **TC-E2E-02: Native Desktop Process & Offline Invariant:**
  - Verifies Tauri window launches, supervises Java 21 child process on loopback `127.0.0.1`, communicates via memory IPC token, and operates fully offline with network disconnected.
