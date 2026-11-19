# SCREEN INVENTORY (D1)
**Typing Trainer — Windows Desktop Application**
*Document Version: 1.0.0 | Stage: D1 Architecture*

---

## 1. Inventory Summary & Master Screen Index

This document catalogs every functional screen and modal across the Typing Trainer application. Each entry defines the screen's purpose, actions, states, and navigation boundaries.

| Screen ID | Screen Name | Parent Module | Route / Trigger |
|---|---|---|---|
| **SCR-001** | First-Time Onboarding Wizard | Global / System | First launch / Reset |
| **SCR-002** | Command Palette Overlay | Global / System | `Ctrl + K` |
| **SCR-003** | Pause & Session Menu Modal | Global / System | `Esc` during test |
| **SCR-101** | Dashboard Command Center | 01. Dashboard | `/dashboard` |
| **SCR-201** | Typing Test Setup & Config | 02. Typing Test | `/test` |
| **SCR-202** | Live Typing Test Arena | 02. Typing Test | `/test/active` |
| **SCR-203** | Test Results & Performance Summary | 02. Typing Test | `/test/results/:id` |
| **SCR-301** | Touch-Typing Curriculum Roadmap | 03. Learning Mode | `/learning` |
| **SCR-302** | Lesson Briefing & Finger Intro | 03. Learning Mode | `/learning/lesson/:id` |
| **SCR-303** | Interactive Lesson Drill Stage | 03. Learning Mode | `/learning/lesson/:id/drill` |
| **SCR-304** | Module Mastery Assessment | 03. Learning Mode | `/learning/module/:id/mastery` |
| **SCR-401** | Skill Drills Catalog & Hub | 04. Skill Drills | `/drills` |
| **SCR-402** | Weak-Key Remediation Generator | 04. Skill Drills | `/drills/weak-keys` |
| **SCR-403** | N-Grams & Bigrams Practice Stage | 04. Skill Drills | `/drills/ngrams` |
| **SCR-404** | High-Frequency Vocabulary Drills | 04. Skill Drills | `/drills/vocabulary` |
| **SCR-405** | Custom Text & File Import Studio | 04. Skill Drills | `/drills/custom-import` |
| **SCR-501** | Arcade Games Hub | 05. Typing Games | `/games` |
| **SCR-502** | Falling Words Defense Arena | 05. Typing Games | `/games/falling-words` |
| **SCR-503** | Time Attack Sprint Arena | 05. Typing Games | `/games/time-attack` |
| **SCR-504** | Word Scramble Decryptor Arena | 05. Typing Games | `/games/word-scramble` |
| **SCR-505** | Game Over & Local High Scores | 05. Typing Games | `/games/results/:id` |
| **SCR-601** | Developer Language Catalog | 06. Developer Mode | `/developer` |
| **SCR-602** | Code Syntax Typing Stage | 06. Developer Mode | `/developer/stage/:lang` |
| **SCR-603** | Terminal & Shell Drills Stage | 06. Developer Mode | `/developer/terminal` |
| **SCR-604** | Custom Code Snippet Manager | 06. Developer Mode | `/developer/snippets` |
| **SCR-701** | Analytics Telemetry Trends | 07. Analytics | `/analytics` |
| **SCR-702** | Keyboard Heatmap & Finger Matrix | 07. Analytics | `/analytics/heatmap` |
| **SCR-703** | Historical Session Log Explorer | 07. Analytics | `/analytics/sessions` |
| **SCR-704** | Consistency & Cadence Lab | 07. Analytics | `/analytics/cadence` |
| **SCR-801** | Trophy Room & Badge Cabinet | 08. Achievements | `/achievements` |
| **SCR-802** | XP Level Ladder & Tier Hall | 08. Achievements | `/achievements/levels` |
| **SCR-803** | Daily Streak Calendar & Goals | 08. Achievements | `/achievements/streaks` |
| **SCR-901** | General Application Preferences | 09. Settings | `/settings` |
| **SCR-902** | Typing Engine & Caret Config | 09. Settings | `/settings/engine` |
| **SCR-903** | Keyboard Layout & Finger Settings | 09. Settings | `/settings/keyboard` |
| **SCR-904** | Visual Themes & Font Palette | 09. Settings | `/settings/appearance` |
| **SCR-905** | Mechanical Audio Sound Studio | 09. Settings | `/settings/audio` |
| **SCR-906** | Local Database & Export/Backup | 09. Settings | `/settings/data` |

