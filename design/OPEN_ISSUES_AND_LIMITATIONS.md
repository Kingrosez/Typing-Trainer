# MASTER OPEN ISSUES, NUANCES & TECHNICAL LIMITATIONS REGISTER
**Typing Trainer — Windows Desktop Application**  
*Document Version: 1.0.0 | Stage: Complete UI/UX Design Finalization*  
*Date: 2026-11-19 | Status: MASTER GOVERNANCE REGISTER (ALL DECISIONS APPROVED & AUDITED)*

---

## 1. Executive Summary & Governance Closure

This document serves as the official, comprehensive register of all architectural decisions, implementation nuances, external technical boundaries, and formally deferred features for the entire Typing Trainer desktop application.

### Key Milestones Achieved:
1. **Zero Open Product Owner Decisions:** All strategic and functional decisions across Phases D1 through D7 have been formally approved and verified.
2. **Unbroken Decision Traceability:** All 38 application screens, 32 master components, and ergonomic typing loops align with approved governance reports.
3. **Transparent Platform Boundary Reporting:** External constraints (Figma Starter plan rate limits, WebView2 accelerator hazards, SQLite write concurrency) are documented honestly with robust architectural mitigations.

---

## 2. Master Register of Approved Product Owner Decisions (D1–D7)

| Decision ID | Phase / Area | Title & Approved Policy | Governing Document |
|---|---|---|---|
| **DEC-01** | D1 Architecture | **Separation of Learning Mode & Skill Drills:** Maintained as distinct top-level sidebar items. | `D1_REVIEW_RESOLUTION.md` |
| **DEC-02** | D1 Architecture | **Single-Profile MVP with Multi-Profile Schema:** UI supports 1 local user; SQLite tables include `profile_id`. | `D1_REVIEW_RESOLUTION.md` |
| **DEC-03** | D1 Architecture | **Mechanical Audio Switch Simulation:** Pre-sampled WAV audio (Cherry MX Blue, Brown, Red), shipped **muted by default**. | `D1_REVIEW_RESOLUTION.md` |
| **DEC-04** | D1 Architecture | **Personal Record Gating ($\ge 95\%$):** Official benchmark records and speed badges strictly require $\ge 95.0\%$ accuracy. | `D1_REVIEW_RESOLUTION.md` |
| **DEC-05** | D1 Architecture | **Windows 11 Native Material:** Native Mica translucency on Windows 11 titlebar/sidebar; solid Obsidian fallback on Win 10. | `D1_REVIEW_RESOLUTION.md` |
| **DEC-06** | D1 Architecture | **Automated Local Backups:** Rotating 4-week automated local snapshot archive in `AppData` + manual JSON export. | `D1_REVIEW_RESOLUTION.md` |
| **D2-01** | D2 Design System | **Calibrated Palette:** Dark Midnight Slate (`#0B0F19`) and Light Daylight Studio (`#F8FAFC`, `#FFFFFF`). | `DESIGN_DECISIONS.md` |
| **D2-02** | D2 Design System | **Dual Typography Strategy:** `Inter` for all UI chrome; `JetBrains Mono` with tabular numerals for typing/code. | `DESIGN_DECISIONS.md` |
| **D2-03** | D2 Design System | **Pastel 65% Mechanical Keyboard:** Soft Mint, Cream, Rose, and Lavender keycaps mapping to touch-typing finger zones. | `DESIGN_DECISIONS.md` |
| **D2-04** | D2 Design System | **Realistic Human Hand Anatomy:** Anatomically accurate hands (natural metacarpals, curved digits) over abstract 3D blobs. | `DESIGN_DECISIONS.md` |
| **D2-05** | D2 Design System | **Surface Elevation via Lightness:** In Dark theme, elevation steps `#0B0F19` $\rightarrow$ `#131B2E` $\rightarrow$ `#1E293B` with luminous borders. | `DESIGN_DECISIONS.md` |
| **D2-06** | D2 Design System | **1:1 Tailwind & shadcn/ui Mapping:** Every token and component drops directly into standard React/Tailwind primitives. | `DESIGN_DECISIONS.md` |
| **D3-01** | D3 Dashboard | **Standardized Button Token (`#2563EB`):** All primary action buttons standardize on Cobalt Blue for verified 5.17:1 contrast. | `DASHBOARD_DESIGN_DECISIONS.md` |
| **D3-02** | D3 Dashboard | **Dashboard Hero Metric Quartet:** Best WPM, Average WPM, Overall Accuracy, Total Practice Time. | `DASHBOARD_DESIGN_DECISIONS.md` |
| **D3-03** | D3 Dashboard | **Deterministic Weak-Key Engine:** Flagged when key error rate $>8.0\%$ over trailing 500 strokes. 100% offline and explainable. | `DASHBOARD_DESIGN_DECISIONS.md` |
| **D3-04** | D3 Dashboard | **Non-Punitive Habit Streaks:** Streaks advance upon meeting daily goal (default: 20 min). 1 Streak Freeze Shield per 7 days. | `DASHBOARD_DESIGN_DECISIONS.md` |
| **D3-05** | D3 Dashboard | **Compact WPM Telemetry (15 Sessions):** Focused 540 × 240px Recharts trend line preventing visual cognitive overload. | `DASHBOARD_DESIGN_DECISIONS.md` |
| **D4-01** | D4 Typing Test | **Standard 5-Character Word Definition:** $1\text{ Word} \equiv 5\text{ Keystrokes}$ across all prose and code tests. | `TYPING_TEST_DESIGN_DECISIONS.md` |
| **D4-02** | D4 Typing Test | **Net WPM Governing Formula:** $NetWPM = \max\left(0, \frac{N_{typed}/5 - E_{uncorrected}}{T_{minutes}}\right)$ with zero floor. | `TYPING_TEST_DESIGN_DECISIONS.md` |
| **D4-03** | D4 Typing Test | **Peripheral Chrome Dimming:** Navigation sidebar and titlebars automatically dim to 20% opacity during active typing. | `TYPING_TEST_DESIGN_DECISIONS.md` |
| **D4-04** | D4 Typing Test | **3-Line Centered Smooth-Scroll Window:** Active typing line locked to Center Line 2; 180ms smooth translateY scroll. | `TYPING_TEST_DESIGN_DECISIONS.md` |
| **D4-05** | D4 Typing Test | **Throttled Live HUD Updates (500ms):** Metric numbers update at 500ms intervals to eliminate distracting visual strobing. | `TYPING_TEST_DESIGN_DECISIONS.md` |
| **D4-06** | D4 Typing Test | **Pure React In-Memory Keystroke Loop:** Live keypresses processed in React state; zero REST calls per keystroke. | `TYPING_TEST_DESIGN_DECISIONS.md` |
| **D4-07** | D4 Typing Test | **IndexedDB Offline Queueing:** Completed sessions buffered locally in IndexedDB before REST submission to Spring Boot. | `TYPING_TEST_DESIGN_DECISIONS.md` |
| **D4-09** | D4 Typing Test | **Backspace Accounting:** Backspace does not count as character input; corrects errors to 0 Net WPM penalty. | `TYPING_TEST_DESIGN_DECISIONS.md` |
| **D4-10** | D4 Typing Test | **Filtered Cadence Consistency:** $100 - (CV \times 100)$ requiring $\ge 10$ samples, filtering outlier pauses $>2000\text{ms}$. | `TYPING_TEST_DESIGN_DECISIONS.md` |
| **D4-12** | D4 Typing Test | **Shortcut Conflict Resolutions:** Zen Mode on `F8`, Quick Restart on `F5`/`Ctrl+R`, `Tab` dedicated to accessibility. | `TYPING_TEST_DESIGN_DECISIONS.md` |
| **D4-13** | D4 Typing Test | **3-Second Unpause Buffer:** Resuming from pause initiates `3... 2... 1... GO!` with timer frozen. | `TYPING_TEST_DESIGN_DECISIONS.md` |
| **D5-01** | D5 Learning Mode| **32-Lesson, 4-Module Curriculum:** Home Row $\rightarrow$ Top Row $\rightarrow$ Bottom Row $\rightarrow$ Numbers/Symbols. | `LEARNING_MODE_DESIGN_DECISIONS.md`|
| **D5-02** | D5 Learning Mode| **3D Anatomical Human Hands:** Defined metacarpals, relaxed C-curve, modeled anchor points on `F` and `J`. | `LEARNING_MODE_DESIGN_DECISIONS.md`|
| **D5-03** | D5 Learning Mode| **Forgiving Multi-Word Backspacing:** Word-lock lifted in Learning Mode to allow neural motor overwriting of errors. | `LEARNING_MODE_DESIGN_DECISIONS.md`|
| **D5-04** | D5 Learning Mode| **Accuracy-First Progression Gating:** $\ge 95.0\%$ accuracy to pass lessons, $\ge 98.0\%$ accuracy for 3 Stars. | `LEARNING_MODE_DESIGN_DECISIONS.md`|
| **D5-05** | D5 Learning Mode| **Trajectory Reach Arcs:** Animated glowing dashed bezier arc from home anchor keycap to target keycap. | `LEARNING_MODE_DESIGN_DECISIONS.md`|
| **D5-06** | D5 Learning Mode| **Floating Finger Hint Pill (`[ L-Mid ]`):** Positioned above active character; toggled via `F1`. | `LEARNING_MODE_DESIGN_DECISIONS.md`|
| **D5-11** | D5 Learning Mode| **Capstone Assessment Gate:** Capstones (08, 16, 24, 32) require $\ge 2\text{ Stars}$ ($\ge 95\%$ Acc + WPM gate) to unlock next module. | `LEARNING_MODE_DESIGN_DECISIONS.md`|
| **D5-12** | D5 Learning Mode| **Idempotent Reward Ledger:** Base XP scaled by accuracy multipliers ($1.5x$ to $0.5x$); milestone bonuses are flat additive. | `LEARNING_MODE_DESIGN_DECISIONS.md`|
| **D6-01** | D6 Skill Drills | **Minimum Opportunity Floor ($N_{min} = 20$):** Keys require $\ge 20$ opportunities before appearing on Watchlist. | `D6_OPEN_DECISIONS.md` |
| **D6-02** | D6 Skill Drills | **14-Day / 100-Stroke Rolling FIFO Buffer:** Weak-key diagnosis uses trailing 100 eligible strokes over 14 calendar days. | `D6_OPEN_DECISIONS.md` |
| **D6-03** | D6 Skill Drills | **3-Session Mastery Graduation Lifecycle:** Key graduates to Mastered upon achieving 3 consecutive qualifying sessions. | `D6_OPEN_DECISIONS.md` |
| **D6-OD-01**| D6 Skill Drills | **Default Drill Duration 2 Minutes:** Separate from word-count mode; requires $\ge 30$ opportunities for mastery qualification. | `D6_OPEN_DECISIONS.md` |
| **D6-OD-02**| D6 Skill Drills | **Weak-Key Prioritization Index ($WPI$):** $WPI_k = \text{ErrRate}_k \times \ln(O_k + 1)$. Descriptive prioritization index. | `D6_OPEN_DECISIONS.md` |
| **D6-OD-03**| D6 Skill Drills | **Strict 500 KB Limit & UTF-8 Validation:** Enforce 500 KB ceiling and valid UTF-8. **Zero silent stripping or replacement.** | `D6_OPEN_DECISIONS.md` |
| **D6-OD-04**| D6 Skill Drills | **Neutral Mastery Presentation:** Clean celebratory banner (`🏆 KEY P MASTERED!`) with 0 Milestone XP to protect economy. | `D6_OPEN_DECISIONS.md` |
| **D7-OD-01**| D7 Developer Mode| **Indentation Mechanics (Smart Auto-Advance):** Smart Auto-Advance on `Enter` is default; dotted guides (`┆`); manual toggle; auto-indent excluded from WPM/accuracy. | `D7_OPEN_DECISIONS.md` |
| **D7-OD-02**| D7 Developer Mode| **6 Launch Languages + JSON Data Track:** Java, TS, JS, Python, SQL, Rust, plus separate JSON track. C++, Go, Bash deferred (`D7-DEF-02`). | `D7_OPEN_DECISIONS.md` |
| **D7-OD-03**| D7 Developer Mode| **Multi-Line Backspacing:** Full multi-line backspacing across previous lines; unlocks Line $N-1$; corrected errors excluded from Net WPM penalty. | `D7_OPEN_DECISIONS.md` |
| **D7-OD-04**| D7 Developer Mode| **Benchmark Metrics (D4 Formula):** Standard Net WPM ($WPM_{net} = \max(0, \frac{N_{total}/5 - E_{unc}}{T_{min}})$); prominent Symbol Accuracy. | `D7_OPEN_DECISIONS.md` |
| **D7-OD-05**| D7 Developer Mode| **Terminal Scope Deferral:** CLI / terminal drills deferred to future module (`D7-DEF-01`). Developer Mode focuses exclusively on code typing. | `D7_OPEN_DECISIONS.md` |
| **D7-OD-06**| D7 Developer Mode| **Telemetry Persistence & Outbox Recovery:** In-memory collection in React; session UUID; IndexedDB outbox; async batch POST to Spring Boot. | `D7_OPEN_DECISIONS.md` |
| **D7-ARCH-01**| D7 Developer Mode| **Five-Screen Architecture (`SCR-601`..`605`):** `SCR-601` Hub, `SCR-602` Catalog, `SCR-603` Arena, `SCR-604` Importer, `SCR-605` Results Scorecard. | `D7_SCREEN_INVENTORY.md`, `D7_INFORMATION_ARCHITECTURE.md` |
| **D7-NU-01A**| D7 Developer Mode| **Dual Representation Storage:** Raw UTF-8 bytes in SQLite `raw_bytes` (`BLOB`); normalized `\n` in typing memory. | `D7_STAGE_4_FINAL_DESIGN_AUDIT.md` |
| **D7-NU-01B**| D7 Developer Mode| **In-Memory React Keystroke Buffer:** Real-time keypresses processed in React state; batch outbox persistence. | `D7_STAGE_4_FINAL_DESIGN_AUDIT.md` |
| **D7-NU-02**| D7 Developer Mode| **Option A Bounded Pagination:** 1–30 lines remain 1 part; $>30$ lines partitioned into parts $\le 20$ lines. | `D7_STAGE_4_FINAL_DESIGN_AUDIT.md` |
| **D7-NU-03**| D7 Developer Mode| **Inactivity Auto-Pause Proposal (15s):** FORMALLY DEFERRED. Manual Esc pause remains approved baseline. | `D7_STAGE_4_FINAL_DESIGN_AUDIT.md` |

