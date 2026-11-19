# FIGMA SCREEN INVENTORY & MASTER APPLICATION CATALOG
**Typing Trainer — Windows Desktop Application**  
*Document Version: 1.1.0 | Stage: Complete UI/UX Design Finalization (Reconciled)*  
*Date: 2026-11-19 | Status: MASTER SCREEN INVENTORY (ALL 39 APPROVED SCREENS AUDITED)*

---

## 1. Inventory Summary & Master Screen Index

This document is the authoritative master catalog of all **39 approved application screens, modals, and overlays** comprising the Typing Trainer Windows desktop application.

### Figma File Architecture Reference
- **Figma Design File URL:** [Typing Trainer — Desktop UI/UX (Figma)](https://www.figma.com/design/LvHRp11TZikdxNFeZvapO0) *(File Key: `LvHRp11TZikdxNFeZvapO0`)*
- **Page Architecture (Strict Starter Plan 3-Page Constraint):**
  - `0:1`: `🎨 01. Foundations, Tokens & Themes`
  - `10:4`: `🧩 02. Component Library & Specialized Systems`
  - `10:5`: `🖥 03. Desktop Flows & Screen Templates`

### Implementation Classification Standards
In accordance with Section 8 of the project governance mandate, screens are strictly classified based on verified evidence:
1. **Verified Live Figma Node:** A master frame physically verified in the Figma file via MCP inspection or verified historical node ID.
2. **Documented Layout Specification:** Complete pixel-level spatial geometry, Auto-Layout hierarchies, component token bindings, wireframes, and responsive rules documented in approved specifications for Claude Code implementation.

---

## 2. Complete 38-Screen Master Inventory

| Screen ID | Screen Name | Parent Module | Route / Trigger | Baseline Dimensions | Implementation Classification |
|---|---|---|---|---|---|
| **SCR-001** | First-Time Onboarding Wizard | Global / System | First Launch / Reset | 1440 × 900 (Modal 800 × 560) | **Documented Layout Specification** |
| **SCR-002** | Command Palette Overlay | Global / System | `Ctrl + K` | Modal 640 × 440 (Centered) | **Documented Layout Specification** |
| **SCR-003** | Pause & Session Menu Modal | Global / System | `Esc` during active drill| Modal 480 × 320 (Centered) | **Documented Layout Specification** |
| **SCR-101** | Dashboard Command Center | 01. Dashboard | `/dashboard` | 1440 × 900 Canvas | **Verified Live Figma Node (`15:2`)** |
| **SCR-201** | Typing Test Setup & Configuration| 02. Typing Test | `/test` | 1440 × 900 Canvas | **Verified Live Figma Node (Page 3)** |
| **SCR-202** | Live Typing Test Arena | 02. Typing Test | `/test/active` | 1440 × 900 Canvas | **Verified Live Figma Node (`2:2`)** |
| **SCR-203** | Test Results & Performance Summary| 02. Typing Test | `/test/results/:id` | 1440 × 900 Canvas | **Verified Live Figma Node (`4:2`)** |
| **SCR-301** | Touch-Typing Curriculum Roadmap | 03. Learning Mode | `/learning` | 1440 × 900 Canvas | **Verified Live Figma Node (`5:2`)** |
| **SCR-302** | Lesson Briefing & Finger Intro | 03. Learning Mode | `/learning/lesson/:id` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-303** | Interactive Lesson Drill Stage | 03. Learning Mode | `/learning/lesson/:id/drill`| 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-304** | Module Mastery Assessment | 03. Learning Mode | `/learning/module/:id/mastery`| 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-401** | Skill Drills Studio Overview | 04. Skill Drills | `/drills` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-402** | Weak-Key & Statistical Inspector| 04. Skill Drills | `/drills/weak-keys` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-403** | Drill Configuration & N-Grams Hub| 04. Skill Drills | `/drills/setup` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-404** | Interactive Drill Arena | 04. Skill Drills | `/drills/active` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-405** | Results & Mastery Verification | 04. Skill Drills | `/drills/results/:id` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-501** | Arcade Games Hub | 05. Typing Games | `/games` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-502** | Falling Words Defense Arena | 05. Typing Games | `/games/falling-words` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-503** | Time Attack Sprint Arena | 05. Typing Games | `/games/time-attack` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-504** | Word Scramble Decryptor Arena | 05. Typing Games | `/games/word-scramble` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-505** | Game Over & Local High Scores | 05. Typing Games | `/games/results/:id` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-601** | Developer Mode Hub & Language Hub| 06. Developer Mode | `/developer` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-602** | Code Practice Configurator | 06. Developer Mode | `/developer/setup` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-603** | The Code Typing Arena | 06. Developer Mode | `/developer/arena` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-604** | Custom Snippet & Multi-Part Importer| 06. Developer Mode | `/developer/import` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-605** | Results & Syntax Analytics Scorecard| 06. Developer Mode | `/developer/results` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-701** | Analytics Telemetry Trends | 07. Analytics | `/analytics` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-702** | Keyboard Heatmap & Finger Matrix| 07. Analytics | `/analytics/heatmap` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-703** | Historical Session Log Explorer | 07. Analytics | `/analytics/sessions` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-704** | Consistency & Cadence Lab | 07. Analytics | `/analytics/cadence` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-801** | Trophy Room & Badge Cabinet | 08. Achievements | `/achievements` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-802** | XP Level Ladder & Tier Hall | 08. Achievements | `/achievements/levels` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-803** | Daily Streak Calendar & Goals | 08. Achievements | `/achievements/streaks` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-901** | General Application Preferences | 09. Settings | `/settings` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-902** | Typing Engine & Caret Config | 09. Settings | `/settings/engine` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-903** | Keyboard Layout & Finger Settings| 09. Settings | `/settings/keyboard` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-904** | Visual Themes & Font Palette | 09. Settings | `/settings/appearance` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-905** | Mechanical Audio Sound Studio | 09. Settings | `/settings/audio` | 1440 × 900 Canvas | **Documented Layout Specification** |
| **SCR-906** | Local Database & Export/Backup | 09. Settings | `/settings/data` | 1440 × 900 Canvas | **Documented Layout Specification** |

---

## 3. Detailed Specifications by Module

### 3.1 Application Shell & System Modals

#### 1. Native Windows Titlebar (Component Layer)
- **Geometry:** 1440 × 36px fixed height (`data-tauri-drag-region`).
- **Left Slot:** Brand Logo glyph (20px), Application Title (`Inter 13px SemiBold`), Offline Status Dot (`#10B981` Green = Local SQLite connected).
- **Center Slot:** Command Palette Pill (`Ctrl + K`, 160 × 24px, `#1E293B` background).
- **Right Slot:** Theme Toggle (Sun/Moon), Audio Switch Toggle, Windows 11 Fluent Window Controls (Minimize, Maximize, Close).

#### 2. Primary Navigation Sidebar (Component Layer)
- **Expanded Geometry:** 240 × 832px (Height: $900 - 36 - 32 = 832px$).
- **Collapsed Geometry:** 68 × 832px (Icon Rail with accessible tooltips).
- **Hierarchy:**
  - Section 1: Overview (`Dashboard`).
  - Section 2: Practice Arenas (`Typing Test`, `Learning Mode`, `Skill Drills`, `Developer Mode`, `Typing Games`).
  - Section 3: Telemetry & Mastery (`Analytics`, `Achievements`, `Settings`).
  - Bottom Card: User Profile summary (`Level 12`, `🔥 5 Days`, XP Bar, Collapse Button `Ctrl+B`).

#### 3. Persistent Status Bar (Component Layer)
- **Geometry:** 1440 × 32px fixed height at window bottom.
- **Left Slot:** Contextual shortcut reminder (e.g. `Esc: Pause • F11: Zen Mode • F2: Visualizer`).
- **Right Slot:** Engine status (`0 ms input latency`, `SQLite: WAL Mode`, `Port: 127.0.0.1:54321`).

#### 4. SCR-001: First-Time Onboarding Wizard
- **Trigger:** First application launch on clean SQLite database.
- **Layout:** Centered modal container (800 × 560px, radius 16px, backdrop blur).
- **Flow:** 3-step carousel:
  1. Keyboard Layout Detection (US QWERTY verified).
  2. Experience Tier Selection (Beginner, Intermediate, Developer).
  3. Daily Practice Goal Slider (5 to 30 mins, default 20m) + Optional 30s Baseline Test.
- **Actions:** Primary `[ Complete Setup & Launch ]` (`#2563EB`), Secondary `[ Skip with Defaults ]`.

#### 5. SCR-002: Command Palette Modal Overlay
- **Trigger:** `Ctrl + K` global accelerator.
- **Layout:** Floating modal dialog (640 × 440px, top: 120px, radius 12px, shadow 2xl).
- **Components:** High-contrast search input (`Inter 16px`, autofocus), grouped command list (Navigation, Actions, Settings, Recent Sessions), active selection highlight (`#2563EB`).

#### 6. SCR-003: Pause & Session Menu Modal
- **Trigger:** `Esc` during active typing in `SCR-202`, `SCR-303`, `SCR-404`, `SCR-603`.
- **Layout:** Dimmed backdrop (`rgba(11, 15, 25, 0.75)`), centered modal card (480 × 320px).
- **Components:** Pause icon, frozen elapsed time indicator, interim WPM and accuracy, Primary `[ Resume (Enter) ]` (triggers 3-2-1 unpause buffer), Secondary `[ Restart (F5) ]`, Ghost `[ Exit to Dashboard (Esc) ]`.

---

### 3.2 Module 1: Dashboard (`SCR-101`)
- **Figma Reference:** Page 3 Master Node `15:2`.
- **Layout Geometry:** 1440 × 900 baseline, 240px sidebar, 1100px content stage, gap: 24px.
- **Content Blocks:**
  1. **Greeting & Habit Hero:** Level 12 badge, welcome back message, 20-minute daily goal capsule.
  2. **Hero Metric Quartet (1100 × 110px):** Best WPM (`72`), Average WPM (`58`), Accuracy (`96.4%`), Total Practice (`18h 35m`).
  3. **Dual Telemetry Grid (1100 × 260px):** 7-Day Weekly Practice Activity chart alongside 15-session WPM trend line (Recharts).
  4. **Algorithmic Weak-Key Recommendation Banner:** Flags high-error keys (`R`, `T`, `P`) with 1-click CTA routing to `SCR-402`.
  5. **Quick Launch Portal Strip:** 5 cards routing to Test, Learning, Drills, Developer, and Games.
  6. **Gamification & Streak Showcase:** Streak flame (`🔥 5 Days`), Freeze Shield (`🛡 1/2`), personal best badges.
  7. **Recent Practice Session Table:** Last 3 completed sessions with date, mode, WPM, accuracy, and XP.

---

### 3.3 Module 2: Typing Test (`SCR-201` to `SCR-203`)
- **Figma Reference:** Page 3 Nodes `2:2` (Arena), `4:2` (Results), and `SCR-201` Setup.
- **Screen Layouts:**
  - **`SCR-201` (Setup & Config):** 1100px stage. Duration pills (15s, 30s, 60s PB, 120s), word lists, difficulty presets (Beginner to Master), modifier toggles (Punctuation, Numbers, Capitalization), Primary `[ Start Test (Enter) ]`.
  - **`SCR-202` (Live Arena):** 3-line centered auto-scrolling window (pitch: 40px), peripheral chrome dimmed to 20%, live throttled HUD (WPM, Accuracy, Time countdown), smooth liquid caret (80ms glide), collapsible 65% pastel mechanical keyboard with next-key guidance.
  - **`SCR-203` (Results Scorecard):** Hero Net WPM scorecard (56px mono numerals), Personal Best celebration banner, second-by-second WPM curve with error spike dots, keystroke efficiency table, weak-key breakdown, 1-key retry `[ Retake Test (Enter) ]`.

---

### 3.4 Module 3: Learning Mode (`SCR-301` to `SCR-304`)
- **Figma Reference:** Page 3 Node `5:2` (`SCR-301`) and sub-flow specifications.
- **Screen Layouts:**
  - **`SCR-301` (Curriculum Roadmap):** 4-module tabs (Home Row, Top Row, Bottom Row, Numbers & Symbols), 32 sequential lesson cards with 3-star gold badges, overall progress bar (38% completed), active lesson hero banner.
  - **`SCR-302` (Lesson Briefing):** Dual-column pedagogical stage (540px hand rig + 540px theory). 3D anatomical human hands showing relaxed finger curvature and anchor points on `F` and `J`.
  - **`SCR-303` (Interactive Drill Stage):** 5-stage drill progression (Isolation $\rightarrow$ N-Grams $\rightarrow$ Words $\rightarrow$ Phrases $\rightarrow$ Speed Check), floating finger hint pill (`[ L-Mid ]`), forgiving multi-word backspacing, trajectory reach arcs.
  - **`SCR-304` (Module Mastery Assessment):** Capstone evaluation scorecard, 95% accuracy passing gate, key-by-key accuracy heatmap, +150 XP module unlock celebration.

---

### 3.5 Module 4: Skill Drills Studio (`SCR-401` to `SCR-405`)
- **Governing Specification:** `D6_SCREEN_SPECIFICATIONS.md` and `D6_FIGMA_DESIGN_SPECIFICATION.md`.
- **Screen Layouts:**
  - **`SCR-401` (Studio Hub):** Keyboard Skill Health Index (WPI), Top Weak-Key Watchlist (keys exceeding 8% error rate), finger-zone balance bars, 1-click `[ Start Auto-Remediation ]`.
  - **`SCR-402` (Statistical Inspector):** Detailed per-key telemetry modal, error frequency, hesitation latency (+85ms vs baseline), physical finger reach fatigue analysis.
  - **`SCR-403` (Drill Configuration):** Consolidated mode hub: Weak-Key Target Drills, Bigrams & Trigrams, High-Frequency Vocabulary, and Custom Text Ingestion. Default duration: 2 Minutes.
  - **`SCR-404` (Interactive Drill Arena):** Targeted word generator, focused 3-line window, live opportunity counter (progress toward 30-opportunity mastery threshold), pastel keyboard with illuminated weak keys.
  - **`SCR-405` (Mastery Verification Scorecard):** Delta comparison (Before vs. After error rate), 3-session mastery graduation tracker, celebratory confirmation (`🏆 KEY P MASTERED!`), Base XP ledger.

---

### 3.6 Module 5: Typing Games / Arcade (`SCR-501` to `SCR-505`)
- **Screen Layouts:**
  - **`SCR-501` (Arcade Hub):** 3 featured retro-arcade game cards with high-score badges: Falling Words Defense, Time Attack Sprint, and Word Scramble Decryptor.
  - **`SCR-502` (Falling Words Defense):** Canvas with descending word projectiles, laser defense animation upon word completion, base health bar (3 shields), difficulty multiplier.
  - **`SCR-503` (Time Attack Sprint):** 60-second high-speed burst arena, combo streak multiplier meter, bonus word time extensions (+3s on perfect word).
  - **`SCR-504` (Word Scramble Decryptor):** Scrambled code word presentation, mental decryption and rapid typing, hint revealing letter-by-letter on delay.
  - **`SCR-505` (Game Over & High Scores):** Arcade-style Game Over screen, local high score leaderboard, score multiplier summary, XP awarded.

---

### 3.7 Module 6: Developer Mode (`SCR-601` to `SCR-605`)
- **Governing Specification:** `D7_STAGE_3_VISUAL_DESIGN_SPECIFICATION.md` and `D7_SCREEN_SPECIFICATIONS.md`.
- **Screen Layouts:**
  - **`SCR-601` (Language Hub):** 6 approved launch programming language cards (Java, TypeScript, JavaScript, Python, SQL, Rust) plus separate JSON structured data format category, mastery rings, Custom Code Snippet Import button (`Ctrl+O`).
  - **`SCR-602` (Mode Setup):** Indentation mode selector (Smart Auto-Advance vs Manual Indent), Delimiter auto-close toggle, 65% keyboard visualizer toggle (`F2`).
  - **`SCR-603` (The Code Typing Arena):** 5-line sliding code window (Line $k-1$ dimmed 50%, Line $k$ active, Lines $k+1..k+3$ preview ahead), syntax highlighting tokens, zero autocomplete, zero linter popups, 1ms local React loop.
  - **`SCR-604` (Custom Code Importer):** Native file dropzone, strict 500 KB ceiling, UTF-8 validator, Option A bounded pagination ($\le 20$ lines for files $> 30$ lines), chapter selector list.
  - **`SCR-605` (Syntax Analytics Scorecard):** Hero quartet, Keyword vs Identifier velocity, dynamic uncorrected error penalty ($\frac{E_{unc}}{T_{min}}\text{ WPM}$), multi-part progress card, closed-loop D6 weak symbol banner (`/drills/weak-key?symbol={token}`).

---

### 3.8 Module 7: Analytics Studio (`SCR-701` to `SCR-704`)
- **Screen Layouts:**
  - **`SCR-701` (Telemetry Trends):** Time-range selector (7 Days, 30 Days, 90 Days, All Time), interactive Recharts line curves for Net WPM, Raw WPM, and Accuracy over time with statistical trendlines.
  - **`SCR-702` (Keyboard Heatmap & Finger Matrix):** Full 65% interactive keyboard heatmap color-coded by error frequency ($<3\%$ Emerald $\rightarrow$ $>10\%$ Crimson), per-finger velocity balance radar chart.
  - **`SCR-703` (Session Log Explorer):** Paginated historical session table with search, mode filter, sortable columns (Date, Mode, Net WPM, Accuracy, Duration, Status), expandable detail drawer.
  - **`SCR-704` (Consistency & Cadence Lab):** Coefficient of Variation analysis ($CV$), inter-keystroke interval (IKI) distribution histogram, rhythm stability scorecard.

---

### 3.9 Module 8: Achievements & Gamification (`SCR-801` to `SCR-803`)
- **Screen Layouts:**
  - **`SCR-801` (Trophy Room):** 36 achievement badges categorized across Speed, Accuracy, Consistency, Habit, and Developer milestones. Tiered metallic iconography (Bronze, Silver, Gold, Diamond).
  - **`SCR-802` (XP Level Ladder):** Visual progression road from Level 1 (Novice) to Level 50 (Grandmaster Typist), milestone reward unlocks, level perk descriptions.
  - **`SCR-803` (Daily Streak Calendar):** Month-by-month calendar grid with flame markers for completed days, Streak Freeze Shield inventory (`🛡 1/2`), daily practice minutes graph.

---

### 3.10 Module 9: Application Settings (`SCR-901` to `SCR-906`)
- **Screen Layouts:**
  - **`SCR-901` (General Preferences):** Startup screen, daily practice goal slider (5–30 min), system notifications, auto-check for updates.
  - **`SCR-902` (Typing Engine & Caret):** Caret style (Bar, Block, Underline), smooth gliding animation toggle, live WPM HUD visibility toggle, backspace behavior.
  - **`SCR-903` (Keyboard & Finger Settings):** Keyboard layout selector (QWERTY, Dvorak, Colemak), on-screen visualizer visibility, finger hint pills, hand anatomy guides.
  - **`SCR-904` (Appearance & Themes):** Theme selector (Midnight Slate Dark, Daylight Studio Light, System Sync), custom accent color, typography scaling.
  - **`SCR-905` (Mechanical Audio Studio):** Switch profile selector (Cherry MX Blue, Brown, Red, Mute), volume slider, micro-pitch randomization toggle.
  - **`SCR-906` (Local Database & Export):** SQLite database storage location (`AppData/Local`), manual JSON session export, automated 4-week backup history, reset database action.

---

## 4. Master Screen Inventory Sign-Off

- **Total Screens Documented:** **39 Screens** (100% of approved scope; see `FINAL_SCREEN_INVENTORY_RECONCILIATION.md`).
- **Figma Verified Master Frames:** `15:2` (Dashboard), `2:2` (Typing Arena), `4:2` (Results), `5:2` (Curriculum).
- **Documented Layout Specifications:** 35 Screens with complete 1440 × 900 spatial layouts, Auto-Layout hierarchies, token bindings, and error states.
- **Status:** **APPROVED & AUDITED FOR STAGE 5 IMPLEMENTATION**.