---

## 2. Global & System Screens

### SCR-001: First-Time Onboarding Wizard
- **Parent Module:** Global / System
- **Purpose:** Welcomes first-time users, detects keyboard layout, gathers skill self-assessment, sets daily goals, and establishes initial local profile.
- **Main User Action:** Step through 3 setup slides and take an optional 30s benchmark test.
- **Secondary Actions:** "Skip setup and start with default settings."
- **Key Information:** Layout confirmation (QWERTY US detected), skill level options (Beginner, Intermediate, Advanced, Developer), daily practice goal slider (5 to 30 mins).
- **Navigation Entry:** Automatic trigger on empty database / first launch.
- **Navigation Exit:** `/dashboard` or `/test`.
- **States:**
  - *Empty:* Initial clean setup slides.
  - *Loading:* Initializing local SQLite schema.
  - *Error:* Failure to create local database (surfaces friendly local file permission guide).
  - *Success:* "Profile Ready! Welcome to Typing Trainer" banner.

### SCR-002: Command Palette Modal Overlay
- **Parent Module:** Global / System
- **Purpose:** Universal keyboard navigation and search dialog.
- **Main User Action:** Type to filter destinations, recent tests, or settings, and press `Enter` to jump.
- **Secondary Actions:** `Arrow Up/Down` to select, `Esc` to dismiss.
- **Key Information:** Grouped search results (Navigation, Actions, Tests, Recent Sessions).
- **Navigation Entry:** `Ctrl + K` global shortcut.
- **Navigation Exit:** Closes on selection or `Esc`.
- **States:**
  - *Empty:* Shows recommended quick links (`Start Test`, `Practice Weak Keys`, `Settings`).
  - *Loading:* Instant in-memory search.
  - *Error:* "No matching commands found."

### SCR-003: Pause & Session Menu Modal
- **Parent Module:** Global / System
- **Purpose:** Suspends active timer during a typing test, lesson, or game without losing session state.
- **Main User Action:** Resume session (`Enter` or `Esc`).
- **Secondary Actions:** Restart session (`Tab + Enter`), Adjust session options, or Abandon to Dashboard.
- **Key Information:** Paused time indicator, current interim WPM and accuracy, session elapsed time.
- **Navigation Entry:** `Esc` key pressed during active typing.
- **Navigation Exit:** Returns to active canvas or exits to `/dashboard`.
- **States:**
  - *Active:* Crisp frosted overlay with focused modal dialog.

---

## 3. Module 1: Dashboard

### SCR-101: Dashboard Command Center
- **Parent Module:** 01. Dashboard
- **Purpose:** Daily home base providing habit tracking, recommended practice, personal records, and quick launchpad.
- **Main User Action:** Click "Continue Daily Practice" or hit `Space` to start recommended drill.
- **Secondary Actions:** View personal bests, review recent session mini-cards, quick-switch test presets.
- **Key Information:** Streak counter (days + freeze shields), Daily practice goal progress ring (mins & words), Overall Level + XP bar, Top 3 Personal Bests (15s, 60s, Dev Mode), Deterministic Recommendation Card ("Practice 'P' and 'B' reaches").
- **Navigation Entry:** Primary sidebar "Dashboard", app launch, or logo click.
- **Navigation Exit:** Routes to `/test`, `/learning`, `/drills`, or `/analytics`.
- **States:**
  - *Empty:* Friendly welcome state with "Take your first benchmark test" prominent button.
  - *Loading:* Skeleton cards for stats and streak rings.
  - *Error:* Fallback state with retry button if local stats query fails.
  - *Success:* Fully populated telemetry dashboard.

---

## 4. Module 2: Typing Test

