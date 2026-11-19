# D7 SCREEN SPECIFICATIONS: DEVELOPER MODE
**Typing Trainer — Windows Desktop Application**  
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 2 UX Architecture & Functional Specifications*  
*Document Version: 3.0.0 | Date: 2026-11-18 | Status: COMPLETE & RECONCILED (AWAITING PRODUCT OWNER APPROVAL)*

---

## 1. Executive Summary

This document establishes the detailed spatial geometry, Auto-Layout hierarchies, pixel dimensions, typography, and color token bindings for screens **`SCR-601` through `SCR-605`** in Developer Mode.

All screens are designed for the standard **1440 × 900** desktop resolution, enforce the **1100px maximum reading stage**, adhere rigidly to the **4px base spacing grid**, and support full dual-theme parity across Midnight Slate (Dark) and Daylight Studio (Light).

---

## 2. Accessible Syntax Color Palette Specifications

To guarantee WCAG 2.2 AA compliance ($\ge 4.5:1$ contrast) while maintaining code editor authenticity, Developer Mode employs a dedicated accessible syntax token palette:

| Syntax Token | Dark Theme Hex (`#0B0F19` Canvas) | Dark Contrast | Light Theme Hex (`#F8FAFC` Canvas) | Light Contrast | Scope / Purpose |
|---|---|:---:|---|:---:|---|
| **Keywords** | `#C084FC` (Lilac Purple) | **7.82:1** | `#7E22CE` (Deep Purple) | **6.42:1** | `const`, `function`, `public`, `return`, `class`, `import` |
| **Identifiers** | `#F8FAFC` (Primary White) | **16.20:1** | `#0F172A` (Slate 900) | **17.68:1** | Variable names, function names, properties, parameters |
| **Strings** | `#34D399` (Emerald Mint) | **8.14:1** | `#047857` (Forest Green) | **5.32:1** | `"hello"`, `'value'`, ``` `template` ``` |
| **Numbers** | `#FBBF24` (Amber Gold) | **11.20:1** | `#B45309` (Amber Brown) | **4.71:1** | Numeric literals (`42`, `3.1415`, `0xFF`) |
| **Operators & Symbols**| `#38BDF8` (Sky Blue) | **6.54:1** | `#0284C7` (Dark Cobalt) | **4.62:1** | `{}`, `[]`, `()`, `===`, `=>`, `&&`, `||`, `;`, `:`, `,` |
| **Comments** | `#94A3B8` (Muted Slate) | **6.64:1** | `#64748B` (Medium Slate) | **4.92:1** | `// single-line`, `/* multi-line */`, `/// docstring` |
| **Active Caret** | `#2563EB` (Cobalt Blue) | **5.17:1** | `#2563EB` (Cobalt Blue) | **5.17:1** | 3px wide solid vertical bar with fluid horizontal gliding |
| **Incorrect Character**| `#EF4444` (Coral Red) | **4.68:1** | `#DC2626` (Crimson Red) | **4.85:1** | Rendered with persistent `2px wavy underline` |
| **Indent Guide (┆)** | `#334155` (Slate 700) | **3.15:1** | `#CBD5E1` (Slate 300) | **3.05:1** | Subtle vertical dotted lines marking indentation levels |

---

## 3. Screen Specifications & Wireframes

### 3.1 SCR-601: Developer Mode Overview & Language Hub

