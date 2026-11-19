# PEDAGOGICAL CALCULATION & PROGRESSION ENGINE (D5)
**Typing Trainer — Windows Desktop Application**
*Module: Learning Engine & Educational Metrics*
*Document Version: 1.3.0 | Stage: D5 Final Documentation Closure & Approval*
*Date: 2026-11-17 | Status: PRODUCT OWNER APPROVED (FINAL)*

---

## 1. Executive Summary & Engine Principles

The Touch-Typing Learning Engine operates on the core educational principle that **accuracy precedes speed**. In motor skill acquisition, attempting to type rapidly before neural pathways are established reinforces erroneous reach patterns.

To ensure students build clean, unshakeable muscle memory, all lesson progression, star evaluations, module unlock gates, and gamification rewards are governed by deterministic mathematical thresholds and idempotent database transactions.

---

## 2. Exhaustive Star-Rating Decision Table

Every completed lesson and module assessment is evaluated against strict speed and accuracy gates. To guarantee zero undefined outcomes, the decision table below maps every possible permutation of Accuracy and Speed for both **Standard Lessons** (Lessons 01–07, 09–15, 17–23, 25–31) and **Module Capstone Assessments** (Lessons 08, 16, 24, 32):

```
+-------------------------------------------------------------------------------------------------------------------------------+
|                                      EXHAUSTIVE STAR-RATING DECISION TABLE                                                    |
+--------------------+-----------------------+--------------------+-------+---------------+-------------+-----------+-----------+
| Context            | Accuracy Range        | Speed Condition    | Stars | Lesson Status | Next Lesson | Module    | Next Mod  |
|                    |                       |                    |       |               | Unlocked?   | Mastered? | Unlocked? |
+--------------------+-----------------------+--------------------+-------+---------------+-------------+-----------+-----------+
| **Standard Lesson**| Accuracy ≥ 98.0%      | Speed ≥ WPM_target | ⭐⭐⭐| PASSED (3-Star)| YES         | N/A       | N/A       |
| **Standard Lesson**| Accuracy ≥ 98.0%      | Speed < WPM_target | ⭐⭐☆| PASSED (2-Star)| YES         | N/A       | N/A       |
| **Standard Lesson**| 95.0% ≤ Acc < 98.0%   | Speed ≥ WPM_target | ⭐⭐☆| PASSED (2-Star)| YES         | N/A       | N/A       |
| **Standard Lesson**| 95.0% ≤ Acc < 98.0%   | Speed < WPM_target | ⭐☆☆ | PASSED (1-Star)| YES         | N/A       | N/A       |
| **Standard Lesson**| 90.0% ≤ Acc < 95.0%   | Speed ≥ WPM_target | ⭐☆☆ | PASSED (1-Star)| YES         | N/A       | N/A       |
| **Standard Lesson**| 90.0% ≤ Acc < 95.0%   | Speed < WPM_target | ⭐☆☆ | PASSED (1-Star)| YES         | N/A       | N/A       |
| **Standard Lesson**| Accuracy < 90.0%      | Any Speed          | ☆☆☆  | INCOMPLETE    | NO (Repeat) | N/A       | N/A       |
+--------------------+-----------------------+--------------------+-------+---------------+-------------+-----------+-----------+
| **Capstone Exam**  | Accuracy ≥ 98.0%      | Speed ≥ WPM_target | ⭐⭐⭐| PASSED (3-Star)| N/A (Final) | MASTERED  | **YES**   |
| **Capstone Exam**  | Accuracy ≥ 98.0%      | Speed < WPM_target | ⭐⭐☆| INCOMPLETE*   | N/A (Final) | NO        | **NO**    |
| **Capstone Exam**  | 95.0% ≤ Acc < 98.0%   | Speed ≥ WPM_target | ⭐⭐☆| PASSED (2-Star)| N/A (Final) | MASTERED  | **YES**   |
| **Capstone Exam**  | 95.0% ≤ Acc < 98.0%   | Speed < WPM_target | ⭐☆☆ | INCOMPLETE*   | N/A (Final) | NO        | **NO**    |
| **Capstone Exam**  | 90.0% ≤ Acc < 95.0%   | Speed ≥ WPM_target | ⭐☆☆ | INCOMPLETE*   | N/A (Final) | NO        | **NO**    |
| **Capstone Exam**  | 90.0% ≤ Acc < 95.0%   | Speed < WPM_target | ⭐☆☆ | INCOMPLETE*   | N/A (Final) | NO        | **NO**    |
| **Capstone Exam**  | Accuracy < 90.0%      | Any Speed          | ☆☆☆  | INCOMPLETE    | N/A (Final) | NO        | **NO**    |
+--------------------+-----------------------+--------------------+-------+---------------+-------------+-----------+-----------+
```

