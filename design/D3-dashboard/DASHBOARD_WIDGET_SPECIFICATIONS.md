# DASHBOARD WIDGET SPECIFICATIONS (D3)
**Typing Trainer — Windows Desktop Application**
*Screen ID: SCR-101 | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D3 Dashboard Design*

---

## 1. Overview of Dashboard Widgets

The Dashboard Command Center integrates **10 distinct widgets** engineered for rapid cognitive scanning. Every widget is specified below with its data model, visual anatomy, typography, interaction rules, and accessibility semantics.

---

## 2. Widget 01: Welcome & User Status Header

- **Location:** Top left of central workspace stage (`Row 0`).
- **Dimensions:** Width `680px`, Height `100px`.
- **Purpose:** Personal greeting, tier level confirmation, and motivational encouragement.
- **Anatomy:**
  1. *Greeting:* Display Headline ("Welcome back, Alex! 👋") in `Inter Bold 24px`.
  2. *Rank Pill:* Luminous badge ("Level 12 • Apprentice Touch Typist") in `Inter Semi-Bold 11px`.
  3. *Motivational Subtext:* "Ready to build muscle memory today? You are on a 5-day practice streak."
- **Accessibility:** Header tagged as `<h1>` landmark.

---

## 3. Widget 02: Daily Practice Goal Progress Capsule

- **Location:** Top right of central workspace stage (`Row 0`).
- **Dimensions:** Width `380px`, Height `100px`.
- **Purpose:** Tracks progress toward daily practice threshold (20 minutes).
- **Data Model:**
  - Daily Target: `20 minutes`
  - Completed Today: `12 minutes` (60%)
  - Remaining: `8 minutes`
- **Visual Anatomy:**
  1. Circular SVG Progress Ring (diameter 56px, stroke 5px) with electric blue fill (`#2563EB`) and smooth glow dot at endpoint.
  2. Inner Ring Text: `60%` in `JetBrains Mono Bold 12px`.
  3. Metric Text: `12 / 20 mins` in `JetBrains Mono Bold 20px`.
  4. Status Label: `8 mins remaining to seal streak` in `Inter Regular 11px`.
- **Interactivity:** Clicking opens Goal Setting popover (`SCR-901`).

---

## 4. Widget 03: Four Primary Metric Cards

- **Location:** Row 1 (`Height: 124px`, 4-column flex grid, 20px gaps).
- **Visual Structure:** Surface card (`#131B2E` Dark / `#FFFFFF` Light), 1px border (`#1E293B` / `#E2E8F0`), corner radius 12px, padding 16px.

### 4.1 Rigorous Metric Definitions
To eliminate ambiguity, all speed metrics throughout the application use standardized definitions:
1. **Average WPM:** The mathematical mean of Net WPM across the trailing 30 completed benchmark tests.
2. **All-Time Personal Best (Best WPM):** The single highest Net WPM achieved on an official 60s standard test with $\ge 95\%$ accuracy.
3. **Current Session WPM:** The Net WPM achieved in the immediately preceding completed session (displayed in recent session logs and results).
4. **Accuracy %:** All-time weighted accuracy percentage across all completed practice keystrokes:
   $$Accuracy = \frac{TotalCorrectKeystrokes}{TotalKeystrokesTyped} \times 100$$

*(Note: In accordance with offline-first privacy architecture, all comparison metrics are derived strictly from local historical data. Percentile claims against external populations such as "Top 15%" are strictly prohibited without an authenticated global telemetry sample).*

### 4.2 Card Specification Table (Illustrative Sample Profile)

| Card # | Metric Title | Sample Value (JetBrains Mono) | Metric Definition / Context | Trend Indicator (Local History) |
|---|---|---|---|---|
| **Card 1** | **BEST WPM** | **72** | Highest 60s standard test ($\ge 95\%$ Acc) | `+4 WPM vs last week` (Emerald pill) |
| **Card 2** | **AVERAGE WPM** | **58** | Trailing 30-session mean Net WPM | `+2.1 WPM monthly delta` (Blue pill) |
| **Card 3** | **ACCURACY** | **96.4%** | Weighted all-time keystroke precision | `Goal Met (Target: ≥ 95%)` (Emerald pill) |
| **Card 4** | **PRACTICE TIME** | **18h 35m** | Cumulative time across 142 sessions | `5.2 hrs logged this month` |

