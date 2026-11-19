# D6 UX ARCHITECTURE: SKILL DRILLS & WEAK-KEY REMEDIATION STUDIO
**Typing Trainer — Windows Desktop Application**
*Module: 04. Skill Drills & Remediation Studio | Screen Scope: SCR-401 to SCR-405*
*Target Resolution: 1440 × 900 (Responsive: 1280 × 720 to 2560 × 1440)*
*Document Version: 1.0.0 | Stage: D6 Stage 2 UX and Functional Specifications*
*Date: 2026-11-18 | Status: SPECIFICATION COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Executive Summary & Studio Philosophy

Phase D6 establishes the **Skill Drills & Weak-Key Remediation Studio** (`SCR-401` through `SCR-405`), the dedicated diagnostic and targeted corrective practice engine for Typing Trainer. 

### 1.1 The Role of D6 in the Typing Trainer Ecosystem
Typing Trainer separates skill acquisition into three distinct, complementary phases:
1. **Typing Test Arena (D4):** Evaluates overall speed, accuracy, and endurance under standardized transcription conditions. It exposes high-level metrics and identifies where errors occur.
2. **Learning Mode & Touch-Typing Curriculum (D5):** Guides students through a linear, 32-lesson pedagogical journey teaching proper finger placement, row-by-row reaches, and touch-typing fundamentals.
3. **Skill Drills & Remediation Studio (D6):** Acts as the **precision repair workshop**. As typists develop speed, they inevitably encounter motor plateaus, asymmetric finger weaknesses, and recurring letter-pair stumbles (e.g. adjacent key drift between `O` and `P`, sluggish reaches to bottom-row `B` or `Z`, or hesitation on punctuation `;`). D6 isolates these stumbling blocks, provides transparent data on *why* they happen, generates targeted practice routines, and verifies sustained improvement.

```
+---------------------------------------------------------------------------------------------------+
|                                 TYPING TRAINER LEARNING ECOSYSTEM                                 |
+---------------------------------------------------------------------------------------------------+
|  [D5: Learning Mode]          ──► Structured, sequential foundation (Home Row -> Full Keyboard)   |
|         │                                                                                         |
|         ▼                                                                                         |
|  [D4: Typing Test Arena]      ──► Periodic standardized benchmarking (Gross/Net WPM, Accuracy)     |
|         │                                                                                         |
|         ▼ (Feeds Keystroke Telemetry)                                                             |
|  [D6: Skill Drills Studio]    ──► Non-linear, adaptive diagnostics & targeted muscle memory repair |
|         │                                                                                         |
|         ▼ (Mastery Verification)                                                                  |
|  [D3: Dashboard Command]      ──► High-level progress, streak maintenance, and XP level tracking  |
+---------------------------------------------------------------------------------------------------+
```

### 1.2 Core Studio Principles
1. **Targeted Remediation Without Judgement:**
   - Weak keys and digit coordination gaps are framed as **high-leverage growth opportunities**, never as personal failures or negative scores.
   - Tone is analytical, encouraging, and focused on deliberate practice.
2. **Deterministic & Explainable Diagnostics:**
   - In accordance with project architecture, all weak-key flags, confusion matrices, and practice recommendations are calculated locally using transparent statistical rules on SQLite data.
   - No black-box machine learning, cloud telemetry, or local LLMs are utilized.
3. **Closed Remediation Feedback Loop:**
   - Remediation follows an unbroken cycle: **Diagnose** (`SCR-401`/`SCR-402`) $\longrightarrow$ **Configure** (`SCR-403`) $\longrightarrow$ **Drill** (`SCR-404`) $\longrightarrow$ **Verify Improvement** (`SCR-405`) $\longrightarrow$ **Mastery Graduation**.
4. **Observable Performance Language (Non-Clinical):**
   - In compliance with product governance, all diagnostics use strictly **observable performance descriptions**. The application never makes medical, clinical, or biomechanical claims (e.g., describing "lower target-key accuracy on the right pinky zone" rather than claiming "finger fatigue" or "poor motor coordination").

---

## 2. Five-Screen Pipeline Architecture

The D6 Studio consolidates targeted typing practice into a cohesive, five-screen end-to-end workflow:

```
+---------------------------------------------------------------------------------------------------+
|                                PHASE D6 SCREEN PIPELINE WORKFLOW                                  |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [SCR-401: Studio Overview]  ◄─────────────────────────────────────────────┐                     |
|    │  - Keyboard Skill Health Gauge                                         │                     |
|    │  - Weak-Key Watchlist & Finger Balance                                 │                     |
|    │  - 4 Practice Mode Quick Launchers                                     │                     |
|    │                                                                        │                     |
|    ├──► [SCR-402: Weak-Key Analysis]                                        │                     |
|    │      │  - 65% ANSI Keyboard Heatmap                                    │                     |
|    │      │  - Per-Key Confusion Matrix & Timing Metrics                    │                     |
|    │      │  - Plain-Language Explainability Cards                          │                     |
|    │      │                                                                 │                     |
|    │      └──────────────────────────┐                                      │                     |
|    │                                 ▼                                      │                     |
|    └───────────────────────► [SCR-403: Drill Configuration]                 │                     |
|                                │  - Target Key / Finger / N-Gram Selection  │                     |
|                                │  - Vocab Tier & Custom File Import         │                     |
|                                │  - Progression Stage & Duration Controls   │                     |
|                                │                                            │                     |
|                                ▼                                            │                     |
|                              [SCR-404: Skill Drill Arena]                   │                     |
|                                │  - Focused 3-Line Typing Canvas            │                     |
|                                │  - Target Focus HUD & Floating Hints       │                     |
|                                │  - Forgiving Multi-Word Backspace          │                     |
|                                │                                            │                     |
|                                ▼                                            │                     |
|                              [SCR-405: Results & Verification] ─────────────┘                     |
|                                   - Before-vs-After Key Comparison                                |
|                                   - Multi-Session Mastery Tracker (Session 1/2/3 of 3)             |
|                                   - D3 XP & Daily Goal Credit                                     |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### Screen Overview & Primary Responsibilities

| Screen ID | Screen Title | Primary User Goal | Key Information Displayed | Exit Routes |
|---|---|---|---|---|
| **`SCR-401`** | **Skill Drills Studio Overview** | Get an immediate snapshot of typing precision and launch targeted practice. | Keyboard Skill Health %, Weak-Key Watchlist, Finger-Zone Balance, 7-Day Trend, Mode cards. | $\rightarrow$ `SCR-402`, `SCR-403`, `SCR-404` |
| **`SCR-402`** | **Weak-Key Analysis** | Understand *why* specific keys are failing and inspect error distributions. | 65% ANSI Heatmap, Key Inspector drawer, Confusion Matrix, Hesitation Latency, Explanations. | $\rightarrow$ `SCR-403`, `SCR-401` |
| **`SCR-403`** | **Drill Configuration** | Customize drill targets, exercise modes, duration, and difficulty. | Key selector, Mode tabs (Weak Keys, N-Grams, Vocab, Custom), Stage selector, Live Preview. | $\rightarrow$ `SCR-404`, `SCR-401` |
| **`SCR-404`** | **Interactive Skill Drill Arena** | Execute focused corrective practice in a distraction-free typing canvas. | Target Focus HUD, 3-line text window, keystroke color feedback, floating hints, timer/progress. | $\rightarrow$ `SCR-405`, Pause Modal |
| **`SCR-405`** | **Results & Improvement Analysis** | Review before-and-after accuracy delta and track multi-session mastery. | Before-vs-After Key Table, Multi-Session Mastery Gauge, Net WPM, Accuracy, XP ledger breakdown. | $\rightarrow$ `SCR-403`, `SCR-401`, `SCR-402` |

---

## 3. Approved Key Classification & Error Attribution Baseline

### 3.1 Standard Key Classification Tiers
In accordance with Product Owner decision D6-01, all 47 primary keyboard keys are classified based on their error rate across the rolling diagnostic telemetry window:

$$\text{Error Rate } (ErrRate_k) = \frac{\text{Total Miskeyed Character Opportunities on Key } k}{\text{Total Eligible Target Opportunities for Key } k} \times 100\%$$

| Classification | Error Rate Threshold | Visual Token & Color | Semantic Status | Action Recommended |
|---|---|---|---|---|
| **Mastered** | $ErrRate_k \le 3.0\%$ | `#10B981` (Emerald Green) | High Precision Mastery | Maintain form; periodic check-in. |
| **Stable** | $3.0\% < ErrRate_k \le 5.0\%$ | `#06B6D4` / `#2563EB` (Cobalt/Cyan) | Reliable Baseline | Normal practice; low priority. |
| **Developing** | $5.0\% < ErrRate_k \le 8.0\%$ | `#F59E0B` (Amber) | Emerging Reach | Monitor; include in warm-ups. |
| **Weak Key** | $ErrRate_k > 8.0\%$ | `#EF4444` (Coral Red) | High Friction / Stumble Point | **Priority Remediation Target**. |
| **Insufficient Data** | $< 20$ eligible opportunities | `#64748B` (Muted Slate) | Calibrating Baseline | Requires more typing in test/curriculum. |

