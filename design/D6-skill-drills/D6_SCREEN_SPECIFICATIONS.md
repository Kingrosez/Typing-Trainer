# D6 SCREEN SPECIFICATIONS: SKILL DRILLS & REMEDIATION STUDIO
**Typing Trainer — Windows Desktop Application**
*Screen IDs: SCR-401, SCR-402, SCR-403, SCR-404, SCR-405*
*Target Resolution: 1440 × 900 (Responsive: 1280 × 720 to 2560 × 1440)*
*Document Version: 1.0.0 | Stage: D6 Stage 2 UX and Functional Specifications*
*Date: 2026-11-18 | Status: SPECIFICATION COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Global Shell Geometry & Desktop Layout (1440 × 900)

All five D6 screens adhere to the standard Typing Trainer desktop shell:

```
+---------------------------------------------------------------------------------------------------+
| TITLEBAR: Windows Chrome • [⌨] Typing Trainer • [●] Offline Ready • [Ctrl+K] Search • [_][□][✕]    | (36px)
+-------------------+-------------------------------------------------------------------------------+
| SIDEBAR (240px)   | MAIN APPLICATION STAGE (1200px Canvas / 1100px Centered Stage)                |
| [🎯] Dashboard    |                                                                               |
| [⚡] Typing Test  | Padding: Top 24px, Bottom 24px, Left 50px, Right 50px                        |
| [🎓] Learning Mode| Content Stage Max-Width: 1100px (Centered)                                   |
| [🎯] Skill Drills |                                                                               |
| [💻] Developer Mode|                                                                               |
| [🎮] Games        |                                                                               |
| [📊] Analytics    |                                                                               |
|                   |                                                                               |
| [⚙] Settings      |                                                                               |
+-------------------+-------------------------------------------------------------------------------+
| STATUS BAR: Ready • WPM: 42 • Active Profile: Local User • Engine: 60Hz                           | (32px)
+---------------------------------------------------------------------------------------------------+
```

---

## 2. SCR-401: Skill Drills Studio Overview

### 2.1 Layout Wireframe (1440 × 900)

