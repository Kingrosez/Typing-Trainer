# TYPING CALCULATION & ENGINE SPECIFICATION (D4)
**Typing Trainer — Windows Desktop Application**
*Module: Typing Engine & Telemetry Evaluation*
*Document Version: 1.1.0 | Stage: D4 Review Resolution*
*Date: 2026-11-17 | Status: RESOLVED (AWAITING PRODUCT OWNER APPROVAL)*

---

## 1. Executive Summary & Engine Principles

The Typing Trainer engine executes entirely on the client side (React / TypeScript / Zustand within the Tauri desktop webview). It captures and evaluates individual keyboard events at native hardware polling rates ($< 1\text{ ms}$ input capture latency, zero network hops).

To guarantee absolute fairness, comparability, and mathematical reproducibility, all speed, accuracy, and consistency metrics are governed by standardized formulas aligned with international touch-typing standards.

---

## 2. Keystroke Event Taxonomy & Classification

Every keyboard hardware event captured during a typing test belongs to one of three strictly segregated categories:

```
+---------------------------------------------------------------------------------------+
|                                KEYBOARD EVENT TAXONOMY                                |
+-------------------------------+-----------------------------------+-------------------+
| 1. Character Input Events     | 2. Correction & Buffer Events     | 3. Modifier Keys  |
+-------------------------------+-----------------------------------+-------------------+
| • Alphabet (a-z, A-Z)         | • Backspace (\b)                  | • Shift (L/R)     |
| • Numbers (0-9)               |                                   | • Ctrl, Alt, Meta |
| • Punctuation (, . ; ' " etc) | (Edits buffer; does NOT increment | • CapsLock        |
| • Symbols (! @ # $ % etc)     |  Total Attempted Inputs or WPM)   | • Tab, Esc, Fn    |
| • Whitespace (Space, Enter)   |                                   | (0 character count|
| (Increments N_total by exactly|                                   |  0 error count)   |
|  1 character attempt)         |                                   |                   |
+-------------------------------+-----------------------------------+-------------------+
```

### 2.1 Explicit Event Definitions
1. **Character Input Event ($N_{total}$):**
   - Generated when the user presses any printable character key (letters, numbers, symbols, spaces, and newlines).
   - Each printable character produces exactly **1 attempted character input**.
   - Pressing `Shift + a` producing capital `A` counts as **1 character input event** (the modifier `Shift` is not counted separately).
2. **Control & Modifier Keys:**
   - Standalone presses of `Shift`, `Control`, `Alt`, `Meta` (Windows key), `CapsLock`, `Tab`, `Escape`, `F1–F12`, or arrow keys generate **0 attempted character inputs** and do **NOT** count as strokes or errors.
3. **Backspace & Correction Events:**
   - Pressing `Backspace` erases the preceding character in the active word buffer and retreats the caret.
   - **Crucial Rule on Backspace Accounting:**
     - Backspace **DOES NOT increment Total Attempted Character Inputs ($N_{total}$)**.
     - Backspace **DOES NOT count as a character keystroke towards Gross WPM or Net WPM**.
     - Backspace is strictly an editing operation. It enables the typist to transform an *Uncorrected Error* into a *Corrected Mistake*, restoring Net WPM potential.
     - However, the initial incorrect keystroke that necessitated the backspace **remains permanently recorded** in the session error tally ($N_{incorrect}$) and per-key diagnostic matrix, correctly reducing overall Accuracy.
4. **Correct Character Attempt ($N_{correct}$):**
   - A character input event where the struck character matches the target character at the current cursor index upon initial stroke.
5. **Incorrect Character Attempt ($N_{incorrect}$):**
   - A character input event where the struck character differs from the expected target character at that position.
6. **Corrected Mistake ($N_{corrected}$):**
   - A character position where an incorrect keystroke was initially struck, but was subsequently erased with Backspace and replaced with the correct character before advancing.
7. **Uncorrected Error ($E_{uncorrected}$):**
   - Erroneous characters remaining in the submitted text at the conclusion of the test (either left in previously committed words after pressing Space, or remaining in the active word when the timer reaches 0:00).
