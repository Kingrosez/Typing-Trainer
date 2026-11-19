# D7 INTERACTION SPECIFICATIONS: DEVELOPER MODE
**Typing Trainer — Windows Desktop Application**  
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 2 UX Architecture & Functional Specifications*  
*Document Version: 2.0.0 | Date: 2026-11-18 | Status: COMPLETE & RECONCILED (AWAITING PRODUCT OWNER APPROVAL)*

---

## 1. Executive Summary

This specification establishes the interactive behaviors, event-handling algorithms, keyboard mechanics, multi-line backspacing logic, persistence lifecycle, and accessibility controls for **Developer Mode (Module 06)**.

All keyboard interactions are processed locally in the React frontend with sub-millisecond responsiveness, ensuring zero frame drops or input lag during high-frequency typing.

---

## 2. Global Keyboard Accelerator Matrix

| Accelerator | Global Scope | Active Context | Action / Behavior | Focus & State Handling |
|---|---|---|---|---|
| **`Ctrl + 5`** | Application-wide | Global Shell | Navigate to `/developer` (`SCR-601: Developer Hub`). | Sets active Cobalt indicator on sidebar; shifts focus to Language Grid (aligned with D1/D3; `Ctrl + 6` reserved for Typing Games). |
| **`Enter`** | Modal / Hub | `SCR-601`, `SCR-602`, `SCR-604` | Activate focused language card, tab, or primary action button. | Activates element currently bearing visible keyboard focus. |
| **`Enter`** | Arena Hot Path | `SCR-603` | Line advance: inserts newline `\n` into buffer; auto-advances cursor; scrolls camera 40px up. | Counts as 1 character input attempt ($N_{total} += 1$); triggers Smart Auto-Advance. |
| **`Backspace`** | Arena Hot Path | `SCR-603` | Delete previous character within line; at column 0, traverse back to previous line. | Executes multi-line backspacing algorithm; dissolves auto-indentation in 1 atomic step. |
| **`Tab`** | Arena Hot Path | `SCR-603` | Intercepted via capture listener; prevents WebView2 focus loss. | `e.preventDefault()`; 0 characters inserted; zero focus loss; hints auto-indent on Enter. |
| **`Ctrl + ◀ / ▶`**| Arena | `SCR-603` | Switch between parts of an imported multi-part exercise (`Part 1 of 6`). | Prompts guarded confirmation if session is in progress; switches active part. |
| **`Esc`** | Screen-wide | `SCR-603` (Arena) | Pause active drill; render Pause Overlay Modal (Manual `Esc` pause is approved D4/D7 baseline). | Suspends timer; freezes caret; dims canvas with 60% overlay. (Note: Inactivity auto-pause is an unresolved proposal `D7-NU-03`, not approved product behavior). |
| **`Esc`** | Screen-wide | `SCR-602`, `SCR-604`, `SCR-605` | Return to previous view (`SCR-601: Developer Hub` or `SCR-604: Importer`). | Clean route transition; clears transient configuration. |
| **`F1`** | Arena | `SCR-603` (Arena) | Toggle floating ergonomic symbol reach hints (`[ R-Pinky: { ]`). | Toggles visibility state in `useDevSessionStore`. |
| **`F2`** | Arena | `SCR-603` (Arena) | Toggle auxiliary pastel mechanical keyboard visualizer. | Toggles bottom visualizer panel with smooth height collapse. |
| **`F11`** | Arena | `SCR-603` (Arena) | Toggle Zen Mode (fullscreen distraction-free code canvas). | Hides sidebar, titlebar, and HUD; centers 5-line canvas. |
| **`F5` / `Ctrl+R`**| Arena | `SCR-603` (Arena) | Guarded Restart. If session $> 10\text{s}$, prompts confirmation modal. | Intercepts native reload; prevents data loss; requires `Enter` to confirm. |

---

## 3. High-Frequency Keystroke Event Loop & Event Taxonomy

The typing engine operates on a local, in-memory event dispatch cycle adhering strictly to the **D4 Keyboard Event Taxonomy**:

```typescript
export function handleDevKeyDown(e: KeyboardEvent, state: DevSessionState) {
  // 1. Intercept browser accelerators
  if (e.key === 'Tab') {
    e.preventDefault();
    processTabInput(state);
    return;
  }
  if (e.key === 'F5' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
    e.preventDefault();
    triggerGuardedRestart(state);
    return;
  }
  if (e.key === 'Escape') {
    e.preventDefault();
    state.togglePause();
    return;
  }
  if (e.ctrlKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    e.preventDefault();
    handlePartSwitch(e.key === 'ArrowRight' ? 1 : -1, state);
    return;
  }

  // 2. Ignore non-printable modifier chords (Ctrl+C, Alt, etc.)
  if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'Shift') {
    return;
  }

  // 3. Process Backspace (Editing operation, does NOT increment N_total)
  if (e.key === 'Backspace') {
    e.preventDefault();
    executeMultiLineBackspace(state);
    return;
  }

  // 4. Process Enter (Line Termination - Category 1 Character Input Event)
  if (e.key === 'Enter') {
    e.preventDefault();
    executeLineAdvance(state);
    return;
  }

  // 5. Printable character matching (Category 1 Character Input Event)
  if (e.key.length === 1) {
    e.preventDefault();
    executeCharacterMatch(e.key, state);
  }
}
```

