# TYPING TEST RESULTS SPECIFICATION (SCR-203)
**Typing Trainer — Windows Desktop Application**
*Screen ID: SCR-203 | Route: /test/results/:id | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D4 Typing Test Arena Design*
*Date: 2026-11-17 | Status: D4 DESIGN COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Screen Mission & Strategic Role

**`SCR-203: Typing Test Results and Performance Breakdown`** is the concluding stage of the typing test journey. It transforms raw keystroke telemetry into a clear, honest, and motivating performance debriefing.

### 1.1 Core Design Objectives
1. **Celebrate Genuine Achievement:** Acknowledge milestone breakthroughs (e.g. new Personal Best, Level advancement) with elegant gaming flair.
2. **Deliver Actionable Diagnostics:** Identify the exact character keys and reach sequences that caused mistakes, bridging directly to targeted remediation.
3. **Encourage Metronomic Rhythm:** Highlight consistency and cadence alongside top-line speed.
4. **Frictionless Re-Engagement:** Enable typists to restart the test or jump into a weak-key drill immediately with a single keystroke (`Enter` on focused Retry button or `F5` / `Ctrl + R`).

---

## 2. Layout Architecture & Visual Hierarchy (1440 × 900)

```
+-------------------------------------------------------------------------------+
| TITLEBAR: Windows Chrome • [⌨] Typing Trainer • Offline-Ready [●] • [Ctrl+K]  |
+-------------------+-----------------------------------------------------------+
| SIDEBAR (240px)   | MAIN STAGE: Centered Performance Showcase (1100px)        |
|                   |                                                           |
| [📊] Dashboard    | [ ← Return to Dashboard (Ctrl+1) ]    [⚙ Configure New]   |
| [⚡] Typing Test  |                                                           |
|      (ACTIVE)     | +-------------------------------------------------------+ |
| [🎓] Learning     | | ROW 0: HERO SCORECARD & MILESTONES (Height: 140px)    | |
| [🎯] Drills       | | [ 72 WPM NET ]  [ 98.4% ACC ]  [ 78 RAW ]  [ 86% CONS]| |
| [💻] Developer    | | 🏆 NEW PERSONAL BEST!  •  Level 12 (+110 XP) • Streak 🔥| |
| [🎮] Games        | +-------------------------------------------------------+ |
|                   |                                                           |
|                   | +-----------------------------+-------------------------+ |
|                   | | ROW 1: WPM PROGRESSION      | ROW 1: CHARACTER STATS  | |
|                   | | Second-by-Second Telemetry  | Detailed Keystroke Tally| |
|                   | | Line Curve (Recharts)       | • Correct: 354 chars    | |
|                   | | • Blue Line: Speed Curve    | • Incorrect: 6 strokes  | |
|                   | | • Red Dots: Error Spikes    | • Uncorrected: 1 error  | |
|                   | | • Dashed: 60s Average WPM   | • Duration: 60.0s       | |
|                   | +-----------------------------+-------------------------+ |
|                   |                                                           |
|                   | +-------------------------------------------------------+ |
|                   | | ROW 2: DETERMINISTIC WEAK-KEY & REACH DIAGNOSTICS     | |
|                   | | Keys to Improve: [ R (72%) ]  [ T (78%) ] [ P (81%) ] | |
|                   | | "Diagonal reaches with the left index caused 4 errors"| |
|                   | +-------------------------------------------------------+ |
|                   |                                                           |
|                   | +-------------------------------------------------------+ |
|                   | | ROW 3: ACTION CONTROLS & NEXT STEPS                   | |
|                   | | [ RETRY SAME TEST (Enter) → ]                         | |
|                   | | [ PRACTICE WEAK KEYS (3m Drill) ]   [ RETURN TO HOME ]| |
|                   | +-------------------------------------------------------+ |
+-------------------+-----------------------------------------------------------+
| STATUS BAR: [Enter] Retry | [F5] Quick Restart | [Ctrl+1] Dashboard           |
+-------------------------------------------------------------------------------+
```