8. **Total Attempted Character Inputs ($N_{total}$):**
   - The exact mathematical sum of all printable character-generating attempts:
     $$\mathbf{N_{total} = N_{correct} + N_{incorrect}}$$
   - Backspaces and modifier keys are strictly excluded from $N_{total}$.

---

## 3. Mathematical Metric Formulas

### 3.1 The Standardized 5-Character "Word"
In informal prose, words vary widely in length (e.g. `is` vs `synchronization`). In standardized typing measurement, a "Word" is strictly defined as:
$$\mathbf{1\text{ Word} \equiv 5\text{ Keystrokes}}$$

This standard keystroke equivalence applies across all alphanumeric characters, punctuation, and whitespace.

### 3.2 Gross WPM (Raw WPM)
Gross WPM measures raw motor finger velocity and mechanical throughput:
$$\mathbf{GrossWPM = \frac{N_{total} / 5}{t_{elapsed}}}$$
where $t_{elapsed}$ is active net duration in fractional minutes ($t_{seconds} / 60$).

*Characteristics:*
- Counts every character input attempt typed into the active buffer ($N_{total} / 5$).
- Does not penalize errors.
- Backspaces do not contribute to Gross WPM.

---

### 3.3 Net WPM (The Official Benchmark Standard)
Net WPM measures usable typing throughput by penalizing uncorrected errors left in the final text:
$$\mathbf{NetWPM = \max\left(0, \frac{(N_{total} / 5) - E_{uncorrected}}{t_{elapsed}}\right)}$$

*Rules & Penalties:*
- **The Error Penalty:** Each uncorrected error subtracts **1 standardized word** ($5\text{ keystrokes}$) from the total gross word count.
- **Corrected Mistakes Benefit:** If a typist corrects an error with Backspace, $E_{uncorrected}$ is not incremented, so **no 5-keystroke word penalty is assessed against Net WPM**. The only penalty is the physical time lost backspacing.
- **The Zero-Floor Rule:** Net WPM cannot be negative. If $E_{uncorrected} > (N_{total} / 5)$, Net WPM is floored at $\mathbf{0.0\text{ WPM}}$.

---

### 3.4 Keystroke Accuracy Percentage
Accuracy represents the exact ratio of correct character attempts to total character attempts:
$$\mathbf{Accuracy\% = \left(\frac{N_{correct}}{N_{total}}\right) \times 100 = \left(\frac{N_{correct}}{N_{correct} + N_{incorrect}}\right) \times 100}$$

*Consistency with Backspace:*
- Erasing a mistake with Backspace and typing the correct character increments $N_{correct}$ by 1 and $N_{total}$ by 1.
- Because the initial mistake was already recorded in $N_{incorrect}$, the accuracy ratio accurately reflects the mistake:
  $$\text{Accuracy} = \frac{N_{target}}{N_{target} + N_{correctedMistakes}} < 100\%$$
- Backspace itself never adds an attempt to numerator or denominator.

---

### 3.5 Consistency Percentage (Cadence Stability)
Consistency measures how evenly spaced the typist's keystrokes are, evaluating cadence rhythm via the **Coefficient of Variation (CV)** of inter-keystroke intervals (IKIs):
$$\mathbf{Consistency\% = \max\left(0, \min\left(100, \text{round}\left(100 - (CV \times 100)\right)\right)\right)}$$
where:
$$CV = \frac{\sigma_{filtered}}{\mu_{filtered}} = \frac{\text{Standard Deviation of Filtered IKIs (ms)}}{\text{Mean of Filtered IKIs (ms)}}$$

#### Rigorous Consistency Evaluation Rules:
1. **Minimum Sample Size ($N_{IKI} \ge 10$):**
   - At least 10 valid inter-keystroke intervals are required to compute standard deviation.
   - If $N_{IKI} < 10$ (e.g. test aborted after 5 strokes), Consistency displays as `"N/A"`, flagged internally as `insufficient_samples: true`.
2. **Pause Interval Exclusion:**
   - Any IKI that spans a pause event (the interval between the keypress immediately before pressing `Esc` and the first keypress following unpause) is **strictly excluded** from the sample array. Pauses never depress typing consistency.
3. **Outlier & Hesitation Filtering:**
   - Brief hesitations or sneeze pauses could artificially inflate standard deviation.
   - **Outlier Rejection Rule:** Any individual interval where $IKI_i > 2,000\text{ ms}$ or $IKI_i > 3 \times \text{median}(IKI)$ is rejected as an anomaly and excluded from the CV calculation.