### SCR-201: Typing Test Configuration & Setup View
- **Parent Module:** 02. Typing Test
- **Purpose:** Allows the user to configure benchmark test parameters before typing.
- **Main User Action:** Select mode pill and duration, then focus input canvas.
- **Secondary Actions:** Toggle punctuation, numbers, or custom word count; toggle live HUD visibility.
- **Key Information:** Mode selectors: Time (15, 30, 60, 120s), Words (10, 25, 50, 100), Quote (All, Short, Medium, Long), Zen.
- **Navigation Entry:** Sidebar "Typing Test" (`Ctrl + 2`).
- **Navigation Exit:** Typing the first character transitions instantly to `SCR-202`.
- **States:**
  - *Ready:* Active caret blinking, text passage primed and waiting for first stroke.

### SCR-202: Live Typing Test Arena (The Flow Canvas)
- **Parent Module:** 02. Typing Test
- **Purpose:** High-focus, distraction-free typing canvas where real-time typing occurs.
- **Main User Action:** Type matching text characters.
- **Secondary Actions:** `Tab + Enter` to restart; `Esc` to pause.
- **Key Information:** Live stream of words: green for correct, red highlight for incorrect, gray for upcoming; active caret; optional top HUD (WPM, Accuracy %, Time Remaining, Error Count).
- **Navigation Entry:** Keystroke actuation from `SCR-201`.
- **Navigation Exit:** Automatic transition to `SCR-203` upon timer expiration or passage completion.
- **States:**
  - *Active:* Ultra-low latency keystroke responsiveness ($< 8\text{ ms}$).
  - *Peripheral Dimmed:* Sidebar and headers softly dimmed to 20% opacity.

### SCR-203: Test Results & Performance Summary
- **Parent Module:** 02. Typing Test
- **Purpose:** Comprehensive celebration, performance breakdown, error diagnostic, and next steps after a test.
- **Main User Action:** Press `Tab + Enter` for "Next Drill / Try Again".
- **Secondary Actions:** "Practice Missed Keys", "Save Replay / Export Stats Card", "View in Analytics".
- **Key Information:** Net WPM (large hero), Accuracy %, Raw WPM, Consistency %; Second-by-second WPM line chart with error markers; Missed character list with responsible finger assignments; XP earned and milestone alerts.
- **Navigation Entry:** Completion of `SCR-202`.
- **Navigation Exit:** `Tab + Enter` (restarts new test), or sidebar navigation.
- **States:**
  - *Success:* Celebration badge on Personal Record.
  - *Warning:* If accuracy $< 90\%$, surfaces friendly reminder: "Slow down slightly to build precision."

---

## 5. Module 3: Learning Mode

### SCR-301: Touch-Typing Curriculum Roadmap
- **Parent Module:** 03. Learning Mode
- **Purpose:** High-level educational progression displaying all touch-typing modules, completion status, and mastery stars.
- **Main User Action:** Click "Resume Active Lesson" or select an unlocked module.
- **Secondary Actions:** Review completed lesson scores; retake past drills.
- **Key Information:** 4 Modules (Home Row Foundations, Top Row Reaches, Bottom Row Coordination, Numbers & Symbols); 32 sequential lessons; mastery badges per lesson.
- **Navigation Entry:** Sidebar "Learning Mode" (`Ctrl + 3`).
- **Navigation Exit:** Routes to `SCR-302` on lesson selection.
- **States:**
  - *Empty/First Time:* Module 1 unlocked, Modules 2–4 locked with progress lock icons.

### SCR-302: Lesson Briefing & Finger Intro
- **Parent Module:** 03. Learning Mode
- **Purpose:** Teaches physical ergonomic theory, tactile landmarks, and finger assignments before drilling.
- **Main User Action:** Press `Space` to begin the interactive drill.
- **Secondary Actions:** Review visual diagram of target keys on hands and keyboard.
- **Key Information:** Target key pair (e.g., `F` and `J`), assigned fingers (Left and Right Index), posture tip, target accuracy threshold (must achieve $\ge 95\%$ to pass).
- **Navigation Entry:** Selection of a lesson from `SCR-301`.
- **Navigation Exit:** Transitions to `SCR-303`.

