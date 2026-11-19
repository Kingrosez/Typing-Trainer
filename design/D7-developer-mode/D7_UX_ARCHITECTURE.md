# D7 UX ARCHITECTURE: DEVELOPER MODE
**Typing Trainer — Windows Desktop Application**
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 2 UX Architecture & Functional Specifications*
*Document Version: 1.0.0 | Date: 2026-11-18 | Status: COMPLETE & READY FOR REVIEW*

---

## 1. Executive UX Philosophy & Purpose

Developer Mode transforms Typing Trainer from a prose-oriented typing tool into an authentic, syntax-aware **code cadence accelerator** for software engineers.

In programming, typing is not merely lexical transcription; it is an ergonomic dialogue with formal grammar:
- Syntactic delimiters (`{}`, `[]`, `()`, `<>`) define scope and data structure boundaries.
- Operators (`===`, `=>`, `&&`, `||`, `!=`, `->`, `::`) express computation and logical flow.
- Case conventions (`camelCase`, `snake_case`, `SCREAMING_SNAKE_CASE`) demand continuous Shift-key dexterity.
- Multi-line indentation (2 or 4 spaces) dictates structural hierarchy.

### 1.1 The Anti-IDE Pedagogical Principle
Modern Integrated Development Environments (IDEs) optimize for **authoring velocity** by automating boilerplate: auto-closing brackets, auto-pairing quotes, auto-indenting, and expanding code snippets. While essential for professional programming, these conveniences cause severe **muscle memory atrophy**. When developers work in terminal environments, remote servers, unfamiliar editors, or technical whiteboard interviews, they stumble frequently on perimeter punctuation.

**The Anti-IDE Rule:** Developer Mode **never auto-completes, auto-closes, or auto-pairs characters**. Typists must physically actuate every opening bracket, closing delimiter, quote, and semicolon. By deliberately exercising the right-hand pinky perimeter and top number row, developers build unconscious tactile confidence.

---

## 2. Core User Experience Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         D7 UX ARCHITECTURE PIPELINE                              │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   1. SELECT & CONFIGURE (/developer -> SCR-601 / SCR-602 / SCR-604)                  │
│      • Select from 6 Core Languages (Java, TS, JS, Python, SQL, Rust) or JSON.      │
│      • Choose Exercise Category: Snippets, Delimiters, Operators, Custom Import.     │
│      • Custom Code Importer (/developer/import -> SCR-604): 500 KB limit, strict     │
│        UTF-8 validation, automatic 15–20 line pagination for files >30 lines (Opt A).│
│      • Set Difficulty Tier (1 to 4) and Indentation Mode (Auto-Advance / Manual).    │
│                                                                                  │
│   2. MULTI-LINE TYPING ARENA (/developer/arena -> SCR-603)                       │
│      • 5-Line Monospace Sliding Window (JetBrains Mono 20px, 40px line height).  │
│      • Accessible syntax highlighting with WCAG 2.2 AA verified contrast.        │
│      • Smart Auto-Advance Indentation with subtle dotted guidelines (┆).         │
│      • Multi-line backspacing: users can delete back across previous lines.      │
│      • Liquid horizontal caret gliding + smooth vertical auto-scrolling.         │
│                                                                                  │
│   3. ANALYZE & PROGRESS (/developer/results -> SCR-605)                         │
│      • D4 Net WPM & Raw WPM paired with specialized Symbol Accuracy Badge.       │
│      • Syntactic error breakdown (Delimiters, Operators, Identifiers, Keywords). │
│      • Multi-line code diff visualization highlighting exact miskeys.            │
│      • 4-Stage Language Mastery Certification progress tracking.                 │
│      • Closed-loop streaming of symbol errors to D6 Weak-Key Remediation.        │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. The Multi-Line Typing Canvas Paradigm

Unlike standard speed test arenas that utilize a single-line or wrapped-prose sliding window, code typing requires a structured **multi-line architectural viewport**:

### 3.1 The 5-Line Monospace Viewport
- **Line 1 (Previous Context):** Fully completed line, rendered with dimmed text (`#64748B` Dark / `#94A3B8` Light) at 60% opacity.
- **Line 2 (Immediate Context):** Fully completed line immediately preceding the active line.
- **Line 3 (Active Working Line):** Vertically centered in the reading viewport, highlighted with a subtle surface elevation container (`bg-surface-elevated`), high-contrast syntax tokens, and active liquid caret.
- **Line 4 (Upcoming Context):** Untyped upcoming line rendered in full syntax colors at 80% opacity.
- **Line 5 (Subsequent Context):** Untyped line rendered at 50% opacity.

### 3.2 Smooth Vertical Camera Scroll
When the typist strikes `Enter` at the end of Line 3:
1. The canvas smoothly scrolls upward by exactly 1 line height (40px) over $80\text{ms}$ using a hardware-accelerated CSS transition (`transform: translateY(-40px)`).
2. The newly active line lands seamlessly at vertical position Line 3.
3. If the typist backspaces across the line boundary back into Line 2, the camera smoothly scrolls downward by 40px, restoring Line 2 to the active Line 3 center position.

---

## 4. Indentation & Spacing Paradigm (Approved D7-OD-01)

Indentation represents the primary spatial difference between natural-language prose and structured source code. Developer Mode establishes three explicit classifications:

### 4.1 Tripartite Indentation Classification
1. **Expected Indentation:**
   - The syntactic leading whitespace defined in the source snippet structure (e.g. 2 spaces in TypeScript/JavaScript, 4 spaces in Python/Java/Rust, or depth $\times 4$).
   - Standardized strictly on canonical spaces (` `); raw tab characters are normalized to spaces upon ingestion.
2. **Automatically Inserted Indentation (Smart Auto-Advance — Default Mode):**
   - **Behavior:** Upon striking `Enter` at the end of Line $N$, the engine advances the viewport to Line $N+1$ and automatically fills the expected leading indentation, positioning the liquid caret immediately at the first printable code column.
   - **Visual Representation:** Leading spaces render with subtle, dotted vertical guidelines (`┆` in `#334155` Dark / `#CBD5E1` Light).
   - **Strict Metric Exclusion (Zero Inflation Rule):** Automatically inserted indentation is **100% excluded** from:
     - Keystroke counts ($N_{total}$, $N_{correct}$, $N_{incorrect}$)
     - Gross WPM and Net WPM calculations
     - Keystroke accuracy ($Acc_{overall}$)
     - Mastery qualification thresholds and XP calculations
   - Automatically inserted characters produce **zero eligible opportunities** and **zero D6 telemetry events** (`key_telemetry_window`). They can never artificially inflate typing speed or fabricate false mastery.
3. **Manually Typed Indentation (User-Selectable Spacebar Mode):**
   - **Behavior:** Typist must physically strike the spacebar for every leading indentation space (2, 4, 8, etc.) to traverse to the code margin.
   - **Evaluation & Errors:** Each stroke is evaluated character-by-character against expected whitespace. Typing an incorrect number of spaces (e.g. 3 instead of 4) or an incorrect key registers an **Indentation Error** ($N_{incorrect} += 1$).
   - **Telemetry:** Manually typed spaces count as eligible character opportunities and stream directly into D6 telemetry under the spacebar (` `) key matrix.

### 4.2 Deletion & Backspace Rules for Indentation
- **Active Line Deletion:** Backspacing within a line erases characters in reverse order.
- **Line Boundary Traversal:** When the cursor is positioned at the first printable code column (column $K$ after auto-indentation) and the typist strikes `Backspace`:
  1. The entire auto-inserted indentation block **dissolves in a single atomic operation** (it does not require multiple backspaces).
  2. The `Enter` newline boundary is removed.
  3. The viewport smoothly scrolls down 40px, restoring Line $N-1$ to active status with the cursor at its terminal character.
