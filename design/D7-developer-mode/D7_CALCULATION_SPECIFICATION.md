# D7 CALCULATION SPECIFICATION: DEVELOPER MODE
**Typing Trainer — Windows Desktop Application**
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 2 UX Architecture & Functional Specifications*
*Document Version: 1.0.0 | Date: 2026-11-18 | Status: COMPLETE & READY FOR REVIEW*

---

## 1. Executive Summary

This specification establishes the mathematical formulas, rounding orders, event-accounting models, and metric derivations for **Developer Mode (Module 06)**.

All typing speed calculations adhere strictly to the approved **D4 Net WPM** baseline, all XP calculations adhere to the approved **D5 Option A Diminishing Returns** model, and all keystroke diagnostics feed directly into the **D6 Weak-Key Remediation** formulas.

---

## 2. Master Mathematical Formulation

### 2.1 Standard Speed & Accuracy Formulas (D4 Reconciliation)

In strict accordance with the approved **D4 Typing Engine Specification**, all speed, accuracy, and error metrics reuse the standardized touch-typing formulations without introducing conflicting "Code WPM" definitions:

#### 1. The Standardized 5-Character "Word"
$$\mathbf{1\text{ Word} \equiv 5\text{ Keystrokes}}$$
- Standard touch-typing equivalence applies equally across code syntax: letters, numbers, punctuation symbols, spaces, and newlines.

#### 2. Gross Words Per Minute ($WPM_{gross}$)
$$\mathbf{WPM_{gross} = \frac{N_{total} / 5}{t_{elapsed}} = \frac{N_{total} / 5}{\text{Elapsed Seconds} / 60.0}}$$
- Evaluates total physical character input attempts actuated by the user ($N_{total} = N_{correct} + N_{incorrect}$).
- Backspaces, modifier keys (`Shift`, `Ctrl`, `Alt`), and automatically inserted indentation spaces are **strictly excluded** from $N_{total}$.
- Unit: Words Per Minute (`WPM`). Internal type: `float64`. Live HUD display: rounded to nearest integer. Results breakdown: 2 decimal places.

#### 3. Net Words Per Minute ($WPM_{net}$) (Approved D7-OD-04 & D4 Standard)
$$\mathbf{WPM_{net} = \max\left(0, \frac{(N_{total} / 5) - E_{uncorrected}}{t_{elapsed}}\right)}$$
- Where:
  - $N_{total}$: Total attempted character inputs.
  - $E_{uncorrected}$: Count of character positions left in an incorrect state in the submitted text at session completion.
  - $t_{elapsed}$: Active typing duration in fractional minutes ($\text{Elapsed Seconds} / 60.0$).
- **The Error Penalty:** Each uncorrected error deducts **1 full standardized word (5 keystrokes)** from gross words before dividing by elapsed minutes: $\text{Penalty in WPM} = \frac{E_{uncorrected}}{t_{elapsed}}$. (For a 1.0-minute session, this equals a $-1.00\text{ WPM}$ deduction; for a 2.0-minute session, it equals $-0.50\text{ WPM}$; for a 30-second session, it equals $-2.00\text{ WPM}$).
- **Corrected Mistakes Benefit:** Correcting a mistake with `Backspace` ensures $E_{uncorrected}$ is not incremented; corrected mistakes incur **zero Net WPM word penalty**.
- **The Zero-Floor Rule:** Net WPM cannot be negative; floored strictly at $\mathbf{0.00\text{ WPM}}$.
- Display format: Rounded to nearest integer on Live HUD and Results Hero; stored to 2 decimal places in SQLite.

#### 4. Overall Accuracy ($Acc_{overall}$)
$$\mathbf{Acc_{overall} = \left(\frac{N_{correct}}{N_{total}}\right) \times 100\% = \left(\frac{N_{correct}}{N_{correct} + N_{incorrect}}\right) \times 100\%}$$
- Safe division guard: If $N_{total} == 0$, $Acc_{overall} \equiv 0.0\%$ (displayed as `N/A`).
- Display format: 1 decimal place on Live HUD (`98.4%`), 2 decimal places in SQLite (`98.42`).

#### 5. Consistency Percentage (Cadence Stability)
$$\mathbf{Consistency\% = \max\left(0, \min\left(100, \text{round}\left(100 - (CV \times 100)\right)\right)\right)}$$
- Where $CV = \frac{\sigma_{filtered}}{\mu_{filtered}}$ is the Coefficient of Variation of inter-keystroke intervals (IKIs).
- **Minimum Sample Gate:** Requires at least 10 valid intervals ($N_{IKI} \ge 10$); otherwise displays `"N/A"` (`insufficient_samples: true`).
- **Exclusions:** Pause intervals ($IKI$ across pause/unpause) and extreme outliers ($IKI > 2000\text{ms}$ or $> 3 \times \text{median}$) are excluded.

---

### 2.2 Specialized Developer Telemetry Formulas

