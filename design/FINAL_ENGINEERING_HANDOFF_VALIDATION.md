# FINAL ENGINEERING HANDOFF VALIDATION & CROSS-AUDIT REPORT
**Typing Trainer — Windows Desktop Application**  
*Document Version: 1.0.0 | Stage: Complete UI/UX Design Finalization*  
*Date: 2026-11-19 | Target Audience: Engineering Team (Claude Code) & Technical Governance*  
*Status: **TECHNICAL INTEGRATION CONTRACTS AUDITED & APPROVED***

---

## 1. Executive Summary & Audit Authority

In strict accordance with Correction 5 of the Product Owner's governance directive, this report delivers an exhaustive cross-audit of [`CLAUDE_CODE_DESIGN_HANDOFF.md`](file:///d:/Windows%20app/Typing%20Trainer/design/CLAUDE_CODE_DESIGN_HANDOFF.md) against all governing specifications established in Phases D1 through D7.

This document formally validates the mathematical contracts, state models, database schemas, and interaction algorithms, while **strictly separating approved Product Owner decisions from unresolved runtime engineering dependencies**.

---

## 2. Validation of Core Technical Contracts

### 2.1 Typing Calculation Contract (Governing Phase D4 Baseline)
Claude Code must implement typing metrics strictly according to the approved mathematical formulations:

1. **Standard Word Definition:** $1\text{ Standard Word} \equiv 5\text{ Keystrokes}$ (including letters, syntax symbols, spaces, and punctuation).
2. **Gross Speed ($WPM_{gross}$):**
   $$WPM_{gross} = \frac{N_{total} / 5}{T_{minutes}}$$
3. **Net Speed ($WPM_{net}$):**
   $$NetWPM = \max\left(0, \frac{(N_{total} / 5) - E_{uncorrected}}{T_{minutes}}\right) = GrossWPM - \frac{E_{uncorrected}}{T_{minutes}}$$
4. **Overall Accuracy ($Acc_{overall}$):**
   $$Acc_{overall} = \begin{cases} \left(\frac{N_{correct}}{N_{total}}\right) \times 100\% & \text{if } N_{total} > 0 \\ \mathbf{\text{“N/A”}} \ (0.0\%) & \text{if } N_{total} == 0 \end{cases}$$
5. **Zero-Floor Rule:** Net WPM can never be negative; strictly clamped at $\mathbf{0.00\text{ WPM}}$.
6. **Zero-Input Guard:** When $N_{total} == 0$, the engine prevents IEEE 754 `0/0` `NaN` or Java `ArithmeticException`, returning `0.00 WPM` and displaying `N/A`.

### 2.2 Error Treatment & Backspace Mechanics
- **Uncorrected Errors ($E_{uncorrected}$):** Characters left in an incorrect state in the submitted buffer upon drill completion. Each uncorrected error deducts exactly 1 standardized word from the gross words numerator. The Net WPM penalty is **strictly time-dependent**:
  $$\text{Penalty in WPM} = \frac{E_{uncorrected}}{T_{minutes}}\text{ WPM}$$
  *(e.g. at 68s duration, 1 error = $-0.88\text{ WPM}$; at 60s, $-1.00\text{ WPM}$; at 120s, $-0.50\text{ WPM}$). Describing this as a static "$-1.0\text{ WPM}$" penalty is mathematically invalid.*
- **Corrected Mistakes ($M_{corrected}$):** Characters mistyped during drilling that are subsequently erased via `Backspace` and retyped correctly. Corrected mistakes incur **zero Net WPM deduction** ($E_{uncorrected} = 0$). Only physical elapsed time lost backspacing and overall accuracy reflect the mistake.
- **Backspace Accounting:** Striking `Backspace` erases character buffer entries but **never increments $N_{total}$** and **never adds to Gross or Net WPM**.

### 2.3 Auto-Indentation Accounting (Smart Auto-Advance vs. Manual Indent)
- **Smart Auto-Advance Mode (`D7-OD-05`):** When the user presses `Enter` at a line boundary, the engine automatically inserts leading indentation spaces (e.g. 4 spaces) based on AST syntax rules.
  - **Zero-Inflation Rule:** Synthetic indentation spaces are positioning aids; they increment **neither** $N_{total}$ nor $N_{correct}$. They do **not** artificially inflate user WPM.
