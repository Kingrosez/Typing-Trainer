# D7 USER JOURNEYS: DEVELOPER MODE
**Typing Trainer — Windows Desktop Application**
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 2 UX Architecture & Functional Specifications*
*Document Version: 1.0.0 | Date: 2026-11-18 | Status: COMPLETE & READY FOR REVIEW*

---

## 1. Executive Summary

This document details the eleven primary user journeys across **Developer Mode**. 

Each journey defines the user persona, trigger conditions, step-by-step interaction sequence, system state transitions, error branches, and post-conditions, ensuring a frictionless desktop developer experience.

---

## 2. Master Journey Directory

1. **Journey 01:** First-Time Developer Mode Onboarding & Orientation
2. **Journey 02:** Language Exploration & Track Selection
3. **Journey 03:** Starting a Curated Multi-Line Exercise
4. **Journey 04:** Starting a Procedurally Generated Exercise
5. **Journey 05:** Importing and Typing Custom Code Files (500 KB UTF-8)
6. **Journey 06:** Practicing Micro-Syntax Delimiters & Compound Operators
7. **Journey 07:** Completing an Advanced Multi-Line Production Code Block
8. **Journey 08:** Correcting Mistakes Across Line Boundaries (Multi-Line Backspacing)
9. **Journey 09:** Reviewing Detailed Syntax Analytics & Code Diff Scorecard
10. **Journey 10:** Seamless Remediation of Weak Symbols via D6 Integration
11. **Journey 11:** Advancing Through 4-Stage Language Mastery Certifications

---

## 3. Detailed User Journey Specifications

### 3.1 Journey 01: First-Time Developer Mode Onboarding & Orientation
- **Persona:** Persona E (Aspiring Junior) or Persona B (Full-Stack Dev).
- **Trigger:** User clicks "Developer Mode" in sidebar or presses `Ctrl + 5` for the first time.
- **Pre-Conditions:** User has no prior Developer Mode session history in SQLite.
- **Interaction Flow:**
  ```
  [User: Presses Ctrl+5] 
       │
       ▼
  [System: Navigates to SCR-601 Developer Hub]
       │
       ▼
  [System: Displays "Welcome to Developer Mode" Onboarding Banner]
       │  • Explains the "Code WPM Gap" (code typing is naturally 20-40% slower due to symbols).
       │  • Explains Anti-IDE Rule (zero auto-closing brackets; typists must type all characters).
       │  • Highlights 6 Core Launch Languages.
       ▼
  [User: Clicks "Select TypeScript Track" (or presses Enter on focused card)]
       │
       ▼
  [System: Transitions to SCR-602 Catalog with Tier 1 Foundations pre-selected]
  ```
- **Post-Conditions:** Onboarding flag `has_seen_dev_intro = 1` persisted to local preferences.

---

### 3.2 Journey 02: Language Exploration & Track Selection
- **Persona:** Persona A (Backend Architect) or Persona C (Data Engineer).
- **Trigger:** User navigates to `/developer` wanting to switch from TypeScript to Python.
- **Interaction Flow:**
  1. User arrives at `SCR-601: Developer Language Hub`.
  2. The 6-language grid displays live cards: TypeScript (54 WPM, 96.2%), Python (0 WPM, Unranked), Java, SQL, Rust, JavaScript, and JSON.
  3. User presses `ArrowDown` to focus the **Python** card.
  4. User presses `Enter` (or clicks `"Open Python Studio"`).
  5. The application navigates to `/developer/catalog/python` (`SCR-602`).
  6. The header updates with the Python emblem, active 4-space indentation tag, and Tier 1 snippets list.
- **Post-Conditions:** `useDevCatalogStore.activeLanguage` set to `'python'`.

---