#### 6. Symbol-Specific Accuracy ($Acc_{sym}$)
Measures accuracy exclusively on programming punctuation (`{}[]()<>;:,.'"/\\!@#$%^&*+-=|~?`):
$$\mathbf{Acc_{sym} = \left(\frac{\text{Correct Symbol Attempts}}{\text{Total Attempted Symbol Keystrokes}}\right) \times 100\%}$$
- Safe division guard: If total symbol attempts $< 20$, displays with `"Insufficient Data (< 20 strokes)"` warning flag.

#### 7. Keyword Velocity ($WPM_{kw}$) vs. Identifier Velocity ($WPM_{id}$)
$$\mathbf{WPM_{kw} = \frac{\text{Chars in Reserved Language Keywords} / 5}{\text{Time Spent Typing Keywords (min)}}}$$
$$\mathbf{WPM_{id} = \frac{\text{Chars in Custom Identifiers} / 5}{\text{Time Spent Typing Identifiers (min)}}}$$

#### 8. Indentation Accuracy ($Acc_{indent}$)
*(Active only when Full Manual Indentation is enabled)*:
$$\mathbf{Acc_{indent} = \left(\frac{\text{Correct Indentation Space Keystrokes}}{\text{Total Attempted Indentation Keystrokes}}\right) \times 100\%}$$

#### 9. Symbol Hesitation Latency Delta ($\Delta t_{sym}$)
$$\mathbf{\Delta t_{sym} = \overline{IKI}_{sym} - \overline{IKI}_{global}}$$
- Reported strictly in descriptive milliseconds.

#### 10. Seven-Dimension Indentation Impact Matrix
To ensure mathematical consistency across engine calculations, all indentation categories are evaluated as follows:

| Metric / Dimension | 1. Expected Indentation | 2. Automatically Inserted Indentation (Mode 2) | 3. Manually Typed Indentation (Mode 1) |
|---|---|---|---|
| **WPM ($WPM_{gross}$, $WPM_{net}$)** | Baseline reference only; 0 keystrokes. | **100% EXCLUDED.** 0 attempts added to $N_{total}$. Zero artificial inflation. | **100% INCLUDED.** Struck spaces increment $N_{total}$ and contribute to WPM. |
| **Overall Accuracy ($Acc_{overall}$)** | Baseline target only. | **100% EXCLUDED.** Cannot increment $N_{correct}$ or $N_{incorrect}$. | **100% INCLUDED.** Correct spaces add to $N_{correct}$; miskeys add to $N_{incorrect}$. |
| **Symbol Accuracy ($Acc_{sym}$)** | N/A (whitespace is not punctuation). | **100% EXCLUDED.** Isolated from symbol categorization. | **100% EXCLUDED.** Categorized under whitespace, not symbol accuracy. |
| **Indentation Accuracy ($Acc_{indent}$)** | Expected spaces target. | **EXCLUDED (N/A).** Bypassed in Smart Auto-Advance mode. | **PRIMARY METRIC.** Calculated as $(N_{correct\_spaces} / N_{attempted\_spaces}) \times 100\%$. |
| **D6 Per-Key Telemetry** | N/A. | **ZERO EVENTS.** 0 records emitted to `key_telemetry_window`. | **FULL STREAMING.** Emits keystroke records for space key (`' '`). |
| **Error Attribution** | N/A. | **ZERO ERRORS.** User cannot miskey automated whitespace. | **ATTRIBUTED TO INDENT ERRORS.** Logged under scorecard and spacebar confusion matrix. |
| **Weak-Key Recommendations** | N/A. | **ZERO IMPACT.** Never triggers weak-symbol remediation drills. | **ACTIVE FOR SPACEBAR.** High error rates on spaces can trigger spacebar rhythm drills. |

---

### 2.3 Code Complexity Score ($CCS$)
$$\mathbf{CCS = (D_{sym} \times 0.35) + (N_{max} \times 0.25) + (R_{case} \times 0.20) + (L_{avg} \times 0.20)}$$
- Output: Float between `1.0` and `10.0`, rounded to 1 decimal place.

---

### 2.4 Gamification & XP Allocation Order (D5/D6 Reconciliation)
$$\mathbf{Words = \text{round}(\text{Correct Characters} / 5)}$$
$$\mathbf{Minutes = \text{Elapsed Seconds} / 60.0}$$
$$\mathbf{XP_{base} = \text{round}(Words \times 0.2) + \text{round}(Minutes \times 5)}$$
$$\mathbf{XP_{adjusted\_base} = \text{round}(XP_{base} \times AccuracyMultiplier)}$$
$$\mathbf{XP_{session} = \text{round}(XP_{adjusted\_base} \times RetakeTier)}$$

- **Accuracy Multiplier:**
  - $\ge 98.0\%$: $1.50\times$ (+50%)
  - $95.0–97.9\%$: $1.20\times$ (+20%)
  - $90.0–94.9\%$: $1.00\times$ (Par)
  - $85.0–89.9\%$: $0.75\times$ (-25%)
  - $< 85.0\%$: $0.50\times$ (-50%)
