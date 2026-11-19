# D7 TYPING MECHANICS ANALYSIS: DEVELOPER MODE
**Typing Trainer — Windows Desktop Application**
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 1 Product Discovery & Requirements Analysis*
*Document Version: 1.0.0 | Date: 2026-11-18 | Status: COMPLETE & READY FOR REVIEW*

---

## 1. Executive Summary

Typing source code introduces unique mechanical challenges that do not exist in standard prose typing: structural multi-line indentation, paired opening and closing delimiters, dense symbol chords, and continuous capitalization shifts.

This analysis evaluates how the **Developer Mode Typing Engine** must handle these mechanics. It contrasts traditional code editor behavior (IDEs) with the pedagogical requirements of a typing trainer, resolving the tension between editor convenience and tactile motor acquisition.

---

## 2. The Core Dilemma: Typing Trainer vs. Code Editor

Modern code editors (VS Code, IntelliJ, Neovim) are engineered for **authoring efficiency**, relying heavily on automated conveniences:
- Auto-closing brackets: Typing `(` automatically inserts `)` and places the caret between them.
- Auto-closing quotes: Typing `"` automatically inserts `"`.
- Auto-indentation: Pressing `Enter` automatically indents the next line to match block nesting.
- Code completion: Pressing `Tab` or `Enter` expands prefixes into entire variable names or method calls.

### Why Editor Auto-Completions Defeat a Typing Trainer:
1. **Atrophy of Right-Pinky Muscle Memory:** If the application auto-inserts closing delimiters (`}`, `]`, `)`), the developer never practices reaching to the right-pinky keys to close expressions. In real software development, developers frequently edit existing code, navigate across brackets, or type on remote servers where auto-pairing fails.
2. **False Measurement of Typing Competence:** If an application auto-indents 12 spaces on a nested line, counting those 12 spaces as "typed characters" artificially inflates WPM; conversely, requiring the user to type over auto-inserted text creates immense cognitive frustration.
3. **Core Conclusion:** **A typing trainer must train the fingers, not simulate an IDE.** Auto-completion and auto-closing delimiters must be strictly disabled.

---

## 3. Indentation Mechanics Analysis

Indentation represents the single most significant mechanical divergence between prose and code. Three potential models were evaluated:

### 3.1 Model 1: Strict Manual Spacebar Indentation
- **How it works:** The typist must physically strike the spacebar 2, 4, 8, or 12 times at the start of every line to match the visual indentation level.
- **Pros:** 100% authentic literal character reproduction; zero engine ambiguity.
- **Cons:** Extremely tedious and mechanically fatiguing; causes rhythm disruption where typists mash the spacebar repeatedly, distracting from syntax practice.

### 3.2 Model 2: Smart Auto-Advance on Enter (Recommended Baseline)
- **How it works:** When the typist presses `Enter` at the end of Line $N$, the caret automatically moves to Line $N+1$ and visually skips leading indentation spaces, positioning the active cursor immediately at the first non-whitespace character of that line.
- **Visual Representation:** Leading spaces are pre-rendered with subtle, non-intrusive dotted indentation guide lines (`┆`).
- **Telemetry Accounting:** Pre-skipped indentation spaces do **not** count toward WPM or keystroke opportunities, guaranteeing zero metric inflation.
- **Pros:** Eliminates monotonous spacebar mashing; keeps typists focused on syntax, keywords, and delimiters; maintains high rhythm.
- **Cons:** Typists do not physically practice spacebar taps for indentation.

### 3.3 Model 3: Tab-to-Indent (Single Key Block Advance)
- **How it works:** The typist must press the `Tab` key once per indentation level (e.g. 2 tabs for an 8-space nested block) to advance to the code margin.
- **Pros:** Mirrors manual coding habits in editors configured for tab indentation.
- **Cons:** Requires overriding browser/WebView2 tab navigation (which shifts focus to UI buttons); introduces dual-key modes.

### Recommendation (Open Decision D7-01):
Adopt **Model 2 (Smart Auto-Advance on Enter)** as the default for all Standard and Benchmark exercises. Provide an optional toggle in `SCR-603` settings: `[ Indentation Mode: Auto-Advance (Default) | Manual Spacebar ]` to satisfy purists.