- **Design Rule:** Numerical values use **`JetBrains Mono Bold 28px`** with tabular numbers (`tabular-nums`) to prevent horizontal jitter.
- **Accessibility:** Stat cards use semantic `<dl>` (definition list) with `<dt>` label and `<dd>` value.

---

## 5. Widget 04: Weekly Practice Activity Chart

- **Location:** Row 2, Left Column (`Width: 540px`, `Height: 240px`).
- **Purpose:** Visualizes practice duration and goal completion over the last 7 calendar days.
- **Visual Anatomy:**
  1. Header: "Weekly Practice Activity" + subtitle ("7-day practice duration & goal completion").
  2. 7 Day Columns (Mon, Tue, Wed, Thu, Fri, Sat, Sun).
  3. Vertical Bar Fill: Height proportional to minutes typed (e.g. 0m to 35m).
  4. Goal Marker: Subtle dashed horizontal line at 20m threshold.
  5. Completion Icons:
     - Day Met: Green checkmark badge (`✓`) beneath column.
     - Day Missed / Rest: Subtle outline dash (`-`).
     - Current Day: Illuminated blue highlight frame around active column.
- **Accessibility:** Fallback tabular text summary provided in `aria-label`: *"Weekly summary: 5 of 7 days completed. Total time: 114 minutes."*

---

## 6. Widget 05: Compact WPM Performance Trend Curve

- **Location:** Row 2, Right Column (`Width: 540px`, `Height: 240px`).
- **Purpose:** Compact Recharts line graph showing WPM progression across the last 15 typing sessions.
- **Visual Anatomy:**
  1. Header: "Speed & Consistency Trend" + range selector ("Last 15 Sessions").
  2. SVG Line Curve: Smooth bezier curve in Electric Cobalt (`#2563EB`, stroke 2.5px).
  3. Shaded Area: Linear gradient drop beneath curve (`rgba(37, 99, 235, 0.15) -> rgba(37, 99, 235, 0.0)`).
  4. Error Spike Markers: Discrete coral red dots (`#EF4444`) annotating sessions with $> 4$ errors.
  5. Axis: Left Y-axis (40, 60, 80 WPM), Bottom X-axis (Session numbers 1 to 15).
- **Interactivity:** Hovering any node displays a floating tooltip with Net WPM, Raw WPM, Accuracy, and Date.

---

## 7. Widget 06: Algorithmic Weak-Key Recommendation Hero Banner

- **Location:** Row 3 (`Width: 1100px`, `Height: 140px`).
- **Purpose:** Deterministic remediation engine pinpointing the user's top error-prone characters.
- **Deterministic Derivation:**
  - Evaluates local SQLite error matrix:
    $$ErrorRate(k) = \frac{Errors(k)}{Keystrokes(k)}$$
  - Identifies top 3 keys with error rate $> 8\%$.
- **Sample Output:**
  - **Identified Keys:** `R` (72% accuracy), `T` (78% accuracy), `P` (81% accuracy).
  - **Diagnostic Copy:** *"Keys to improve: R, T, P have a higher error rate in your recent sessions. These diagonal index and pinky reaches are dragging down your overall WPM."*
- **Action Button:**
  - **Label:** `"Practice Weak Keys (3m Drill) ↵"`
  - **Styling:** Primary button using verified Cobalt Blue (`#2563EB`) with white text (contrast 5.17:1).
  - **Action:** 1-click launch into `SCR-402` with pre-filtered drill text.

---

## 8. Widget 07: Quick Practice Action Cards (5 Interactive Portals)

- **Location:** Row 4 (`Height: 130px`, 5-column grid, 16px gap, 204px per card).
- **Purpose:** Instant 1-click launchpad into all five practice modes.

| Card Name | Icon | Headline | Subtext | Primary Action Affordance |
|---|---|---|---|---|
| **01. Typing Test** | `⚡` | **Typing Test** | Standard 60s Benchmark | "Start Test" (Highlighted Primary Border) |
| **02. Learning Mode**| `🎓` | **Learning** | Resume Lesson 07 (Top Row) | "Continue Lesson →" |
| **03. Skill Drills** | `🎯` | **Weak Keys** | Custom N-Gram repetition | "Launch Drill →" |
| **04. Developer Mode**| `💻` | **Dev Studio** | TypeScript / Java / Python | "Code Syntax →" |
| **05. Typing Games** | `🎮` | **Arcade Games** | Falling Words & Sprint | "Play Arcade →" |