*\*Note on Capstone Exam Incomplete State:* In standard lessons, achieving 1 Star ($\ge 90\%$ accuracy) allows the user to advance to the next sequential lesson. However, for a **Module Capstone Assessment**, achieving 1 Star or failing the speed target does **NOT** grant Module Mastery and does **NOT** unlock the next module. The student must achieve **at least 2 Stars ($\ge 95.0\%$ Accuracy AND Speed $\ge WPM_{target}$)** to unlock the next module.

### 2.1 Baseline Speed Targets per Module
- **Module 1 (Home Row):** $WPM_{target} = \mathbf{20.0\text{ WPM}}$
- **Module 2 (Upper Row):** $WPM_{target} = \mathbf{30.0\text{ WPM}}$
- **Module 3 (Bottom Row):** $WPM_{target} = \mathbf{40.0\text{ WPM}}$
- **Module 4 (Numbers & Advanced):** $WPM_{target} = \mathbf{50.0\text{ WPM}}$

---

## 3. D4 Typing Engine Compatibility & Keystroke Accounting

Learning Mode strictly reuses the **D4 typing calculation specification** without divergent calculation forks:

1. **Character Input Events ($N_{total}$):**
   - Every printable keypress (letters, numbers, punctuation, spaces) generates exactly **1 character attempt**.
   - $$N_{total} = N_{correct} + N_{incorrect}$$
2. **Backspace Accounting in Learning Mode:**
   - Pressing `Backspace` does **NOT** increment $N_{total}$ and does **NOT** add keystrokes to WPM.
   - Unlike speed tests (which enforce word-locking), **Learning Mode permits multi-word backspacing**.
   - Correcting a mistake converts an *Uncorrected Error* into a *Corrected Mistake*, preventing the 5-stroke word penalty on Net WPM.
   - However, the initial mistake remains permanently logged in $N_{incorrect}$ and in key diagnostics, correctly reducing the lesson's Accuracy percentage.
3. **WPM Formulations (Standard 5-Keystroke Word):**
   - $$GrossWPM = \frac{N_{total} / 5}{t_{elapsed}}$$
   - $$NetWPM = \max\left(0, \frac{(N_{total} / 5) - E_{uncorrected}}{t_{elapsed}}\right)$$
4. **Accuracy Percentage:**
   - $$Accuracy\% = \left(\frac{N_{correct}}{N_{total}}\right) \times 100$$
5. **Pause & Resume Handling:**
   - High-resolution monotonic timer (`performance.now()`). Paused intervals $\sum T_{paused}$ are strictly excluded. The 3-second unpause countdown is frozen and incurs zero time penalty.

---

## 4. Reconciled XP & Reward Architecture (D3 Alignment)

Learning Mode rewards are fully reconciled with the approved D3 gamification model (`D3_REVIEW_RESOLUTION.md` Finding 3 and `DASHBOARD_WIDGET_SPECIFICATIONS.md` Section 9.1).

### 4.1 Master Reward Formula & Complete Calculation Order

Every completed drill calculates deterministic Base Effort XP, scales it by an Accuracy Multiplier, and adds any eligible one-time milestone bonuses:

$$\mathbf{XP_{session} = XP_{adjusted\_base} + Bonus_{firstTime} + Bonus_{3Star} + Bonus_{module}}$$
*(If today's daily goal is reached during the session, the independent $+150\text{ XP}$ Daily Goal Bonus is awarded concurrently).*

#### Step-by-Step Calculation Order & Rounding Rules

1. **Step 1: Calculate Raw Base Effort XP ($XP_{base}$)**
   - Rewards genuine physical effort based on words typed and active duration:
     $$XP_{base} = \text{round}(WordsTyped \times 0.2) + \text{round}\left(\frac{ActiveSeconds}{60} \times 5\right)$$
   - *WordsTyped* is calculated using the universal D4 standard: $\text{Correct Characters} / 5$.
   - Rounding rule: Standard half-up integer rounding applied to each component before summing.

2. **Step 2: Apply Accuracy Multiplier ($Multiplier_{accuracy}$)**
   - Retrieved directly from approved D3 specifications (`D3_REVIEW_RESOLUTION.md` Finding 3):
     - $\ge 98.0\%$: **$1.50\times$** (+50% High Precision Mastery)
     - $95.0\% - 97.9\%$: **$1.20\times$** (+20% Touch-Typing Target Competence)
     - $90.0\% - 94.9\%$: **$1.00\times$** (Standard Baseline Effort)
     - $80.0\% - 89.9\%$: **$0.75\times$** (Beginner Effort Preserved; No Zero-Credit)
     - $< 80.0\%$: **$0.50\times$** (Foundational Effort Floor)
   - **Scope of Multiplier:** The Accuracy Multiplier applies **strictly to Base XP only**:
     $$XP_{adjusted\_base} = \text{round}(XP_{base} \times Multiplier_{accuracy})$$
   - *Multipliers NEVER scale milestone bonuses or daily goal bonuses.*

3. **Step 3: Evaluate One-Time Milestone Bonuses (Flat Additive)**
   - **First-Time Lesson Completion Bonus ($Bonus_{firstTime}$):** **$+25\text{ XP}$**  
     *Eligibility:* Awarded strictly on the user's first passing attempt with $\ge 1\text{ Star}$ ($\ge 90.0\%$ accuracy). Once earned for a lesson ID, it is permanently locked in `user_reward_ledger` and is never awarded again on retakes.
   - **Three-Star Mastery Bonus ($Bonus_{3Star}$):** **$+15\text{ XP}$**  
     *Eligibility:* Awarded strictly on the first attempt achieving 3 Stars ($\ge 98.0\%$ accuracy and target WPM met), whether on the initial pass or during a subsequent retake. Awarded once per lesson ID.
   - **Module Capstone Mastery Bonus ($Bonus_{module}$):** **$+150\text{ XP}$**  
     *Eligibility:* Awarded strictly on the first attempt passing a Module Capstone Assessment (Lessons 08, 16, 24, 32) with $\ge 2\text{ Stars}$ ($\ge 95.0\%$ accuracy and module speed target met). Awarded once per module.

4. **Step 4: Independent Daily Goal Completion Bonus ($Bonus_{dailyGoal}$)**
   - **Daily Goal Bonus:** **$+150\text{ XP}$** (approved D3 value).
   - *Eligibility:* Handled independently by the daily streak engine. Awarded strictly once per calendar day when the user's cumulative active practice time reaches their configured daily goal (e.g., 20 minutes).

5. **Step 5: Final Session XP Summation**
   $$XP_{total} = XP_{adjusted\_base} + Bonus_{firstTime} + Bonus_{3Star} + Bonus_{module} (+ Bonus_{dailyGoal}\text{ if triggered})$$

---

### 4.2 Retake Reward & Anti-Exploit Policy

#### Formula-Derived Base XP Rate vs. Typing Cadence
In an offline-first learning application, students frequently retake lessons to build muscle memory. Because Base XP is tied directly to active practice time and words typed, the relationship between typing speed (WPM) and base XP generation is mathematically derived from the base formula ($XP_{base} = \text{round}(WordsTyped \times 0.2) + \text{round}(MinutesTyped \times 5)$):

$$\mathbf{\text{Base XP per minute} \approx 5 + (0.2 \times \text{WPM})}, \quad \text{before rounding and accuracy multipliers.}$$

- **At 20 WPM:** $5 + (0.2 \times 20) = 5 + 4 = \mathbf{9.0\text{ Base XP/min}}$ ($10.8\text{ XP/min}$ at $1.20\times$; $13.5\text{ XP/min}$ at $1.50\times$).
- **At 30 WPM:** $5 + (0.2 \times 30) = 5 + 6 = \mathbf{11.0\text{ Base XP/min}}$ ($13.2\text{ XP/min}$ at $1.20\times$; $16.5\text{ XP/min}$ at $1.50\times$).
- **At 40 WPM:** $5 + (0.2 \times 40) = 5 + 8 = \mathbf{13.0\text{ Base XP/min}}$ ($15.6\text{ XP/min}$ at $1.20\times$; $19.5\text{ XP/min}$ at $1.50\times$).
- **At 50 WPM:** $5 + (0.2 \times 50) = 5 + 10 = \mathbf{15.0\text{ Base XP/min}}$ ($18.0\text{ XP/min}$ at $1.20\times$; $22.5\text{ XP/min}$ at $1.50\times$).
- **At 100 WPM:** $5 + (0.2 \times 100) = 5 + 20 = \mathbf{25.0\text{ Base XP/min}}$ ($30.0\text{ XP/min}$ at $1.20\times$; $37.5\text{ XP/min}$ at $1.50\times$).

This formula-derived relationship proves that Base XP generation is physically bounded by typing cadence and time. Milestone bonuses (+25 XP, +15 XP, +150 XP) remain strictly one-time grants protected by unique database constraints.

#### Approved Retake Anti-Exploit Policy (Option A: Daily Diminishing Returns)
The Product Owner has explicitly approved **Option A: Daily Diminishing Returns** to prevent automated macro-botting or rapid short-drill spamming:

1. **Minimum Session Quality Gate:**
   - Any completed drill session with $< 30\text{ seconds}$ of active practice time OR $< 20\text{ words}$ typed awards **$0\text{ XP}$**.
   - This prevents rapid click-and-abort farming scripts.

2. **Same-Lesson Daily Soft Cap (Option A Implementation):**
   - **Scope:** Evaluated per lesson ID per calendar day.
   - **Initial Attempt Inclusion:** **Attempt 1 includes the initial lesson attempt on that calendar day.** The daily counter begins on the very first completion of that lesson ID today (it does *not* begin only after the first completion).
   - **Diminishing Returns Schedule:**
     - **Attempts 1–3 of the lesson ID:** **$100\%$** of earned $XP_{adjusted\_base}$.
     - **Attempts 4–5 of the lesson ID:** **$50\%$** of earned $XP_{adjusted\_base}$ ($\text{round}(XP_{adjusted\_base} \times 0.5)$).
     - **Attempts 6 onwards:** **$0\text{ XP}$**.
   - **100% Preservation of Practice Time & Daily Goal:**  
     Active practice time (seconds) and words typed from *all* legitimate attempts (including attempts 6+) continue contributing **$100\%$ of active practice time toward daily practice goals, streak eligibility, and diagnostic statistics**. The diminishing-return policy affects base XP only.
   - **Milestone Rewards Protected:**  
     Milestone rewards (+25 XP first-time, +15 XP 3-star, +150 XP module capstone) remain independent one-time grants protected by the unique reward ledger (`user_reward_ledger`).
   - **Curriculum Diversity Reset:**  
     Switching to a different lesson ID immediately accesses that distinct lesson's independent daily attempt counter.

3. **Product Owner Governance Status:**  
   Option A is **APPROVED & FINALIZED**. No outstanding policy decisions remain.

---

## 5. Five Recalculated Worked Examples

### Example 1: First-Time Standard Lesson Pass (2 Stars)
- **Context:** Student completes Lesson 02 (Left Hand A-S-D-F) for the first time.
- **Telemetry:** Duration: $180\text{ s}$ ($3.0\text{ min}$); Words: $60\text{ words}$ ($300\text{ chars}$); Accuracy: $96.5\%$; Speed: $22\text{ WPM}$ (Target: $20\text{ WPM}$).
- **Outcome:** Stars: `⭐⭐☆` (2 Stars, Passed).
- **Calculations:**
  1. $XP_{base} = \text{round}(60 \times 0.2) + \text{round}(3.0 \times 5) = 12 + 15 = 27\text{ XP}$.
  2. Accuracy Multiplier: $96.5\% \rightarrow 1.20\times$.  
     $XP_{adjusted\_base} = \text{round}(27 \times 1.20) = \text{round}(32.4) = 32\text{ XP}$.
  3. First-Time Completion Bonus: $+25\text{ XP}$ (newly unlocked).
  4. 3-Star Bonus: $0\text{ XP}$ (earned 2 stars).
  5. Module Bonus: $0\text{ XP}$ (standard lesson).
- **Total Awarded:** $32 + 25 = \mathbf{57\text{ XP}}$.

---

### Example 2: First-Time Standard Lesson Pass (3 Stars)
- **Context:** Student completes Lesson 09 (Reaching for E & I) for the first time with exceptional form.
- **Telemetry:** Duration: $240\text{ s}$ ($4.0\text{ min}$); Words: $120\text{ words}$; Accuracy: $98.8\%$; Speed: $34\text{ WPM}$ (Target: $30\text{ WPM}$).
- **Outcome:** Stars: `⭐⭐⭐` (3 Stars, Flawless).
- **Calculations:**
  1. $XP_{base} = \text{round}(120 \times 0.2) + \text{round}(4.0 \times 5) = 24 + 20 = 44\text{ XP}$.
  2. Accuracy Multiplier: $98.8\% \rightarrow 1.50\times$.  
     $XP_{adjusted\_base} = \text{round}(44 \times 1.50) = 66\text{ XP}$.
  3. First-Time Completion Bonus: $+25\text{ XP}$ (newly unlocked).
  4. 3-Star Bonus: $+15\text{ XP}$ (newly unlocked).
  5. Module Bonus: $0\text{ XP}$ (standard lesson).
- **Total Awarded:** $66 + 25 + 15 = \mathbf{106\text{ XP}}$.

---

### Example 3: Retake of an Already 2-Starred Lesson Upgrading to 3 Stars
- **Context:** Student retakes Lesson 02 (which previously earned 2 stars and $+25\text{ XP}$) to earn the 3rd star.
- **Telemetry:** Duration: $120\text{ s}$ ($2.0\text{ min}$); Words: $50\text{ words}$; Accuracy: $99.0\%$; Speed: $25\text{ WPM}$.
- **Outcome:** Stars: `⭐⭐⭐` (Upgraded from 2 to 3 stars; attempt 1 of the day for Lesson 02).
- **Calculations:**
  1. $XP_{base} = \text{round}(50 \times 0.2) + \text{round}(2.0 \times 5) = 10 + 10 = 20\text{ XP}$.
  2. Accuracy Multiplier: $99.0\% \rightarrow 1.50\times$.  
     $XP_{adjusted\_base} = \text{round}(20 \times 1.50) = 30\text{ XP}$.
  3. First-Time Completion Bonus: **$0\text{ XP}$** (already claimed on initial completion).
  4. 3-Star Upgrade Bonus: **$+15\text{ XP}$** (newly achieved).
  5. Module Bonus: $0\text{ XP}$.
- **Total Awarded:** $30 + 15 = \mathbf{45\text{ XP}}$.

---

### Example 4: Retake of an Already 3-Starred Lesson (Maintenance Drill)
- **Context:** Student practices Lesson 09 again for routine warm-up (attempt 2 of the day for Lesson 09).
- **Telemetry:** Duration: $180\text{ s}$ ($3.0\text{ min}$); Words: $90\text{ words}$; Accuracy: $98.2\%$; Speed: $32\text{ WPM}$.
- **Outcome:** Stars: `⭐⭐⭐` (Maintained existing 3 stars).
- **Calculations:**
  1. $XP_{base} = \text{round}(90 \times 0.2) + \text{round}(3.0 \times 5) = 18 + 15 = 33\text{ XP}$.
  2. Accuracy Multiplier: $98.2\% \rightarrow 1.50\times$.  
     $XP_{adjusted\_base} = \text{round}(33 \times 1.50) = \text{round}(49.5) = 50\text{ XP}$.
  3. First-Time Bonus: **$0\text{ XP}$** (previously claimed).
  4. 3-Star Bonus: **$0\text{ XP}$** (previously claimed).
  5. Module Bonus: $0\text{ XP}$.
- **Total Awarded:** $\mathbf{50\text{ XP}}$ (Effort rewarded; zero duplicate milestone bonuses).

---

### Example 5: Module Capstone Passed + Daily Practice Goal Reached
- **Context:** Student passes Module 2 Capstone Assessment (Lesson 16) with 3 stars. The 5.0 minutes typed pushes their cumulative daily practice from 17.0 minutes to 22.0 minutes (crossing their 20-minute daily goal).
- **Telemetry:** Duration: $300\text{ s}$ ($5.0\text{ min}$); Words: $160\text{ words}$; Accuracy: $98.4\%$; Speed: $34\text{ WPM}$ (Target: $30\text{ WPM}$).
- **Outcome:** Stars: `⭐⭐⭐`; Module 2 Mastered; Module 3 Unlocked.
- **Calculations:**
  1. $XP_{base} = \text{round}(160 \times 0.2) + \text{round}(5.0 \times 5) = 32 + 25 = 57\text{ XP}$.
  2. Accuracy Multiplier: $98.4\% \rightarrow 1.50\times$.  
     $XP_{adjusted\_base} = \text{round}(57 \times 1.50) = \text{round}(85.5) = 86\text{ XP}$.
  3. First-Time Capstone Lesson Bonus: $+25\text{ XP}$.
  4. 3-Star Mastery Bonus: $+15\text{ XP}$.
  5. Module Mastery Certification Bonus: **$+150\text{ XP}$**.
  6. Independent Daily Goal Reached Bonus (approved D3 value): **$+150\text{ XP}$**.
- **Total Awarded for Session:** $86 + 25 + 15 + 150 + 150 = \mathbf{426\text{ XP}}$.

---

## 6. Persistence & Idempotency Architecture

To prevent duplicate rewards or lost progress, the local SQLite database utilizes an explicit relational audit model:

```sql
-- 1. Lesson Progress Summary Table (One record per lesson per user)
CREATE TABLE lesson_progress (
    lesson_id VARCHAR(32) PRIMARY KEY,
    status VARCHAR(16) NOT NULL, -- 'LOCKED', 'UNLOCKED', 'COMPLETED'
    highest_stars INTEGER NOT NULL DEFAULT 0, -- 0 to 3
    best_wpm REAL NOT NULL DEFAULT 0.0,
    best_accuracy REAL NOT NULL DEFAULT 0.0,
    first_completed_at TIMESTAMP,
    first_completion_rewarded BOOLEAN NOT NULL DEFAULT 0,
    three_star_rewarded BOOLEAN NOT NULL DEFAULT 0,
    module_mastery_rewarded BOOLEAN NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL
);

-- 2. Lesson Attempt Audit Log (Append-only record of every attempt)
CREATE TABLE lesson_attempts (
    attempt_id VARCHAR(36) PRIMARY KEY, -- Immutable UUID
    session_id VARCHAR(36) NOT NULL,    -- Compatible with D3 sessions
    lesson_id VARCHAR(32) NOT NULL,
    stars_earned INTEGER NOT NULL,
    net_wpm REAL NOT NULL,
    gross_wpm REAL NOT NULL,
    accuracy REAL NOT NULL,
    elapsed_seconds REAL NOT NULL,
    words_typed INTEGER NOT NULL,
    base_xp_earned INTEGER NOT NULL,
    bonus_xp_earned INTEGER NOT NULL,
    completed_at TIMESTAMP NOT NULL
);

-- 3. User Reward Ledger (Immutable ledger preventing duplicate XP events)
CREATE TABLE user_reward_ledger (
    reward_event_id VARCHAR(64) PRIMARY KEY, -- Deterministic Hash/UUID
    attempt_id VARCHAR(36) NOT NULL,
    reward_type VARCHAR(32) NOT NULL,        -- 'BASE_EFFORT', 'FIRST_COMPLETION', 'THREE_STAR', 'MODULE_MASTERY'
    xp_amount INTEGER NOT NULL,
    awarded_at TIMESTAMP NOT NULL
);
```

### 6.1 Atomic Transaction & Crash Recovery
1. **Atomic SQLite Commit:** When a lesson finishes, all updates (`lesson_attempts`, `lesson_progress`, `user_reward_ledger`, `daily_streak`) execute within a single atomic transaction (`BEGIN TRANSACTION ... COMMIT`).
2. **Duplicate Submission Protection:** If a client retries submitting an already processed `attempt_id`, the SQLite unique constraint rejects the write; the service returns HTTP 200 with `duplicate: true`, returning the existing record with 0 additional XP.
3. **Crash Recovery Guarantee:** In-flight keystrokes live in-memory. If an OS crash occurs mid-drill, uncommitted strokes are discarded. If a completed payload cannot reach SQLite due to a temporary OS file lock (`SQLITE_BUSY`), it is stored in the webview's **IndexedDB offline queue** and flushed automatically on the next launch.

---

## 7. Verification Status Taxonomy

To maintain strict governance between design specifications and actual desktop runtime capabilities, all specifications in this document are categorized into three explicit verification states:

| Category | Scope | Verification Status | Governance Owner |
|---|---|---|---|
| **Design Specification** | 32-lesson curriculum roadmap, UI cards, lesson briefings, 5 exercise stages, mastery scorecards, and gating policies. | **VERIFIED** | Antigravity Design Phase (Approved) |
| **Mathematical Calculation** | Base XP formula, D3 accuracy multipliers, additive milestone bonuses, rounding order, and 5 worked examples. | **VERIFIED** | Antigravity Design Phase (Approved) |
| **Runtime Implementation Behavior** | SQLite ACID transaction locking, IndexedDB offline retry sync, and Tauri/Rust IPC bridge performance. | **AWAITING CLAUDE CODE IMPLEMENTATION & TESTING** | Implementation Phase (Claude Code) |