---

## 3. External System Boundaries & Mitigations

### 3.1 Figma Starter Plan MCP Tool-Call Rate Limit
- **The Constraint:** The authenticated Figma workspace operates under a Starter Plan (maximum 3 pages per file, tool-call rate limit paywall on MCP operations).
- **The Audit Reality:**
  - On Page 3 (`🖥 03. Desktop Flows & Screen Templates`), master frames `15:2` (Dashboard), `2:2` (Typing Arena), `4:2` (Results), and `5:2` (Learning Mode) are physically verified.
  - Deeper automated writes are blocked by Figma's paywall.
- **Governing Mitigation:** All 38 application screens are documented with complete, pixel-level Auto-Layout properties, layer hierarchies, token bindings, and responsive wireframes in [`FIGMA_SCREEN_INVENTORY.md`](file:///d:/Windows%20app/Typing%20Trainer/design/FIGMA_SCREEN_INVENTORY.md). We make **zero claims of unverified canvas nodes**.

### 3.2 Microsoft WebView2 Global Accelerator Hazards
- **The Hazard:** Pressing `F5` or `Ctrl + R` reloads the webview, destroying volatile in-memory React session data and dropping active user progress.
- **Governing Mitigation:**
  1. Top-level window `keydown` interception captures `F5` and `Ctrl + R`, routing through the **Guarded Restart** confirmation modal for sessions $> 10\text{s}$.
  2. Tauri 2 native desktop configuration disables default webview accelerators:
     ```rust
     (*settings).put_AreBrowserAcceleratorKeysEnabled(0); // FALSE
     ```

### 3.3 SQLite Concurrent Write Contention (`SQLITE_BUSY`)
- **The Hazard:** Flushing queued sessions from IndexedDB outbox during backend reconnection could encounter SQLite write locks.
- **Governing Mitigation:**
  1. SQLite configured in WAL mode with a 5000ms busy timeout:
     ```sql
     PRAGMA journal_mode = WAL;
     PRAGMA busy_timeout = 5000;
     ```
  2. Spring Boot persistence layer employs `@Retryable` backoff on database locks.

---

## 4. Contextual `Tab` Key & Window-Blur Invariants

1. **Contextual `Tab` Key Behavior:**
   - **Inside Typing Stage (`SCR-202`, `SCR-303`, `SCR-404`, `SCR-603`):** `Tab` is intercepted via `e.preventDefault()`. Focus **never** escapes to window chrome during an active exercise, preventing dropped keystrokes. In Developer Mode, it handles code indentation per user configuration.
   - **Outside Typing Stage:** `Tab` functions normally as an accessible WCAG keyboard focus traversal mechanism.
   - **Anti-Trap Rule:** A global keyboard trap is never created. `Esc` immediately pauses active typing and restores standard focus navigation.
2. **Window-Blur Policy (Governance Invariant):**
   > [!IMPORTANT]
   > **Window-blur auto-pause is NOT an approved feature.** Shifting operating system focus (e.g. notifications, alt-tabbing) does **not** artificially pause the exercise. Active exercises pause **only** when the user explicitly presses `Esc` (manual `Esc` pause is the approved baseline; proposed 15-second inactivity auto-pause `D7-NU-03` remains deferred).

---

## 5. Formally Deferred Features (Locked Scope)

| Deferred Feature ID | Feature Title | Planned Future Phase | Architectural Justification |
|---|---|---|---|
| **D7-DEF-01** | **Terminal & CLI Shell Simulation** | Module 09 (DevOps Studio) | Typing Trainer is an ergonomic typing tutor, not a pseudo-terminal (PTY) emulator. PTY piping belongs in a dedicated DevOps module. |
| **D7-DEF-02** | **Extended Languages Pack** | Developer Mode DLC Pack 1 | The initial 6 core launch languages + JSON provide comprehensive multi-paradigm coverage. |
| **D7-NU-03** | **15-Second Inactivity Auto-Pause** | Post-MVP Evaluation | Manual Esc pause remains the approved baseline; auto-pause on inactivity is deferred from launch. |
| **POST-MVP-01** | **Multi-User Profile Switching** | Post-MVP Update | SQLite schema includes `profile_id` foreign keys from Day 1 (`DEC-02`), but UI is streamlined for single desktop users in MVP. |

---

## 6. Register Sign-Off & Governance Clearance

- **Total Open Decisions:** **0 (Zero)**.
- **Total Unresolved Conflicts:** **0 (Zero)**.
- **Audit Verdict:** **100% RESOLVED & APPROVED FOR STAGE 5 IMPLEMENTATION**.