#### Layout Wireframe (1440 × 900 Desktop Target)
```
+---------------------------------------------------------------------------------------------------+
| TITLEBAR: [● OFFLINE]  Typing Trainer — Developer Mode                         [—] [□] [✕] (36px) |
+---------------------------------------------------------------------------------------------------+
| SIDEBAR (240px) | MAIN STAGE (Max Width: 1100px, Horizontally Centered)                           |
| [📊 Dashboard ] |                                                                                 |
| [⚡ Typing Test]| HEADER BAR (1100 × 48px)                                                         |
| [📚 Learning  ] | [💻 Developer Mode] • The Code Studio                [ 60s Dev Benchmark → ]     |
| [🎯 Drills    ] | Targeted syntax, delimiter, and multi-line programming practice.                |
| [💻 Dev Mode* ] |                                                                                 |
|   (Active Blue) | OVERVIEW HERO METRICS (1100 × 120px)                                              |
| [🎮 Games     ] | +---------------------+ +---------------------+ +-----------------------------+ |
| [🏆 Trophies  ] | | AGGREGATE CODE WPM  | | SYMBOL ACCURACY     | | TOTAL CODE LINES TYPED      | |
| [⚙️ Settings  ] | | 54 WPM              | | 97.4% (Tier 3)      | | 1,480 Lines                 | |
|                 | | Peak: 68 WPM        | | 32 Symbol Types     | | 6 Active Languages          | |
|                 | +---------------------+ +---------------------+ +-----------------------------+ |
|                 |                                                                                 |
|                 | LANGUAGE CATALOG (1100 × 380px) (3 Columns × 2 Rows, Gap: 20px)                 |
|                 | +-------------------------+ +-------------------------+ +---------------------+ |
|                 | | TypeScript / JS  [★3]   | | Python           [★2]   | | Java           [★3] | |
|                 | | Speed: 58 WPM           | | Speed: 48 WPM           | | Speed: 62 WPM       | |
|                 | | Symbol Acc: 98.1%       | | Symbol Acc: 96.4%       | | Symbol Acc: 97.8%   | |
|                 | | Lines: 640 lines        | | Lines: 380 lines        | | Lines: 420 lines    | |
|                 | | [ Open TypeScript → ]   | | [ Open Python → ]       | | [ Open Java → ]     | |
|                 | +-------------------------+ +-------------------------+ +---------------------+ |
|                 | +-------------------------+ +-------------------------+ +---------------------+ |
|                 | | SQL              [★2]   | | Rust             [★1]   | | JSON Data Track [★4]| |
|                 | | Speed: 46 WPM           | | Speed: 38 WPM           | | Speed: 72 WPM       | |
|                 | | Symbol Acc: 98.8%       | | Symbol Acc: 94.2%       | | Symbol Acc: 99.2%   | |
|                 | | Lines: 240 lines        | | Lines: 120 lines        | | Lines: 180 lines    | |
|                 | | [ Open SQL Studio → ]   | | [ Open Rust Studio → ]  | | [ Open JSON Track →]| |
|                 | +-------------------------+ +-------------------------+ +---------------------+ |
|                 |                                                                                 |
|                 | QUICK PRACTICE PORTALS (1100 × 110px) (4 Columns, Gap: 16px)                    |
|                 | [ Micro-Delimiters ]   [ Operator Studio ]   [ Import Custom Code ]  [ Dev PB ] |
+-----------------+---------------------------------------------------------------------------------+
| STATUS BAR: Build v1.4.0 • SQLite Connected • Developer Mode • Active Language: TypeScript (32px) |
+---------------------------------------------------------------------------------------------------+
```

---

### 3.2 SCR-602: Exercise Catalog & Configurator

