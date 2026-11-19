# D6 CALCULATION SPECIFICATION: SKILL DRILLS & REMEDIATION ENGINE
**Typing Trainer — Windows Desktop Application**
*Module: 04. Skill Drills & Remediation Studio | Screen Scope: SCR-401 to SCR-405*
*Document Version: 1.0.0 | Stage: D6 Stage 2 UX and Functional Specifications*
*Date: 2026-11-18 | Status: SPECIFICATION COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Executive Summary & Mathematical Principles

All calculations in the Skill Drills & Remediation Studio are strictly **deterministic, explainable, and local**. They operate without artificial intelligence, probabilistic approximations, or cloud dependencies. 

Every displayed percentage, rank, delta, and XP allocation is mathematically derived using explicit arithmetic rules and standard half-up rounding.

---

## 2. Core Diagnostic Metric Formulas

### 2.1 Key-Level Error Rate & Accuracy
For any individual key $k$ within the rolling observation window:

$$\mathbf{ErrRate_k = \frac{E_k}{O_k} \times 100\%}, \qquad \mathbf{Acc_k = 100.0\% - ErrRate_k}$$

- **Definitions:**
  - $O_k$ (Eligible Opportunities): Total times key $k$ was the **intended target character** at an evaluated text position in the rolling window ($1 \le O_k \le 100$).
  - $E_k$ (Miskeyed Count): Total times an incorrect character was struck when key $k$ was intended (including corrected mistakes).
  - $C_k$ (Correct on First Strike): Total times key $k$ was struck correctly on the first attempt ($C_k = O_k - E_k$).
- **Sample Eligibility Gate (Decision D6-01):**
  - If $O_k < 20$, $ErrRate_k$ and $Acc_k$ are flagged as **`INSUFFICIENT_DATA`** and excluded from Weak-Key rankings.
- **Rounding Policy:** Standard half-up integer rounding to 1 decimal place (e.g. $12.44\% \rightarrow 12.4\%$; $12.45\% \rightarrow 12.5\%$).

---

### 2.2 Weak-Key Prioritization Index (WPI)
To determine which keys appear in the **Top Weak-Key Watchlist** on `SCR-401` and receive auto-remediation recommendations in `SCR-403`, keys are ranked by the **Weak-Key Prioritization Index ($WPI_k$)**:

$$\mathbf{WPI_k = ErrRate_k \times \ln(O_k + 1)}$$

- **Purpose:** Prevents keys with high error rates but low sample sizes from dominating high-frequency keys that cause massive real-world friction. 
  - *Example:* A key with $10\%$ error rate across 80 strokes ($WPI = 10 \times \ln(81) = 43.9$) ranks higher than a key with $11\%$ error rate across only 20 strokes ($WPI = 11 \times \ln(21) = 33.5$).
- **Prerequisite:** Evaluated strictly for keys satisfying $O_k \ge 20$ and $ErrRate_k > 8.0\%$.

---

### 2.3 Key Classification Tiers

$$\text{Classification}(k) = \begin{cases} 
\mathbf{INSUFFICIENT\_DATA} & \text{if } O_k < 20 \\
\mathbf{MASTERED} & \text{if } O_k \ge 20 \text{ and } ErrRate_k \le 3.0\% \\
\mathbf{STABLE} & \text{if } O_k \ge 20 \text{ and } 3.0\% < ErrRate_k \le 5.0\% \\
\mathbf{DEVELOPING} & \text{if } O_k \ge 20 \text{ and } 5.0\% < ErrRate_k \le 8.0\% \\
\mathbf{WEAK\_KEY} & \text{if } O_k \ge 20 \text{ and } ErrRate_k > 8.0\%
\end{cases}$$

---

### 2.4 Confusion Matrix Distribution
For an intended key $k$ and an entered incorrect key $j$:

$$\mathbf{P(actual = j \mid intended = k) = \frac{\text{Count}(k \longrightarrow j)}{\sum_{m \ne k} \text{Count}(k \longrightarrow m)} \times 100\%}$$