```
+---------------------------------------------------------------------------------------------------+
| HEADER: Skill Drills Studio Overview                 [ ℹ️ Diagnostic Window: Last 100 Strokes/14d ]|
| Subtitle: Targeted practice and error reduction based on local typing telemetry                   |
+---------------------------------------------------------------------------------------------------+
| ROW 1: KEYBOARD SKILL HEALTH HERO CARD (1100 × 130px)                                              |
| +-------------------------+-----------------------------------------+---------------------------+ |
| | [ 94.2% ]               | STATUS BREAKDOWN                        | PRIMARY ACTION            | |
| | Radial Health Gauge     | • Mastered: 38 keys (≤3% error)         | [ Drill Recommended ]     | |
| | "Overall Keyboard Skill | • Stable:    5 keys (3-5% error)        | [ Weak Keys (Enter) ]     | |
| |  Health Index"          | • Developing: 1 key  (5-8% error)       | (#2563EB Cobalt Button,   | |
| | (Single-User Aggregate) | • Weak Keys:  3 keys (>8% error)        |  5.17:1 WCAG AA Contrast) | |
| +-------------------------+-----------------------------------------+---------------------------+ |
+---------------------------------------------------------------------------------------------------+
| ROW 2: DIAGNOSTIC SPLIT GRID (1100 × 280px)                                                       |
| +-----------------------------------------+ +---------------------------------------------------+ |
| | WEAK-KEY WATCHLIST (540 × 280px)        | | FINGER-ZONE PERFORMANCE SUMMARY (540 × 280px)     | |
| | Top Priority High-Friction Keys:        | | Left Hand vs Right Hand Accuracy Distribution:    | |
| | 1. [ P ]  12.4% Err • 89 strokes • -> O | | L-Pinky: 93.8% [████████████░░] (Amber 6.2% Err)  | |
| | 2. [ B ]   9.8% Err • 62 strokes • -> V | | L-Ring:  97.4% [██████████████] (Stable 2.6% Err) | |
| | 3. [ ; ]   8.9% Err • 45 strokes • -> L | | L-Mid:   98.9% [██████████████] (Mastered 1.1% Err| |
| |                                         | | L-Index: 96.5% [█████████████░] (Stable 3.5% Err) | |
| |                                         | | ------------------------------------------------- | |
| | [ Deep Weak-Key Analysis Lab (Ctrl+2) →]| | R-Index: 97.8% [██████████████] (Stable 2.2% Err) | |
| |                                         | | R-Pinky: 91.2% [███████████░░░] (Weak 8.8% Err)   | |
| +-----------------------------------------+ +---------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
| ROW 3: PRACTICE MODE QUICK-LAUNCHPAD (1100 × 180px)                                               |
| +-------------------+ +-------------------+ +-------------------+ +-----------------------------+ |
| | [🎯] WEAK KEYS    | | [🔤] N-GRAMS      | | [📚] VOCABULARY   | | [📄] CUSTOM TEXT / FILE     | |
| | Remediation       | | Digraph Fluency   | | Frequency Tiers   | | Technical Import Studio     | |
| | Auto-generated    | | High-frequency    | | Top 100, 300,     | | Paste text or load local    | |
| | drills on P, B, ; | | letter pairs      | | 1000 common words | | .txt / .md files to drill   | |
| | [ Launch Drill ]  | | [ Launch Drill ]  | | [ Launch Drill ]  | | [ Import Material ]         | |
| +-------------------+ +-------------------+ +-------------------+ +-----------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

### 2.2 Component & Token Specifications (SCR-401)
- **Keyboard Skill Health Card:** Dimensions `1100 × 130px`, Corner Radius `12px`, Border `1px solid #1E293B` (Dark) / `#E2E8F0` (Light). Radial gauge uses `#2563EB` fill on `#131B2E` surface.
- **Weak-Key Watchlist Card:** Dimensions `540 × 280px`. Key badges use `JetBrains Mono Bold 18px` with Coral Red indicator (`#EF4444`) on weak keys ($> 8\%$).
- **Finger-Zone Performance Card:** Dimensions `540 × 280px`. Horizontal bar gauge width `180px`, height `8px`. Green `#10B981` ($\ge 97\%$), Cyan `#06B6D4` ($95–97\%$), Amber `#F59E0B` ($92–95\%$), Red `#EF4444` ($< 92\%$).
- **Practice Mode Cards:** Dimensions `260 × 180px` each, Gap `20px`. Border hover highlights to `#2563EB` with `2px translateY(-2px)` elevation lift.

---

## 3. SCR-402: Weak-Key Analysis Lab

### 3.1 Layout Wireframe (1440 × 900)

