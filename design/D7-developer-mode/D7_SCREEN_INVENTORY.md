# D7 SCREEN INVENTORY: DEVELOPER MODE
**Typing Trainer — Windows Desktop Application**
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 2 UX Architecture & Functional Specifications*
*Document Version: 1.0.0 | Date: 2026-11-18 | Status: COMPLETE & READY FOR REVIEW*

---

## 1. Executive Summary

This inventory catalogues the five core screens comprising **Developer Mode (Module 06)**. 

Each screen is assigned a permanent, stable identifier starting from `SCR-601`, with comprehensive state mappings (Default, Loading, Empty, Active, Paused, Error, Completed) to ensure complete visual and engineering coverage.

---

## 2. Master Screen Directory

| Screen ID | Screen Name | Route Path | Primary Function & Scope | Parent Module |
|---|---|---|---|:---:|
| **SCR-601** | **Developer Mode Overview & Language Hub** | `/developer` | Central portal displaying 6 core languages, overall developer telemetry, and quick launchpad. | 06. Dev Mode |
| **SCR-602** | **Exercise Catalog & Configurator** | `/developer/catalog/:lang` | Filterable catalog of curated snippets, micro-syntax drills, procedural generator, and difficulty tiers. | 06. Dev Mode |
| **SCR-603** | **Multi-Line Code Syntax Typing Arena** | `/developer/arena` | 5-line monospace sliding window with Smart Auto-Advance indentation and multi-line backspacing. | 06. Dev Mode |
| **SCR-604** | **Custom Code Importer & Workspace** | `/developer/import` | 500 KB file upload dropzone and direct code workspace with strict UTF-8 validation. | 06. Dev Mode |
| **SCR-605** | **Results & Syntax Analytics Scorecard** | `/developer/results` | Performance breakdown (Net WPM, Symbol Accuracy, Error categories, Diff card, Mastery progression). | 06. Dev Mode |

---

## 3. Detailed Screen Specifications & Operational States

### 3.1 SCR-601: Developer Mode Overview & Language Hub
- **Route:** `/developer` | **Accelerator:** `Ctrl + 5` (aligned with approved D1 navigation model and D3 shortcut matrix)
- **Purpose:** Serve as the home base for developers, summarizing code typing volume, language proficiencies, and providing 1-click access to all language tracks.
- **Operational States:**
  1. `Default State:` Populated cards for TypeScript, Python, Java, SQL, Rust, JavaScript, and JSON data track, showing WPM, accuracy, and certification badges.
  2. `Empty / Zero State:` First-time onboarding state with educational banner explaining the Code WPM gap and Anti-IDE rule, with all cards unranked (`-- WPM`, `0 Lines`).
  3. `Loading State:` Shimmer skeleton cards on language grid while SQLite loads historical sessions.
  4. `Focus State:` Visible 3px Cobalt Blue focus ring (`#2563EB`) navigating across language cards via arrow keys.

### 3.2 SCR-602: Exercise Catalog & Configurator
- **Route:** `/developer/catalog/:lang` (e.g. `/developer/catalog/typescript`)
- **Purpose:** Allow developers to browse curated snippets, configure difficulty tiers (1–4), toggle indentation modes, and preview exercise text with seed hash traceability.
- **Operational States:**
  1. `Default State (Snippets Tab):` Filtered list of 12–15 curated snippets for selected language with right-column live syntax-highlighted preview.
  2. `Delimiters Tab State:` High-density paired delimiter sprint list (Brackets, Parentheses, Braces).
  3. `Operators Tab State:` Compound operator sprint list (`===`, `=>`, `&&`, `||`, `!=`, `->`, `::`).
  4. `Procedural Generator Tab State:` Parameterized generator with seed hash (`#RUST-GEN-7842`) and dynamic snippet preview.
  5. `Empty Search State:` No snippets match custom search filter; displays `"No snippets found matching criteria."`

### 3.3 SCR-603: Multi-Line Code Syntax Typing Arena
- **Route:** `/developer/arena`
- **Purpose:** Focused, distraction-free multi-line code typing environment with authentic syntax coloring and tactile feedback.
- **Operational States:**
  1. `Ready / Standby State:` 5-line window rendered; Line 1 active; cursor blinking at column 0; timer at `00:00` waiting for first keystroke.
  2. `Active Typing State:` Liquid caret gliding horizontally; correct characters Sky Blue; errors Coral Red with wavy underline; auto-advanced indentation guided by dotted lines (`┆`).
  3. `Multi-Line Correction State:` Cursor backspacing at column 0 across line boundary, smoothly scrolling camera down and unlocking Line $N-1$ for editing.
  4. `Paused State:` Dimmed overlay modal on `Esc` displaying session elapsed time, current WPM, and buttons: `[ Resume (Esc) ]`, `[ Restart (R) ]`, `[ Quit (Q) ]`.
  5. `Guarded Restart State:` Modal prompt triggered on `F5` / `Ctrl + R` if session $> 10\text{s}$: *"Discard active drill progress and restart?"*
  6. `Zen Mode State:` Fullscreen clean view (`F11`) stripping sidebar, titlebar, and HUD for 100% code focus.

### 3.4 SCR-604: Custom Code Importer & Workspace
- **Route:** `/developer/import`
- **Purpose:** Ingest local developer files (`.java`, `.ts`, `.js`, `.py`, `.sql`, `.rs`, `.json`, `.txt`, `.md`) or raw pasted code.
- **Operational States:**
  1. `Default Empty Dropzone:` Dashed Cobalt border, supported formats list, 500 KB ceiling label, and paste workspace.
  2. `File Dragging State:` Dropzone pulses with active blue overlay (`rgba(37, 99, 235, 0.08)`).
  3. `Validation Success State:` Code parsed and displayed in preview box; line count, character count, and detected language tag shown.
  4. `Error State — Oversized File (> 500 KB):` Prominent red error banner: *"File exceeds 500 KB limit. Please select a shorter source file or snippet."*
  5. `Error State — Invalid UTF-8 Encoding:` Red error banner: *"Encoding Error: File contains invalid UTF-8 byte sequences. Please re-save as UTF-8 in your text editor."*
  6. `Error State — Empty File (0 Bytes):` Alert banner: *"Empty File: Selected file contains no text content."*

### 3.5 SCR-605: Developer Results & Syntax Analytics Scorecard
- **Route:** `/developer/results`
- **Purpose:** Deliver a comprehensive post-drill evaluation isolating syntax accuracy, keyword velocity, and multi-line code diffs.
- **Operational States:**
  1. `Default Scorecard State:` Hero Quartet (Net WPM, Raw WPM, Overall Accuracy, Symbol Accuracy), Syntax Error Breakdown, and XP bar.
  2. `Mastery Stage Unlock State:` Celebratory golden badge unlocked when typist fulfills 5 qualifying tier snippets (e.g. `★ STAGE 2 CERTIFIED: IDIOMATIC TYPIST`).
  3. `Remediation Trigger State:` High symbol error rate triggers recommendation banner linking directly to D6 Weak-Key Remediation Studio.
  4. `Zero Errors Perfect Run State:` Emerald celebration banner: `✨ CLEAN COMPILE: 100% SYNTACTIC ACCURACY`.