### 3.3 Journey 03: Starting a Curated Multi-Line Exercise
- **Persona:** Persona B (Full-Stack Specialist).
- **Trigger:** User is in `SCR-602` and wants to practice modern async TypeScript.
- **Interaction Flow:**
  1. User selects `[ Tier 2: Idiomatic Constructs ]`.
  2. The snippet list filters to 12 curated snippets (e.g. `Async Fetch Handler`, `Array Reducer`, `Generic Repository`).
  3. User selects `Async Fetch Handler` (9 lines, Complexity Score 4.8).
  4. The right-hand column renders a live syntax-highlighted preview with line numbers and metadata.
  5. User verifies default setting: `[•] Smart Auto-Advance Indentation`.
  6. User presses `Enter` on the focused primary button `"Start Interactive Drill"`.
  7. System transitions to `SCR-603: Multi-Line Code Syntax Arena`.
  8. The 5-line sliding window renders Lines 1–5, with Line 1 active and liquid caret awaiting first stroke.
- **Post-Conditions:** `useDevSessionStore` initialized; timer armed to start on first keystroke.

---

### 3.4 Journey 04: Starting a Procedurally Generated Exercise
- **Persona:** Persona D (Systems Commander).
- **Trigger:** User wants infinite variety in Rust syntax without repeating curated snippets.
- **Interaction Flow:**
  1. In `SCR-602`, user selects tab `[ Procedural Generator ]`.
  2. System displays generator controls: Language (`Rust`), Complexity Tier (`Tier 3: Production`), Syntactic Focus (`Pattern Matching & Result Types`).
  3. The system generates a deterministic seed hash (`#RUST-GEN-7842`) using the local PRNG algorithm.
  4. The live preview box displays a procedurally assembled, syntactically valid Rust fragment:
     ```rust
     match parse_header(&buffer[..len]) {
         Ok(Some(token)) => process_payload(token, &mut stream)?,
         Ok(None) => return Err(ProtocolError::Incomplete),
         Err(e) => return Err(ProtocolError::from(e)),
     }
     ```
  5. User clicks `"Start Drill"`.
  6. The generated code loads into `SCR-603` arena with identical measurement and telemetry.
- **Post-Conditions:** Exercise executes; seed hash logged for deterministic review.

---

### 3.5 Journey 05: Importing and Typing Custom Code Files (500 KB UTF-8)
- **Persona:** Persona A (Backend Architect practicing proprietary codebase patterns).
- **Trigger:** User clicks `"Import Custom Code"` from Hub or Catalog.
- **Interaction Flow:**
  1. System opens `SCR-604: Custom Code Importer & Workspace`.
  2. Drag-and-drop dropzone displays supported formats (`.java`, `.ts`, `.js`, `.py`, `.sql`, `.rs`, `.json`, `.txt`, `.md`) and 500 KB ceiling.
  3. User drags a local file `OrderService.java` (42 KB) onto the dropzone.
  4. System executes pre-check:
     - Size: 42 KB $\le 500\text{ KB}$ (`PASS`).
     - UTF-8 Decoding: Strict TextDecoder byte verification (`PASS`).
     - Empty check: 180 lines of code (`PASS`).
     - Language Detection: Java detected from `.java` extension.
  5. Text is parsed strictly as inert plaintext (zero code execution).
  6. Automatic Pagination (Option A Approved): Because the file has 180 lines (>30 lines), the system automatically chunks the file into 10 sequential 15–20 line exercises based on logical boundary heuristics (blank lines, method declarations).
  7. SCR-604 displays the Chapter Navigation Selector preview:
     `OrderService.java • 180 lines • 10 Parts Generated (18 lines/part avg) • UTF-8 Validated`
     `[▶ Part 1: Lines 1–18 (Imports & Class Header)]` ... `[ Part 10: Lines 163–180 (Helper Methods)]`
  8. User clicks `[ Start Practice from Part 1 → ]`.
  9. System opens `SCR-603: Multi-Line Code Syntax Arena` with Focus HUD showing:
     `[ Java ] [ Part 1 of 10 ◀ ▶ ] [ Line 1 of 18 ] [ Time: 00:00 ]`.
  10. User completes Part 1; session is staged in IndexedDB and persisted with a unique UUID.
  11. System opens `SCR-605: Developer Results Scorecard`, showing Part 1 metrics and an "Imported File Progress" card (`1 of 10 Parts Completed (10%)`), with primary action `[ Next Part: Start Part 2 (Enter) ▶ ]`.
  12. Typist can pause and return to `SCR-604` anytime; the file card displays a progress bar (`1/10 Parts Completed`) and a 1-click `[ Resume Part 2 ]` button.