### SCR-303: Interactive Lesson Drill Stage
- **Parent Module:** 03. Learning Mode
- **Purpose:** Step-by-step paced drill reinforcing muscle memory with real-time visual keyboard finger overlay.
- **Main User Action:** Type repeating patterns (e.g., `fjfj fff jjj fjfj`).
- **Secondary Actions:** Toggle visual keyboard guide on/off (`Ctrl + KBD`).
- **Key Information:** Visual QWERTY keyboard with illuminated finger zones and dynamic key glows; live accuracy meter; pace metronome indicator.
- **Navigation Entry:** From `SCR-302`.
- **Navigation Exit:** Transitions to lesson summary or `SCR-301`.
- **States:**
  - *Passing:* Green stroke trail.
  - *Mistake:* Immediate audio tone, key turns red, finger guide highlights correct reach.

### SCR-304: Module Mastery Assessment
- **Parent Module:** 03. Learning Mode
- **Purpose:** Formal gatekeeper test concluding each curriculum module.
- **Main User Action:** Complete a 2-minute comprehensive test covering all keys in the module.
- **Key Information:** Strict criteria: Must score $\ge 95\%$ accuracy and $\ge 35\text{ WPM}$ to unlock the next module.
- **Navigation Entry:** Unlocked after completing all lessons in a module.
- **Navigation Exit:** Unlocks subsequent module on success or prompts review on failure.

---

## 6. Module 4: Skill Drills & Exercises

### SCR-401: Skill Drills Catalog & Hub
- **Parent Module:** 04. Skill Drills
- **Purpose:** Non-linear practice center for targeted skill sharpening.
- **Main User Action:** Select drill category (Weak Keys, N-Grams, Vocabulary, Custom Import).
- **Navigation Entry:** Sidebar "Skill Drills" (`Ctrl + 4`).
- **Navigation Exit:** Routes to specific drill stages (`SCR-402` to `SCR-405`).

### SCR-402: Weak-Key Remediation Generator
- **Parent Module:** 04. Skill Drills
- **Purpose:** Dynamically constructs custom drills targeting the user's highest error rate characters based on recent local telemetry.
- **Main User Action:** Click "Generate Drill" and begin typing generated exercise.
- **Key Information:** Current top 5 weakest keys (e.g., `Z`, `Q`, `P`, `B`, `;`), error percentage per key, generated exercise preview.
- **Navigation Entry:** From `SCR-401` or Dashboard recommendation link.
- **Navigation Exit:** Drill completion screen showing error rate reduction.

### SCR-403: N-Grams & Bigrams Practice Stage
- **Parent Module:** 04. Skill Drills
- **Purpose:** Drills the most common letter pairs (bigrams: `th`, `he`, `in`, `er`) and triplets (trigrams: `the`, `and`, `ing`) to build subconscious cadence.
- **Key Information:** Repetition counters, bigram rhythm graph, fluidity index.

### SCR-404: High-Frequency Vocabulary Drills
- **Parent Module:** 04. Skill Drills
- **Purpose:** Practice using the Top 100, 300, 1000, and 5000 most common English words.
- **Key Information:** Word tier selector, automatic punctuation inclusion option.

### SCR-405: Custom Text & File Import Studio
- **Parent Module:** 04. Skill Drills
- **Purpose:** Allows users to paste or import their own `.txt` or `.md` files to practice custom materials (articles, books, legal briefs).
- **Main User Action:** Paste text into preview box or click "Open Local Text File".
- **Key Information:** Word count, character count, estimated duration, sanitized preview.
- **States:**
  - *Empty:* Paste placeholder with sample text chips ("Literature", "Philosophy", "Scientific").
  - *Error:* "File exceeds 100,000 characters" or "Unsupported file format."

---

## 7. Module 5: Typing Games

### SCR-501: Arcade Games Hub
- **Parent Module:** 05. Typing Games
- **Purpose:** Showcase of arcade-style typing games with local leaderboards and highest streak records.
- **Main User Action:** Select game card (Falling Words, Time Attack, Word Scramble) and difficulty.
- **Navigation Entry:** Sidebar "Typing Games" (`Ctrl + 5`).