- **Option A Retake Tier (Scope: Snippet ID per calendar day):**
  - Attempts 1–3: $1.00\times$ (100% Base XP; Attempt 1 is initial attempt).
  - Attempts 4–5: $0.50\times$ (50% Base XP).
  - Attempts 6+: $0.00\times$ (0% Base XP).
- **Daily Goals:** 100% of physical active practice minutes accumulate toward daily practice goals regardless of tier.

---

### 2.5 Deterministic Custom-File Pagination Algorithm & Boundary Invariants (Correction A)

For custom code imported in `SCR-604`, file partitioning adheres strictly to the approved Product Owner decision (`D7-NU-02 Option A`) and mathematical boundary constraints:

#### 1. Mathematical Partitioning Rules
- **Short-File Exemption:** If normalized source line count $N \le 30$, the snippet remains a single exercise ($K = 1$, lines $1 \dots N$).
- **Partition Count ($K$):** If $N > 30$, the file is partitioned into $K$ sequential exercises:
  $$\mathbf{K = \left\lceil \frac{N}{20} \right\rceil}$$
- **Base Partition Size ($q$) & Remainder ($r$):**
  $$\mathbf{q = \left\lfloor \frac{N}{K} \right\rfloor}, \quad \mathbf{r = N \pmod K}$$
- **Line Distribution Rule:**
  - The first $r$ parts each receive $(q + 1)$ source lines.
  - The remaining $(K - r)$ parts each receive $q$ source lines.
- **Strict 20-Line Ceiling Invariant:**
  - Because $K = \lceil N / 20 \rceil \ge N / 20$, it follows that $N \le 20K$.
  - Therefore, $q = \lfloor N / K \rfloor \le 20$.
  - If $q = 20$, then $N = 20K$, meaning $r = 0$, so all parts have exactly $q = 20$ lines.
  - If $r > 0$, then $N < 20K$, meaning $q \le 19$, so $q + 1 \le 20$.
  - **Mathematical Proof of Invariant:** Under this formulation, **no part can ever exceed 20 source lines** ($\max(\text{lines per part}) \le 20$). Merging remainders into preceding parts to create parts $> 20$ lines is strictly prohibited.

#### 2. Specification Pagination Test Table (Required Verification Cases)

| Total Source Lines ($N$) | Rule Evaluation | Part Count ($K = \lceil N/20 \rceil$) | Base Size ($q$) / Remainder ($r$) | Exact Line Partitioning Breakdown | Max Lines in Any Part | Invariant Check ($\le 20$ lines) |
|:---:|---|:---:|:---:|---|:---:|:---:|
| **20** | $N \le 30 \rightarrow$ 1 part | 1 | $q=20, r=0$ | Part 1: lines 1–20 (20 lines) | 20 | PASS ($\le 20$) |
| **30** | $N \le 30 \rightarrow$ 1 part | 1 | $q=30, r=0$ | Part 1: lines 1–30 (30 lines; exemption rule) | 30 | PASS ($1–30$ rule) |
| **31** | $N > 30 \rightarrow$ $\lceil 31/20 \rceil = 2$ | 2 | $q=15, r=1$ | Part 1: lines 1–16 (16 lines)<br>Part 2: lines 17–31 (15 lines) | 16 | PASS ($\le 20$) |
| **40** | $N > 30 \rightarrow$ $\lceil 40/20 \rceil = 2$ | 2 | $q=20, r=0$ | Part 1: lines 1–20 (20 lines)<br>Part 2: lines 21–40 (20 lines) | 20 | PASS ($\le 20$) |
| **41** | $N > 30 \rightarrow$ $\lceil 41/20 \rceil = 3$ | 3 | $q=13, r=2$ | Part 1: lines 1–14 (14 lines)<br>Part 2: lines 15–28 (14 lines)<br>Part 3: lines 29–41 (13 lines) | 14 | PASS ($\le 20$) |
| **49** | $N > 30 \rightarrow$ $\lceil 49/20 \rceil = 3$ | 3 | $q=16, r=1$ | Part 1: lines 1–17 (17 lines)<br>Part 2: lines 18–33 (16 lines)<br>Part 3: lines 34–49 (16 lines) | 17 | PASS ($\le 20$; NO 29-line bug) |
| **60** | $N > 30 \rightarrow$ $\lceil 60/20 \rceil = 3$ | 3 | $q=20, r=0$ | Part 1: lines 1–20 (20 lines)<br>Part 2: lines 21–40 (20 lines)<br>Part 3: lines 41–60 (20 lines) | 20 | PASS ($\le 20$) |
| **61** | $N > 30 \rightarrow$ $\lceil 61/20 \rceil = 4$ | 4 | $q=15, r=1$ | Part 1: lines 1–16 (16 lines)<br>Part 2: lines 17–31 (15 lines)<br>Part 3: lines 32–46 (15 lines)<br>Part 4: lines 47–61 (15 lines) | 16 | PASS ($\le 20$) |
| **79** | $N > 30 \rightarrow$ $\lceil 79/20 \rceil = 4$ | 4 | $q=19, r=3$ | Part 1: lines 1–20 (20 lines)<br>Part 2: lines 21–40 (20 lines)<br>Part 3: lines 41–60 (20 lines)<br>Part 4: lines 61–79 (19 lines) | 20 | PASS ($\le 20$) |