### Event Taxonomy Principles (D4 Alignment)
1. **`Enter` Keypress (Line Advance):**
   - In multi-line code, the line-terminating newline character (`\n`) is an expected content character defined in the target text.
   - Striking `Enter` at the end of a completed line produces `\n` in the user buffer:
     - Increments Total Attempted Character Inputs: $N_{total} += 1$.
     - Evaluated as correct: $N_{correct} += 1$.
     - Contributes to Gross WPM, Net WPM, and Overall Accuracy.
   - If struck prematurely mid-line, it increments $N_{total} += 1$ and $N_{incorrect} += 1$ (recorded as a syntax error) and does not advance the line.
2. **`Tab` Keypress (Control Key):**
   - Intercepted via `e.preventDefault()`.
   - Standalone presses generate **0 attempted character inputs** ($N_{total}$, $N_{correct}$, $N_{incorrect}$ unchanged).
   - Generates 0 WPM contribution and 0 accuracy penalty.
   - Prevents focus loss away from the canvas and displays subtle guidance hint.
3. **Automatically Inserted Indentation (Smart Auto-Advance):**
   - Synthetic indentation spaces inserted automatically upon `Enter` are **zero-keystroke fills**.
   - Generate **0** to $N_{total}$, **0** to WPM, **0** to accuracy, and **0** events to D6 telemetry.

---

## 4. Multi-Line Backspacing Algorithm (Approved D7-OD-03)

Developer Mode permits students to correct mistakes across previous lines, adhering to strict event-accounting and mathematical idempotency rules:

### 4.1 State Machine for Line Boundary Traversal
```
[User strikes Backspace on Line N]
         │
         ├───► Is cursor at column > first non-indent character? 
         │        YES ──► Delete character immediately to the left.
         │                Update active line string.
         │                Re-evaluate line accuracy state.
         │
         └───► Is cursor at column == first non-indent character (start of code text)?
                  │
                  ├───► Is Line N == Line 1 (very start of snippet/part)?
                  │        YES ──► No-op (caret stops at beginning of exercise).
                  │
                  └───► Is Line N > Line 1?
                           YES ──► EXECUTE MULTI-LINE BOUNDARY RETREAT:
                                   1. Dissolve entire auto-inserted indentation block in 1 atomic step.
                                   2. Remove '\n' newline from buffer.
                                   3. Decrement activeLineIndex (N -> N - 1).
                                   4. Unlock Line N - 1 for editing.
                                   5. Position caret at end of Line N - 1 (after last typed char).
                                   6. Scroll camera down by 40px (transform: translateY(+40px)).
                                   7. Line N reverts to upcoming status.
```

### 4.2 Multi-Line Event & Error Accounting Rules
1. **Diagnostic Memory Persistence:** If a typist struck an incorrect key on Line 2 (e.g. struck `O` instead of `P`), backspacing from Line 3 into Line 2 and fixing the character **preserves the error record in diagnostic history** (`is_correct = 0`, `was_corrected = 1`).
2. **Net WPM Penalty Exclusion:** Because the error was corrected prior to final session submission, it incurs **zero uncorrected error penalty** in the final Net WPM calculation ($WPM_{net}$).
3. **Idempotency Guarantee:** Striking `Backspace` multiple times across the same character position and re-typing it does **not** create duplicate error records, does not increment total opportunity counts, and does not distort the error rate. Position evaluation remains strictly evaluated once.

---

## 5. Indentation Mechanics & Telemetry Accounting (Approved D7-OD-01)

### 5.1 Tripartite Indentation Taxonomy
1. **Expected Source Indentation:** Leading syntactic whitespace normalized strictly to space characters (`0x20`).
2. **Automatically Inserted Indentation (Smart Auto-Advance — Default Mode):**
   - Automatically indents on `Enter` and places cursor at first code column.
   - Zero inflation: 0 keystrokes, 0 WPM, 0 accuracy impact, 0 D6 telemetry events.
3. **Manually Typed Indentation (User-Selectable Spacebar Mode):**
   - Cursor placed at column 0 on Line $N+1$.
   - Typist physically strikes the spacebar for each space ($N_{total} += 1$).
   - Errors in leading space count logged as `Indentation Errors` and stream to D6 telemetry under `' '`.

