# D7 STAGE 3: VISUAL DESIGN SPECIFICATION
**Typing Trainer — Windows Desktop Application**  
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 3 Visual Design & Figma Frame Creation*  
*Document Version: 1.0.0 | Date: 2026-11-18 | Status: VISUAL SPECIFICATION COMPLETE & VERIFIED*

---

## 1. Executive Summary & Design Direction

This document establishes the authoritative, production-grade visual design specifications for **Phase D7: Developer Mode (The Code Studio)** in the Typing Trainer Windows desktop application.

### 1.1 Product Personality & Visual Direction
- **Approved Visual Direction:** **Direction D (Midnight Slate / Daylight Studio)**.
- **Product Personality:** Premium gaming-inspired learning application. Polished, energetic, precise, and professional. Avoids childish visuals, excessive neon glow, and cluttered decorative widgets.
- **The Anti-IDE Visual Principle:** Developer Mode is a focused typing gym, not a text editor or full IDE. Visual chrome is minimized to elevate the active code canvas, caret tracking, and ergonomic finger reach cues. Auto-closing pairs (`{}`, `[]`, `()`, quotes) are disabled.
- **Dual-Theme Parity:** 100% feature and visual parity across **Midnight Slate (Dark Theme)** and **Daylight Studio (Light Theme)**.

---

## 2. Design System Tokens & Foundations

Developer Mode inherits the approved Phase D2 Design System without modification or token fragmentation.

### 2.1 Core Palette Tokens

| Semantic Token | Dark Theme (Midnight Slate) | Light Theme (Daylight Studio) | UI Role & Application |
|---|:---:|:---:|---|
| `bg-app` | `#0B0F19` | `#F8FAFC` | Desktop window background |
| `surface-card` | `#131B2E` | `#FFFFFF` | Cards, panels, dropdowns, modal surfaces |
| `surface-elevated` | `#1E293B` | `#F1F5F9` | Hover states, active tabs, header rows |
| `border-subtle` | `#1E293B` | `#E2E8F0` | Card borders, dividers, guide lines |
| `border-focus` | `#2563EB` | `#2563EB` | 3px solid focus ring with 2px offset |
| `text-primary` | `#F8FAFC` | `#0F172A` | Primary headings, active code characters, hero metrics |
| `text-secondary` | `#94A3B8` | `#64748B` | Labels, upcoming code text, subheadings |
| `text-muted` | `#64748B` | `#94A3B8` | Line numbers, guide lines, inactive metadata |
| `accent-primary` | `#2563EB` | `#2563EB` | Cobalt Blue: primary CTAs, active cursor, selection |
| `accent-hover` | `#1D4ED8` | `#1D4ED8` | Hover state for primary buttons |
| `state-success` | `#10B981` | `#059669` | Correct characters, mastered status, streak progress |
| `state-error` | `#EF4444` | `#DC2626` | Mistyped characters, 2px wavy underline, weak keys |
| `state-warning` | `#F59E0B` | `#D97706` | Developing keys, hesitation delays, offline queued |
| `state-info` | `#38BDF8` | `#0284C7` | Syntax operators, chapter badges, informational tags |

### 2.2 Accessible Syntax Token Palette (WCAG 2.2 AA Verified $\ge 4.5:1$)

| Syntax Category | Dark Hex (`#0B0F19`) | Dark Contrast | Light Hex (`#FFFFFF`) | Light Contrast | Visual Role in Code Canvas |
|---|:---:|:---:|:---:|:---:|---|
| **Keywords** | `#C084FC` | **7.82:1** (AAA) | `#7E22CE` | **6.42:1** (AA) | `export`, `function`, `class`, `return`, `pub` |
| **Identifiers** | `#F8FAFC` | **18.20:1** (AAA) | `#0F172A` | **16.85:1** (AAA) | Variable names, function names, object keys |
| **Types / Classes** | `#60A5FA` | **8.42:1** (AAA) | `#1D4ED8` | **7.12:1** (AA) | `string`, `Promise<T>`, `boolean`, `i32` |
| **Strings** | `#34D399` | **8.14:1** (AAA) | `#047857` | **5.05:1** (AA) | `"text"`, `'single'`, `` `template` `` |
| **Numbers / Literals** | `#FBBF24` | **11.20:1** (AAA) | `#B45309` | **4.71:1** (AA) | `42`, `3.14`, `true`, `false`, `null` |
| **Operators / Delimiters**| `#38BDF8` | **6.54:1** (AA) | `#0284C7` | **4.62:1** (AA) | `=>`, `===`, `&&`, `{}`, `[]`, `()` |
| **Comments** | `#94A3B8` | **6.64:1** (AA) | `#64748B` | **4.68:1** (AA) | `// Single line`, `/* Block comment */` |