---

## 3. Comprehensive Worked Scenarios (Reconciled with D4)

### Scenario 01: Correct Typing (Clean Benchmark, Zero Errors)
- **Parameters:** Standard 60-second JavaScript function. Duration: $t = 60.0\text{ s}$ ($t_{elapsed} = 1.00\text{ min}$). Target text: 300 printable characters (60 standardized words).
- **Keystroke Log:**
  - Correct Character Attempts ($N_{correct}$): 300
  - Incorrect Character Attempts ($N_{incorrect}$): 0
  - Total Attempted Keystrokes ($N_{total}$): $300 + 0 = 300$
  - Backspaces: 0
  - Corrected Mistakes: 0
  - Uncorrected Errors ($E_{uncorrected}$): 0
- **Calculations:**
  - $WPM_{gross} = \frac{300 / 5}{1.00} = \mathbf{60.00\text{ WPM}}$
  - $NetWPM = \max\left(0, \frac{(300 / 5) - 0}{1.00}\right) = \frac{60.00 - 0}{1.00} = \mathbf{60.00\text{ WPM}}$
  - $Acc_{overall} = \left(\frac{300}{300}\right) \times 100\% = \mathbf{100.00\%}$
  - $Consistency\% = \mathbf{86\%}$ ($N_{IKI} = 299 \ge 10$, $CV = 0.14$).
  - Gamification: $Words = 60$. $XP_{base} = \text{round}(60 \times 0.2) + \text{round}(1.0 \times 5) = 12 + 5 = 17\text{ XP}$. Multiplier ($100\%$ acc): $1.50\times \rightarrow \text{round}(17 \times 1.50) = \mathbf{26\text{ XP awarded}}$ (Attempt 1). Daily goal credit: 1.0 minute.

### Scenario 02: Corrected Errors (Mistyped Delimiter Corrected via Backspace)
- **Parameters:** 300-character snippet. Duration: $t = 60.0\text{ s}$ ($t_{elapsed} = 1.00\text{ min}$).
- **Keystroke Log:**
  - At character 150, user strikes `]` instead of `}` ($N_{incorrect} = 1$).
  - User presses `Backspace` (editing event; does not increment $N_{total}$).
  - User strikes `}` correctly ($N_{correct} = 1$).
  - User completes remaining text with no further mistakes.
  - Correct Character Attempts ($N_{correct}$): 300
  - Incorrect Character Attempts ($N_{incorrect}$): 1
  - Total Attempted Inputs ($N_{total}$): $300 + 1 = 301$
  - Backspaces: 1
  - Corrected Mistakes: 1
  - Uncorrected Errors Remaining ($E_{uncorrected}$): 0
- **Calculations:**
  - $WPM_{gross} = \frac{301 / 5}{1.00} = \mathbf{60.20\text{ WPM}}$
  - $NetWPM = \max\left(0, \frac{(301 / 5) - 0}{1.00}\right) = \mathbf{60.20\text{ WPM}}$ *(On completed text words: $(300/5)/1.0 = 60.00\text{ WPM}$; HUD displays rounded integer $\mathbf{60\text{ WPM}}$)*.
  - $Acc_{overall} = \left(\frac{300}{301}\right) \times 100\% = \mathbf{99.67\%}$
  - **D4 Reconciliation Finding:** Corrected mistakes carry **zero Net WPM error penalty** ($E_{uncorrected} = 0$). Only overall accuracy ($99.67\%$) and the physical time lost backspacing reflect the error.

### Scenario 03: Uncorrected Errors (Errors Left in Final Submitted Code)
- **Parameters:** 300-character snippet. Duration: $t = 60.0\text{ s}$ ($t_{elapsed} = 1.00\text{ min}$).
- **Keystroke Log:**
  - User strikes 5 incorrect characters during the drill and never backspaces, leaving them in the submitted text.
  - Correct Character Attempts ($N_{correct}$): 295
  - Incorrect Character Attempts ($N_{incorrect}$): 5
  - Total Attempted Inputs ($N_{total}$): $295 + 5 = 300$
  - Backspaces: 0
  - Corrected Mistakes: 0
  - Uncorrected Errors Remaining ($E_{uncorrected}$): 5