### 5.2 Atomic Dissolution on Backspace Across Line Boundaries
- When the cursor reaches the first non-whitespace character on Line $N+1$ and the typist strikes `Backspace`:
  1. The entire auto-inserted indentation block **dissolves in a single atomic step**.
  2. The `\n` newline character is removed from the active buffer.
  3. The camera smoothly scrolls downward 40px.
  4. Line $N$ is unlocked and restored to active editing status.

---

## 6. Custom File Import & Multi-Part Pagination Interaction Flow (Approved D7-NU-02 Option A & Bounded Pagination)

```
[ SCR-604: Custom Importer ]
        │
        ├── Ingest local file (.java, .ts, .py, etc.) via Drag & Drop or Native Dialog.
        ├── Pre-Ingestion Validation:
        │     • Size <= 500 KB (Ceiling enforced on raw bytes before decoding: file.size <= 512,000 bytes).
        │     • Strict UTF-8 validation (Reject invalid byte sequences upfront with actionable encoding error modal).
        │     • Reject empty (0-byte) files upfront.
        │     • Treat code strictly as inert plaintext (zero compilation, execution, or evaluation).
        │
        ├── Dual Content Representation:
        │     • Original Source Representation: Exact raw UTF-8 byte stream preserved in raw_source_bytes BLOB.
        │     • Working Representation: Decoded UTF-8 with CRLF/CR normalized to '\n' for typing canvas; 1:1 line mapping.
        │
        ├── Line Count Evaluation & Deterministic Bounded Pagination (Correction A):
        │     ├── 1–30 Lines ──► Single Exercise (Part 1 of 1; lines 1..N).
        │     └── > 30 Lines ──► BALANCED BOUNDED PARTITIONING (Option A):
        │                          • Total Parts: K = ceil(N / 20).
        │                          • Base Size: q = floor(N / K), Remainder: r = N % K.
        │                          • Distribution: First r parts receive (q + 1) lines; remaining (K - r) parts receive q lines.
        │                          • Hard Ceiling: NO part ever exceeds 20 source lines (max <= 20).
        │
        ├── Display Chapter Preview in SCR-604:
        │     • Summary: "85 Lines • 5 Parts Generated (17 lines/part avg, max 17 lines)".
        │     • Chapter selector list: [ Part 1: Lines 1-17 ] ... [ Part 5: Lines 69-85 ].
        │     • Action: [ Start Practice from Part 1 (Enter) ] or [ Jump to Selected Part ].
        │
        ▼
[ SCR-603: Multi-Line Arena ]
        │
        ├── Practice Part 1: Focus HUD displays [ Part 1 of 5 ◀ ▶ ] [ Line 3 of 17 ].
        ├── Hotkeys: Ctrl+◀ / Ctrl+▶ switch parts (prompts confirmation if session in-flight).
        ├── Session Pause: Manual Esc pause is approved baseline (3s countdown, max 2 pauses, max 60s).
        │                  (15s inactivity auto-pause is deferred proposal D7-NU-03).
        ├── Complete Part 1: In-memory metrics finalized; unique UUID sessionId created;
        │                    staged in IndexedDB pending_session_outbox.
        │
        ▼
[ SCR-605: Results Scorecard ]
        │
        ├── Hero Quartet: Displays Part 1 performance (Net WPM, Raw WPM, Acc, Symbol Acc).
        ├── Multi-Part Progress Card: "File: OrderService.java • Part 1 of 5 Completed (20%)".
        │                             "File Cumulative Stats: 56.2 Net WPM • 98.4% Acc".
        ├── Primary CTA: [ Next Part: Start Part 2 (Enter) ▶ ] (Seamless continuation).
        ├── Secondary CTAs: [ Retake Part 1 (R) ] • [ Back to Importer (SCR-604) ].
        │
        ▼
[ Resume Workflow in SCR-604 ]
        └── Returning to SCR-604 displays updated progress: "OrderService.java: 1/5 Parts (20%)"
            with 1-click [ Resume Part 2 ] button.
```

---

## 7. Outbox Persistence Acknowledgement Contract & Complete Retry Lifecycle