- **State Polish:** Subtle upward card translation (`translateY(-2px)`) and luminous border glow on mouse hover.

---

## 9. Widget 08: Gamification Progression & Streak Widget

- **Location:** Row 5, Left Column (`Width: 540px`, `Height: 180px`).
- **Purpose:** Visual progression hub tracking XP, tier advancement, and streak protection.

### 9.1 Balanced, Beginner-Friendly Gamification Rules
1. **Meaningful Effort Reward (No Zero-Credit for Beginners):**
   - Every completed practice session awards guaranteed **Base Effort XP** based on active practice time and words typed:
     $$XP_{base} = \text{round}(WordsTyped \times 0.2) + \text{round}(MinutesTyped \times 5)$$
   - High accuracy adds a compounding performance multiplier ($+20\%$ to $+50\%$), but beginners with $80–89\%$ accuracy still earn their earned base effort XP ($0.75\times$). Beginners are never punished with 0 XP for genuine practice.
2. **Daily Goal Bonus (+150 XP):**
   - Awarded strictly once per calendar day upon reaching the user-configured daily practice threshold (e.g., 20 minutes or 1,000 words).
   - Serves as an uninflated, deterministic daily milestone.
3. **Non-Punitive Streak Habit Loops:**
   - Streaks advance only upon reaching the daily goal.
   - Beginners can configure modest daily goals (e.g., 5 or 10 minutes) to build confidence.
   - Earned **Streak Freeze Shields** (1 shield earned per 7 days of practice) automatically protect active streaks from breaking during travel, rest days, or illness.

### 9.2 Widget Visual Anatomy
1. Level 12 Hexagon Crest + "Apprentice Typist" tier title.
2. XP Progress Bar: `2,450 / 3,000 XP (81.6%)` with dual-color gradient fill (`#2563EB` to `#06B6D4`).
3. Streak Status: `🔥 5-Day Active Streak` + `🛡 1 Streak Freeze Shield Available`.
4. Next Milestone Card: *"Reach Level 13 to unlock Journeyman Tier & Custom Caret Themes."*

---

## 10. Widget 09: Personal Best Showcase

- **Location:** Row 5, Right Column (`Width: 540px`, `Height: 180px`).
- **Purpose:** Restrained, prestigious showcase celebrating verified official benchmark records ($\ge 95\%$ accuracy).
- **Benchmark Categories & Definitions:**
  1. **Highest 15-Second WPM:** Personal record achieved on an official 15s speed sprint with $\ge 95\%$ accuracy (`Sample: 84 WPM @ 99.1% Acc`).
  2. **Highest 60-Second WPM (All-Time Standard PB):** Personal record on the standard 60s benchmark with $\ge 95\%$ accuracy (`Sample: 72 WPM @ 98.4% Acc`).
  3. **Developer Mode WPM:** Personal record typing multi-line code blocks with syntax symbols and auto-indentation with $\ge 95\%$ accuracy (`Sample: 58 WPM @ 97.2% Acc`).
  4. **Longest Practice Session:** Cumulative single uninterrupted practice session (`Sample: 42 mins continuous`).
- **Aesthetic:** Brushed steel / bronze metallic badge icons with subdued gold borders.
- **Data Integrity:** Any sprint where accuracy falls below $95.0\%$ is recorded in session history but marked ineligible for Personal Best records.

---

## 11. Widget 10: Recent Practice Sessions Log Table

- **Location:** Row 6 (`Width: 1100px`, `Height: 200px`).
- **Purpose:** Historical audit log displaying the last 3 completed sessions with full telemetry.
- **Columns:**
  - *Activity / Mode* (e.g., "60s English Benchmark", "Lesson 06: Index Reaches")
  - *Net Speed* (`72 WPM`, `58 WPM`)
  - *Accuracy* (`98.4%`, `96.8%`)
  - *Error Tally* (`2 Errors`, `3 Errors`)
  - *Time Completed* (`Today, 3:45 PM`, `Yesterday`)
  - *XP Earned* (`+110 XP`, `+85 XP`)
- **Action:** Clicking any row opens historical results scorecard drawer.