- **Manual Indent Mode:** When selected in `SCR-602`, the user must explicitly type every indentation space. Each typed space increments $N_{total}$ and $N_{correct}$.

### 2.4 D5 Learning Mode XP & Reward Ledger Architecture
- **Base Effort XP:**
  $$XP_{base} = \text{round}(Words \times 0.2) + \text{round}(Minutes \times 5)$$
- **Accuracy Scaling Multipliers:**
  - $\ge 98.0\%$ Accuracy: **$1.50\times$**
  - $95.0\% - 97.9\%$ Accuracy: **$1.20\times$**
  - $90.0\% - 94.9\%$ Accuracy: **$1.00\times$**
  - $85.0\% - 89.9\%$ Accuracy: **$0.75\times$**
  - $< 85.0\%$ Accuracy: **$0.50\times$**
- **Milestone Bonuses (Flat Additive):**
  - First-time lesson completion: **+25 XP**
  - 3-Star lesson certification ($\ge 98\%$ Acc): **+15 XP**
  - Module Capstone Mastery ($\ge 2\text{ Stars}$): **+150 XP**
  - Daily Practice Goal completion (default 20 min): **+150 XP**
- **Idempotent Economy Protection:** Milestone bonuses are flat additive and protected by unique constraints in SQLite table `user_reward_ledger`. Accuracy multipliers **never** multiply milestone bonuses. Retakes of previously completed lessons award Base XP only, preventing unearned milestone inflation.

### 2.5 D6 Skill Drills Rolling Per-Key Telemetry
- **Telemetry Window:** Trailing **100 eligible strokes per key** managed on a rolling FIFO buffer over a maximum **14-calendar-day** age window.
- **Weak-Key Prioritization Index ($WPI$):**
  $$WPI_k = \text{ErrRate}_k \times \ln(O_k + 1)$$
- **Watchlist Floor:** Keys require a minimum of **20 eligible opportunities** ($N_{min} = 20$) before qualifying for the active Watchlist on `SCR-401`.
- **Mastery Graduation:** A key graduates to Mastered status upon completing **3 consecutive qualifying sessions**, each requiring $\ge 30\text{ eligible opportunities}$ with an error rate $\le 3.0\%$. Per-key mastery awards **0 Milestone XP** to prevent economic exploitation.

### 2.6 D7 Developer Mode Language & Exercise Progression
- **Six Approved Launch Languages (`D7-OD-02`):**
  1. **Java**
  2. **TypeScript**
  3. **JavaScript**
  4. **Python**
  5. **SQL**
  6. **Rust**
- **Structured Data Format Category:** **JSON** is supported as a separate structured data format category.
- **Option A Bounded Pagination (`D7-NU-02`):**
  - Files containing **1–30 lines** remain a single exercise (`Part 1 of 1`).
  - Files containing **> 30 lines** are automatically divided into sequential parts where **no part exceeds 20 lines**, targeting AST structural breaks (blank lines, closing braces).
- **Dual Representation Storage (`D7-NU-01A`):**
  - Raw imported bytes are stored verbatim in SQLite `custom_code_files.raw_bytes` (`BLOB`) with SHA-256 `content_hash`.
  - For the frontend typing engine, line endings are normalized to `\n` in memory.

### 2.7 IndexedDB Outbox & Idempotent Duplicate Handling
- **Pre-Submission UUID:** Before transmitting a session to the backend, the frontend generates an RFC 4122 v4 UUID and writes the payload to IndexedDB table `typing_sessions_outbox` with status `PENDING`.
- **Backend Response Handling:**
  - `HTTP 201 Created`: First successful submission $\rightarrow$ delete entry from outbox.
  - `HTTP 200 OK` (`DUPLICATE_ACKNOWLEDGED`): Matching UUID and identical content hash $\rightarrow$ delete entry from outbox.
  - `HTTP 409 Conflict` (`CONFLICT_DETECTED`): Existing UUID with conflicting payload hash $\rightarrow$ mark entry as `QUARANTINED`, surface alert banner, **never silently discard**.