```
+---------------------------------------------------------------------------------------------------+
| HEADER: [← Skill Drills] • Weak-Key Diagnostic Analysis Lab       [ Rolling Window: Last 100/14d ]|
+---------------------------------------------------------------------------------------------------+
| HEATMAP TOOLBAR & FILTER BAR (1100 × 44px)                                                        |
| View Metric: (•) Error Frequency %   ( ) Raw Accuracy %   ( ) Hesitation Latency (ms)             |
| Legend: [■ ≤3% Mastered] [■ 3-5% Stable] [■ 5-8% Developing] [■ >8% Weak Key] [■ <20 Calibrating] |
+---------------------------------------------------------------------------------------------------+
| 65% ANSI KEYBOARD INTERACTIVE HEATMAP (1100 × 260px)                                              |
| +-----------------------------------------------------------------------------------------------+ |
| | [`~] [1 ] [2 ] [3 ] [4 ] [5 ] [6 ] [7 ] [8 ] [9 ] [0 ] [- ] [= ] [ Backspace ] [Del]          | |
| | [Tab  ] [Q ] [W ] [E ] [R ] [T ] [Y ] [U ] [I ] [O ] [P*] [{ ] [} ] [ \  | ]   [PgUp]         | |
| | [Caps  ] [A ] [S ] [D ] [F*] [G ] [H ] [J*] [K ] [L ] [;*] [' ] [ Enter     ]   [PgDn]         | |
| | [Shift   ] [Z ] [X ] [C ] [V ] [B*] [N ] [M ] [, ] [. ] [/ ] [ Shift      ] [▲] [End ]         | |
| | [Ctrl] [Win] [Alt] [            Spacebar            ] [Alt] [Fn] [Ctrl] [◄] [▼] [►]           | |
| +-----------------------------------------------------------------------------------------------+ |
| * Keys highlighted with Coral Red border indicate Active Weak Keys (e.g. P, B, ;)                 |
+---------------------------------------------------------------------------------------------------+
| BOTTOM DIAGNOSTIC SPLIT (1100 × 320px)                                                            |
| +-----------------------------------------+ +---------------------------------------------------+ |
| | KEY INSPECTOR: KEY 'P' (540 × 320px)    | | EXPLAINABILITY & TREND ANALYSIS (540 × 320px)     | |
| | Badge: [ P ]  Right Pinky • Weak (>8%)  | | Observable Performance Summary:                   | |
| | Total Opportunities: 89 strokes         | | "Target key 'P' error frequency (12.4%) is        | |
| | Error Rate: 12.4% (11 mistakes)         | |  significantly higher than your 3.1% keyboard     | |
| | Corrected: 8 (73%) • Uncorrected: 3     | |  baseline. 62% of errors result from adjacent     | |
| | Hesitation Latency: 245ms (+85ms delay) | |  drift into 'O', indicating pinky extension       | |
| |                                         | |  hesitation from home anchor key 'L'."            | |
| | Confusion Matrix (Where did hits go?):  | |                                                   | |
| | 1. Struck 'O' instead: 7 times (63.6%)  | | Historical Accuracy Trend (Last 10 Sessions):     | |
| | 2. Struck ';' instead: 3 times (27.3%)  | | [Graph: 84% -> 86% -> 88% -> 85% -> 87.6%]        | |
| | 3. Struck '[' instead: 1 time  ( 9.1%)  | |                                                   | |
| |                                         | | Action: [ Configure Targeted Drill for 'P' (Enter)]| |
| +-----------------------------------------+ +---------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

### 3.2 Component & Token Specifications (SCR-402)
- **Heatmap Keycaps:** Standard keycap size `48 × 48px`, Gap `4px`. Keycaps render semantic token fills:
  - Mastered ($\le 3\%$): Background `#064E3B` (Dark) / `#D1FAE5` (Light), Border `#10B981`.
  - Stable ($3–5\%$): Background `#0C4A6E` (Dark) / `#E0F2FE` (Light), Border `#0284C7`.
  - Developing ($5–8\%$): Background `#78350F` (Dark) / `#FEF3C7` (Light), Border `#D97706`.
  - Weak ($> 8\%$): Background `#7F1D1D` (Dark) / `#FEE2E2` (Light), Border `#EF4444`.
  - Calibrating ($< 20$ strokes): Background `#1E293B` (Dark) / `#F1F5F9` (Light), Border `#64748B`.
- **Confusion Matrix Table:** Width `100%`, Row Height `32px`. Text formatted with `tabular-nums`.

---

## 4. SCR-403: Drill Configuration & Personalization Studio

### 4.1 Layout Wireframe (1440 × 900)

```
+---------------------------------------------------------------------------------------------------+
| HEADER: [← Skill Drills] • Drill Configuration Studio                                             |
+---------------------------------------------------------------------------------------------------+
| MODE SELECTOR TABS (1100 × 40px)                                                                  |
| [🎯 Weak-Key Remediation (Active)]  [🔤 N-Grams/Bigrams]  [📚 Vocabulary Tiers]  [📄 Custom Import] |
+---------------------------------------------------------------------------------------------------+
| CONFIGURATION SPLIT WORKSPACE (1100 × 520px)                                                      |
| +-----------------------------------------+ +---------------------------------------------------+ |
| | PARAMETER SELECTION PANEL (540 × 520px) | | LIVE PASSAGE PREVIEW & IMPACT (540 × 520px)       | |
| | 1. Target Keys:                         | | Deterministic Generator Preview:                  | |
| |    [✓ P] [✓ B] [✓ ;] [+ Add Key]        | | +-----------------------------------------------+ | |
| |    Presets: (•) Auto Weak ( ) R-Pinky   | | | pop drop paper pool apply blob bubble habit   | | |
| |                                         | | | brave subtle public problem probe peak        | | |
| | 2. Exercise Progression Stage:          | | | simple sample copy open plane loop pipe       | | |
| |    ( ) Stage 1: Character Isolation     | | | rapid reply please help proud plan            | | |
| |    (•) Stage 2: Word Families (Selected)| | +-----------------------------------------------+ | |
| |    ( ) Stage 3: Natural Context Prose   | |                                                   | |
| |                                         | | Passage Telemetry:                                | |
| | 3. Practice Scope:                      | | • Total Words: 65 words (345 characters)          | |
| |    Mode: (•) Timed Duration  ( ) Words  | | • Target Key Density: 34.2% (91 target strokes)   | |
| |    Duration: [ 1m ] [ 2m*] [ 3m ] [ 5m ]| | • Seed Hash: #WK-7842-P-B (Deterministic)         | |
| |    (Word Mode: [ 25 ] [ 50 ] [ 100 ])    | |                                                   | |
| |                                         | | Mastery Opportunity Floor:                        | |
| | 4. Syntax & Modifiers:                  | | [ ℹ️ 91 Target strokes projected (>30 min floor).| |
| |    [ ] Include Punctuation              | |      Completing with ≤3% error on 'P' qualifies    | |
| |    [ ] Include Numbers                  | |      as Session 2 of 3 for Mastery. ]             | |
| +-----------------------------------------+ +---------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
| BOTTOM ACTION BAR (1100 × 60px)                                                                   |
| [ Reset Defaults ]                                            [ Begin Drill Practice (Enter) → ]  |
|                                                               (#2563EB Cobalt, 5.17:1 Contrast)   |
+---------------------------------------------------------------------------------------------------+
```

### 4.2 Component & Token Specifications (SCR-403)
- **Target Key Chips:** Height `32px`, Padding `8px 12px`, Corner Radius `6px`. Active chips use `#2563EB` background with white text and close icon (`✕`).
- **Passage Preview Box:** Background `#0B0F19` (Dark) / `#F8FAFC` (Light), Border `1px solid #1E293B`, Font `JetBrains Mono 15px`, Line Height `24px`. Target characters within words are subtly underlined.

---

## 5. SCR-404: Interactive Skill Drill Arena

### 5.1 Layout Wireframe (1440 × 900)

```
+---------------------------------------------------------------------------------------------------+
| REMEDIATION FOCUS HUD (1100 × 52px)                                                               |
| Active Focus: [ Target Keys: P, B, ; ] [ Focus Finger: Right Pinky / Left Index ] [ Goal: ≤3% Err]|
| Live Metrics: [ Accuracy: 98.4% ] [ Speed: 46 WPM ] [ Progress: 28/50 Words (56%) ]               |
+---------------------------------------------------------------------------------------------------+
| PRIMARY MONOSPACE TYPING CANVAS (1100 × 300px)                                                    |
|                                                                                                   |
|                      [ R-Pinky ]  <-- Floating Finger Hint (Toggleable via F1)                    |
|                      |                                                                            |
|        pop drop paper pool apply blob bubble habit brave subtle public                            |
|        ^^^^^^^^^^^^^^^^^^|                                                                        |
|                          Caret (Cobalt Glide, 50ms transform)                                     |
|        problem probe peak simple sample copy open plane loop pipe                                 |
|        rapid reply please help proud plan speed point prompt                                      |
|                                                                                                   |
| Legend: Electric Sky Blue = Correct, Coral Red + Wavy Underline = Miskeyed, Slate = Upcoming       |
+---------------------------------------------------------------------------------------------------+
| AUXILIARY GUIDANCE CANVAS (1100 × 260px) (Toggleable via F2)                                      |
| +-----------------------------------------------------------------------------------------------+ |
| | MINI MECHANICAL KEYBOARD VISUALIZER (Pastel 65% ANSI)                                         | |
| | Active Target Key 'P' is illuminated in Cobalt Blue (#2563EB)                                  | |
| | An animated dashed trajectory reach arc extends from Home Anchor 'L' to 'P'                    | |
| +-----------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
| ARENA STATUS BAR (1100 × 36px)                                                                    |
| [Esc] Pause Drill   •   [F1] Finger Hints (ON)   •   [F2] Keyboard (ON)   •   [F5] Restart Drill  |
+---------------------------------------------------------------------------------------------------+
```

### 5.2 Component & Token Specifications (SCR-404)
- **Typing Font:** `JetBrains Mono Medium 28px`, Line Height `56px`.
- **Character Colors:**
  - Correct: `#38BDF8` (Sky Blue, Dark Theme) / `#0284C7` (Cobalt, Light Theme).
  - Incorrect: `#EF4444` (Coral Red) with `2px wavy underline`.
  - Upcoming / Untyped: `#64748B` (Dark Theme) / `#94A3B8` (Light Theme).
- **Floating Finger Hint Pill:** Background `#1E293B`, Border `1px solid #38BDF8`, Font `12px JetBrains Mono Bold`, Color `#38BDF8`. Positioned 8px above the active target character.

---

## 6. SCR-405: Drill Results & Improvement Scorecard

### 6.1 Layout Wireframe (1440 × 900)

```
+---------------------------------------------------------------------------------------------------+
| HEADER: [✓ Drill Completed] • Targeted Remediation Results                                        |
| Outcome Badge: [ 🌟 EXCELLENT PROGRESS: SIGNIFICANT ERROR REDUCTION DEMONSTRATED ]               |
+---------------------------------------------------------------------------------------------------+
| ROW 1: PRIMARY PERFORMANCE TELEMETRY CARDS (1100 × 110px)                                         |
| +-------------------+ +-------------------+ +-------------------+ +-----------------------------+ |
| | NET SPEED         | | SESSION ACCURACY  | | TARGET KEY ACC    | | XP EARNED                   | |
| | 48 WPM            | | 98.5%             | | 97.8%             | | +58 XP                      | |
| | Gross: 49 WPM     | | Target: ≥95.0%    | | 91 Target Strokes | | Base: 39 XP • Multiplier: 1.5x|
| +-------------------+ +-------------------+ +-------------------+ +-----------------------------+ |
+---------------------------------------------------------------------------------------------------+
| ROW 2: BEFORE-AND-AFTER TARGET KEY IMPROVEMENT BREAKDOWN (1100 × 240px)                           |
| +-----------------------------------------------------------------------------------------------+ |
| | Key | Historical Error % | Drill Session Error % | Delta Improvement     | Session Outcome    | |
| |-----+--------------------+-----------------------+-----------------------+--------------------| |
| | [P] | 12.4% (89 strokes) |  2.2% (45 strokes)    | -10.2% Error Drop [▲] | QUALIFIED FOR MASTERY|
| | [B] |  9.8% (62 strokes) |  3.1% (32 strokes)    |  -6.7% Error Drop [▲] | Developing         | |
| | [;] |  8.9% (45 strokes) |  0.0% (14 strokes)*   |  -8.9% Error Drop [▲] | Insufficient Size* | |
| +-----------------------------------------------------------------------------------------------+ |
| * Note: Key ';' had 14 strokes (<30 min required); provides practice credit but not mastery step.  |
+---------------------------------------------------------------------------------------------------+
| ROW 3: MULTI-SESSION MASTERY PROGRESS GAUGE (1100 × 110px)                                        |
| +-----------------------------------------------------------------------------------------------+ |
| | KEY 'P' MASTERY PROGRESSION: [████████████████████░░░░░░░░░░] 2 OF 3 CLEAN SESSIONS QUALIFIED  | |
| | Status: VALIDATING • 1 more session with ≤3.0% error (≥30 strokes) required to graduate to Mastered|
+---------------------------------------------------------------------------------------------------+
| ROW 4: RESULTS ACTION BAR (1100 × 60px)                                                           |
| [ View Updated Heatmap (SCR-402) ]   [ Return to Studio (SCR-401) ]    [ Next Remediation Drill → ]|
|                                                                        (#2563EB Primary Action)    |
+---------------------------------------------------------------------------------------------------+
```

### 6.2 Component & Token Specifications (SCR-405)
- **Improvement Table:** Width `1100px`. Positive delta (`-10.2% Error Drop`) is highlighted in Emerald Green `#10B981` with an upward arrow.
- **Mastery Gauge Card:** Dimensions `1100 × 110px`, Background `#131B2E` (Dark) / `#FFFFFF` (Light). Progress bar height `12px`, dual-color fill (`#2563EB` to `#10B981`).
- **Action Buttons:** Standard height `44px`, primary action uses `#2563EB` with white text.