- In manual mode, backspacing across leading spaces requires individual backspace strokes per space.

---

## 5. Multi-Line Backspacing Paradigm (Approved D7-OD-03)

In strict compliance with the Product Owner's mandate, Developer Mode permits typists to **correct mistakes across previous lines**:

1. **Active Line Deletion:** Within the active line, pressing `Backspace` deletes characters in reverse order. Forgiving multi-word backspacing (approved D5/D6 baseline) is fully supported.
2. **Line Boundary Traversal:** When the cursor reaches column 0 of the active line (the first printable character after indentation):
   - Striking `Backspace` dissolves the newline boundary.
   - The viewport smoothly scrolls down by 1 line height.
   - The previous line is unlocked and restored to active editing status.
   - The cursor is positioned at the terminal character of the restored line.
3. **Event Accounting Rules:**
   - Corrected errors remain permanently logged in diagnostic history to record the learning event.
   - Corrected errors are excluded from the uncorrected-error penalty in Net WPM.
   - Repeatedly backspacing and re-typing the same character does **not** generate duplicate errors or inflate opportunity counts.
   - Automatically inserted indentation is deleted cleanly in a single backspace step upon crossing the line boundary.

---

## 6. Ergonomic & Cognitive Considerations

- **Right-Pinky Fatigue Mitigation:** Because code syntax increases right-pinky load to >25% of keystrokes, sessions are bounded to 1–3 minutes by default, with voluntary rest prompts between high-density delimiter sprints.
- **Accessible Code Typography:** Code text is rendered exclusively in **`JetBrains Mono`** at **20px** with a generous **40px line height** (2.0 line ratio), providing superior readability for nested punctuation.
- **High-Contrast Syntax Highlighting:** Standard syntax highlighting themes (e.g. Monokai) often use low-contrast pastels. Developer Mode uses a custom palette mathematically audited to guarantee $\ge 4.5:1$ contrast against both Dark (`#0B0F19`) and Light (`#F8FAFC`) canvases.

---

## 7. Session Lifecycle, Persistence & Crash Recovery (D3 Reconciliation)

Adhering to the approved D3 recovery architecture:

### 7.1 In-Memory Hot Path & Zero-Keystroke-I/O
- Keystrokes are captured exclusively in client-side React/Zustand memory (`DevSessionEventBuffer`). Zero database writes or IPC calls occur while typing.

### 7.2 Two Distinct Session States
1. **Interrupted / Incomplete Session (Mid-Drill Abandonment):**
   - Occurs when the user exits to the hub, pauses and quits, or force-closes the application before reaching the end of the snippet.
   - **Handling:** Uncommitted keystrokes are discarded from memory. Zero records are stored in IndexedDB or SQLite; zero XP is awarded. Historical metrics remain uncorrupted.
2. **Completed Session Awaiting Persistence:**
   - Occurs only when the snippet or exercise part is completed.
   - **Handling:** Assigned a client-generated UUID `sessionId` and written synchronously to the persistent **IndexedDB Outbox (`pending_session_outbox`)** before asynchronous dispatch to Spring Boot.
   - Survives application restarts and OS crashes. Retries with an active foreground burst of 5 attempts (delays: 1s, 2s, 4s, 8s), background checks every 30s while open, and auto-flushes on next launch.
   - **Strict Outbox Removal:** Pruned from IndexedDB ONLY upon receiving a confirmed successful persistence acknowledgement (HTTP 201 Created or HTTP 200 OK with `duplicate: true`). Never removed merely because a request was sent.
   - Spring Boot database writes are idempotent; duplicate transmissions cannot create duplicate session rows or XP awards.
   - For multi-part custom files (D7-NU-02 Option A), each completed part generates its own `sessionId` while linking to the parent `snippetId`.
   - The UI communicates pending, persisted, offline-queued, and retry states transparently.