### 3.4 Rigorous Indentation & Keystroke Accounting Specification
To ensure absolute mathematical integrity and prevent metric distortion, the typing engine implements strict indentation rules:

```
+---------------------------------------------------------------------------------------------------------+
|                                    INDENTATION ACCOUNTING TAXONOMY                                      |
+--------------------------+-------------------------------------+----------------------------------------+
| 1. Expected Indentation  | 2. Automatically Inserted Indent    | 3. Manually Typed Indentation          |
+--------------------------+-------------------------------------+----------------------------------------+
| • Syntactic leading      | • Auto-inserted on Enter in Mode 2  | • Physical spacebar taps in Mode 1     |
|   whitespace from source | • EXCLUDED from N_total, WPM, Acc   | • INCLUDED in N_total, WPM, Acc        |
| • Standardized on spaces | • 0 eligible opportunities          | • Evaluated character-by-character     |
| • Normalizes \t to '    '| • 0 telemetry events to D6 window   | • Errors logged under Indentation Err  |
| • Sets column offset K   | • Dissolves atomically on Backspace | • Backspaced 1 space per Backspace tap |
+--------------------------+-------------------------------------+----------------------------------------+
```

### 3.5 Seven-Dimension Indentation Impact Matrix
The three indentation classifications impact performance, error tracking, and analytics across seven specific dimensions:

| Evaluation Dimension | 1. Expected Indentation | 2. Automatically Inserted Indentation (Mode 2 Default) | 3. Manually Typed Indentation (Mode 1 Manual) |
|---|---|---|---|
| **1. WPM ($WPM_{gross}$, $WPM_{net}$)** | Baseline reference only; zero character attempts. | **100% EXCLUDED.** Generates 0 keystrokes towards $N_{total}$. Zero artificial speed inflation. | **100% INCLUDED.** Each physical space struck increments $N_{total}$ and contributes to raw and net WPM. |
| **2. Overall Accuracy ($Acc_{overall}$)** | Inactive baseline target. | **100% EXCLUDED.** Auto-inserted spaces cannot increment $N_{correct}$ or $N_{incorrect}$. | **100% INCLUDED.** Evaluated character-by-character. Correct spaces increment $N_{correct}$; miskeys increment $N_{incorrect}$. |
| **3. Symbol Accuracy ($Acc_{sym}$)** | N/A (whitespace is not punctuation). | **100% EXCLUDED.** Auto-inserted whitespace is isolated from the symbol category. | **100% EXCLUDED.** Manually struck spacebar taps are categorized under whitespace, not programming symbols. |
| **4. Indentation Accuracy ($Acc_{indent}$)** | Defines expected space count per indentation level. | **EXCLUDED (N/A).** Indentation accuracy is bypassed/inactive in Smart Auto-Advance mode. | **PRIMARY EVALUATION METRIC.** $Acc_{indent} = \left(\frac{N_{correct\_indent\_spaces}}{N_{attempted\_indent\_spaces}}\right) \times 100\%$. |
| **5. D6 Per-Key Telemetry** | N/A. | **ZERO EVENTS.** Emits 0 records to `key_telemetry_window` and `key_confusion_matrix`. | **FULL REAL-TIME STREAMING.** Emits keystroke records for the space key (`' '`) including latency deltas. |
| **6. Error Attribution** | N/A. | **ZERO ERRORS POSSIBLE.** Typist cannot miskey automated whitespace. | **EXPLICIT SCORECARD ATTRIBUTION.** Logged under dedicated `Indentation Errors` counter and spacebar confusion matrix. |
| **7. Weak-Key Recommendations** | N/A. | **ZERO IMPACT.** Automated whitespace never triggers weak-symbol remediation or false recommendations. | **ACTIVE FOR SPACEBAR.** High error rates or hesitation on indentation spaces can trigger spacebar cadence drills in D6. |