- **Numerator:** Total observed occurrences where actual input was $j$ when intended was $k$.
- **Denominator:** Total errors committed on key $k$.
- **Rounding:** 1 decimal place.

---

### 2.5 Finger-Zone Statistical Aggregation
For each physical digit $D$ across the 10 fingers:

$$\mathbf{ErrRate_D = \frac{\sum_{k \in Keys(D)} E_k}{\sum_{k \in Keys(D)} O_k} \times 100\%}, \qquad \mathbf{Acc_D = 100.0\% - ErrRate_D}$$

- **Digit Mapping ($Keys(D)$):**
  - *Left Pinky:* `Q, A, Z, 1, Tab, CapsLock, LeftShift`
  - *Left Ring:* `W, S, X, 2`
  - *Left Middle:* `E, D, C, 3`
  - *Left Index:* `R, T, F, G, V, B, 4, 5`
  - *Right Index:* `Y, U, H, J, N, M, 6, 7`
  - *Right Middle:* `I, K, ,, 8`
  - *Right Ring:* `O, L, ., 9`
  - *Right Pinky:* `P, ;, /, 0, -, =, [, ], ', Enter, RightShift`
  - *Thumbs:* `Spacebar`

---

### 2.6 Hesitation Latency Index (Timing Metric)
Let $T_k$ be the inter-keystroke interval in milliseconds preceding a target key strike. Let $\overline{T}_{user}$ be the student's overall average inter-keystroke interval across all keys:

$$\mathbf{LatencyDelta_k = \overline{T}_k - \overline{T}_{user} \quad (\text{ms})}, \qquad \mathbf{HLI_k = \frac{\overline{T}_k}{\overline{T}_{user}}}$$

- **Interpretation:** If $\overline{T}_k = 245\text{ms}$ and $\overline{T}_{user} = 160\text{ms}$, then $LatencyDelta_k = +85\text{ms}$ ($HLI_k = 1.53\times$). This indicates an observable timing hesitation when reaching for key $k$.
- **Language Standard:** Described strictly as an observable time interval, not a psychological or motor diagnosis.

---

### 2.7 Before-and-After Performance Delta
Evaluated on `SCR-405` following drill completion:

$$\mathbf{\Delta ErrRate_k = ErrRate_{historical}(k) - ErrRate_{session}(k)}$$

- **Positive Delta ($\Delta > 0$):** Indicates improvement (error rate decreased). Displayed in Emerald Green with an upward arrow (`-8.2% Error Drop [▲]`).
- **Negative Delta ($\Delta < 0$):** Indicates error rate increased during the drill. Displayed in Amber.

---

### 2.8 Multi-Session Mastery Verification Algorithm (Decision D6-03)
A key $k$ achieves **Mastered Status** if and only if:

$$\mathbf{\text{ConsecutiveQualifyingSessions}(k) \ge 3}$$

Where a session qualifies if and only if:
1. Session status is **Completed** (not abandoned or aborted).
2. Key opportunity count in the session: **$O_{session}(k) \ge 30$**.
3. Key error rate in the session: **$ErrRate_{session}(k) \le 3.0\%$**.

If a session fails condition 2 or 3, the counter is evaluated:
- If $ErrRate_{session}(k) > 3.0\%$ with $O_{session}(k) \ge 30$, the consecutive counter **resets to 0**.
- If $O_{session}(k) < 30$, the session provides practice and XP, but **does not alter the consecutive counter** (neutral session).

---

### 2.9 D3/D5 Reconciled XP & Daily Diminishing-Return Policy

#### Formula:
$$\mathbf{XP_{session} = \text{round}(XP_{adjusted\_base} \times RetakeTier) + Bonus_{milestone}}$$
$$\mathbf{XP_{base} = \text{round}(WordsTyped \times 0.2) + \text{round}\left(\frac{ActiveSeconds}{60} \times 5\right)}$$
$$\mathbf{XP_{adjusted\_base} = \text{round}(XP_{base} \times Multiplier_{accuracy})}$$