- **Calculations:**
  - $WPM_{gross} = \frac{300 / 5}{1.00} = \mathbf{60.00\text{ WPM}}$
  - $NetWPM = \max\left(0, \frac{(300 / 5) - 5}{1.00}\right) = \frac{60.00 - 5.00}{1.00} = \mathbf{55.00\text{ WPM}}$
  - $Acc_{overall} = \left(\frac{295}{300}\right) \times 100\% = \mathbf{98.33\%}$
  - **Penalty Verification:** Each uncorrected error subtracts **1 standardized word (5 keystrokes)** from gross words. In this 1.00-minute session ($t_{elapsed} = 1.00\text{ min}$), the 5 uncorrected errors impose an exact **$-5.00\text{ WPM}$ penalty** on Net WPM ($55.00$ vs $60.00$ Gross WPM), confirming $\text{Penalty} = \frac{5}{1.00} = 5.00\text{ WPM}$. (Note: In a 2.00-minute session, 5 errors would impose a $\frac{5}{2.00} = -2.50\text{ WPM}$ deduction; in a 30-second session, it would impose $\frac{5}{0.50} = -10.00\text{ WPM}$).

### Scenario 04: Backspace Across Line Boundaries (Multi-Line Backspacing)
- **Parameters:** User types Line 1 (40 characters correctly). Strikes `Enter` ($N_{correct} += 1$). Smart Auto-Advance automatically inserts 4 spaces on Line 2 (0 keystrokes counted). User types 5 characters on Line 2, then notices an uncorrected typo on Line 1. Total session duration: 72.0s ($1.20\text{ min}$).
- **Mechanics:**
  - User presses `Backspace` 5 times to erase the 5 characters on Line 2 (5 backspace operations; $N_{total}$ unmodified).
  - Cursor reaches column 4 (first non-whitespace code column on Line 2).
  - User presses `Backspace` at the line boundary:
    1. The 4-space auto-indentation block dissolves in a single atomic step.
    2. Newline boundary `\n` dissolves; camera scrolls down 40px; Line 1 restored to active editing at column 40.
  - User backspaces 4 characters on Line 1, corrects the character ($N_{incorrect} = 1, N_{correct} += 1$), and strikes `Enter` to advance back to Line 2.
- **Accounting:** Total character attempts: $N_{total} = 301$, $N_{correct} = 300$, $N_{incorrect} = 1$, $E_{uncorrected} = 0$, Backspaces: 15.
- **Calculations:**
  - $WPM_{gross} = \frac{301 / 5}{1.20} = \mathbf{50.17\text{ WPM}}$
  - $NetWPM = \max\left(0, \frac{(301 / 5) - 0}{1.20}\right) = \mathbf{50.17\text{ WPM}}$ (Target text Net: $\mathbf{50.00\text{ WPM}}$).
  - $Acc_{overall} = \left(\frac{300}{301}\right) \times 100\% = \mathbf{99.67\%}$
  - **Idempotency Proof:** Multi-line backspacing preserves error logs without duplicating opportunities or distorting WPM.

### Scenario 05: Automatically Inserted Indentation (Smart Auto-Advance Zero Distortion)
- **Parameters:** 10-line Python snippet with nested logic containing 48 total leading indentation spaces across lines 2–10. Total printable code characters = 240. Total line advance events = 9 `Enter` keys. Duration: 60.0s ($1.00\text{ min}$).
- **Strict Exclusion Verification:**
  - User types the 240 printable code characters and strikes `Enter` 9 times.
  - System automatically places the 48 indentation spaces upon each line advance.
  - Auto-inserted spaces counted in $N_{total}$: **0**.
  - Auto-inserted spaces counted in $N_{correct}$: **0**.
  - Total evaluated keystrokes: $N_{total} = 240 + 9 = \mathbf{249\text{ keystrokes}}$.
  - $N_{correct} = 249$, $N_{incorrect} = 0$, $E_{uncorrected} = 0$.
- **Calculations:**
  - $WPM_{gross} = \frac{249 / 5}{1.00} = \mathbf{49.80\text{ WPM}}$
  - $NetWPM = \frac{(249 / 5) - 0}{1.00} = \mathbf{49.80\text{ WPM}}$
  - $Acc_{overall} = \left(\frac{249}{249}\right) \times 100\% = \mathbf{100.00\%}$
  - **Anti-Inflation Proof:** If 48 auto-spaces were improperly counted, $N_{total}$ would become $297$, yielding $59.40\text{ WPM}$ (an artificial inflation of $+9.60\text{ WPM}$ or $+19.28\%$). Smart Auto-Advance guarantees **zero artificial inflation** and protects benchmark integrity.
  - D6 Telemetry: Exactly 0 events are dispatched to `key_telemetry_window` for auto-inserted spaces.