### SCR-502: Falling Words Defense Arena
- **Parent Module:** 05. Typing Games
- **Purpose:** Words descend from the top of the canvas; typing them destroys them before they hit the defense line.
- **Main User Action:** Type matching word and press `Space` to detonate.
- **Key Information:** Defense shield integrity (100%), combo multiplier ($2x$, $4x$), score tally, word speed progression.
- **States:**
  - *Game Over:* Transitions to `SCR-505` when shield integrity reaches 0%.

### SCR-503: Time Attack Sprint Arena
- **Parent Module:** 05. Typing Games
- **Purpose:** 60-second high-tempo sprint where every error deducts 2 seconds and every 10 consecutive clean words adds 3 seconds.
- **Key Information:** Countdown clock with dynamic red/green time additions, raw burst speed meter.

### SCR-504: Word Scramble Decryptor Arena
- **Parent Module:** 05. Typing Games
- **Purpose:** Cognitive anagram challenge where scrambled letters must be deciphered and typed correctly.

### SCR-505: Game Over & Local High Scores
- **Parent Module:** 05. Typing Games
- **Purpose:** Summary of game performance, score multipliers, and local leaderboard ranking.
- **Main User Action:** "Play Again (`Enter`)" or "Return to Arcade (`Esc`)".

---

## 8. Module 6: Developer Mode

### SCR-601: Developer Language Catalog
- **Parent Module:** 06. Developer Mode
- **Purpose:** Selection hub for technical typing across programming languages, configuration syntaxes, and CLI environments.
- **Main User Action:** Select language card (TypeScript, Java, Python, Rust, Go, SQL, Bash, HTML/CSS).
- **Secondary Actions:** Choose exercise tier: Language Keywords, Standard Idiomatic Snippets, Full Algorithm Functions.
- **Navigation Entry:** Sidebar "Developer Mode" (`Ctrl + 6`).

### SCR-602: Code Syntax Typing Stage
- **Parent Module:** 06. Developer Mode
- **Purpose:** Authentic code typing canvas with indentation preservation, syntax coloring, and special character recognition.
- **Main User Action:** Type code matching tokens (`{}`, `()`, `[]`, `=>`, `const`, `return`).
- **Key Information:** Tab indentation auto-advance (pressing `Enter` auto-aligns cursor to indentation depth without manual spacing); syntax token error highlights; symbol speed metric.
- **Navigation Entry:** Language selection from `SCR-601`.
- **Navigation Exit:** Code completion summary with symbol accuracy breakdown.

### SCR-603: Terminal & Shell Drills Stage
- **Parent Module:** 06. Developer Mode
- **Purpose:** Practice realistic terminal commands (`git`, `docker`, `kubectl`, `grep`, `ssh`, PowerShell).
- **Key Information:** Terminal shell mockup theme, flag/parameter recognition (`-rf`, `--all`, `-it`).

### SCR-604: Custom Code Snippet Manager
- **Parent Module:** 06. Developer Mode
- **Purpose:** Import, edit, and organize user's own programming snippets for custom practice.

---

## 9. Module 7: Analytics & Progress

### SCR-701: Analytics Telemetry Trends
- **Parent Module:** 07. Analytics
- **Purpose:** Longitudinal graphs of user performance over time.
- **Main User Action:** Toggle time range (Last 7 Days, 30 Days, All Time) and metric view (Net WPM, Accuracy, Consistency).
- **Key Information:** Recharts-driven interactive time-series curve; 7-day rolling average; personal record annotations.
- **Navigation Entry:** Sidebar "Analytics" (`Ctrl + 7`).

### SCR-702: Keyboard Heatmap & Finger Matrix
- **Parent Module:** 07. Analytics
- **Purpose:** Visual physical keyboard where key caps are colored according to speed and error rate.
- **Main User Action:** Click any key to inspect deep analytics (Total strokes, Errors, Mean latency, Most common substitution).
- **Key Information:** Color spectrum: Emerald ($< 2\%$ error, fast), Amber ($2-6\%$ error), Crimson ($> 6\%$ error); Finger load distribution bar chart.