#### Approved Accuracy Multipliers (D3 Alignment):
- $\ge 98.0\%$: **$1.50\times$**
- $95.0\% - 97.9\%$: **$1.20\times$**
- $90.0\% - 94.9\%$: **$1.00\times$**
- $80.0\% - 89.9\%$: **$0.75\times$**
- $< 80.0\%$: **$0.50\times$**

#### Approved Option A Diminishing Returns (D5 Alignment):
- Attempt counter includes the initial attempt on that calendar day for that specific drill configuration:
  - **Attempts 1–3:** $RetakeTier = 1.0$ (**$100\%$ Base XP**)
  - **Attempts 4–5:** $RetakeTier = 0.5$ (**$50\%$ Base XP**)
  - **Attempts 6+:** $RetakeTier = 0.0$ (**$0\%$ Base XP**)
- **Practice Time Credit:** All attempts (even 6+) contribute **$100\%$ toward Daily Practice Goal time and streak**.

---

## 3. Ten Comprehensive Worked Examples

### Scenario 1: Insufficient Sample Size Gate
- **Telemetry:** User strikes key `Z` 8 times in a 60s test; 1 error committed.
- **Calculation:** $O_Z = 8$. Threshold requires $O_Z \ge 20$.
- **Outcome:** Key `Z` is classified as **`INSUFFICIENT_DATA`**. It is NOT flagged as a weak key despite a raw error rate of $12.5\%$ ($1/8$).

---

### Scenario 2: Active Weak-Key Classification
- **Telemetry:** Key `P` has 89 opportunities in the rolling window ($O_P = 89$). Errors logged: 11 ($E_P = 11$).
- **Calculation:**
  $$ErrRate_P = \frac{11}{89} \times 100\% = 12.359\% \longrightarrow \mathbf{12.4\%}$$
  $$Acc_P = 100.0\% - 12.4\% = \mathbf{87.6\%}$$
  $$WPI_P = 12.359 \times \ln(89 + 1) = 12.359 \times 4.4998 = \mathbf{55.61}$$
- **Outcome:** Key `P` exceeds the $8.0\%$ threshold and satisfies $O_P \ge 20$. Classified as **`WEAK_KEY`** (Coral Red `#EF4444`). Ranks as Priority #1 on Watchlist.

---

### Scenario 3: Corrected Mistake Keystroke Accounting
- **Telemetry:** In `SCR-404`, text requires word `"paper"`. Student types `"o"`, notices red wavy underline, hits `Backspace`, types `"p"`, then completes `"aper"`.
- **Accounting:**
  - Character position 1: Intended key `P`.
  - First keystroke was `O` $\rightarrow$ Logged as **1 Error on Key `P`** in diagnostic window.
  - Pairwise tuple `(P -> O)` incremented in `key_confusion_matrix`.
  - Position was corrected before committing $\rightarrow$ No uncorrected error penalty to Net WPM.
  - Position 1 is evaluated once (denominator increments by 1, not 2).

---

### Scenario 4: Uncorrected Error Keystroke Accounting
- **Telemetry:** Student types `"open"` as `"ooen"` and hits `Spacebar` without correcting.
- **Accounting:**
  - Character position 2: Intended key `P`.
  - First keystroke was `O` $\rightarrow$ Logged as **1 Error on Key `P`** in diagnostic window.
  - Remains uncorrected $\rightarrow$ Generates a 1-word Net WPM penalty in `SCR-404` session scoring.

---

### Scenario 5: Confusion Matrix Distribution
- **Telemetry:** Over 14 days, student made 16 total errors on intended key `B` ($E_B = 16$).
  - Entered `V`: 10 times.
  - Entered `N`: 4 times.
  - Entered `G`: 2 times.