### Scenario 06: Manually Typed Indentation (Full Manual Spacebar Mode)
- **Parameters:** Same 10-line Python snippet with Full Manual Indentation enabled in `SCR-603`. Typist must physically strike the spacebar for all 48 expected indentation spaces. Total expected inputs = 48 spaces + 240 code characters + 9 newlines = 297 keystrokes. Duration: 60.0s ($1.00\text{ min}$).
- **Execution & Mistake:**
  - Typist strikes 240 code characters correctly and 9 newlines correctly.
  - On Line 4 (requires 8 spaces), typist types 7 spaces and strikes the first code character `'d'` of `def`.
  - Struck `'d'` when `' '` was expected: $N_{incorrect} += 1$ (Recorded as an `Indentation Error`).
  - Typist strikes `Backspace`, types the 8th space, then strikes `'d'`.
  - Total spacebar attempts: 49 (48 correct, 1 corrected mistake).
  - Total attempts: $N_{total} = 297 + 1 = 298$. $N_{correct} = 297$, $N_{incorrect} = 1$, $E_{uncorrected} = 0$.
- **Calculations:**
  - $WPM_{gross} = \frac{298 / 5}{1.00} = \mathbf{59.60\text{ WPM}}$
  - $NetWPM = \frac{(298 / 5) - 0}{1.00} = \mathbf{59.60\text{ WPM}}$ (Target text Net: $\mathbf{59.40\text{ WPM}}$).
  - $Acc_{overall} = \left(\frac{297}{298}\right) \times 100\% = \mathbf{99.66\%}$
  - Indentation Accuracy: $Acc_{indent} = \left(\frac{48}{49}\right) \times 100\% = \mathbf{97.96\%}$
  - Scorecard: Displays `Indentation Errors: 1 (Corrected)`.
  - Telemetry: 1 spacebar error logged to `key_telemetry_window` under `' '`.

### Scenario 07: Newline (`\n`) and Tab Handling (Event Taxonomy & Worked Calculation)
- **Parameters:** A 5-line code exercise completed cleanly by the user.
- **Physical Event Breakdown:**
  - Code Characters Typed: 100 printable code characters (letters, numbers, symbols, spaces within lines).
  - Newlines Typed: 5 `Enter` keypresses at line ends (producing `\n` in the user buffer).
  - Tabs Attempted: 3 trapped `Tab` keypresses (`e.preventDefault()`).
  - Active Typing Duration: 30.0 seconds ($0.50\text{ min}$).
- **Classification Under Authoritative D4 Event Taxonomy:**
  1. **Newline (`Enter` / `\n` - Category 1 Character Input Event):**
     - In multi-line code, the line-terminating newline character (`\n`) is an expected content character defined in the target exercise.
     - Striking `Enter` at the end of a completed line inserts `\n` into the buffer, matching the target `\n`.
     - Increments Total Attempted Character Inputs: $N_{total} += 1$.
     - Evaluated as correct: $N_{correct} += 1$.
     - Contributes to Gross WPM, Net WPM, and Overall Accuracy.
     - (If struck prematurely mid-line, it increments $N_{total} += 1$ and $N_{incorrect} += 1$ as a syntax error without advancing the line).
  2. **Tab Key Trapping (Category 3 Control / Modifier Key):**
     - Intercepted via `e.preventDefault()`.
     - Standalone presses generate **0 attempted character inputs** ($N_{total}$, $N_{correct}$, $N_{incorrect}$ unchanged).
     - Contributes **0 to WPM** and **0 to accuracy**.
     - Prevents focus loss away from the canvas and displays subtle guidance hint.
  3. **Auto-Inserted Indentation:**
     - Synthetic spaces placed automatically on `Enter` contribute **0 to $N_{total}$**, **0 to WPM**, and **0 to accuracy**.
- **Exact Calculations:**
  - $N_{total} = 100\text{ code characters} + 5\text{ newlines} = 105\text{ attempted character inputs}$.
  - $N_{correct} = 105, \quad N_{incorrect} = 0, \quad E_{uncorrected} = 0$.
  - Active Duration: $t_{elapsed} = 30.0\text{ s} / 60.0 = 0.50\text{ minutes}$.
  - $WPM_{gross} = \frac{N_{total} / 5}{t_{elapsed}} = \frac{105 / 5}{0.50} = \frac{21.00}{0.50} = \mathbf{42.00\text{ WPM}}$.
  - $WPM_{net} = \max\left(0, \frac{(105 / 5) - 0}{0.50}\right) = \mathbf{42.00\text{ WPM}}$.
  - $Acc_{overall} = \left(\frac{105}{105}\right) \times 100\% = \mathbf{100.00\%}$.
  - *Accounting Note:* If an exercise had 95 printable code characters and 5 newlines for a total of 100 character attempts over 30.0s ($0.50\text{ min}$), Gross WPM would be $\frac{100 / 5}{0.50} = \mathbf{40.00\text{ WPM}}$. Here, $100\text{ code chars} + 5\text{ newlines} = 105\text{ attempts}$, producing exactly $\mathbf{42.00\text{ WPM}}$.

