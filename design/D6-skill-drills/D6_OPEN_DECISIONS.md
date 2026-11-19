# D6 OPEN DECISIONS & IMPLEMENTATION CONSIDERATIONS
**Typing Trainer — Windows Desktop Application**
*Module: 04. Skill Drills & Remediation Studio | Screen Scope: SCR-401 to SCR-405*
*Document Version: 1.2.0 | Stage: D6 Stage 4 Design Audit & Engineering Verification*
*Date: 2026-11-18 | Status: AUDITED & RECONCILED (STAGE 4 APPROVED)*

---

## 1. Status of Architectural Baseline Decisions

All four core architectural decisions for Phase D6 have received explicit Product Owner approval:
- **Decision D6-01 (Minimum Sample Size $N_{min} = 20$):** **APPROVED**.
- **Decision D6-02 (14-Day / 100-Stroke Rolling FIFO Window):** **APPROVED**.
- **Decision D6-03 (3-Session Mastery Graduation Lifecycle):** **APPROVED**.
- **Decision D6-04 (Consolidation of Drill Modes into `SCR-403`):** **APPROVED**.

---

## 2. Product Owner Approved Implementation Decisions (Audited & Reconciled)

The three open implementation nuances have been formally audited and reconciled under Stage 4 governance:

### Decision D6-OD-01: Default Drill Duration (Reconciled)
- **Approved Policy:** Default drill duration is set strictly to **2 Minutes**.
- **Reconciliation & Conditions (Issue A):**
  1. **Measure Distinction:** 2 Minutes is a timed duration. Word-count-based drills are supported as a separate, distinct exercise mode in `SCR-403`. 50 words is **never** presented as equivalent to 2 minutes.
  2. **Mastery Independence:** Mastery qualification depends strictly on eligible target-key opportunities, **not** on elapsed duration or word count.
  3. **30-Opportunity Floor:** Each qualifying mastery session strictly requires at least **30 eligible target-key opportunities** with an error rate of $\le 3.0\%$.
  4. **Non-Qualifying Practice:** A session with fewer than 30 eligible opportunities remains completely valid practice (awarding Base XP and crediting active time toward daily goals and streaks), but **does not qualify toward the 3-session mastery threshold**.
  5. **Opportunity Prioritization:** Exercise generation algorithms in `SCR-403` must prioritize text patterns that generate sufficient target-key opportunities to meet or exceed the 30-opportunity threshold.
- **Status:** **APPROVED & RECONCILED (STAGE 4)**.

### Decision D6-OD-02: Weak-Key Prioritization Index Formulation (Approved)
- **Approved Formula:**
  $$WPI_k = \text{ErrRate}_k \times \ln(O_k + 1)$$
- **Conditions:**
  1. Requires a minimum floor of **20 eligible opportunities** before ranking in the active Weak-Key Watchlist ($N_{min} = 20$).
  2. Telemetry incorporates the **latest 100 eligible opportunities** per key on a rolling FIFO basis.
  3. Maximum telemetry age window is **14 calendar days**.
  4. The UI must always display the raw **error rate (%)** and **opportunity count ($O_k$)** alongside the composite $WPI$ score to ensure complete data transparency.
  5. The $WPI$ is strictly a **descriptive prioritization ranking score**, not a medical, neurological, or biomechanical diagnostic measurement.
- **Status:** **APPROVED BY PRODUCT OWNER**.

### Decision D6-OD-03: Custom Text File Import Validation Pipeline (Reconciled)
- **Approved Ceiling:** Maximum imported file size is **500 KB** (approximately 80,000 words). Enforced before any processing occurs.
- **Reconciliation & Rules (Issue B):**
  1. **Supported Formats:** Approved `.txt` and `.md` formats only.
  2. **File Size Pre-Check:** Enforce the 500 KB limit immediately upon file selection. Files $> 500\text{ KB}$ are rejected upfront with: *"File exceeds 500 KB limit. Please select a shorter chapter or snippet."*
  3. **Empty-File Rejection:** Reject files with 0 bytes or whitespace-only content with a clear alert: *"File is empty. Please select a text file with content."*
  4. **Strict UTF-8 Validation (No Silent Stripping):** Accept valid UTF-8 files. Reject invalid UTF-8 files with an actionable error: *"Encoding Error: File contains invalid UTF-8 byte sequences. Please re-save the file with UTF-8 encoding in your text editor and re-import."* **Never silently strip, replace, or modify invalid bytes.**
  5. **Exact Preservation:** Preserve imported text exactly after successful UTF-8 decoding.
  6. **Plain Non-Executable Text:** Treat all imported content strictly as inert string data. Never execute, evaluate, or render as active HTML.
- **Status:** **APPROVED & RECONCILED (STAGE 4)**.

### Policy D6-OD-04: Mastery Reward Presentation (Reconciled)
- **Approved Policy (Issue C):**
  1. **Per-Key Mastery Awards 0 Milestone XP:** Graduating a key to Mastered status does not award a separate +100 Milestone XP.
  2. **Neutral Visual Presentation:** `SCR-405` presents a clean, celebratory confirmation: `🏆 KEY P OFFICIALLY MASTERED!` with the subtitle *"3 consecutive qualifying sessions verified (≤ 3.0% error rate and ≥ 30 target opportunities). Key P graduated to Mastered status."*
  3. **Protection of D5/D3 Rules:** Base XP and session accuracy multipliers apply normally. Milestone XP is strictly restricted to approved one-time achievements in `user_reward_ledger` (such as the one-time "Precision Repair" achievement for the student's *first* mastered key), preventing duplicate or unearned milestone awards on subsequent keys, retakes, or after regression.
- **Status:** **APPROVED & RECONCILED (STAGE 4)**.

---

## 3. Implementation Verification Requirements for Claude Code

During the subsequent implementation phase, Claude Code must verify the following desktop runtime behaviors:
1. **WebView2 Browser Accelerator Suppression:** Verify that `ICoreWebView2Settings::put_AreBrowserAcceleratorKeysEnabled(FALSE)` properly suppresses native `F5` / `Ctrl + R` window reloads on Windows 10 and 11.
2. **SQLite File Concurrency:** Verify that SQLite database write operations during atomic session persistence do not encounter `SQLITE_BUSY` when background processes are active.
3. **Local Text File Dialog Sanitization:** Verify that Tauri's native file dialog restricts selections strictly to `.txt` and `.md` extensions and safely sanitizes non-UTF-8 characters.