- **Error Branch (Oversized File):** If user drops a 1.2 MB file, system immediately rejects it with: *"File exceeds 500 KB limit. Please select a shorter source file or snippet."*
- **Error Branch (Invalid UTF-8):** If file contains invalid byte sequences, system rejects it with: *"Encoding Error: File contains invalid UTF-8 byte sequences. Please re-save as UTF-8 in your text editor."*
- **Error Branch (Empty File):** If user selects a 0-byte file, system immediately alerts: *"Empty File: Selected file contains no text content."*
- **Post-Conditions:** Custom code loaded into memory; zero file execution; multi-part progress persisted.

---

### 3.6 Journey 06: Practicing Micro-Syntax Delimiters & Compound Operators
- **Persona:** Persona C (Data Engineer struggling with brackets).
- **Trigger:** User selects `[ Delimiter Sprints ]` in `SCR-602`.
- **Interaction Flow:**
  1. User selects target delimiter set: `Curly Braces & Brackets: { } [ ]`.
  2. System loads a high-density 30-second sprint passage:
     `{ data: [ { id: (1) }, [ { key: [ "val" ] } ] ] }`
  3. User types in `SCR-603`. As each opening or closing delimiter is struck, the character illuminates Sky Blue (`#38BDF8`).
  4. Floating hint (`F1`) highlights the reaching finger: `[ R-Pinky: Key ] ]`.
  5. User finishes in 24 seconds with 98.2% symbol accuracy.
  6. Results card displays Symbol Accuracy and Hesitation Latency Delta (`-42ms improvement`).
- **Post-Conditions:** Symbol accuracy profile updated in SQLite.

---

### 3.7 Journey 07: Completing an Advanced Multi-Line Production Code Block
- **Persona:** Persona B (Full-Stack Specialist).
- **Trigger:** User is typing a 12-line TypeScript React hook in `SCR-603`.
- **Interaction Flow:**
  1. Canvas renders the 5-line window. Line 1 is active:
     `export function useDebounce<T>(value: T, delay: number): T {`
  2. User types Line 1. Caret glides smoothly.
  3. User strikes `Enter` at the terminal `{`.
  4. System executes Smart Auto-Advance:
     - Viewport scrolls up by 40px.
     - Line 2 becomes active: `  const [debouncedValue, setDebouncedValue] = useState<T>(value);`
     - The 2 leading spaces are pre-advanced with dotted guide `┆`.
     - Caret lands immediately at `c` of `const`.
  5. User types through Lines 2 to 12.
  6. Upon striking the final closing brace `}` on Line 12, the session terminates automatically.
  7. System plays subtle success chime and transitions to `SCR-605: Developer Results Scorecard`.
- **Post-Conditions:** Session metrics saved; Base XP and practice minutes credited.

---

### 3.8 Journey 08: Correcting Mistakes Across Line Boundaries (Multi-Line Backspacing)
- **Persona:** Persona A (Backend Architect).
- **Trigger:** User makes a typo on the previous line and wants to fix it.
- **Interaction Flow:**
  ```
  Line 1: public class UserService {               [Completed]
  Line 2:     private final UserRpository repo;    <-- Typo in 'UserRpository' (missing 'e')
  Line 3:     public User|                         <-- Active Caret at column 15
  ```
  1. User notices typo on Line 2 while currently on Line 3.
  2. User presses `Backspace` repeatedly.
  3. Within Line 3, words delete backwards: `User` $\rightarrow$ caret lands at column 4 (first character after 4-space auto-indentation).
  4. User presses `Backspace` once more at column 4:
     - **The Line Boundary Traversal executes:**
     - The auto-inserted 4-space indentation on Line 3 dissolves.
     - The newline `\n` is deleted.
     - The canvas scrolls down by 40px.
     - Line 2 is unlocked and restored to active editing status.
     - The caret lands at the end of Line 2 (column 37, after `;`).
  5. User presses `Backspace` across Line 2 back to the word `UserRpository`.
  6. User re-types `UserRepository repo;` cleanly.
  7. User strikes `Enter`.
  8. Smart Auto-Advance re-engages for Line 3; caret lands at column 4.
  9. User resumes typing Line 3.
