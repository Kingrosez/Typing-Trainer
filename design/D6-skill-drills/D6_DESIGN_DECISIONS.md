# D6 DESIGN DECISIONS & TRADE-OFFS
**Typing Trainer — Windows Desktop Application**
*Module: 04. Skill Drills & Remediation Studio | Screen Scope: SCR-401 to SCR-405*
*Document Version: 1.0.0 | Stage: D6 Stage 2 UX and Functional Specifications*
*Date: 2026-11-18 | Status: SPECIFICATION COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Pedagogical & Diagnostic Decisions

### Decision D6-01: Minimum Keystroke Sample Size ($N_{min} = 20$)
- **Context:** Establishing the statistical threshold before a key can be evaluated and classified as "Weak", "Developing", or "Stable".
- **Decision:** Mandate a minimum sample floor of **$N_{min} = 20\text{ eligible opportunities}$** per key. Any key with $< 20$ target opportunities in the rolling window is classified as `INSUFFICIENT_DATA` (Muted Slate `#64748B`).
- **Rationale:** Prevents erratic UI thrashing and false-positive weak-key alerts based on small sample sizes (e.g. typing a letter once in a session and miskeying it yielding an artificial 100% error rate).
- **Status:** **Product Owner Approved**.

---

### Decision D6-02: 14-Day / 100-Stroke Rolling FIFO Diagnostic Window
- **Context:** Deciding how historical keystroke telemetry is aggregated for the live heatmap and recommendations.
- **Decision:** Maintain a rolling FIFO buffer of the **latest 100 eligible opportunities per key**, with an absolute expiration cutoff of **14 calendar days**. Older entries are purged automatically. Permanent historical session logs are stored separately in `drill_attempts`.
- **Rationale:** Ensures that recent targeted remediation rapidly updates the student's live skill health. An error-heavy session from three weeks ago should not permanently anchor a keycap in red if recent deliberate practice has stabilized the reach.
- **Status:** **Product Owner Approved**.

---

### Decision D6-03: Multi-Session Mastery Graduation (3-Session Gate)
- **Context:** Deciding when a weak key is officially declared "Mastered" and removed from the active Watchlist.
- **Decision:** A key achieves Mastered status only after maintaining $\le 3.0\%$ error rate across **three distinct completed sessions**, with **at least 30 target opportunities in each session**. An intermediate qualifying session with $> 3.0\%$ error resets the consecutive counter to zero.
- **Rationale:** A single short drill does not prove sustained motor competence. Typists often type slowly during a single drill to achieve high accuracy, but true remediation requires repeatable, subconscious cadence across separate sessions.
- **Status:** **Product Owner Approved**.

---

### Decision D6-04: Consolidation of Drill Types into SCR-403 Configuration Studio
- **Context:** D1 initially conceived `SCR-402` to `SCR-405` as separate standalone drill pages (Weak Keys, N-Grams, Vocab, Custom Import).
- **Decision:** Consolidate all drill modes (Weak Keys, N-Grams/Bigrams, Vocabulary Tiers, Custom Text/File Import) as configurable mode presets inside **`SCR-403: Drill Configuration Studio`**, channeling all practice through the unified **`SCR-404: Skill Drill Arena`** and **`SCR-405: Results Scorecard`**.
- **Rationale:** Eliminates redundant, fragmented typing canvases; provides a single powerful, versatile configuration interface; simplifies navigation and cognitive load.
- **Status:** **Product Owner Approved**.

---

## 2. Technical & Ethical Standards

### Decision D6-05: Observable Performance Language (Non-Clinical Standard)
- **Context:** Ensuring diagnostic descriptions remain professional, accessible, and free of unauthorized medical/biomechanical diagnostic claims.
- **Decision:** Strictly enforce observable performance descriptions (e.g. "Right pinky target-key accuracy is 91.2%, lower than your 96.8% keyboard baseline") and purge all claims of physical impairment, fatigue, or motor diagnosis. Hesitation latency is documented strictly as a descriptive timing metric in milliseconds. Replace "Fleet Health" with "Keyboard Skill Health".
- **Rationale:** Typing Trainer is educational learning software, not a medical or neurological diagnostic device.
- **Status:** **Product Owner Approved**.