### 2.8 Approved Keyboard Shortcut Architecture
- **Global:** `Ctrl + K` (Command Palette), `Ctrl + B` (Sidebar toggle), `Ctrl + 1`..`Ctrl + 9` (Shell module navigation), `F11` (Fullscreen / Zen mode).
- **Manual Pause (`Esc`):** Manual `Esc` pause is the **approved baseline**. Halts timer and mounts `SCR-003`. 15-second auto-pause (`D7-NU-03`) is **deferred**. Window-blur auto-pause is **strictly prohibited**.
- **Guarded Restart (`F5` / `Ctrl + R`):**
  - If $t_{elapsed} \le 10.0\text{s}$: instant reset.
  - If $t_{elapsed} > 10.0\text{s}$: displays Guarded Restart confirmation modal before wiping progress.
- **Contextual `Tab` Key:**
  - Inside typing canvas: trapped via `e.preventDefault()`, handles code indentation; never escapes canvas.
  - Outside typing canvas: standard accessible WCAG tab ring. Global traps are strictly prohibited.

---

## 3. Separation of Approved Decisions vs. Unresolved Engineering Dependencies

To ensure complete clarity for Claude Code, implementation requirements are partitioned into approved architectural decisions versus technical desktop runtime dependencies:

```
+----------------------------------------------------------------------------------------------------+
| ARCHITECTURAL PARTITION: APPROVED DECISIONS VS. RUNTIME ENGINEERING DEPENDENCIES                  |
+----------------------------------------------------------------------------------------------------+
```

### Approved Product Owner Decisions (Locked Specifications — Zero Ambiguity)
1. **Net WPM Formula:** Standard 5-char word, dynamic uncorrected error penalty ($\frac{E_{unc}}{T_{min}}$), zero penalty for corrected mistakes.
2. **Launch Language Scope:** Strictly 6 programming languages (Java, TS, JS, Python, SQL, Rust) + JSON data format.
3. **Option A Pagination:** Files $1–30$ lines remain 1 part; files $> 30$ lines split into parts $\le 20$ lines.
4. **Pause Mechanics:** Manual `Esc` pause is baseline; 15s auto-pause is deferred; window-blur auto-pause is prohibited.
5. **Guarded Restart:** $10.0\text{s}$ threshold confirmation dialog.
6. **Pass/Mastery Gates:** Lessons require $\ge 95\%$ accuracy; 3 stars require $\ge 98\%$; Capstones require $\ge 2\text{ stars}$ for module mastery.
7. **Economy Invariants:** Base XP scaled by accuracy; milestone bonuses flat additive; 0 milestone XP on per-key mastery.

### Unresolved Engineering Dependencies (Desktop Runtime Tasks for Claude Code)
1. **WebView2 Accelerator Suppression FFI:** In Tauri 2 Rust initialization (`src-tauri/src/main.rs`), configure WebView2 settings to disable default browser accelerators (`put_AreBrowserAcceleratorKeysEnabled(0)`), ensuring `F5`, `Ctrl+R`, and `Tab` reach React `keydown` listeners on all Windows versions.
2. **SQLite WAL Concurrency & Lock Handling:** Configure SQLite connection pooling with `PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;`. Implement Spring `@Retryable` backoff on database write contention during rapid outbox flushing.
3. **Web Audio API Buffer Preloading:** Implement asynchronous pre-loading and decoding of Cherry MX switch audio WAV files (`click.wav`, `clack.wav`, `thud.wav`) during application splash screen, with $\pm 3\%$ pitch micro-randomization.
4. **Tauri Native File Dialog Filtering:** Enforce strict file dialog extension filters (`.txt`, `.md`, `.java`, `.ts`, `.js`, `.py`, `.sql`, `.rs`, `.json`) in Rust before passing file handles to the frontend.
5. **Display Scaling Coordinate Translation:** Verify that high-DPI Windows display scaling (125%, 150%) does not introduce sub-pixel rounding errors or text blur in Recharts canvas elements.

---

## 4. Engineering Handoff Validation Sign-Off

- **Contract Consistency:** 100% verified across typing math, error treatment, indentation, gamification, telemetry, and outbox lifecycles.
- **Decision Baseline:** 100% aligned with all approved Product Owner decisions.
- **Dependency Isolation:** Runtime desktop dependencies are cleanly separated from product specifications.
- **Status:** **VALIDATED & CLEARED FOR CLAUDE CODE IMPLEMENTATION**.