- **Accounting Verification:**
  - The original miskey on `R` remains logged in diagnostic history as a learning event.
  - Because it was corrected, it incurs **zero Net WPM error penalty** in the final scorecard.
  - Repeated backspacing does not generate duplicate error counts.
- **Post-Conditions:** State remains mathematically consistent across line boundaries.

---

### 3.9 Journey 09: Reviewing Detailed Syntax Analytics & Code Diff Scorecard
- **Persona:** Persona B (Full-Stack Specialist).
- **Trigger:** Session completes; user arrives at `SCR-605: Developer Results Scorecard`.
- **Interaction Flow:**
  1. Scorecard renders Hero Quartet:
     - **Net Speed:** `52 WPM` (D4 standard)
     - **Raw Speed:** `55 WPM`
     - **Overall Accuracy:** `97.8%`
     - **Symbol Accuracy:** `98.6%` (Emerald badge)
  2. Syntax Category Error Breakdown Table shows:
     - Delimiters: `0 errors / 24 opportunities (100%)`
     - Operators: `1 error / 18 opportunities (94.4%)` (stumbled on `=>`)
     - Identifiers: `2 errors / 62 opportunities (96.8%)`
     - Keywords: `0 errors / 45 opportunities (100%)`
  3. Multi-Line Code Diff Card displays full snippet with color-coded tokens; the single operator error on `=>` is highlighted with red strikethrough and corrected token in green.
  4. User reviews XP breakdown: Base XP `32 XP` $\times 1.20$ accuracy multiplier = `38 XP`.
- **Post-Conditions:** Results committed to SQLite `developer_sessions`.

---

### 3.10 Journey 10: Seamless Remediation of Weak Symbols via D6 Integration
- **Persona:** Persona D (Systems Commander).
- **Trigger:** User consistently struggles with curly braces `{}` and underscores `_` in Rust.
- **Interaction Flow:**
  1. In `SCR-605`, the recommendation banner displays:
     *ℹ "Observed high friction on symbols '{' (86.4% acc) and '_' (88.1% acc). Weak-Key Prioritization Index ($WPI$) has flagged these keys for targeted remediation."*
  2. User clicks primary button: `"Drill Weak Symbols in Remediation Studio"`.
  3. System routes seamlessly to `SCR-403: Drill Configuration Studio` (Module 04).
  4. The configurator automatically pre-selects `{` and `_` as target keys in Stage 2 (Word Families / Delimiters).
  5. User completes 2-minute remediation drill in `SCR-404`.
  6. Updated key health streams back to SQLite, lifting the symbol out of weak status.
- **Post-Conditions:** Unbroken closed-loop remediation achieved between D7 and D6.

---

### 3.11 Journey 11: Advancing Through 4-Stage Language Mastery Certifications
- **Persona:** Persona C (Data Engineer tracking SQL mastery).
- **Trigger:** User completes 5th qualifying Tier-2 SQL snippet with $\ge 96\%$ accuracy and $\ge 40$ WPM.
- **Interaction Flow:**
  1. In `SCR-605`, the Language Mastery Progression Card illuminates with celebration animation.
  2. Stage 2 Badge unlocks: `★ STAGE 2 CERTIFIED: IDIOMATIC SQL TYPIST`.
  3. Checklist shows: `[✓ 5/5 Qualifying Tier-2 Snippets Completed]`.
  4. System unlocks Tier 3 Production SQL snippets (complex joins, CTEs, window functions).
  5. On `SCR-601`, the SQL card updates its certification star from 1 to 2 stars.
- **Post-Conditions:** `developer_language_progress` updated in SQLite; zero duplicate milestone XP awarded (protects D5 reward governance).