---

## 3. Detailed Component Specifications

### 3.1 Row 0: Hero Scorecard & Milestone Badges
- **Dimensions:** Width `1100px`, Height `140px`, Background `#131B2E` (Dark) / `#FFFFFF` (Light), Border 1px `#1E293B` / `#E2E8F0`.
- **Primary Hero Metric (Net WPM):**
  - Value: **`72`** rendered in **`JetBrains Mono Bold 56px`** with tabular figures.
  - Unit Label: `"NET WPM"` in `Inter Semi-Bold 13px` with electric blue tint (`#2563EB`).
  - Delta Badge: `+4 WPM vs 30-Session Average` in an Emerald green pill.
- **Secondary Hero Metrics:**
  - *Accuracy:* **`98.4%`** in `JetBrains Mono Bold 32px` (`#10B981` Emerald).
  - *Raw WPM:* **`78 WPM`** in `JetBrains Mono Semi-Bold 24px` (`#94A3B8`).
  - *Consistency:* **`86%`** in `JetBrains Mono Semi-Bold 24px` (`#38BDF8`).
- **Milestone Banner (Conditional):**
  - If official 60s benchmark and Net WPM exceeds user's previous all-time record:
    - Glowing amber badge: **`🏆 NEW ALL-TIME PERSONAL BEST!`**
    - Subtext: *"You beat your previous best of 68 WPM with 98.4% accuracy."*
  - XP Award Pill: **`+110 XP Earned`** (Base: 72 + Precision Bonus: 38).

---

### 3.2 Row 1 (Left): Second-by-Second Speed & Error Timeline Chart
- **Dimensions:** Width `640px`, Height `240px`.
- **Technology:** React Recharts component (`<ResponsiveContainer>`, `<AreaChart>`, `<Line>`).
- **Telemetry Visualized:**
  1. **Primary Speed Curve:** Continuous SVG line (`#2563EB`, stroke width `2.5px`) tracking instantaneous Net WPM calculated across 2-second moving windows.
  2. **Soft Gradient Area:** Fill beneath curve fades from `rgba(37, 99, 235, 0.2)` to transparent.
  3. **Error Spike Markers:** Coral red circular dots (`#EF4444`, radius `4px`) placed on the exact second where an error occurred.
  4. **Average WPM Reference Line:** Subtle dashed horizontal rule (`#64748B`, stroke `1.5px`) representing the session mean.
- **Interactivity:** Hovering over any second snaps a tooltip showing: `Second 24: 74 WPM • 1 Error on 't'`.
- **Accessibility:** Screen reader fallback table provided with minute/second interval summaries.

---

### 3.3 Row 1 (Right): Detailed Keystroke & Accuracy Breakdown
- **Dimensions:** Width `440px`, Height `240px`.
- **Card Structure:** 2-column statistical definition list (`<dl>`):
  - *Total Keystrokes Attempted:* `360`
  - *Correct Keystrokes:* `354` ($98.3\%$)
  - *Gross Incorrect Attempts:* `6`
  - *Mistakes Corrected with Backspace:* `5`
  - *Uncorrected Net Errors:* `1`
  - *Test Elapsed Time:* `60.0s`
  - *Average Keystroke Latency:* `166 ms` (Mean IKI)
- **Visual Polish:** Subtle horizontal dividers (`border-t 1px #1E293B`) between rows with JetBrains Mono numbers.

---

### 3.4 Row 2: Deterministic Weak-Key & Reach Diagnostic Hero
- **Dimensions:** Width `1100px`, Height `130px`, Border `1.5px solid #2563EB`.
- **Deterministic Derivation:**
  The engine filters keystroke logs for characters with an error rate $> 5\%$:
  - Found: Key `R` (2 errors / 18 attempts = 88.8% accuracy).
  - Found: Key `T` (2 errors / 24 attempts = 91.6% accuracy).
  - Found: Key `P` (1 error / 8 attempts = 87.5% accuracy).