---

### Decision D6-06: Four-Layer Error Attribution Model
- **Context:** Defining how errors are assigned to keys when mistyped, backspaced, and corrected.
- **Decision:**
  1. Errors are strictly attributed to the **intended target keycap**.
  2. Each character position in the passage is evaluated at most once.
  3. Corrected mistakes avoid the Net WPM penalty in `SCR-404`, but remain permanently logged in the diagnostic error matrix.
  4. The actual incorrect key entered is recorded in `key_confusion_matrix` for confusion analysis.
- **Rationale:** Guarantees mathematically sound per-key diagnostic statistics without double-counting errors through repeated backspacing.
- **Status:** **Product Owner Approved**.

---

### Decision D6-07: Forgiving Multi-Word Backspace in Remediation Arena (`SCR-404`)
- **Context:** Choosing between D4 Speed Benchmark word-locking vs D5 Learning Mode multi-word backspacing.
- **Decision:** Adopt the **D5 forgiving multi-word backspace policy** in `SCR-404`. Students are allowed and encouraged to backspace across multiple words to delete mistakes and retype words cleanly.
- **Rationale:** Neuroplastic motor learning relies on deliberate practice. Forcing a student to leave an uncorrected error in their text reinforces the neural pathway of the mistake. Allowing full backspacing enables the student to immediately overwrite the erroneous motor program with the correct finger movement.
- **Status:** **Product Owner Approved**.

---

### Decision D6-08: Deterministic Offline Content Generation (Local 5,000-Word Corpus + PRNG)
- **Context:** Generating high-density targeted practice drills without remote servers or local LLMs.
- **Decision:** Bundle an offline, permissively licensed 5,000-word English vocabulary corpus and n-gram frequency index. Use a deterministic PRNG seeded with parameters `(TargetKeys, Stage, Session, Date)` to generate repeatable, structured drill passages.
- **Rationale:** Adheres strictly to the offline-first, local-first architecture while providing infinite, repeatable, zero-latency drill generation.
- **Status:** **Product Owner Approved**.

---

### Decision D6-09: Tauri Desktop Accelerator Suppression (`F5` / `Ctrl + R` Guard Dialog)
- **Context:** Preventing native WebView2 page reload under `F5` / `Ctrl + R` from destroying active React drill state.
- **Decision:**
  1. Frontend top-level keydown listener intercepts `F5` and `Ctrl + R` via `{ capture: true }` and `e.preventDefault()`.
  2. If $> 10\text{s}$ elapsed in `SCR-404`, a modal confirmation dialog is required (`"Discard active drill progress and restart?"`).
  3. Tauri 2 Rust window initialization explicitly disables WebView2 browser accelerators via `put_AreBrowserAcceleratorKeysEnabled(FALSE)`.
  4. Formally designated as an **implementation verification requirement for Claude Code**.
- **Rationale:** Protects student practice data from accidental desktop reloads.
- **Status:** **Product Owner Approved**.

---

### Decision D6-10: Option A Daily Diminishing Returns for Base XP (Attempt 1 = Initial Attempt)
- **Context:** Aligning D6 drill rewards with D5 gamification rules and preventing XP farming.
- **Decision:** Enforce Option A Daily Diminishing Returns:
  - Attempt 1 includes the initial lesson/drill attempt on that calendar day.
  - Scope: Evaluated per drill configuration per calendar day.
  - Attempts 1–3: **100% Base XP**.
  - Attempts 4–5: **50% Base XP**.
  - Attempts 6 onwards: **0% Base XP**.
  - 100% of active physical practice time accumulates toward daily practice goals and streak maintenance.
- **Rationale:** Maintains balanced gamification while honoring authentic physical practice time.
- **Status:** **Product Owner Approved**.

---

## 3. Approved Implementation Decisions (Stage 3 Kickoff)