### Scenario 08: Zero-Input Sessions (Immediate Abandonment or Idle Expiry)
- **Parameters:** User opens a TypeScript drill in `SCR-603`. User idles for 15 seconds without pressing any key, then strikes `Esc` and clicks `"Exit to Hub"`.
- **Physical Counts:**
  - $N_{total} = 0, N_{correct} = 0, N_{incorrect} = 0, E_{uncorrected} = 0$.
  - Active typing duration: $t_{elapsed} = 0.00\text{ min}$.
- **Guarded Calculations:**
  - $WPM_{gross} = \mathbf{0.00\text{ WPM}}$ (Safe guard: `t === 0 || N_total === 0 ? 0.0`).
  - $WPM_{net} = \mathbf{0.00\text{ WPM}}$.
  - $Acc_{overall} = \mathbf{N/A}$ (Guarded against division by zero; displayed as `0.0%` or `--%`).
  - $Consistency\% = \mathbf{N/A}$ (`insufficient_samples: true`, as $N_{IKI} = 0 < 10$).
  - $XP_{awarded} = \mathbf{0\text{ XP}}$.
- **Crash Recovery & Persistence:**
  - Session is classified as **Interrupted / Incomplete Session**.
  - In-memory event buffer is discarded.
  - Zero records written to IndexedDB `pending_session_outbox`.
  - Zero records written to SQLite `developer_sessions`.
  - Historical analytics, streaks, and personal records remain clean.

### Scenario 09: Sessions with Low Character Counts vs. D6 Weak-Key Telemetry Thresholds
- **Parameters:** User completes a short 3-line micro-drill (or a single completed line):
  - Typed: 18 characters (15 correct, 3 uncorrected errors).
  - Symbols typed: 2 symbols (`(`, `)`), both correct.
  - Duration: 12.0 seconds ($0.20\text{ min}$).
  - Total opportunities: $N_{total} = 18$.
- **General Session Metrics (Fully Calculated & Stored):**
  - General session metrics apply to the session as a whole and are valid for all completed exercises:
  - $WPM_{gross} = \frac{18 / 5}{0.20} = \frac{3.60}{0.20} = \mathbf{18.00\text{ WPM}}$.
  - $NetWPM = \max\left(0, \frac{(18 / 5) - 3}{0.20}\right) = \frac{3.60 - 3.00}{0.20} = \mathbf{3.00\text{ WPM}}$.
  - $Acc_{overall} = \left(\frac{15}{18}\right) \times 100\% = \mathbf{83.33\%}$.
  - Symbol Accuracy: $\left(\frac{2}{2}\right) \times 100\% = \mathbf{100.00\%}$ (2/2 symbols correct).
  - These metrics are **not suppressed, discarded, or flagged as invalid**. They are displayed on the Scorecard (`SCR-605`) and saved to `developer_sessions` in SQLite.
- **D6 Key-Level Weak-Key Telemetry (Per-Key Statistical Threshold & Evaluation Rules):**
  - For each target key independently, D6 evaluates the **most recent 100 eligible opportunities per key, subject to the maximum 14-calendar-day age limit**.
  - D6 requires a minimum of **20 eligible opportunities ($O_k \ge 20$) per target key** in its key-level rolling window before a key can be evaluated for diagnostic classification (`MASTERED`, `STABLE`, `DEVELOPING`, `WEAK_KEY`).
  - For any target key where the cumulative count in the window remains $< 20$, the diagnostic classification is marked strictly as **`INSUFFICIENT_DATA`**.
  - Sample count alone never determines classification: a sample count of 20 satisfies only the minimum eligibility gate. Error rate determines the classification tier.
  - These 18 keystrokes *are* still appended to `key_telemetry_window` to accumulate toward the 20-opportunity threshold across sessions; they are **never discarded**.
  - D6 weak-key minimum sample rules govern diagnostic recommendations only; they do not invalidate general session WPM and accuracy metrics.

### D6 Telemetry-Window Integration: Diagnostic Classification Process & Worked Examples (Correction A)

#### 1. Five-Step Diagnostic Classification Process
1. **Count Eligible Opportunities ($O_k$):** Determine the number of eligible opportunities for target key $k$ in the rolling window (most recent 100 eligible opportunities per key within 14 calendar days).
2. **Eligibility Check:** If $O_k < 20$, return **`INSUFFICIENT_DATA`**. Exclude from weak-key rankings.
3. **Calculate Error Rate:** If $O_k \ge 20$, calculate key error rate using approved D6 error-attribution rules:
   $$ErrRate_k = \left(\frac{E_k}{O_k}\right) \times 100\%$$
   *(where $E_k$ includes corrected mistakes, each position evaluated once without repeated backspace inflation).*
4. **Apply Approved Classification Thresholds:**
   - **`MASTERED`:** $ErrRate_k \le 3.0\%$
   - **`STABLE`:** $3.0\% < ErrRate_k \le 5.0\%$
   - **`DEVELOPING`:** $5.0\% < ErrRate_k \le 8.0\%$
   - **`WEAK_KEY`:** $ErrRate_k > 8.0\%$