- **Visual Presentation:**
  - Three character badges displayed in prominent red/coral pill chips: `[ R: 88% ]`, `[ T: 91% ]`, `[ P: 87% ]`.
  - Diagnostic Explanation:
    > *"Weak Key Diagnosis: 4 of your 6 errors occurred on upper-row reach keys (R, T, P). Focusing on left-index extension will stabilize your rhythm above 75 WPM."*
  - Dedicated Remediation Button: `"Practice Weak Keys (3m Drill) ↵"` linking directly to `/drills/weak-keys`.

---

### 3.5 Row 3: Action Controls & Primary CTA
- **Dimensions:** Width `1100px`, Height `60px`.
- **Action Hierarchy & Accessibility Focus Model:**
  1. **Primary Button: "Retry Same Test"**
     - Dimensions: `260 × 48px`, `#2563EB` fill, white text (contrast 5.17:1).
     - Accessibility Focus: **Receives default focus on initial render**.
     - Keyboard Activation: Pressing **`Enter`** or **`Space`** actuates the focused button immediately to restart `SCR-202` with identical settings.
     - Secondary Accelerator: Global **`F5`** or **`Ctrl + R`**.
  2. **Secondary Button: "Practice Weak Keys"**
     - Dimensions: `220 × 48px`, Outline border `1.5px solid #2563EB`, text `#38BDF8` (Dark) / `#2563EB` (Light).
     - Action: Generates targeted drill and routes to `SCR-402`.
  3. **Tertiary Button: "Configure New Test"**
     - Accelerator: **`Ctrl + N`**.
     - Routes back to `SCR-201`.
  4. **Text Link: "Return to Dashboard"**
     - Keyboard Accelerator: **`Ctrl + 1`**.

---

## 4. Gamification & Personal Best Integrity

### 4.1 Strict Personal Best Eligibility Criteria
To ensure personal records remain meaningful and uncorrupted:
1. **Benchmark Duration:** Must be an official **60-Second Standard Benchmark** test.
2. **Standard Corpus:** Must use standard system corpora (Common English Words or Sentences); custom text or short sprints are ineligible for All-Time PB records.
3. **Accuracy Gate ($\ge 95.0\%$):** Tests with $< 95.0\%$ accuracy are recorded in session history, but are **strictly ineligible for All-Time Personal Best records**.
4. **Pause Limits:** A maximum of **2 pause events** and **$\le 60\text{ seconds}$ total cumulative pause duration** is allowed. Any test exceeding these limits is marked `pbEligible: false`.

### 4.2 Deterministic XP Calculation (Aligned with D3 Governance)
Following the approved D3 gamification model:
- *Words Typed:* $360 / 5 = 72\text{ words}$
- *Minutes Typed:* $60.0 / 60 = 1.0\text{ min}$
- *Base Effort XP:*
  $$XP_{base} = \text{round}(72 \times 0.2) + \text{round}(1.0 \times 5) = 14 + 5 = 19\text{ XP}$$
- *Accuracy Multiplier:* $98.4\% \longrightarrow 1.50\times$ (Flawless Precision Tier):
  $$XP_{accuracy} = \text{round}(19 \times 1.50) = 29\text{ XP}$$
- *New Personal Best Milestone Bonus:* $+100\text{ XP}$ (awarded strictly if PB criteria met).
- **Total XP Awarded:** $29 + 100 = \mathbf{129\text{ XP}}$

### 4.3 Anti-Duplication Security Rule (Idempotent Persistence)
- When `SCR-203` loads, the session payload is posted once to the local backend:
  `POST /api/v1/sessions`
- The payload includes an immutable client-generated UUID (`sessionId`).
- **Idempotency Guarantee:** If the user reloads the page, reviews history, or retries the test, the backend matches the existing `sessionId` and returns HTTP 200 with `duplicate: true`, rendering the stored scorecard. Duplicate XP awards, daily goal double-counting, and streak re-advancements are completely prevented by database constraints.