### Decision D6-11 (D6-OD-01): Default Drill Duration (2 Minutes) & 30-Stroke Mastery Opportunity Floor
- **Context:** Establishing the default duration in `SCR-403` and governing its relationship with the 3-session mastery threshold.
- **Decision:** Default drill duration is set strictly to **2 Minutes**. Word-count-based drills are supported as a separate exercise mode; 50 words is **never** presented as equivalent to 2 minutes. Mastery progression depends strictly on eligible target-key opportunities, not elapsed duration or word count. Mastery qualification strictly requires $\ge 30\text{ eligible opportunities}$ on the target keycap with $\le 3.0\%$ error rate within that single completed session. If a completed session produces $< 30$ opportunities, it remains valid practice (awarding Base XP and contributing practice time to daily goals), but is explicitly labelled as `NON_QUALIFYING_OPPORTUNITY_COUNT` for mastery progression.
- **Rationale:** 2 minutes generates approximately 60–90 target-key strokes for intermediate typists, providing ample opportunity margin while preventing cognitive fatigue.
- **Status:** **Product Owner Approved & Reconciled (Stage 4)**.

---

### Decision D6-12 (D6-OD-02): Weak-Key Prioritization Index Formulation with Logarithmic Scaling
- **Context:** Weighting error severity against sample frequency without artificial category bias.
- **Decision:** Calculate the Weak-Key Prioritization Index as:
  $$WPI_k = \text{ErrRate}_k \times \ln(O_k + 1)$$
  Subject to:
  1. Minimum sample size floor $N_{min} = 20$ eligible opportunities.
  2. Rolling FIFO window of the latest 100 eligible opportunities per key.
  3. 14 calendar day maximum telemetry age window.
  4. The UI must always show the underlying error rate and opportunity count alongside $WPI$.
  5. Strictly designated as a descriptive ranking index, not a clinical or biomechanical metric.
- **Rationale:** The natural logarithm $\ln(O_k + 1)$ gracefully balances stroke volume and error rate without distorting punctuation keys or common letters.
- **Status:** **Product Owner Approved**.

---

### Decision D6-13 (D6-OD-03): Custom Text Import File Size Ceiling (500 KB) & Strict UTF-8 Validation
- **Context:** Safeguarding desktop performance and memory footprint during custom text/file imports in `SCR-403`.
- **Decision:** Constrain imported text files (`.txt`, `.md`) to an absolute maximum ceiling of **500 KB** (approximately 80,000 words), enforced before processing. Accept valid UTF-8 files. Reject invalid UTF-8 files with a clear, actionable error banner: *"Encoding Error: File contains invalid UTF-8 byte sequences. Please re-save the file with UTF-8 encoding in your text editor and re-import."* **Never silently strip, replace, or modify invalid bytes.** Preserve imported text exactly after successful decoding. Continue rejecting empty or whitespace-only files. Treat imported content as plain, non-executable text.
- **Rationale:** Guarantees data integrity without silent byte loss while protecting memory and parsing latency in Tauri/Rust.
- **Status:** **Product Owner Approved & Reconciled (Stage 4)**.

---

### Decision D6-14: Neutral Mastery Presentation in SCR-405 (No Per-Key Milestone XP)
- **Context:** Reconciling the "+100 Milestone XP" presentation on `SCR-405` with approved D5/D3 gamification rules and the unique reward ledger.
- **Decision:** Graduating a key to Mastered status does not award a per-key +100 Milestone XP bonus. `SCR-405` utilizes a neutral mastery-achieved presentation:
  `🏆 KEY P OFFICIALLY MASTERED!`
  *"3 consecutive qualifying sessions verified (≤ 3.0% error rate and ≥ 30 target opportunities). Key P graduated to Mastered status."*
  Standard session XP (Base XP × Accuracy Multiplier × Daily Diminishing Returns Tier) and practice time are awarded normally. Milestone bonuses remain strictly governed by D5 rules (First-time lesson completion +25 XP, 3-star +15 XP, Module capstone +150 XP, Daily goal +150 XP) and specific one-time achievements stored in `user_reward_ledger` (e.g. "Precision Repair" for the *first* mastered key), preventing duplicate or unearned milestone awards on subsequent keys, retakes, or regression.
- **Rationale:** Protects XP economy integrity and avoids duplicate milestone grants.
- **Status:** **Product Owner Approved & Reconciled (Stage 4)**.