### SCR-703: Historical Session Log Explorer
- **Parent Module:** 07. Analytics
- **Purpose:** Tabular log of every completed typing test and lesson stored in SQLite.
- **Main User Action:** Filter by mode, date, or WPM; click any row to review full historic results card.
- **Key Information:** Timestamp, Mode, Duration, Net WPM, Accuracy, Raw WPM, Errors.

### SCR-704: Consistency & Cadence Lab
- **Parent Module:** 07. Analytics
- **Purpose:** Analyzes typing rhythm, burst speed variance, and fatigue degradation over extended sessions.

---

## 10. Module 8: Achievements & Streaks

### SCR-801: Trophy Room & Badge Cabinet
- **Parent Module:** 08. Achievements
- **Purpose:** Visual gallery of unlockable trophies and badges celebrating speed thresholds, accuracy mastery, and dedication.
- **Main User Action:** Click any badge to inspect requirements and progress percentage.
- **Key Information:** Badge categories (Speed Milestones, Accuracy Paragons, Endurance Streaks, Developer Prowess); Locked badges show progress bars (e.g., "Hit 100 WPM on 60s test: 94/100").
- **Navigation Entry:** Sidebar "Achievements" (`Ctrl + 8`).

### SCR-802: XP Level Ladder & Tier Hall
- **Parent Module:** 08. Achievements
- **Purpose:** Visual progression ladder displaying levels 1 to 100 across 6 mastery tiers (Novice to Grandmaster).
- **Key Information:** Total accumulated XP, current level perks, next tier certificate unlock.

### SCR-803: Daily Streak Calendar & Goals
- **Parent Module:** 08. Achievements
- **Purpose:** Habit tracking calendar highlighting active practice days and streak protection shields.
- **Key Information:** GitHub-style practice contribution heatmap, current streak count, streak freeze inventory (earned through consistent accuracy).

---

## 11. Module 9: Customization & Settings

### SCR-901: General Application Preferences
- **Parent Module:** 09. Settings
- **Purpose:** Configure basic application behavior, start-up mode, and window preferences.
- **Key Information:** Start-up screen preference (Dashboard or Instant Test), auto-check for updates, minimizable to system tray.
- **Navigation Entry:** Sidebar "Settings" (`Ctrl + 9` or `Ctrl + ,`).

### SCR-902: Typing Engine & Caret Config
- **Parent Module:** 09. Settings
- **Purpose:** Fine-tune the typing interaction loop to individual typist preferences.
- **Key Information:** Caret style (Smooth Line, Block, Underline, Pulse, Off); Caret smoothness (Off, Gentle, Smooth); Error treatment (Stop on error vs. Allow free typing with backspace); Live WPM HUD visibility.

### SCR-903: Keyboard Layout & Finger Settings
- **Parent Module:** 09. Settings
- **Purpose:** Select physical keyboard hardware layout and visual guide settings.
- **Key Information:** Layout choices (QWERTY, Dvorak, Colemak, Workman, AZERTY); Keyboard size (60%, TKL, Full Size); Hand guide display on/off.

### SCR-904: Visual Themes & Font Palette
- **Parent Module:** 09. Settings
- **Purpose:** Personalize color palettes, contrast levels, and typographic fonts.
- **Key Information:** Theme selection (Midnight Dark, Cyber Slate, Warm Studio Light, High Contrast Black & White); Font family (Inter, JetBrains Mono, Fira Code, OpenDyslexic); Font size scaling slider (14px to 28px).

### SCR-905: Mechanical Audio Sound Studio
- **Parent Module:** 09. Settings
- **Purpose:** Acoustic feedback simulation for keystroke actuation.
- **Key Information:** Switch sound profiles (Cherry MX Blue Clicky, Cherry MX Brown Tactile, Cherry MX Red Linear, Bubble Type, Typewriter, Off); Master volume slider; Separate sound on error option.

### SCR-906: Local Database & Export/Backup
- **Parent Module:** 09. Settings
- **Purpose:** Data ownership and privacy controls for the local SQLite database.
- **Main User Action:** "Export Complete History (.json / .csv)", "Create Backup Snapshot", or "Clear Local History".
- **Key Information:** Database storage size, total stored sessions count, local SQLite directory path with one-click "Open in Windows Explorer" button.