4. **Output Clamping & Rounding:**
   - The result is rounded to the nearest integer and clamped strictly within **`[0, 100]`**.

---

## 4. Worked Calculation Examples (Three Benchmark Scenarios)

### Scenario 1: Perfect Typing Without Corrections
- **Test Duration:** $60.0\text{ seconds}$ ($t_{elapsed} = 1.0\text{ min}$).
- **Target Text:** $300\text{ characters}$.
- **Typing Log:**
  - Correct Character Attempts ($N_{correct}$): $300$
  - Incorrect Character Attempts ($N_{incorrect}$): $0$
  - Backspaces: $0$
  - Corrected Mistakes ($N_{corrected}$): $0$
  - Uncorrected Errors Remaining ($E_{uncorrected}$): $0$
  - Total Attempted Inputs ($N_{total}$): $300 + 0 = 300$
- **Calculations:**
  1. *Gross WPM:*
     $$GrossWPM = \frac{300 / 5}{1.0} = \frac{60.0}{1.0} = \mathbf{60.00\text{ WPM}}$$
  2. *Net WPM:*
     $$NetWPM = \frac{(300 / 5) - 0}{1.0} = \frac{60.0 - 0}{1.0} = \mathbf{60.00\text{ WPM}}$$
  3. *Accuracy %:*
     $$Accuracy = \left(\frac{300}{300}\right) \times 100 = \mathbf{100.00\%}$$
  4. *PB Eligibility:* Eligible for official PB (Duration $= 60\text{s}$, Acc $\ge 95\%$).

---

### Scenario 2: Typing With an Incorrect Character That Is Corrected
- **Test Duration:** $60.0\text{ seconds}$ ($t_{elapsed} = 1.0\text{ min}$).
- **Target Text:** $300\text{ characters}$.
- **Typing Log:**
  - On character 150, user strikes `'x'` instead of `'c'` (1 incorrect attempt).
  - User presses `Backspace` (1 backspace event; does not increment $N_{total}$).
  - User strikes `'c'` correctly.
  - User completes the remaining text with no further mistakes.
  - Correct Character Attempts ($N_{correct}$): $300$
  - Incorrect Character Attempts ($N_{incorrect}$): $1$
  - Backspaces: $1$
  - Corrected Mistakes ($N_{corrected}$): $1$
  - Uncorrected Errors Remaining ($E_{uncorrected}$): $0$
  - Total Attempted Inputs ($N_{total}$): $300 + 1 = 301$
- **Calculations:**
  1. *Gross WPM:*
     $$GrossWPM = \frac{301 / 5}{1.0} = \frac{60.20}{1.0} = \mathbf{60.20\text{ WPM}}$$
  2. *Net WPM:*
     $$NetWPM = \frac{(301 / 5) - 0}{1.0} = \frac{60.20 - 0}{1.0} = \mathbf{60.20\text{ WPM}}$$
     *(Note: If computed on final completed text words $(300/5)$, Net WPM is $60.00\text{ WPM}$. To maintain internal mathematical consistency where $NetWPM = GrossWPM - (Errors/Time)$, $60.20\text{ WPM}$ reflects raw attempts, rounded to $60\text{ WPM}$ on the HUD).*
  3. *Accuracy %:*
     $$Accuracy = \left(\frac{300}{301}\right) \times 100 = \mathbf{99.67\%}$$
  4. *Conclusion:* Backspacing saved the user from a full 1-word Net WPM penalty ($55\text{ WPM} \rightarrow 60\text{ WPM}$), while accurately penalizing the accuracy metric to $99.67\%$.

---

### Scenario 3: Typing With an Incorrect Character That Remains Uncorrected
- **Test Duration:** $60.0\text{ seconds}$ ($t_{elapsed} = 1.0\text{ min}$).
- **Target Text:** $300\text{ characters}$.
- **Typing Log:**
  - User strikes 5 incorrect characters during the test.
  - User never presses Backspace, advancing past the errors.
  - Correct Character Attempts ($N_{correct}$): $295$
  - Incorrect Character Attempts ($N_{incorrect}$): $5$
  - Backspaces: $0$
  - Corrected Mistakes ($N_{corrected}$): $0$
  - Uncorrected Errors Remaining ($E_{uncorrected}$): $5$
  - Total Attempted Inputs ($N_{total}$): $295 + 5 = 300$