### 3.6 Multi-Line Traversal and Error Correction Mechanics
- **Moving Forward Between Lines (`Enter`):** Striking `Enter` terminates Line $N$, counts as 1 printable character attempt ($N_{total} += 1$, $N_{correct} += 1$), advances the line index, smoothly scrolls the camera 40px up, and automatically inserts expected indentation on Line $N+1$, positioning the liquid caret at column $K$ (the first non-whitespace character).
- **Correcting Errors Within Active Line:** Backspacing erases characters in reverse order. In Mode 2, backspacing stops at column $K$ until the line boundary is explicitly crossed.
- **Crossing Line Boundaries Backwards (Line Boundary Deletion):** When the caret is at column $K$ on Line $N+1$ and the typist strikes `Backspace`:
  1. The entire auto-inserted indentation block (e.g. 4 or 8 spaces) **dissolves in a single atomic step** (does not require 4 or 8 individual backspace strokes).
  2. The `\n` newline character is removed from the active buffer.
  3. The camera smoothly scrolls down 40px.
  4. Line $N$ is unlocked and restored to active editing status with the cursor at its terminal character.
- **Re-Advancing Forward After Correction:** Once the typist re-keys Line $N$ and presses `Enter`, Line $N+1$ advances again and auto-indentation re-engages cleanly without duplicate opportunity counts.
- **Tab Key Trapping (`e.preventDefault()`):** Striking `Tab` is trapped by the webview. In canonical mode, tabs are normalized to spaces; `Tab` generates **zero character attempts**, prevents browser focus loss, and displays an educational hint: `"Indentation is automated on Enter"`.

---

## 4. Paired Delimiters & Quotation Marks

### Policy: Strict Explicit Keying (Zero Auto-Pairing)
- When a code passage contains `function calculate(value: number) {}`:
  1. Typist must physically strike `(` (`Shift + 9`).
  2. Typist types `value: number`.
  3. Typist must physically strike `)` (`Shift + 0`).
  4. Typist types space and strikes `{` (`Shift + [`).
  5. Typist presses `Enter`.
  6. Typist types body.
  7. Typist must physically strike `}` (`Shift + ]`).
- **Pedagogical Benefit:** Builds subconscious spatial awareness of closing bracket locations on the right-hand perimeter.

---

## 5. Line Navigation & Multi-Line Scrolling

Code requires vertical visual scanning across multiple lines. Unlike single-line sliding windows (such as traditional speed tests):
1. **The 5-Line Monospace Sliding Window:**
   - Line 1: Previous Line (Completed, rendered in dimmed muted color `#64748B`).
   - Line 2: Immediate Context Line (Completed).
   - **Line 3: Active Working Line** (Highlighted container, full opacity, liquid caret active).
   - Line 4: Upcoming Line (Rendered in standard syntax colors).
   - Line 5: Subsequent Line (Rendered in standard syntax colors).
2. **Smooth Vertical Scroll Physics:**
   - Pressing `Enter` at the end of Line 3 smoothly scrolls the entire canvas up by 1 line height (40px) over $80\text{ms}$ (`ease-out`), maintaining the active cursor steadily in the vertical center of the view.

---

## 6. Backspace & Error Correction Boundaries

### The Multi-Line Backspace Question:
If a typist makes an error on Line 3, should pressing `Backspace` at column 0 allow them to delete the newline and return to Line 2?

### Evaluated Approaches:
- **Approach A: Line-Bounded Backspace (Recommended Baseline):**
  - Pressing `Backspace` at the first non-whitespace character of the current line is a no-op (caret stops at column 0).
  - Typists cannot backspace into previously completed lines.
  - *Rationale:* In code, once a line is terminated with `Enter`, it represents a completed statement. Allowing multi-line backspace causes jarring vertical camera jumps, reflow complexity, and line-index disorientation.
  - *Within the active line:* Forgiving multi-word backspace (approved D5/D6 baseline) is fully supported, allowing typists to erase words, spaces, and operators cleanly.
- **Approach B: Unrestricted Multi-Line Backspace:**
  - Backspacing at column 0 deletes the line break and restores the previous line to active editing.
  - *Rationale:* Extreme purism, but creates severe UX disorientation during rapid typing.

### Recommendation (Open Decision D7-03):
Adopt **Approach A (Line-Bounded Backspace)**. Completed lines are locked; typists have complete freedom to backspace and correct anywhere within the active working line.