### 7.1 Persistence Acknowledgement Contract
To guarantee zero data loss and absolute idempotency across network hiccups or backend restarts:
1. **Immutable Session Identity:** Upon session completion in `SCR-603`, the frontend generates a unique, immutable client UUID `sessionId`.
2. **Synchronous Local Staging:** The complete session payload is stored synchronously in IndexedDB object store `pending_session_outbox` **before any network call begins**.
3. **Asynchronous Dispatch:** An asynchronous `POST /api/v1/developer/sessions` request is dispatched to the local Spring Boot backend.
4. **Strict Outbox Removal Rules:**
   - **HTTP 201 Created (First-Time Creation):** Spring Boot successfully persists the new session and awards rewards. The frontend immediately deletes the record from `pending_session_outbox` and updates UI status to `"Persisted"`.
   - **HTTP 200 OK with `duplicate: true` (Idempotent Duplicate):** Spring Boot detects a duplicate submission. Outbox removal is permitted **only when**:
     1. The session UUID matches the original pending session.
     2. The acknowledged payload data is verified to be identical to the submitted payload.
     3. The backend confirms the duplicate represents the same previously persisted session.
     When all three identity criteria are satisfied, the frontend deletes the record from `pending_session_outbox` and updates UI status to `"Persisted"`; zero duplicate XP or records are created.
   - **HTTP 409 Conflict:** Same `sessionId` submitted with mismatched payload. Conflicting payloads must **never be silently discarded or overwritten**. Payload is quarantined in IndexedDB with status `CONFLICT_DETECTED` and alert logged for user diagnostics. Outbox does not retry automatically.
   - **HTTP 400 or 422 (Client Validation Error):** Malformed payload. Quarantined in IndexedDB with status `VALIDATION_FAILED` to prevent infinite loops; diagnostic error logged.
   - **HTTP 401 or 403 (Authentication / Authorization Failure):** Local per-launch request token mismatch or forbidden origin. Quarantined in IndexedDB with status `AUTH_FAILED`; security error logged. Never silently treated as transient network retries.
   - **HTTP 5xx, 429, or Network Drop/Timeout:** Requires **retry** (remains in outbox).
   - **Cardinal Governance Rule:** **Never remove an outbox item merely because a request was sent.** An outbox item is deleted ONLY upon confirmed HTTP 201 or 200 persistence acknowledgement.

### 7.2 Complete Retry Policy & Lifecycle

#### 1. Foreground Persistence Burst (Five Total HTTP Attempts)
The foreground burst consists of exactly **five HTTP attempts** (one initial request and four retries):

| Attempt | Description | Delay Before Attempt | Cumulative Elapsed Delay |
|:---:|---|:---:|:---:|
| **Attempt 1** | Initial request | Immediate ($0\text{ s}$) | $0.0\text{ s}$ |
| **Attempt 2** | First retry | $1.0\text{ s}$ | $1.0\text{ s}$ |
| **Attempt 3** | Second retry | $2.0\text{ s}$ | $3.0\text{ s}$ |
| **Attempt 4** | Third retry | $4.0\text{ s}$ | $7.0\text{ s}$ |
| **Attempt 5** | Fourth retry | $8.0\text{ s}$ | $15.0\text{ s}$ |

- Total active burst duration: 15.0 seconds.
- UI status communicates attempt progress: `Syncing... (Attempt N of 5)`.

#### 2. Foreground Exhaustion & Offline Queued Transition
- After Attempt 5 fails without acknowledgement:
  - Active foreground polling ceases immediately to prevent CPU spin.
  - The completed session **remains 100% durable** in IndexedDB `pending_session_outbox` (never discarded, never deleted).
  - Its stable UUID `sessionId` and exact payload are preserved; zero duplicate XP is awarded.
  - UI scorecard status updates to: `⚠️ Saved locally (Offline). Will sync when connection is restored.`

#### 3. Background Retry Lifecycle
- **Periodic Interval:** Low-priority background timer checks the outbox every **30 seconds** (the D3 maximum backoff ceiling).
- **No Abandonment Ceiling:** The 30-second background cycle repeats periodically while the desktop application remains open. To prevent data loss, there is no arbitrary abandonment ceiling that deletes unpersisted sessions.
- **Attempt Tracking:** Background attempts do not spin a user-facing attempt counter. The UI status remains `Offline Queued`, while the outbox internally tracks `attemptCount` and `lastAttemptTimestamp`.
- **Application Startup Flush:** Upon application launch/restart, the startup routine automatically flushes all queued sessions in `pending_session_outbox` once Spring Boot initializes.
- **Manual Retry Action:** Clicking `[ Retry Sync Now ]` in `SCR-605` or status bar immediately triggers a submission attempt without creating a duplicate session.
   - Clicking `[ Retry Sync Now ]` in the scorecard or status bar resets the attempt counter and triggers an immediate synchronization attempt.

---

## 8. Accessibility & Usability Controls

- **Reduced Motion (`prefers-reduced-motion: reduce`):** Vertical 40px camera scrolling transitions are instantaneous (`transition: none`).
- **Visual Focus Indicators:** Every interactive control, card, and tab displays a high-visibility **3px solid Cobalt Blue outline (`#2563EB`)** with `2px offset`.
- **Non-Color Error Communication:** Errors in the typing arena are communicated through text color (`#EF4444`), persistent `2px wavy underline`, and optional audio click tones.