- **Calculations:**
  1. *Gross WPM:*
     $$GrossWPM = \frac{300 / 5}{1.0} = \frac{60.0}{1.0} = \mathbf{60.00\text{ WPM}}$$
  2. *Net WPM:*
     $$NetWPM = \frac{(300 / 5) - 5}{1.0} = \frac{60.0 - 5.0}{1.0} = \mathbf{55.00\text{ WPM}}$$
  3. *Accuracy %:*
     $$Accuracy = \left(\frac{295}{300}\right) \times 100 = \mathbf{98.33\%}$$
  4. *Penalty Impact:* The 5 uncorrected errors imposed a **$-5.0\text{ WPM}$ penalty** on the final Net score ($55.0\text{ WPM}$ vs $60.0\text{ Gross WPM}$).

---

## 5. Rounding, Formatting & Persistence Standards

| Context | Metric | Internal Type (SQLite / Zustand) | Display Format (UI) | Example Output |
|---|---|---|---|---|
| **Live HUD** | Net WPM | `float64` | Rounded to nearest integer | `68 WPM` |
| **Live HUD** | Accuracy % | `float64` | 1 decimal place | `98.4%` |
| **Live HUD** | Time Remaining | `integer` (seconds) | Monospace `MM:SS` | `0:42` |
| **Results Hero** | Net WPM | `float64` | Rounded to nearest integer | `72 WPM` |
| **Results Hero** | Accuracy % | `float64` | 1 decimal place | `98.4%` |
| **Results Breakdown**| Gross / Net WPM | `float64` | 2 decimal places | `72.45 WPM` |
| **Results Breakdown**| Accuracy % | `float64` | 2 decimal places | `98.42%` |
| **Consistency** | Consistency % | `float64` | Nearest integer | `86%` |
| **Database Sync** | `netWpm`, `grossWpm`| `REAL` (SQLite) | 2 decimal places | `72.45` |
| **Database Sync** | `accuracy` | `REAL` (SQLite) | 2 decimal places | `98.42` |

---

## 6. Official Personal Best (PB) & XP Governance

### 6.1 Strict Personal Best Eligibility Criteria
To ensure personal records are meaningful and tamper-resistant:
1. **Benchmark Duration:** Must be an official **60-Second Standard Benchmark** test.
2. **Corpus Standard:** Must use standard system corpora (Common English Words or Sentences); custom text is marked ineligible.
3. **Accuracy Gate ($\ge 95.0\%$):** Tests with $< 95.0\%$ accuracy are recorded in session history but are **strictly ineligible for All-Time Personal Best records**.
4. **Pause Limits:** A maximum of **2 pause events** and **$\le 60\text{ seconds}$ total cumulative pause** is allowed. Any test exceeding these limits is marked `pbEligible: false`.

### 6.2 XP Calculation & Anti-Duplication Rule
1. **Base Effort XP:**
   $$\mathbf{XP_{base} = \text{round}(WordsTyped \times 0.2) + \text{round}\left(\frac{ElapsedSeconds}{60} \times 5\right)}$$
2. **Accuracy Multipliers:**
   - $\ge 98.0\%$: $1.50\times$ (+50% Bonus)
   - $95.0\% - 97.9\%$: $1.20\times$ (+20% Bonus)
   - $90.0\% - 94.9\%$: $1.00\times$ (Standard)
   - $80.0\% - 89.9\%$: $0.75\times$ (Effort preserved for beginners)
   - $< 80.0\%$: $0.50\times$
3. **One-Time Milestone Bonuses:**
   - New All-Time Personal Best: $+100\text{ XP}$
   - Daily Goal Reached (20m): $+150\text{ XP}$
4. **Idempotent Session Identity:**
   - Every session is assigned a client-generated UUID `sessionId`.
   - Reopening `SCR-203`, refreshing, or resynchronizing returns HTTP 200 with `duplicate: true`. Duplicate XP awards and duplicate streak advancements are prevented by database constraints.
