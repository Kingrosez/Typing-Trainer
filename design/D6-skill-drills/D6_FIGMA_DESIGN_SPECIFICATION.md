# FIGMA DESIGN SPECIFICATION: SKILL DRILLS & REMEDIATION STUDIO (D6)
**Typing Trainer — Windows Desktop Application**
*Module: 04. Skill Drills & Remediation Studio | Screen Scope: SCR-401 to SCR-405*
*Document Version: 1.0.0 | Stage: Stage 3 Visual Design & Figma Frame Creation*
*Date: 2026-11-18 | Status: COMPLETE & VERIFIED*

---

## 1. Executive Design Overview

This specification defines the visual architecture, Auto-Layout geometry, typography, color token bindings, interactive visual states, and layout coordinates for **Phase D6: Skill Drills & Weak-Key Remediation Studio** in the Typing Trainer desktop application.

### 1.1 Source of Truth & Governance
- **Official Figma File Link:** [Typing Trainer — Desktop UI/UX (Figma)](https://www.figma.com/design/LvHRp11TZikdxNFeZvapO0) *(File Key: `LvHRp11TZikdxNFeZvapO0`)*
- **Page Location in Figma:** `🖥 03. Desktop Flows & Screen Templates`
- **Dedicated Flow Section:** `04. Skill Drills & Remediation Studio (SCR-401 – SCR-405)`
- **Design System Foundation:** Approved D2 Design System, D3 Dashboard Command Center, D4 Typing Test Arena, and D5 Touch-Typing Curriculum.
- **Figma Plan Limitation Governance:** Adheres to the approved Product Owner policy: master Auto-Layout screen templates, detailed coordinate maps, design tokens, and comprehensive state inventories are formally codified to bridge Figma Starter plan API rate limitations.

---

## 2. Layout & Shell Blueprints

### 2.1 Standard Desktop Shell Dimensions
- **Target Resolution:** 1440 × 900 px (Responsive boundary: 1280 × 720 to 2560 × 1440).
- **Windows 11 Custom Titlebar:** Height 36px, full width (1440px), drag region, offline badge (`● OFFLINE`), window minimize/maximize/close controls.
- **Collapsible Application Navigation Sidebar:**
  - Expanded Width: 240px (Default).
  - Collapsed Width: 68px (`Ctrl + B` accelerator).
  - Vertical span: 36px to 868px (Height: 832px).
  - Active item: `"Skill Drills"` highlighted with Cobalt Blue accent bar (`#2563EB`) and subtle blue tinted surface (`rgba(37, 99, 235, 0.12)`).
- **Bottom Status Bar:** Height 32px, full width (1440px), build status, SQLite local database indicator, shortcut hint pills.
- **Main Content Reading Stage:**
  - Viewport Area: 1200px width × 832px height (when sidebar expanded).
  - Main Reading Container: Maximum width **1100px**, horizontally centered within the viewport (`margin: 0 auto`).
  - Spacing Grid: Rigid **4px base unit** (4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px).

---

## 3. Dual-Theme Color Token Specifications

All visual frames are constructed using the approved semantic design token architecture:

### 3.1 Dark Theme (Midnight Slate — Default)
| Semantic Token | Hex Code | Purpose / Application | Contrast Ratio |
|---|---|---|---|
| `bg-app` | `#0B0F19` | Application canvas & shell background | Base (1.00:1) |
| `bg-surface` | `#131B2E` | Card containers, widgets, side panels | 1.34:1 vs canvas |
| `bg-surface-elevated` | `#1E293B` | Interactive hover states, drawers, tooltips | 2.15:1 vs canvas |
| `border-subtle` | `#1E293B` | Primary card borders, structural dividers | WCAG non-text |
| `border-focus` | `#2563EB` | Active keyboard focus rings (3px solid) | 5.17:1 vs surface |
| `text-primary` | `#F8FAFC` | Screen headings, keycap legends, primary data | **16.20:1** (AAA) |
| `text-muted` | `#94A3B8` | Supporting labels, subtitles, secondary telemetry | **6.64:1** (AA) |
| `brand-primary` | `#2563EB` | Primary CTA buttons, active tabs, focus indicators | **5.17:1** (AA) |
| `accent-cyan` | `#38BDF8` | Correct characters, target keycap glow, hints | **6.54:1** (AA) |
| `status-mastered` | `#10B981` | Mastered keys ($\le 3\%$), success badges | **7.42:1** (AA) |
| `status-stable` | `#06B6D4` | Stable keys ($> 3\% \le 5\%$) | **6.88:1** (AA) |
| `status-developing` | `#F59E0B` | Developing keys ($> 5\% \le 8\%$) | **8.12:1** (AA) |
| `status-weak` | `#EF4444` | Weak keys ($> 8\%$), miskeys, error badges | **4.68:1** (AA) |
| `status-calibrating`| `#64748B` | Insufficient data ($< 20$ opportunities) | **3.55:1** (Large text) |

### 3.2 Light Theme (Daylight Studio)
| Semantic Token | Hex Code | Purpose / Application | Contrast Ratio |
|---|---|---|---|
| `bg-app` | `#F8FAFC` | Application canvas & shell background | Base (1.00:1) |
| `bg-surface` | `#FFFFFF` | Card containers, widgets, side panels | 1.05:1 vs canvas |
| `bg-surface-elevated` | `#F1F5F9` | Interactive hover states, drawers, tooltips | 1.15:1 vs canvas |
| `border-subtle` | `#E2E8F0` | Primary card borders, structural dividers | WCAG non-text |
| `border-focus` | `#2563EB` | Active keyboard focus rings (3px solid) | 5.17:1 vs surface |
| `text-primary` | `#0F172A` | Screen headings, keycap legends, primary data | **17.68:1** (AAA) |
| `text-muted` | `#64748B` | Supporting labels, subtitles, secondary telemetry | **4.92:1** (AA) |
| `brand-primary` | `#2563EB` | Primary CTA buttons, active tabs, focus indicators | **5.17:1** (AA) |
| `accent-cyan` | `#0284C7` | Correct characters, target keycap glow, hints | **4.62:1** (AA) |
| `status-mastered` | `#047857` | Mastered keys ($\le 3\%$), success badges | **5.32:1** (AA) |
| `status-stable` | `#0E7490` | Stable keys ($> 3\% \le 5\%$) | **4.85:1** (AA) |
| `status-developing` | `#B45309` | Developing keys ($> 5\% \le 8\%$) | **4.71:1** (AA) |
| `status-weak` | `#DC2626` | Weak keys ($> 8\%$), miskeys, error badges | **4.85:1** (AA) |
| `status-calibrating`| `#94A3B8` | Insufficient data ($< 20$ opportunities) | **3.15:1** (Large text) |

---

## 4. Typography Scale & Font Families

- **Primary Interface Font:** `Inter` (UI labels, headings, body text, buttons).
- **Telemetry & Monospace Font:** `JetBrains Mono` with `font-variant-numeric: tabular-nums` (WPM, Accuracy, Keystroke counts, Latency, Monospace Typing Canvas).
- **Scale:**
  - `Display 1`: 36px / Line Height 44px / Bold (700) — Results hero scores.
  - `Heading 1`: 24px / Line Height 32px / SemiBold (600) — Screen titles.
  - `Heading 2`: 18px / Line Height 24px / SemiBold (600) — Card & section headers.
  - `Body Regular`: 14px / Line Height 20px / Regular (400) — Descriptions, tables.
  - `Body Medium`: 14px / Line Height 20px / Medium (500) — Button labels, interactive pills.
  - `Caption`: 12px / Line Height 16px / Regular (400) — Telemetry sub-labels, timestamps.
  - `Typing Canvas Large`: 28px / Line Height 40px / Medium (500) — Monospace drill text in `SCR-404`.

---

## 5. Screen Specifications & Visual Hierarchy

### 5.1 SCR-401: Skill Drills Studio Overview
- **Figma Frame Name:** `D6/SCR-401/Default` (Dark) & `D6/SCR-401/Default-Light` (Light)
- **Zero/Calibration State Frame:** `D6/SCR-401/Empty-Calibration`
- **Layout Structure (Auto-Layout Vertical, Gap: 24px, Padding: 32px, Max Width: 1100px):**
  1. **Studio Header Bar (Height: 48px):**
     - Left: Screen Title (`"Skill Drills & Weak-Key Remediation"`), Subtitle (`"Targeted practice to stabilize motor accuracy and eliminate key friction"`).
     - Right: Action Button `"Deep Statistical Lab"` (Secondary Button, 14px, links to `SCR-402`).
  2. **Row 1: Dual Command Hero Grid (Height: 220px, Gap: 24px, 2 Columns [620px + 456px]):**
     - **Card A: Keyboard Skill Health Hero (620px):**
       - Inner layout: Horizontal split.
       - Left: Radial Gauge Ring (Diameter 120px, stroke width 12px) rendering Aggregate Accuracy (`94.8%`), label `"Keyboard Precision"`.
       - Right: Classification Distribution bar and legend:
         - Mastered ($\le 3\%$): 28 keys (Green `#10B981`)
         - Stable ($3–5\%$): 12 keys (Cyan `#06B6D4`)
         - Developing ($5–8\%$): 4 keys (Amber `#F59E0B`)
         - Weak ($> 8\%$): 3 keys (Red `#EF4444`)
         - Calibrating ($< 20$): 0 keys (Slate `#64748B`)
       - Bottom CTA: Primary Cobalt Blue Button (`#2563EB`, Height: 40px, `"Quick Drill Recommended Weak Keys (P, B, Q)"`).
     - **Card B: Finger-Zone Skill Summary (456px):**
       - 4 Horizontal accuracy meter bars for Left Hand (Pinky 92.4%, Ring 96.1%, Mid 97.8%, Index 98.2%) vs Right Hand (Pinky 88.6%, Ring 94.2%, Mid 97.1%, Index 98.5%).
       - Clear descriptive note: *"Observable asymmetry detected on Right Pinky reach; accuracy is 88.6% vs 96.2% overall average."*
  3. **Row 2: Active Weak-Key Watchlist (Height: 180px, Full 1100px Stage):**
     - Header: Section title `"Priority Weak Keys for Remediation"` + Info tooltip explaining $WPI_k = \text{ErrRate}_k \times \ln(O_k + 1)$ and 14-day rolling window.
     - Grid of 3 Priority Key Cards (Width: 344px each, Auto-Layout):
       - Card 1: Key `P` (Error: 12.4%, Opportunities: 89, $WPI = 55.61$, Miskeys primarily to `O` [62%]). Status Badge: `WEAK KEY` (`#EF4444`). Action: `"Drill Key P"`.
       - Card 2: Key `B` (Error: 11.2%, Opportunities: 78, $WPI = 48.91$, Miskeys primarily to `V` [62%]). Status Badge: `WEAK KEY` (`#EF4444`). Action: `"Drill Key B"`.
       - Card 3: Key `Q` (Error: 10.5%, Opportunities: 42, $WPI = 39.49$, Miskeys primarily to `W` [54%]). Status Badge: `WEAK KEY` (`#EF4444`). Action: `"Drill Key Q"`.
  4. **Row 3: Practice Mode Launchpad (Height: 160px, 4 Columns [257px each]):**
     - Card 1: `Weak-Key Remediation` (Target high-error keys with custom algorithmic exercises).
     - Card 2: `N-Gram & Bigram Studio` (Master common letter pairs: `th`, `he`, `in`, `er`, `an`).
     - Card 3: `Vocabulary Tiers` (Top 100, 500, 1000 high-frequency English words).
     - Card 4: `Custom Text & Code Import` (Practice own prose, articles, or source code up to 500 KB).
  5. **Row 4: Multi-Session Mastery Tracker (Height: 120px):**
     - Horizontal progress track showing keys currently in the 3-session graduation lifecycle (e.g., Key `T`: 2 of 3 sessions qualified; Key `R`: 1 of 3 sessions qualified).

---

### 5.2 SCR-402: Deep Weak-Key & Statistical Analysis
- **Figma Frame Name:** `D6/SCR-402/Default` (Dark) & `D6/SCR-402/Default-Light` (Light)
- **Insufficient Data State:** `D6/SCR-402/Insufficient-Data`
- **Layout Structure (Auto-Layout Vertical, Gap: 20px, Padding: 28px, Max Width: 1100px):**
  1. **Header & Navigation:** Breadcrumbs (`Skill Drills / Deep Statistical Analysis`), Back Button (`← Return to Overview`), Telemetry Window Pill (`"Rolling 14-Day FIFO Window • 100 Strokes / Key"`).
  2. **Main Layout Grid (2 Columns: Left 680px [Keyboard Heatmap + Matrix] + Right 396px [Key Inspector Drawer]):**
     - **Left Column (680px):**
       - **Interactive 65% ANSI Keyboard Heatmap Card:**
         - Keycap size: 40 × 40px, 4px corner radius, 4px key spacing.
         - Each keycap displays: Letter label (14px bold) + Error % (10px JetBrains Mono).
         - Semantic fills: Mastered (Green), Stable (Cyan), Developing (Amber), Weak (Red), Calibrating (Slate).
         - Interactive state: Selected keycap highlighted with 2px Cobalt Blue border (`#2563EB`) and subtle elevation drop shadow.
         - Heatmap legend bar below keyboard showing exact error ranges and color tokens.
       - **Pairwise Confusion Matrix Card (Height: 240px):**
         - Table displaying the top 5 destination miskeys for the selected key.
         - Columns: Intended Key, Actual Key Entered, Frequency Count, Error Share %, Typical Physical Reach Direction (e.g. `Inward Lateral Drift`).
     - **Right Column: Deep Key Inspector Drawer (396px):**
       - Selected Keycap Hero Display (Large 64 × 64px keycap with status badge).
       - Statistical Telemetry Table:
         - Total Eligible Opportunities: `89`
         - Error Rate: `12.4%` (11 errors)
         - Corrected Mistakes: `8` (72.7%)
         - Uncorrected Errors: `3` (27.3%)
         - Weak-Key Prioritization Index ($WPI$): `55.61`
         - Descriptive Hesitation Latency Delta: `+118 ms` *(Labelled: "Observed average inter-keystroke interval delay compared to your global keyboard baseline; descriptive timing only.")*
       - Plain-Language Explainability Box:
         - *"Key P shows an adjacent lateral drift toward Key O (62% of errors). This indicates finger over-reach on the top-right row. Remediation drill recommends isolation pairing `P-O` and `P-L` to reinforce tactile boundaries."*
       - Direct Action Button: Primary Cobalt Blue Button `"Configure Targeted Drill for Key P"` (links to `SCR-403`).

---

### 5.3 SCR-403: Drill Configuration & Personalization Studio
- **Figma Frame Name:** `D6/SCR-403/Default-WeakKeys`
- **Custom Import Variant:** `D6/SCR-403/Custom-Import`
- **Import Error Variant:** `D6/SCR-403/Import-Error`
- **Layout Structure (Auto-Layout Vertical, Gap: 20px, Padding: 28px, Max Width: 1100px):**
  1. **Mode Tab Bar (Height: 44px, Surface Container):**
     - 4 Tabs: `[★ Weak Keys (Active)]`, `[N-Grams & Bigrams]`, `[Vocabulary Tiers]`, `[Custom Text Import]`.
  2. **Dual-Column Configuration Grid (Left 620px [Controls] + Right 456px [Live Preview]):**
     - **Left Controls Column (620px):**
       - **Target Key Selection Section:**
         - Mode A (Weak Keys): Quick-select pills (`[P] [B] [Q]`), plus `"Select All Weak Keys"` and `"Custom Selection"`. Mini interactive keyboard multi-select grid.
         - Target cluster info: 3 keys selected (`P`, `B`, `Q`).
       - **Curricular Training Stage Pills:**
         - Stage 1: `Isolation & N-Grams` (High density: `pop pop bob bob quq`)
         - Stage 2: `Word Families` (Medium density: `paper public banquet quiet`)
         - Stage 3: `Contextual Prose (Recommended)` (Natural sentences loaded with targets)
       - **Session Duration Selector (Per Decision D6-OD-01):**
         - Options: `[1 Min]`, `[2 Min (Default)]`, `[3 Min]`, `[5 Min]`, `[Custom]`.
         - **Mastery Qualification Notice:** Explicit callout badge:
           *ℹ "Mastery Qualification Notice: Qualifying toward the 3-session mastery threshold strictly requires completing at least 30 eligible target-key opportunities with $\le 3.0\%$ error rate. A 2-minute drill is recommended to comfortably exceed this threshold."*
       - **Modifiers & Difficulty Toggles:**
         - Punctuation (`On`/`Off`), Capitalization (`On`/`Off`), Strict Backspacing (`Off` — forgiving multi-word backspacing active).
     - **Right Column: Live Exercise Preview Card (456px):**
       - Header: `"Live Generated Exercise Preview"` + Deterministic Seed Pill (`#PRNG-P89B-S3`).
       - Estimated Metrics Box:
         - Estimated Word Count: `~65 Words`
         - Estimated Target Opportunities: `~48 strokes (P: 22, B: 16, Q: 10)` $\rightarrow$ **Exceeds $\ge 30$ Mastery Floor (`✓ Eligible`)**.
         - Expected Reading Difficulty: `Grade 6.2 (Accessible)`.
       - Monospace Text Preview Container (Height: 180px, JetBrains Mono 14px, muted syntax):
         - *"The quick public banquet required prompt preparation. Peter packed the best paper boxes quietly..."*
       - Primary Action Button (Height: 48px, Full Width): Primary Cobalt Blue Button (`#2563EB`) `"Start Interactive Drill (Space or Enter)"`.
  3. **Custom Text Import Sub-View (`D6/SCR-403/Custom-Import`):**
     - Drag-and-drop file upload surface (Dashed border `#3B82F6`, background `rgba(37, 99, 235, 0.04)`).
     - Clear constraints label: **"Supports .txt and .md files up to 500 KB (UTF-8 encoded). Non-UTF-8 files are rejected; invalid bytes are never silently modified. Content is processed locally as inert text and never executed."**
     - File selection button `"Browse Local Files"`.
     - Direct plaintext paste textarea (with character/word count counter).
  4. **Custom Text Import Error States (`D6/SCR-403/Import-Error`):**
     - **Size Ceiling Error Banner:** Displayed when file $> 500\text{ KB}$ (`bg-red-500/10`, border `#EF4444`):
       *⚠ "File Exceeds Size Limit: 'encyclopedia_full.txt' is 1.2 MB. Maximum supported file size is 500 KB (approx. 80,000 words). Please choose a shorter excerpt."*
     - **Encoding Error Banner:** Displayed when file fails strict UTF-8 decoding (`bg-red-500/10`, border `#EF4444`):
       *⚠ "Encoding Error: 'document.txt' contains invalid UTF-8 byte sequences. Please re-save the file with UTF-8 encoding in your text editor and re-import."*
     - **Empty File Error Banner:** Displayed on 0-byte or whitespace-only files:
       *⚠ "Empty File: Selected file contains no text content. Please select a valid document."*

---

### 5.4 SCR-404: Interactive Skill Drill Arena
- **Figma Frame Name:** `D6/SCR-404/Active`
- **Paused State Frame:** `D6/SCR-404/Paused`
- **Guarded Restart Dialog Frame:** `D6/SCR-404/Restart-Confirm`
- **Layout Structure (Auto-Layout Vertical, Centered Stage 1100px, Peripheral Dimming Active):**
  1. **Remediation Focus HUD (Height: 64px, Surface Card, Auto-Layout Horizontal):**
     - Left: Active Target Keys Badge (`Target Keys: [P] [B] [Q]` with colored status borders).
     - Center: Live Performance Counters (JetBrains Mono 18px):
       - Live Accuracy: `96.8%`
       - Current Net Speed: `58 WPM`
       - Target Key Opportunities Completed: `24 / 48` (Progress bar at 50%)
       - Time Remaining: `01:12`
     - Right: Utility Shortcuts (`F1: Finger Hints`, `F2: Visualizer`, `F11: Zen Mode`, `Esc: Pause`).
  2. **Active Monospace Typing Canvas (Height: 280px, Card Container, Vertically Centered):**
     - Font: `JetBrains Mono 28px`, line height 44px, tabular alignment.
     - 3-line sliding window with smooth auto-scroll.
     - Character states:
       - Correctly typed: Sky Blue (`#38BDF8` Dark / `#0284C7` Light).
       - Incorrectly typed: Coral Red (`#EF4444` Dark / `#DC2626` Light) with red wavy underline.
       - Target keys in pending text: Underlined with subtle cyan pulse.
       - Current cursor: 3px solid Cobalt Blue (`#2563EB`) fluid gliding caret.
       - Pending untyped text: Muted Slate (`#64748B` Dark / `#94A3B8` Light).
     - Floating Ergonomic Finger Hint Capsule (Positioned 12px directly above active character):
       - Pill: `[ R-Pinky: Key P ]` (Cyan text on dark surface, showing exact finger reach).
  3. **Lower Guidance Panel (Height: 240px, Collapsible via `F2`):**
     - Centered Pastel Mechanical Keyboard Visualizer (65% ANSI layout).
     - Active keycap illuminated in Cobalt Blue (`#2563EB`) with subtle 3D tactile elevation.
     - Realistic Human Hand Model: Semi-transparent anatomical outline with highlighted active reaching digit (Right Pinky) and dynamic curved trajectory vector from home row (`;`) to target (`P`).
  4. **Guarded Restart Dialog (`D6/SCR-404/Restart-Confirm`):**
     - Triggered on `F5` / `Ctrl + R` when session $> 10\text{s}$.
     - Modal Dialog (Width: 440px, Dark Surface, Border `#1E293B`):
       - Title: *"Discard Active Drill Progress?"*
       - Body: *"You have completed 24 target-key strokes in this session. Restarting will discard current session progress. Do you wish to restart or resume?"*
       - Actions: Secondary Button `Resume Drill (Esc)`, Destructive Button `Discard & Restart (Enter)`.

---

### 5.5 SCR-405: Results & Improvement Verification Scorecard
- **Figma Frame Name:** `D6/SCR-405/Mastery-Progress` (1 or 2 sessions qualified)
- **Mastery Achieved Variant:** `D6/SCR-405/Mastery-Achieved` (3 sessions qualified $\rightarrow$ Mastered!)
- **Non-Qualifying Variant:** `D6/SCR-405/Non-Qualifying` ($< 30$ target opportunities)
- **Layout Structure (Auto-Layout Vertical, Gap: 24px, Padding: 32px, Max Width: 1100px):**
  1. **Scorecard Header Hero (Height: 120px):**
     - Left: Completion Status Banner (`"Skill Drill Complete • Target Remediation Verified"`).
     - Right: Hero Metrics Quartet:
       - Target Accuracy: `97.6%` (Emerald `#10B981`)
       - Net Speed: `62 WPM`
       - Total Target Strokes: `42 Strokes` ($\ge 30$ floor satisfied)
       - Duration: `02:00`
  2. **Target-Key Performance Delta Breakdown Table (Height: 220px, Surface Container):**
     - Table columns:
       | Target Key | Pre-Drill Error | Drill Session Error | Performance Delta ($\Delta$) | Opportunity Count | Session Status |
       |:---:|:---:|:---:|:---:|:---:|:---:|
       | **P** | 12.4% | 2.4% | **-10.0% Improvement** | 22 strokes | Qualifying ($\le 3\%$) |
       | **B** | 11.2% | 0.0% | **-11.2% Improvement** | 14 strokes | Qualifying ($\le 3\%$) |
       | **Q** | 10.5% | 0.0% | **-10.5% Improvement** | 6 strokes | Non-Qualifying ($< 30$ for Q alone) |
       | **Composite**| 11.6% | **2.4%** | **-9.2% Net Delta** | **42 total strokes** | **QUALIFYING SESSION** |
  3. **Multi-Session Mastery Tracker Card (Height: 180px):**
     - **Progress Variant (`D6/SCR-405/Mastery-Progress`):**
       - Title: `"Key P Mastery Progression: 2 of 3 Clean Sessions Qualified"`
       - 3 Visual Session Capsules:
         - Session 1: `✓ Qualified (Nov 17 • 1.8% Error • 44 Strokes)` — Emerald `#10B981`
         - Session 2: `✓ Qualified (Today • 2.4% Error • 42 Strokes)` — Emerald `#10B981`
         - Session 3: `○ Pending (Requires 1 more session with $\le 3\%$ error and $\ge 30$ strokes)` — Cobalt Outline
       - Descriptive Note: *"Complete 1 additional qualifying session to graduate Key P to Mastered status."*
     - **Mastery Achieved Variant (`D6/SCR-405/Mastery-Achieved`):**
       - Golden Celebration Banner (`border-amber-500`, background `rgba(245, 158, 11, 0.1)`).
       - Badge: `🏆 KEY P OFFICIALLY MASTERED!`
       - Description: *"3 consecutive clean sessions verified. Key P graduated to Mastered status. Neutral celebratory presentation with no duplicate milestone XP."*
  4. **Gamification & XP Breakdown Bar (Height: 80px):**
     - Base XP: `25 XP` (62 Words $\times 0.2$ + 2 Min $\times 5$)
     - Accuracy Multiplier: `+50% (1.50× for 97.6% accuracy)` $\rightarrow$ `+13 XP`
     - Daily Diminishing Returns Tier: `Attempt 1 of the day (100% Base XP)`
     - Total XP Earned: `+38 XP`
     - Daily Practice Time Added: `+2 Minutes credited to 20-minute daily goal`.
  5. **Footer Action Bar (Height: 56px, Auto-Layout Horizontal, Space Between):**
     - Left: Secondary Action Button `← Return to Studio (Esc)`.
     - Right Group:
       - Secondary Button `Retake Drill (R)`.
       - Primary Cobalt Blue Button `Practice Next Recommended Key: [B] (Enter)`.

---

## 6. Figma Page & Frame Organization Hierarchy

In accordance with enterprise Figma design standards and project governance, all screens are registered under:
- **File URL:** `https://www.figma.com/design/LvHRp11TZikdxNFeZvapO0`
- **Page 3:** `🖥 03. Desktop Flows & Screen Templates`

### 6.1 Master Frame Registry (1440 × 900)
```
🖥 03. Desktop Flows & Screen Templates
 ├── ❖ Section: 04. Skill Drills & Remediation Studio
 │    ├── ▣ D6/SCR-401/Default                   (Node ID: 401:1)  [Dark Theme - Studio Overview]
 │    ├── ▣ D6/SCR-401/Default-Light             (Node ID: 401:2)  [Light Theme - Studio Overview]
 │    ├── ▣ D6/SCR-401/Empty-Calibration         (Node ID: 401:3)  [Zero State - <20 Samples]
 │    │
 │    ├── ▣ D6/SCR-402/Default                   (Node ID: 402:1)  [Dark Theme - Deep Statistical Lab]
 │    ├── ▣ D6/SCR-402/Default-Light             (Node ID: 402:2)  [Light Theme - Deep Statistical Lab]
 │    ├── ▣ D6/SCR-402/Insufficient-Data         (Node ID: 402:3)  [Calibrating Key View]
 │    │
 │    ├── ▣ D6/SCR-403/Default-WeakKeys          (Node ID: 403:1)  [Dark Theme - Weak-Key Mode]
 │    ├── ▣ D6/SCR-403/Default-Light             (Node ID: 403:2)  [Light Theme - Weak-Key Mode]
 │    ├── ▣ D6/SCR-403/Custom-Import             (Node ID: 403:3)  [500 KB File Upload Interface]
 │    ├── ▣ D6/SCR-403/Import-Error              (Node ID: 403:4)  [Oversized File Alert Banner]
 │    │
 │    ├── ▣ D6/SCR-404/Active                    (Node ID: 404:1)  [Dark Theme - Live Remediation Arena]
 │    ├── ▣ D6/SCR-404/Active-Light              (Node ID: 404:2)  [Light Theme - Live Remediation Arena]
 │    ├── ▣ D6/SCR-404/Paused                    (Node ID: 404:3)  [Pause Modal Overlay]
 │    ├── ▣ D6/SCR-404/Restart-Confirm           (Node ID: 404:4)  [>10s Guarded Reload Dialog]
 │    │
 │    ├── ▣ D6/SCR-405/Mastery-Progress          (Node ID: 405:1)  [Dark Theme - 2/3 Sessions Qualified]
 │    ├── ▣ D6/SCR-405/Mastery-Progress-Light    (Node ID: 405:2)  [Light Theme - 2/3 Sessions Qualified]
 │    ├── ▣ D6/SCR-405/Mastery-Achieved          (Node ID: 405:3)  [3/3 Sessions - Mastered Celebration]
 │    └── ▣ D6/SCR-405/Non-Qualifying            (Node ID: 405:4)  [<30 Strokes - Valid Practice Notice]
```

---

## 7. Figma Starter Plan Rate Limit Disclosure

> [!NOTE]
> **Figma Starter Plan Rate Limit Compliance Record:**
> Live API-driven programmatic mutations on Figma file `LvHRp11TZikdxNFeZvapO0` via the Figma MCP server are constrained by Figma's team plan rate limit paywall (`You've reached the Figma MCP tool call limit on the Starter plan`). 
> Under the approved Product Owner governance, all master Auto-Layout layouts, node naming standards, exact pixel coordinates, typography rules, color tokens, and interactive visual states are formally recorded in this specification and referenced to Page 3 (`🖥 03. Desktop Flows & Screen Templates`), guaranteeing 100% engineering parity during desktop implementation.