- **Calculation:**
  $$P(B \longrightarrow V) = \frac{10}{16} \times 100\% = \mathbf{62.5\%}$$
  $$P(B \longrightarrow N) = \frac{4}{16} \times 100\% = \mathbf{25.0\%}$$
  $$P(B \longrightarrow G) = \frac{2}{16} \times 100\% = \mathbf{12.5\%}$$
- **Outcome:** The Inspector card highlights: *"Primary lateral drift into 'V' (62.5%), indicating left index inward reach under-extension."*

---

### Scenario 6: Finger-Zone Aggregation
- **Telemetry:** Right Pinky keys (`P, ;, /, 0, -, =`) have logged 250 total opportunities with 22 errors.
- **Calculation:**
  $$ErrRate_{\text{Right Pinky}} = \frac{22}{250} \times 100\% = \mathbf{8.8\%}, \qquad Acc_{\text{Right Pinky}} = \mathbf{91.2\%}$$
- **Outcome:** Right Pinky bar displays Amber/Red highlight with note: *"Right Pinky accuracy is 91.2%, 5.6% below your 96.8% keyboard baseline."*

---

### Scenario 7: Failed Mastery Session (Counter Reset)
- **Context:** Student currently has 2 clean sessions logged on key `P` (`consecutive_clean_sessions = 2`).
- **Telemetry (Session 3):** Student types 40 strokes on `P` ($O_{session} = 40$), but makes 2 mistakes ($E_{session} = 2$).
- **Calculation:**
  $$ErrRate_{session} = \frac{2}{40} \times 100\% = 5.0\%$$
- **Evaluation:** $ErrRate > 3.0\%$. Session fails the qualification gate.
- **Outcome:** `consecutive_clean_sessions` **resets from 2 to 0**. Status remains `WEAK` / `IN_TRAINING`.

---

### Scenario 8: Successful 3-Session Mastery Sequence
- **Session 1:** 45 strokes on `P`, 1 error ($2.2\% \le 3.0\%$) $\rightarrow$ `consecutive = 1` (Status: `IN_TRAINING`).
- **Session 2:** 50 strokes on `P`, 0 errors ($0.0\% \le 3.0\%$) $\rightarrow$ `consecutive = 2` (Status: `VALIDATING`).
- **Session 3:** 40 strokes on `P`, 1 error ($2.5\% \le 3.0\%$) $\rightarrow$ `consecutive = 3`.
- **Outcome:** `consecutive = 3` reached! Key `P` officially graduates to **`MASTERED`** (`#10B981`). Removed from active Weak-Key Watchlist.

---

### Scenario 9: Rolling Window FIFO Eviction & Expiration
- **Context:** Key `P` has 100 observations in `key_telemetry_window`. The oldest observation occurred on November 2 (16 days ago). A new drill session records 30 new strokes today (November 18).
- **Execution:**
  1. The 16-day-old entry is purged ($> 14\text{ days}$).
  2. The 30 new strokes are appended.
  3. FIFO eviction removes the oldest 29 entries to maintain exactly 100 observations.
- **Outcome:** Telemetry window reflects strictly the latest 100 strokes from the last 14 days.

---

### Scenario 10: Full XP Calculation with Option A Diminishing Returns
- **Context:** Student completes their **4th drill of the day** on the same configuration (Attempt 4).
- **Telemetry:** 100 words, 3.0 minutes active time, 98.2% session accuracy.
- **Calculations:**
  1. $XP_{base} = \text{round}(100 \times 0.2) + \text{round}(3.0 \times 5) = 20 + 15 = 35\text{ XP}$.
  2. Accuracy Multiplier: $98.2\% \ge 98.0\% \implies 1.50\times$.  
     $XP_{adjusted\_base} = \text{round}(35 \times 1.50) = 53\text{ XP}$.
  3. Option A Diminishing Return (Attempt 4 of day):  
     $XP_{session} = \text{round}(53 \times 0.5) = \mathbf{27\text{ XP}}$.
  4. Daily Goal: Full 3.0 minutes ($180\text{s}$) added to daily goal counter ($100\%$ credit).