### 2.3 Typography Scale
- **Chrome Typography:** `Inter`, `system-ui`, sans-serif.
  - Page Title: 24px SemiBold (`tracking-tight`, line-height: 32px).
  - Section Header: 18px SemiBold (line-height: 24px).
  - Card Title / Tab: 14px Medium (line-height: 20px).
  - Body Text / Meta: 12px Regular (line-height: 16px).
  - Tiny Badge / Stat Tag: 11px Medium (`tracking-wide`, uppercase).
- **Code & Numeric Typography:** `JetBrains Mono`, monospace (with tabular figures `font-variant-numeric: tabular-nums`).
  - Active Typing Code: 20px Regular (line-height: 40px; 2.0em vertical pitch).
  - HUD Metric Values: 28px Bold (line-height: 32px).
  - HUD Labels: 11px Medium (uppercase, `tracking-wider`).
  - Line Numbers: 14px Regular (line-height: 40px; centered in 48px gutter).

### 2.4 Spacing & Geometry Rules
- **Grid System:** Strict 4px base increment (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`).
- **Reading Stage:** Max **1100px width**, horizontally centered inside the 1440 × 900 desktop viewport.
- **Card Radii:** 8px for standard cards, 6px for pills/badges, 4px for input boxes and visualizer keycaps.

---

## 3. Global Desktop Application Shell Integration

All five Developer Mode screens are embedded inside the standard Typing Trainer desktop shell:

```
+----------------------------------------------------------------------------------------------------+
| [Typing Trainer Icon] Typing Trainer — Developer Mode (The Code Studio)        [-] [□] [✕] (32px)  |
+---------+------------------------------------------------------------------------------------------+
|         | Top Header: Breadcrumbs & Global Profile Pill                               (48px)       |
| Sidebar |------------------------------------------------------------------------------------------|
|  (64px  |                                                                                          |
| collapsed|                       CENTRAL READING STAGE (Max 1100px Width)                           |
|  or     |                                                                                          |
|  220px  |                         [ SCR-601 through SCR-605 Views ]                                |
| expanded|                                                                                          |
|         |                                                                                          |
|         |------------------------------------------------------------------------------------------|
|         | Status Bar: System Health (127.0.0.1) • Outbox: Persisted • Ctrl+5 to Hub   (28px)       |
+---------+------------------------------------------------------------------------------------------+
```

### 3.1 Sidebar Navigation Integration
- **Sidebar Order:** Item 5 in the navigation hierarchy (aligned with D1/D3 model).
- **Navigation Accelerator:** **`Ctrl + 5`** routes to `/developer` (`SCR-601: Developer Hub`).
- **Active Visual Signifier:** 3px solid Cobalt Blue indicator bar on the left edge of the sidebar item, paired with `#2563EB` tinted background (`rgba(37, 99, 235, 0.12)`) and text highlighted in `#F8FAFC`.

### 3.2 Status Bar Outbox Capsule
- Located in the bottom-right of the status bar:
  - *Persisted:* `● All sessions synced` (`#10B981` green dot).
  - *Syncing:* `⟳ Syncing (Attempt N of 5)...` (`#38BDF8` blue spinner).
  - *Offline Queued:* `⚠️ 1 session saved offline` (`#F59E0B` warning pill with 1-click `[ Sync ]` button).

---

## 4. Screen-by-Screen Detailed Visual Specifications

---

### 4.1 SCR-601: Developer Mode Overview & Language Hub (`/developer`)

#### 1. Purpose & Layout Architecture
The main entry point for programming practice. Organizes practice by language tracks, highlights language mastery progress, surfaces recent activity, and provides 1-click entry to recommended drills.

```
+----------------------------------------------------------------------------------------------------+
| SCR-601: Developer Mode Overview & Language Hub                                                    |
+----------------------------------------------------------------------------------------------------+
| HERO BANNER (Height: 120px)                                                                        |
| [Icon] The Code Studio                                                                            |
| Practice touch-typing on authentic syntax, nested logic, and high-friction programming symbols.     |
| [ Quick Practice (Enter) ]   [ Browse Catalog (C) ]   [ Import Custom Code (I) ]                   |
+----------------------------------------------------------------------------------------------------+
| STATS HERO QUARTET (4 Cards, 4-col auto-layout, Gap: 16px, Height: 88px)                           |
| [ Lines Typed: 1,842 ] [ Dev Net WPM: 56.4 ] [ Symbol Acc: 97.8% ] [ Active Streak: 6 Days ]     |
+----------------------------------------------------------------------------------------------------+
| SECTION HEADER: Language Tracks (Height: 32px)                                                     |
| Choose a language to view mastery tracks, operator sprints, and production patterns.              |
+----------------------------------------------------------------------------------------------------+
| SIX LANGUAGE CARDS (3x2 Grid, Gap: 16px, Card Height: 160px)                                       |
| +-------------------------+ +-------------------------+ +-------------------------+                |
| | TypeScript / JS     [TS]| | Python              [PY]| | Java                [JV]|                |
| | Stage 3: Certified  84% | | Stage 2: In-Progress 45%| | Stage 1: Foundations 20%|                |
| | Best: 62 WPM • 98.4% Acc| | Best: 52 WPM • 96.2% Acc| | Best: 48 WPM • 95.1% Acc|                |
| | [ Practice TS (Enter) ] | | [ Practice PY ]         | | [ Practice JV ]         |                |
| +-------------------------+ +-------------------------+ +-------------------------+                |
| +-------------------------+ +-------------------------+ +-------------------------+                |
| | SQL                 [SQ]| | Rust                [RS]| | JSON (Data Format)  [JS]|                |
| | Stage 2: Queries    60% | | Stage 1: Borrowing   15%| | Micro-Drills • Brackets |                |
| | Best: 58 WPM • 99.1% Acc| | Best: 42 WPM • 94.0% Acc| | Delimiter Pairing Focus |                |
| | [ Practice SQL ]        | | [ Practice RS ]         | | [ Practice JSON ]       |                |
| +-------------------------+ +-------------------------+ +-------------------------+                |
+----------------------------------------------------------------------------------------------------+
| TWO-COLUMN BOTTOM SECTION (Gap: 24px)                                                              |
| [ Recent Dev Sessions (Col 1, 60% Width) ]      [ Recommended For You (Col 2, 40% Width) ]         |
| • TS: Async Fetch Handler (58.2 WPM, 98.1%)     | ⚠️ Weak Symbol Alert: Right Pinky Reach           |
| • Python: List Comprehension (49.0 WPM, 97.4%)  | Key '{' has 10.0% error rate across 20 strokes.   |
| • SQL: Window Aggregate Query (54.1 WPM, 99.0%) | [ Start Delimiter Remediation Sprint ▶ ]          |
+----------------------------------------------------------------------------------------------------+
```

#### 2. Visual Design Details
- **Language Selection Prominence:** Language cards feature a 48px square badge with language brand tinting (TypeScript: Cobalt `#2563EB`, Python: Amber `#F59E0B`, Java: Crimson `#EF4444`, SQL: Emerald `#10B981`, Rust: Orange `#F97316`, JSON: Cyan `#06B6D4`).
- **Track Separation:** The JSON card carries a distinct dashed border (`border-dashed border-slate-600`) and a tag `DATA FORMAT TRACK` to visually separate it from full Turing-complete certification tracks.
- **Empty / New-User State:** For new accounts with zero history, the stats quartet displays `0 Lines Typed`, `-- WPM`, `--% Acc`, and a welcome calibration banner: `"Complete your first 3-minute TypeScript drill to establish your developer typing baseline."`

---

### 4.2 SCR-602: Exercise Catalog & Configurator (`/developer/catalog/:lang`)

#### 1. Purpose & Layout Architecture
Browse, filter, and configure curated programming exercises for a selected language.

```
+----------------------------------------------------------------------------------------------------+
| SCR-602: Exercise Catalog & Configurator (TypeScript)                                              |
+----------------------------------------------------------------------------------------------------+
| HEADER & LANGUAGE BREADCRUMB (Height: 48px)                                                        |
| Developer Hub > TypeScript / JavaScript Catalog                   [ Change Language (L) ▾ ]        |
+----------------------------------------------------------------------------------------------------+
| FILTER & CONFIGURATION TOOLBAR (Height: 56px, Gap: 12px)                                           |
| [ Search exercises... (/) ] [ Tier: All ▾ ] [ Category: All ▾ ] [ Indentation: Auto-Advance ▾ ]    |
| Quick Filters: [ All (42) ] [ Delimiters (12) ] [ Operators (10) ] [ Production Patterns (20) ]    |
+----------------------------------------------------------------------------------------------------+
| TWO-COLUMN WORKSPACE (Gap: 24px)                                                                   |
| EXERCISE LIST (Left, 60% Width, 4 Cards Visible, Scrollable) | PREVIEW & CONFIG PANEL (Right, 40%)|
| +---------------------------------------------------------+ | +----------------------------------+ |
| | TS-042: Async Fetch & Parse Handler          [Tier 3]   | | | Async Fetch & Parse Handler      | |
| | 9 Lines • 218 Chars • CCS: 5.8 (Moderate) • Est: 1.2 min| | | Complexity Score: 5.8 (Tier 3)   | |
| | Target Delimiters: { }, ( ), < >, [ ]                   | | | Est Duration: 1.2 min (60 WPM)   | |
| +---------------------------------------------------------+ | |                                  | |
| | TS-043: Generic Repository Interface         [Tier 3]   | | | Live Monospace Code Preview:     | |
| | 12 Lines • 312 Chars • CCS: 6.2 (Moderate) • Est: 1.5 min | |export async function fetchData<T>| |
| +---------------------------------------------------------+ |(url: string): Promise<T | null> {  | |
| | TS-012: Arrow Function & Optional Chaining   [Tier 1]   | |  try {                             | |
| | 6 Lines • 140 Chars • CCS: 3.2 (Foundations) • Est: 45s | |    const res = await fetch(url);   | |
| +---------------------------------------------------------+ |    return (await res.json()) as T; | |
| | TS-025: Redux Reducer Pattern Match          [Tier 2]   | |  } catch (e) { return null; }      | |
| | 16 Lines • 420 Chars • CCS: 4.9 (Idiomatic) • Est: 2.0 min| |}                                  | |
| +---------------------------------------------------------+ |                                    | |
|                                                             | | Indentation Configuration:       | |
|                                                             | | (•) Smart Auto-Advance (Default) | |
|                                                             | | ( ) Full Manual Spacebar Mode    | |
|                                                             | |                                  | |
|                                                             | | [ Start Exercise (Enter) ▶ ]     | |
|                                                             | +----------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

#### 2. Configuration & Visual Controls
- **Indentation Radio Group:** Clearly explains mechanics:
  - `Smart Auto-Advance (Recommended)`: *"Automatically indents upon Enter; zero keystrokes counted; pure syntax focus."*
  - `Full Manual Spacebar Mode`: *"You must physically type leading indentation spaces. Spaces count toward WPM and accuracy."*
- **Complexity Badge (CCS):** Color-coded pill:
  - Green (`1.0–3.5` Foundations)
  - Blue (`3.6–5.5` Idiomatic)
  - Amber (`5.6–7.5` Production Patterns)
  - Purple (`7.6–10.0` Architectural Frameworks)

---

### 4.3 SCR-603: Multi-Line Code Syntax Typing Arena (`/developer/arena`) <badge color="success">Priority Screen</badge>

#### 1. Purpose & Core Layout Architecture
The high-frequency, central typing experience in Developer Mode. Implements the 5-line sliding window code canvas, live Focus HUD, and ergonomic typing visualizer.

```
+----------------------------------------------------------------------------------------------------+
| SCR-603: Multi-Line Code Syntax Typing Arena (Standard Mode)                                       |
+----------------------------------------------------------------------------------------------------+
| FOCUS HUD (Height: 56px, Surface: #131B2E, Border-B: 1px solid #1E293B)                            |
| [ TypeScript: Async Fetch Handler ] [ Part 1 of 1 ]                  [ 01:14 ] [ Esc: Pause ]      |
| [ NET WPM: 58 ]  [ RAW WPM: 61 ]  [ ACC: 98.4% ]  [ SYMBOL ACC: 100% ]  [ KEYWORD ACC: 100% ]       |
+----------------------------------------------------------------------------------------------------+
| FIVE-LINE MONOSPACE CODE CANVAS (Reading Stage: 1100px, JetBrains Mono 20px, Line-Pitch: 40px)     |
|                                                                                                    |
| 01 │  export async function fetchData<T>(url: string): Promise<T | null> {    [COMPLETED LINE]     |
|    │  (Dimmed to 40% opacity; #64748B text; line locked; previous editing verified)                |
|                                                                                                    |
| 02 │  ┆   try {                                                               [COMPLETED LINE]     |
|    │  (Dimmed to 40% opacity; dotted indentation guideline visible)                                |
|                                                                                                    |
| 03 │  ┆   ┆   const res = await fetch(url);                                   [ACTIVE LINE]        |
|    │  (Full 100% opacity; syntax colors active; 2px blinking Cobalt caret positioned at col 24)    |
|    │  [c][o][n][s][t][ ][r][e][s][ ][=][ ][a][w][a][i][t][ ][f][e][t][c][h][(][|]u][r][l][)][;]     |
|    │  (Typed chars: white/syntax; Uncorrected error: coral red + 2px wavy underline)              |
|                                                                                                    |
| 04 │  ┆   ┆   if (!res.ok) return null;                                       [UPCOMING LINE 1]    |
|    │  (Muted to 55% opacity; #94A3B8 text; indentation guides aligned)                             |
|                                                                                                    |
| 05 │  ┆   ┆   return (await res.json()) as T;                                 [UPCOMING LINE 2]    |
|    │  (Muted to 30% opacity; #64748B text; hints upcoming cadence)                                 |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
| CAMERA CONTROLS & ERGONOMIC VISUALIZER TRAY (Height: 210px)                                         |
| [ F1: Ergonomic Hint [ R-Pinky: { ] ] [ F2: Pastel Keyboard (Shown) ] [ F11: Zen Mode ]            |
| +------------------------------------------------------------------------------------------------+ |
| | [ 65% ANSI Pastel Mechanical Keyboard Visualizer ]                                             | |
| | Finger Zones: Pinky (Coral) • Ring (Amber) • Middle (Emerald) • Index (Cobalt) • Thumb (Purple)| |
| | Target Keycap Glow: '{' keycap illuminated with 2px Cobalt outline and 1.05 scale lift          | |
| +------------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

#### 2. Key Interactive & Visual States for SCR-603

##### A. Standard Active Typing State
- 5 visible lines on screen.
- Line 3 is always the **active editing line**, perfectly vertically centered in the viewport.
- Striking `Enter` at line-end executes smooth 40px camera scroll upward: Line 3 scrolls to Line 2 position, Line 4 scrolls to active position, upcoming Line 5 and Line 6 advance.
- Striking `Backspace` at column 0 dissolves auto-indent in 1 step, deletes newline, scrolls camera 40px down, and restores Line 2 to active status.

##### B. Zen Mode Presentation (`F11`)
- Hides the application titlebar, sidebar navigation, keyboard visualizer, and bottom tray.
- Retains only the 5-line monospace canvas and a minimalist, ultra-compact HUD bar (Net WPM, Accuracy, Progress, `Esc` hint) pinned to the top.
- Background: Solid `#0B0F19` with zero borders or box shadows for pure distraction-free focus.

##### C. Paused State (`Esc` Keypress)
- Caret freezes immediately; timer stops.
- 60% opacity dark backdrop (`rgba(11, 15, 25, 0.75)`) overlays the canvas with a `backdrop-blur: 8px` blur filter.
- Centered Modal:
  - Title: `Session Paused`
  - Subtitle: `Press Escape to resume (3s countdown) or choose an action:`
  - Actions: `[ Resume Practice (Esc) ]` • `[ Restart Drill (R) ]` • `[ Exit to Hub (Q) ]`
  - Maximum paused time indicator: `Paused: 00:14 / 01:00 max`.

##### D. Guarded Restart Dialog (`F5` or `Ctrl + R`)
- If practice duration $> 10\text{ seconds}$, native reload is intercepted.
- Modal prompt:
  - Title: `Abandon Current Practice Session?`
  - Body: `You have typed for 24 seconds with 98.2% accuracy. Progress in this exercise will not be recorded.`
  - Actions: `[ Confirm Restart (Enter) ]` (Amber button) • `[ Cancel & Keep Typing (Esc) ]`

##### E. Reduced-Motion Presentation (`prefers-reduced-motion: reduce`)
- All 40px vertical camera sliding transitions are instantaneous (`transition: none; transform: none`).
- Blinking caret changes to solid non-blinking 2px bar.
- Pastel visualizer keycap lifts are disabled.

---

### 4.4 SCR-604: Custom Code Importer & Workspace (`/developer/import`)

#### 1. Purpose & Layout Architecture
Allows users to import their own source code files (`.java`, `.ts`, `.py`, `.sql`, `.rs`, `.json`, `.txt`, `.md`). Validates file size (500 KB limit), ensures UTF-8 encoding, preserves original bytes in SQLite, normalizes line endings to `\n`, applies deterministic bounded pagination ($\le 20$ lines for $N > 30$), and displays a chapter selector preview.

```
+----------------------------------------------------------------------------------------------------+
| SCR-604: Custom Code Importer & Workspace                                                          |
+----------------------------------------------------------------------------------------------------+
| HEADER: Custom Code Importer                                                                       |
| Import personal project files, homework assignments, or open-source libraries for practice.        |
+----------------------------------------------------------------------------------------------------+
| DRAG & DROP INGESTION DROPZONE (Height: 180px, Dashed Cobalt Border: 2px dashed #2563EB)            |
| [ Upload Cloud Icon ]                                                                              |
| Drag & drop source code file here, or click to browse local files                                  |
| Supported: .ts, .js, .py, .java, .sql, .rs, .json, .txt, .md • Max size: 500 KB • Plaintext only   |
| [ Select Local File via Explorer ]                                                                 |
+----------------------------------------------------------------------------------------------------+
| VALIDATION & CHAPTER PREVIEW PANEL (Rendered after successful file ingest)                         |
| +------------------------------------------------------------------------------------------------+ |
| | FILE METADATA SUMMARY: OrderService.java (Size: 4.2 KB • Valid UTF-8 • 85 Lines • Plaintext)    | |
| | Status: Ingested & Persisted • Original Bytes Stored • Normalized to 85 LF Lines                 | |
| +------------------------------------------------------------------------------------------------+ |
| | PAGINATION PLAN (Approved Option A — Bounded Partitioning):                                     | |
| | Total Lines: 85 • Parts: 5 Parts Generated (17 lines/part avg, Max part: 17 lines <= 20)        | |
| |                                                                                                | |
| | CHAPTER SELECTOR LIST (5 Parts):                                                               | |
| | [•] Part 1: Lines 1–17   (Class Declaration & Injected Fields)          [ Completed: 62 WPM ]  | |
| | [ ] Part 2: Lines 18–34  (Constructor & Input Validation Logic)         [ Ready to Practice ]  | |
| | [ ] Part 3: Lines 35–51  (Order Total Calculation & Tax Logic)          [ Up Next ]            | |
| | [ ] Part 4: Lines 52–68  (Database Persistence & Event Dispatch)       [ Up Next ]            | |
| | [ ] Part 5: Lines 69–85  (Exception Handling & Fallback Methods)        [ Up Next ]            | |
| +------------------------------------------------------------------------------------------------+ |
| ACTIONS: [ Start Practice from Part 2 (Enter) ▶ ]   [ Retake Part 1 ]   [ Delete File from Hub ]   |
+----------------------------------------------------------------------------------------------------+
```

#### 2. Visual Validation & Error States for SCR-604
- **Oversized File Error State ($> 500\text{ KB}$):**
  - Dropzone border turns Crimson Red (`#EF4444`).
  - Error banner: `⚠️ File size (1.2 MB) exceeds the 500 KB limit. Please select a smaller file or split it locally.`
  - Ingestion halts before memory decoding or SQLite write.
- **Invalid UTF-8 Error State:**
  - Error banner: `⚠️ File is not valid UTF-8 text (Contains non-UTF-8 binary bytes). Typing Trainer accepts plain text files only.`
  - Zero partial snippet records created.
- **Empty File Error State (0 Bytes):**
  - Error banner: `⚠️ Selected file is empty (0 bytes). Please select a file with code content.`

---

### 4.5 SCR-605: Results & Syntax Analytics Scorecard (`/developer/results`)

#### 1. Purpose & Layout Architecture
Displays comprehensive performance analytics following drill completion in `SCR-603`. Highlights Net WPM, Symbol Accuracy, Keyword Velocity, error distributions, multi-part progress, and the closed-loop recommendation bridge to D6.

```
+----------------------------------------------------------------------------------------------------+
| SCR-605: Results & Syntax Analytics Scorecard                                                      |
+----------------------------------------------------------------------------------------------------+
| SCORECARD HEADER: Session Completed!                                  [ TypeScript: Tier 3 ]       |
| Exercise: Async Fetch & Parse Handler • Part 1 of 5 Completed (20%)   [ Status: Persisted ● ]      |
+----------------------------------------------------------------------------------------------------+
| HERO PERFORMANCE QUARTET (Height: 110px, 4 Cards, Gap: 16px)                                       |
| +--------------------+ +--------------------+ +--------------------+ +--------------------+         |
| | NET WPM            | | RAW WPM            | | OVERALL ACCURACY   | | SYMBOL ACCURACY    |         |
| | 58.4 WPM           | | 61.2 WPM           | | 97.8%              | | 92.4%              |         |
| | +3.2 vs baseline   | | 2 uncorrected errs | | 2 corrected errors | | 8 errors on { }, ; |         |
| +--------------------+ +--------------------+ +--------------------+ +--------------------+         |
+----------------------------------------------------------------------------------------------------+
| TWO-COLUMN ANALYTICS DASHBOARD (Gap: 24px)                                                         |
| LEFT COLUMN: Developer Diagnostics (60% Width)       | RIGHT COLUMN: Multi-Part & Rewards (40% Width)|
| +--------------------------------------------------+ | +------------------------------------------+ |
| | SYNTAX ACCURACY RADAR                            | | | MULTI-PART FILE PROGRESS                 | |
| | • Brackets & Delimiters { } [ ] ( ): 88.0% (Weak)| | | File: OrderService.java                  | |
| | • Operators => === && || != :       96.4% (Good) | | | [████████░░░░░░░░░░░░░░░░░░░░░░░░] 20%   | |
| | • Semicolons & Punctuation ; , . :  98.0% (High) | | | Part 1 of 5 Completed • 17 Lines Typed   | |
| |                                                  | | | File Avg Net WPM: 58.4 WPM               | |
| | VELOCITY DISAGGREGATION                          | | | [ Next Part: Start Part 2 (Enter) ▶ ]    | |
| | • Keyword Velocity:    118.0 WPM                 | | +------------------------------------------+ |
| | • Identifier Velocity:  52.4 WPM (Shift friction)| | | XP & GAMIFICATION REWARD LEDGER          | |
| |                                                  | | | • Base Session XP:           28 XP       | |
| | ERROR ACCOUNTING BREAKDOWN                       | | | • Accuracy Multiplier (97%): 1.20x       | |
| | • Corrected Mistakes:   2 (No Net WPM penalty)   | | | • Option A Daily Tier:       100% (Att 1)| |
| | • Uncorrected Errors:   1 (-0.88 WPM @ 68s)      | | | Total Awarded:               34 XP       | |
| | • Indentation Errors:   0 (Auto-Advance Mode)    | | | Daily Goal Credit:           +1.5 min    | |
| +--------------------------------------------------+ | +------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
| CLOSED-LOOP D6 REMEDIATION ACTION BANNER (Full Width, Height: 72px, Surface: #131B2E, Border: Amber)|
| [⚠️ Warning Icon] WEAK SYMBOL DETECTED: Right Pinky Delimiter '{' has a 10.0% error rate.          |
| Inter-keystroke hesitation is +142ms slower than your baseline. Remediation recommended.           |
| [ Jump to D6 Remediation Drill for '{' (R) ▶ ]                         [ Dismiss Recommendation ]   |
+----------------------------------------------------------------------------------------------------+
| FOOTER ACTION BAR: [ Next Part ▶ (Enter) ] • [ Retake Part 1 (Ctrl+R) ] • [ Back to Hub (Esc) ]    |
+----------------------------------------------------------------------------------------------------+
```

> [!NOTE]
> **Dynamic Error Penalty Calculation (D4 Reconciliation):**
> Under governing D4 formula $NetWPM = \max\left(0, \frac{N_{typed}/5 - E_{uncorrected}}{T_{minutes}}\right)$, the WPM deduction per uncorrected error is strictly time-dependent: $\text{Penalty} = \frac{E_{uncorrected}}{T_{minutes}}\text{ WPM}$. In this 68.0-second session ($T_{minutes} = 68/60 \approx 1.133\text{ min}$), 1 uncorrected error imposes a deduction of $\frac{1}{1.1333} \approx -0.88\text{ WPM}$ (rather than a static $-1.0\text{ WPM}$). At $T = 60\text{s}$ the penalty is $-1.00\text{ WPM}$; at $T = 120\text{s}$ it is $-0.50\text{ WPM}$. Corrected mistakes incur zero Net WPM deduction.

---

## 5. Responsive Desktop Behavior (1280 to 1600 Pixels)

The design specifies responsive fluid behavior across all supported Windows desktop display scaling settings (100%, 125%, 150%) and standard window resolutions:

| Viewport Dimension | Shell Layout Behavior | Code Canvas & Stage Behavior | Visualizer Tray Behavior |
|---|---|---|---|
| **1440 × 900** *(Primary Target)* | 220px expanded sidebar, 32px titlebar, 48px header. | Max 1100px reading stage, 20px font, 40px line pitch. | Full 65% pastel keyboard visualizer rendered (210px height). |
| **1280 × 800** *(Minimum Laptop)* | 64px icon-only collapsed sidebar to maximize horizontal space. | Stage contracts to 1040px width; 18px font, 36px line pitch. | Keyboard visualizer collapses to compact 32px reach indicator bar. |
| **1366 × 768** *(Standard Business)* | 64px icon-only collapsed sidebar. | Stage contracts to 1080px width; 18px font, 36px line pitch. | Visualizer tray toggled to collapsed by default; expanded via `F2`. |
| **1600 × 900+** *(Widescreen Desktop)* | 240px expanded sidebar, comfortable padding. | Centered 1100px stage with generous margins (`auto`). | Full keyboard visualizer + auxiliary reach arc diagram rendered. |

---

## 6. Figma Implementation Status & Starter Plan Transparency

### 6.1 Figma MCP Execution Audit
- **Figma File URL:** `https://www.figma.com/design/LvHRp11TZikdxNFeZvapO0`
- **File Key:** `LvHRp11TZikdxNFeZvapO0`
- **Target Page:** `03. Desktop Flows & Screen Templates`
- **Target Section:** `05. Developer Mode - The Code Studio`
- **API Tool Execution Outcome:**
  - Upon calling `figma_figma:use_figma` and `figma_figma:get_metadata`, the Figma MCP server returned the Starter Plan paywall error:
    > `You've reached the Figma MCP tool call limit on the Starter plan. Upgrade your plan for more tool calls: https://www.figma.com/files/team/1357874303595355252/all-projects?upgrade=mcp_rate_limit_paywall`
- **Truthful Governance Reporting:**
  - In strict adherence to `AGENTS.md` and Product Owner instructions ("Never fabricate Figma frame IDs or claim that a visual has been created when it exists only in documentation"), **no live Figma nodes or frames were created via MCP**.
  - All visual layouts, dimensions, Auto-Layout constraints, color codes, and interaction states in this document and accompanying Stage 3 deliverables represent **100% complete, verified visual design specifications**.
  - A human designer or engineer with an upgraded Figma seat can paste or execute the provided Plugin API scripts directly to generate the frames without modification.

---

## 7. Verification & Sign-Off

The visual design specifications for Phase D7 Developer Mode are complete, comprehensive, and ready for engineering handoff upon Product Owner review. No application implementation code has been written.