5. **No Sample-Size Inference:** Never infer a classification tier from sample size alone.

#### 2. Master Worked Classification Examples

| Example | Target Key Scope | Eligible Opportunities ($O_k$) | Errors ($E_k$) | Error Rate ($ErrRate_k$) | Expected Classification | Governing Evaluation Rule |
|:---:|---|:---:|:---:|:---:|---|---|
| **EX-01** | Sub-threshold key `[` | 12 | 3 | Not classified | **`Insufficient Data`** | Rule 2: $O_k < 20$ fails sample gate; error rate not evaluated. |
| **EX-02** | Zero-error key `{` | 20 | 0 | $0.0\%$ | **`Mastered`** | Meets $O_k \ge 20$; $ErrRate \le 3.0\%$ qualifies for Mastered. |
| **EX-03** | Single-error key `;` | 20 | 1 | $5.0\%$ | **`Stable`** | Meets $O_k \ge 20$; $3.0\% < ErrRate \le 5.0\%$ qualifies for Stable. |
| **EX-04** | Two-error key `(` | 20 | 2 | $10.0\%$ | **`Weak`** | Meets $O_k \ge 20$; $ErrRate > 8.0\%$ qualifies for Weak Key. |
| **EX-05** | Moderate-error key `&` | 100 | 6 | $6.0\%$ | **`Developing`** | Max window capacity (100); $5.0\% < ErrRate \le 8.0\%$ qualifies for Developing. |
| **EX-06** | 14-day expired key `>` | 5 (45 expired) | 0 | Not classified | **`Insufficient Data`** | 45 strokes older than 14 days evicted; active $O_k = 5 < 20 \rightarrow$ Insufficient Data. |
| **EX-07** | Corrected mistake key `P` | 25 | 1 | $4.0\%$ | **`Stable`** | Backspaced mistake permanently logged ($E_k = 1$); $ErrRate = 1/25 = 4.0\% \rightarrow$ Stable. |

---

## 4. Specialized Developer Diagnostics Scenarios

### Scenario 10: Symbol Accuracy vs Alpha Accuracy Disaggregation
- **Parameters:** Developer types 250 characters: 200 alpha characters (198 correct, 2 errors) and 50 symbol characters (42 correct, 8 errors).
- **Calculations:**
  - $Acc_{alpha} = (198 / 200) \times 100 = \mathbf{99.0\%}$ (High proficiency)
  - $Acc_{sym} = (42 / 50) \times 100 = \mathbf{84.0\%}$ (High hesitation/friction)
  - $Acc_{overall} = (240 / 250) \times 100 = \mathbf{96.0\%}$
  - **Diagnostic Value:** Proves conclusively that symbol hesitation, not general typing ability, is the performance bottleneck.

### Scenario 11: Keyword Burst Velocity vs Identifier Velocity
- **Parameters:** In Java snippet, developer types 60 characters of keywords (`public static void class return`) in 6 seconds ($120\text{ WPM}$ burst rate), but types 60 characters of camelCase identifiers (`calculateMonthlyAccountBalance`) in 15 seconds ($48\text{ WPM}$).
- **Calculations:** Keyword velocity $WPM_{kw} = \mathbf{120\text{ WPM}}$; Identifier velocity $WPM_{id} = \mathbf{48\text{ WPM}}$. Identifies need for camelCase shifting practice.

### Scenario 12: Option A Daily Diminishing Returns XP Allocation (Attempt 4)
- **Parameters:** Developer practices same TypeScript snippet for the 4th time today. Correct words: 60, time: 2.0 min, accuracy: 98.5%.
- **Calculations:**
  - $XP_{base} = \text{round}(60 \times 0.2) + \text{round}(2.0 \times 5) = 12 + 10 = 22\text{ XP}$
  - Accuracy multiplier: $1.50\times \rightarrow XP_{adjusted} = \text{round}(22 \times 1.50) = 33\text{ XP}$
  - Option A Tier (Attempt 4): $50\%$ Base XP tier $\rightarrow \mathbf{\text{round}(33 \times 0.5) = 17\text{ XP awarded}}$.
  - Physical practice time credited: **+2.0 minutes** (100% credited to daily goal).

### Scenario 13: Code Complexity Score Calculation for Rust Pattern Match
- **Parameters:** 12-line Rust snippet: 480 chars, 108 symbols ($D_{sym} = 9.0$), max nesting depth 3 ($N_{max} = 8.5$), 14 camelCase/snake_case shifts ($R_{case} = 5.8$), average line length 40 chars ($L_{avg} = 5.0$).
- **Calculation:**
  $$CCS = (9.0 \times 0.35) + (8.5 \times 0.25) + (5.8 \times 0.20) + (5.0 \times 0.20)$$
  $$CCS = 3.15 + 2.125 + 1.16 + 1.00 = \mathbf{7.4} \rightarrow \mathbf{\text{Tier 3: Production Patterns}}$$