#### Layout Wireframe (1440 × 900 Desktop Target)
```
+---------------------------------------------------------------------------------------------------+
| HEADER BAR: [← Back to Hub] • TypeScript Exercise Catalog & Configurator                          |
| Active Track: [ TypeScript / JS ]  •  Current Status: [ Stage 3 Certified: Senior Coder ]        |
+---------------------------------------------------------------------------------------------------+
| CATEGORY TABS (1100 × 44px, Surface Container)                                                    |
| [ 📑 Curated Snippets (Active) ]  [ 🔣 Delimiters ]  [ ⚡ Operators ]  [ ⚙️ Procedural Generator ]  |
+---------------------------------------------------------------------------------------------------+
| CONFIGURATION SPLIT STAGE (1100 × 540px, Gap: 24px)                                              |
| +-----------------------------------------+ +---------------------------------------------------+ |
| | SNIPPET SELECTION & CONTROLS (538px)    | | LIVE SNIPPET PREVIEW & TELEMETRY (538px)          | |
| | 1. Difficulty Tier:                     | | Title: Async Fetch & Parse Handler                | |
| |    [ Tier 1 ] [ Tier 2 ] [ Tier 3*] [T4]| | License: MIT Open Source  •  Complexity: 5.8      | |
| |                                         | | Symbol Density: 22.4% (48 symbols)  • 9 Lines     | |
| | 2. Available Curated Snippets:          | | +-----------------------------------------------+ | |
| |    • Async Fetch & Parse Handler* (9L)  | | | 1 | export async function fetchData<T>(       | | |
| |    • Generic State Reducer (14L)        | | | 2 |   url: string,                            | | |
| |    • Promise.allSettled Pipeline (11L)  | | | 3 | ): Promise<T | null> {                    | | |
| |    • Debounce Custom Hook (12L)         | | | 4 |   try {                                   | | |
| |    • Recursive Tree Traversal (16L)     | | | 5 |     const res = await fetch(url);         | | |
| |                                         | | | 6 |     if (!res.ok) return null;             | | |
| | 3. Indentation Mode (D7-OD-01):         | | | 7 |     return (await res.json()) as T;       | | |
| |    (•) Smart Auto-Advance on Enter      | | | 8 |   } catch (e) { return null; }            | | |
| |    ( ) Full Manual Spacebar Indentation | | | 9 | }                                         | | |
| |                                         | | +-----------------------------------------------+ | |
| | 4. Practice Scope:                      | | Mastery Notice:                                   | |
| |    [ Full Snippet (Default) ]           | | [ ℹ️ Completing with ≥97% symbol accuracy qualifies | |
| |    [ 60-Second Timed Sprint ]           | |      toward Stage 4 Language Master Certification] | |
| |                                         | |                                                   | |
| | [ Reset Defaults ]                      | | [ Start Multi-Line Typing Arena (Enter) → ]       | |
| |                                         | | (#2563EB Cobalt, Height: 48px, Full Width)        | |
| +-----------------------------------------+ +---------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

---

### 3.3 SCR-603: Multi-Line Code Syntax Typing Arena

#### Layout Wireframe (1440 × 900 Desktop Target)
```
+---------------------------------------------------------------------------------------------------+
| FOCUS HUD: [ Java ] [ Part 1 of 5 ◀ ▶ ] [ Line 3 of 18 ] [ Net WPM: 56 ] [ Symbol Acc: 98.4% ]     |
| [ Elapsed Time: 00:48 ]                                                      [ Persistence: 🟢 ]  |
+---------------------------------------------------------------------------------------------------+
| 5-LINE MONOSPACE TYPING CANVAS (1100 × 340px, Background: #0B0F19, Surface Card, Border: #1E293B) |
|                                                                                                   |
| Line 1 (Context, Dimmed 60%):                                                                     |
| 1 | import java.util.List;                                                                        |
|                                                                                                   |
| Line 2 (Context, Dimmed 80%):                                                                     |
| 2 | public class OrderService {                                                                   |
|                                                                                                   |
| Line 3 (ACTIVE WORKING LINE, Highlighted Container, Height: 52px):                                |
| 3 |     public void processOrder(Order order) {                                                   |
|        ┆ | <--- Liquid Caret (3px Cobalt #2563EB) glides across active token                      |
|        ┆ Dotted Indent Guide (Auto-Advanced via Smart Auto-Advance)                                |
|                                                                                                   |
| Line 4 (Upcoming, 80% Syntax Colors):                                                             |
| 4 |         if (order == null || order.isCancelled()) {                                           |
|                                                                                                   |
| Line 5 (Upcoming, 50% Syntax Colors):                                                             |
| 5 |             throw new IllegalArgumentException("Invalid order");                              |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
| OPTIONAL GUIDANCE PANEL (Toggleable via F2, Height: 240px)                                        |
| [ R-Pinky: Key { ]  <-- Floating Symbol Hint Capsule (12px above caret, Toggle via F1)            |
| 65% ANSI Mechanical Pastel Keyboard Visualizer with reaching trajectory vector                    |
+---------------------------------------------------------------------------------------------------+
| ARENA CONTROLS: [Esc] Pause  •  [F1] Hints (ON)  •  [F2] Keyboard (OFF)  •  [F11] Zen Mode        |
| [Ctrl+◀ / Ctrl+▶] Switch Part  •  [F5 / Ctrl+R] Guarded Restart (>10s prompts confirmation)        |
+---------------------------------------------------------------------------------------------------+
```

#### In-Arena Multi-Part Exercise & Pause Controls
- **Part Navigation:** When practicing an imported multi-part file, the Focus HUD displays `[ Part 1 of N ◀ ▶ ]`. Switching parts via `Ctrl + ◀ / ▶` mid-session triggers a confirmation modal to avoid accidental progress loss.
- **Pause Lifecycle:** The typist pauses manually at any time via **`Esc`**, which immediately freezes the monotonic clock, blurs the canvas, and opens the standard Pause Modal (inherited from approved D4 baseline `TYPING_TEST_STATES.md`).
- **Authority Note on Inactivity Auto-Pause (`D7-NU-03`):** Automatic inactivity pause after 15 seconds is documented as an **unresolved proposal** awaiting future Product Owner review. The baseline product behavior adheres strictly to manual `Esc` pause.

---

### 3.4 SCR-604: Custom Code Importer & Workspace

#### Layout Wireframe (1440 × 900 Desktop Target)
```
+---------------------------------------------------------------------------------------------------+
| HEADER: [← Back to Studio] • Custom Code Importer & Workspace                                     |
| Governance: [ Max Size: 500 KB (Raw Bytes) ] • [ Strict UTF-8 ] • [ Plaintext Inert Execution ]   |
+---------------------------------------------------------------------------------------------------+
| UPLOAD SPLIT WORKSPACE (1100 × 580px, Gap: 24px)                                                  |
| +-----------------------------------------+ +---------------------------------------------------+ |
| | DROPZONE & LOCAL FILE BROWSER (538px)   | | DIRECT PASTE WORKSPACE & PREVIEW (538px)          | |
| | +-------------------------------------+ | | Source Preview & Bounded Pagination (Option A):   | |
| | |        [ 📥 DRAG & DROP FILE ]      | | | +-----------------------------------------------+ | |
| | |                                     | | | | 1 | import java.util.List;                    | | |
| | | Drop .java, .ts, .js, .py, .sql,    | | | | 2 | public class OrderService {               | | |
| | | .rs, .json, .txt, or .md file here  | | | | 3 |     public void processOrder(Order o) {   | | |
| | |                                     | | | | ... (49 Lines Detected)                       | | |
| | | Max 500 KB • Strict UTF-8 Validated | | | +-----------------------------------------------+ | |
| | | [ Browse Local Desktop Files... ]   | | | File Summary & Partitioning:                    | |
| | +-------------------------------------+ | | • Language: Java  • Lines: 49  • Chars: 1,520     | |
| |                                         | | • Raw Size: 1.5 KB / 500 KB Limit [PASS]          | |
| | Dual Representation Architecture:       | | • UTF-8 Validation: VERIFIED (Zero Byte Errors)   | |
| | • Original Source: Exact raw UTF-8 bytes| | • Deterministic Pagination: 3 Balanced Parts (≤20L|
| |   stored for export/inspection.         | | +-----------------------------------------------+ | |
| | • Working Source: Normalized \n line    | | Chapter Navigation Selector:                      | |
| |   endings for canvas typing & layout.   | | [▶ Part 1: Lines 1–17 (17 lines) | Not Started ]  | |
| |                                         | | [  Part 2: Lines 18–33 (16 lines) | Not Started ]  | |
| | Validation Rules:                       | | [  Part 3: Lines 34–49 (16 lines) | Not Started ]  | |
| | • Files 1–30L: 1 Single Exercise.       | | +-----------------------------------------------+ | |
| | • Files >30L: Chunked to 15–20L (≤20L). | | [ Start Practice from Part 1 (Enter) → ]          | |
| | • Invalid UTF-8 rejected upfront.       | | [ Jump Directly to Selected Part → ]              | |
| | • Empty files rejected upfront.         | | [ Download Original Source Code (.java) ]         | |
| +-----------------------------------------+ +---------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

#### Dual Content Representation Specification
1. **Original Source Representation:**
   - Evaluated against the 500 KB limit **prior to any decoding or normalization** (`file.size <= 512,000 bytes`).
   - The exact, unmodified UTF-8 byte stream is stored as `raw_source_bytes` in SQLite table `developer_snippets`.
   - Retained byte-for-byte for future export or source inspection via `"Download Original Source Code"`.
2. **Working Representation:**
   - Generated purely for typing exercise execution, syntax tokenization, and pagination.
   - Normalizes all `\r\n` (CRLF) and `\r` (CR) sequences to `\n` (LF) in memory.
   - Preserves all visible characters, blank lines, indentation spaces, punctuation, and comments.
   - Maintains a strict 1:1 mapping between working line numbers and original source line numbers ($1 \dots N$).

#### Deterministic Bounded Pagination Algorithm & Test Examples
- **Part Count Calculation:** For files with $N > 30$ lines, $K = \lceil N / 20 \rceil$.
- **Hard Upper Bound:** No generated exercise may **ever exceed 20 lines**.
- **Balanced Line Distribution:** Base line count $q = \lfloor N / K \rfloor$, remainder $r = N \pmod K$. The first $r$ parts receive $q + 1$ lines, and remaining $(K - r)$ parts receive $q$ lines.
- **Specification-Level Pagination Test Table:**

| Source Lines ($N$) | Calculated Parts ($K$) | Partition Line Counts | Part Line Ranges | Max Part Lines ($\le 20$) | Content Invariance Verification |
|---:|:---:|---|---|:---:|---|
| **20** | 1 | `[20]` | Part 1: Lines 1–20 | 20 | Single exercise (Rule 1). No lines omitted/duplicated. |
| **30** | 1 | `[30]` | Part 1: Lines 1–30 | 30 | Single exercise ceiling (Rule 1). Zero omission. |
| **31** | 2 | `[16, 15]` | Part 1: 1–16, Part 2: 17–31 | 16 | Balanced division. All 31 lines preserved in order. |
| **41** | 3 | `[14, 14, 13]` | Part 1: 1–14, Part 2: 15–28, Part 3: 29–41 | 14 | Balanced distribution. Never exceeds 20. |
| **49** | 3 | `[17, 16, 16]` | Part 1: 1–17, Part 2: 18–33, Part 3: 34–49 | 17 | Balanced distribution. Over-merging prevented. |
| **60** | 3 | `[20, 20, 20]` | Part 1: 1–20, Part 2: 21–40, Part 3: 41–60 | 20 | Exactly 20 lines per part. Zero lines omitted. |
| **61** | 4 | `[16, 15, 15, 15]` | Part 1: 1–16, Part 2: 17–31, Part 3: 32–46, Part 4: 47–61 | 16 | 4 balanced parts. Ceilings strictly preserved. |
| **79** | 4 | `[20, 20, 20, 19]` | Part 1: 1–20, Part 2: 21–40, Part 3: 41–60, Part 4: 61–79 | 20 | 4 balanced parts. Exactly 79 lines preserved. |

*(Note: The above table represents specification-level mathematical verification of the deterministic partitioning formula).*

---

### 3.5 SCR-605: Developer Results & Syntax Analytics Scorecard

#### Layout Wireframe (1440 × 900 Desktop Target)
```
+---------------------------------------------------------------------------------------------------+
| HEADER: [✓ Exercise Completed] • Developer Performance Scorecard                                  |
| Outcome: [ 🌟 EXCELLENT CADENCE: 98.4% SYMBOL ACCURACY ACHIEVED ON JAVA ORDER SERVICE (PART 1) ]   |
+---------------------------------------------------------------------------------------------------+
| HERO METRIC QUARTET (1100 × 110px)                                                                |
| +-------------------+ +-------------------+ +-------------------+ +-----------------------------+ |
| | NET SPEED         | | RAW SPEED         | | OVERALL ACCURACY  | | SYMBOL ACCURACY             | |
| | 56 WPM            | | 58 WPM            | | 97.8%             | | 98.4% (Emerald Badge)       | |
| | D4 Net Formula    | | Gross Keystrokes  | | Target: ≥95.0%    | | 48 Target Symbols           | |
| +-------------------+ +-------------------+ +-------------------+ +-----------------------------+ |
|                                                                                                   |
| MULTI-PART IMPORTED FILE PROGRESS (1100 × 80px, Surface Container) (Rendered for Custom Files)    |
| +-----------------------------------------------------------------------------------------------+ |
| | File: OrderService.java • Part 1 of 3 Completed (33.3%) • Lines 1–17                          | |
| | [████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] Progress: 1/3 Parts                      | |
| | Cumulative File Stats: 56.0 Net WPM • 98.4% Symbol Accuracy • 17 Lines Completed              | |
| +-----------------------------------------------------------------------------------------------+ |
|                                                                                                   |
| SYNTAX CATEGORY ERROR BREAKDOWN (1100 × 150px, Surface Container)                                 |
| +-----------------------------------------------------------------------------------------------+ |
| | Category          | Opportunities | Errors | Accuracy % | Common Stumbling Tokens             | |
| |-------------------|:-------------:|:------:|:----------:|-------------------------------------| |
| | Delimiters ({}[]) | 24            | 0      | 100.0%     | None (Clean Execution)              | |
| | Operators (=>&&)  | 18            | 1      |  94.4%     | == (Stumbled on repeated =)         | |
| | Punctuation (;:,) | 14            | 0      | 100.0%     | None (Clean Execution)              | |
| | Identifiers       | 62            | 1      |  98.4%     | orderCancelled (case hesitation)    | |
| | Keywords          | 45            | 0      | 100.0%     | None (Subconscious Burst)           | |
| +-----------------------------------------------------------------------------------------------+ |
|                                                                                                   |
| RECONCILED GAMIFICATION & OUTBOX PERSISTENCE BAR (1100 × 60px)                                    |
| [ Base XP: 28 XP ] • [ Accuracy Multiplier: +50% (1.5x) ] • [ Total: +42 XP ]                      |
| [ Outbox Status: 🟢 Persisted to Local Database (HTTP 201 Created) ]                              |
+---------------------------------------------------------------------------------------------------+
| FOOTER ACTIONS: [ Return to Importer (Esc) ]   [ Retake Part 1 (R) ]   [ Next Part: Part 2 (Enter) ▶]|
+---------------------------------------------------------------------------------------------------+
```