### 3.2 Four-Layer Error Attribution Model
To prevent metric distortion and ensure precision diagnostic reporting, D6 formally distinguishes four keystroke events:
1. **Intended Key ($k_{intended}$):** The printable character expected at the current text buffer position according to the exercise passage.
2. **Actual Key ($k_{actual}$):** The actual printable character event generated by the student.
3. **Corrected Mistake:** An initial incorrect keystroke event that the student subsequently erased via `Backspace` and replaced with the correct character.
4. **Uncorrected Mistake:** An incorrect character that remains uncorrected when the word or session is committed.

#### Key Rules of Attribution:
- **Attribution to the Intended Key:** All errors are strictly attributed to the **intended keycap**. If the text requires `P` and the student strikes `O`, this is logged as **1 Error on Key `P`** (with `O` recorded as the confusion destination). Key `O` is *not* penalized.
- **Single-Position Accounting:** Each character position in the passage is evaluated at most **once** for error rate calculations. Repeatedly backspacing and mistyping at the same cursor coordinate does not artificially inflate the opportunity denominator or the error numerator.
- **Preservation of Diagnostic Mistakes:** Even if the student uses `Backspace` to correct an erroneous keystroke (which avoids the Net WPM penalty in `SCR-404`), the initial incorrect strike remains permanently logged in the key diagnostic matrix.
- **Confusion Matrix Recording:** Whenever $k_{actual} \ne k_{intended}$, the directed tuple $(k_{intended} \longrightarrow k_{actual})$ is incremented in SQLite to track adjacent finger drift and letter-pattern confusions.

---

## 4. Technical Constraints & Governance Alignment

### 4.1 Observable Performance Standards (Non-Clinical)
To ensure professional, non-clinical software integrity:
- **No Medical Claims:** The software never uses terms such as "carpal tunnel", "tendonitis", "fatigue", "biomechanical impairment", or "motor defect".
- **Observable Descriptions Only:**
  - *Compliant:* "The right pinky target keys demonstrate an average error rate of 9.2%, compared to a 3.1% keyboard baseline."
  - *Non-Compliant:* "The student's right pinky is fatigued and shows poor coordination."
- **Hesitation Latency as Timing Metric:** Keystroke latency (the time interval in milliseconds between the previous keystroke and the target key strike) is presented purely as an observable time interval (e.g. `Average Interval: 240ms (+80ms above baseline)`), not as proof of cognitive or physical hesitation.

### 4.2 Desktop Shell & Resolution Fit (1440 × 900)
- **Geometry:** 1440 × 900 baseline with full responsive elasticity from 1280 × 720 minimum to 2560 × 1440 maximum.
- **Chrome:** Custom 36px desktop titlebar, 240px persistent collapsible navigation sidebar, 32px status bar, and a centralized 1100px primary workspace stage.
- **Dual-Theme Design Tokens:**
  - Dark Theme: Canvas `#0B0F19`, Card/Surface `#131B2E`, Border `#1E293B`, Primary CTA `#2563EB` (Cobalt Blue, 5.17:1 contrast).
  - Light Theme: Canvas `#F8FAFC`, Card/Surface `#FFFFFF`, Border `#E2E8F0`, Primary CTA `#2563EB` (Cobalt Blue, 5.17:1 contrast).
- **Typography:** `Inter UI` for structural chrome and analytics labels; `JetBrains Mono` with `tabular-nums` for all typing streams, key labels, and numerical metrics.
