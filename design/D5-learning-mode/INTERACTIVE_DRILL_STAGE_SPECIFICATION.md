# INTERACTIVE DRILL STAGE SPECIFICATION (SCR-303)
**Typing Trainer — Windows Desktop Application**
*Screen ID: SCR-303 | Route: /learning/lesson/:id/drill | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D5 Learning Mode Design*
*Date: 2026-11-17 | Status: D5 DESIGN COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Screen Mission & Pedagogical Mechanics

**`SCR-303: Interactive Lesson Drill Stage`** is the interactive typing environment where muscle memory is forged. In contrast to speed benchmark tests (`SCR-202`), which measure existing typing throughput under pressure, the Interactive Drill Stage prioritizes **deliberate practice, progressive key introduction, and error remediation**.

### 1.1 The 5-Stage Progressive Lesson Structure
Every 5-minute lesson advances through a carefully sequenced 5-stage pedagogical ladder:
1. **Stage 1: Key Isolation (Single Characters):** Rhythmic repetition of new keys paired with home anchors (e.g. `d e d e d e k i k i k i`).
2. **Stage 2: Bigrams & Trigrams (Syllables):** Common phonetic combinations (e.g. `ed de id di die fed kid`).
3. **Stage 3: High-Frequency Word Families:** Real English words utilizing target keys (e.g. `did kid file side desk line`).
4. **Stage 4: Short Contextual Phrases:** Fluid sentence fragments (e.g. `did he decide`, `like a fine idea`).
5. **Stage 5: Speed & Cadence Evaluation:** A 60-second continuous flow check testing retention with a $\ge 95\%$ accuracy passing threshold.

---

## 2. Layout Architecture & Information Hierarchy (1440 × 900)

```
+-------------------------------------------------------------------------------+
| TITLEBAR: [⌨] Typing Trainer  (Peripheral Dimmed: 20% Opacity)        [—] [□] [✕]|
+-------------------+-----------------------------------------------------------+
| SIDEBAR: (240px)  | MAIN ARENA STAGE (1100px Centered Stage)                  |
|                   |                                                           |
| (Peripheral       | +-------------------------------------------------------+ |
|  Dimmed: 20%      | | EDUCATIONAL TELEMETRY HUD (Height: 64px)              | |
|  Opacity during   | | [STAGE 2/5: BIGRAMS]  [ACC: 98.4%]  [28 WPM]  [PROGRESS| |
|  active typing)   | +-------------------------------------------------------+ |
|                   |                                                           |
|                   | +-------------------------------------------------------+ |
|                   | | MONOSPACE GUIDED CANVAS (Height: 220px, 3-Line Window)| |
|                   | |                   [ L-Mid ]                           | |
|                   | |                   (Finger Hint)                       | |
|                   | | d e d e   k i k i   d [e] d e   k i k i               | |
|                   | | die fed kid side line desk wide like                  | |
|                   | | he decided to ride the slide inside                   | |
|                   | +-------------------------------------------------------+ |
|                   |                                                           |
|                   | +-------------------------------------------------------+ |
|                   | | PASTEL KEYBOARD WITH DYNAMIC REACH ARCS (Height: 260px| |
|                   | |          [ E ] (Target Glowing Sky Blue)              | |
|                   | |            ^                                          | |
|                   | |          /   (Dashed Trajectory Arc)                  | |
|                   | |        [ D ] (Home Row Anchor Glowing Emerald)        | |
|                   | +-------------------------------------------------------+ |
|                   |                                                           |
|                   | IN-DRILL CONTROLS: [Esc] Pause • [F5] Restart • [F1] Hints|
+-------------------+-----------------------------------------------------------+
| STATUS BAR: [Esc] Pause | [F1] Toggle Finger Hints | [F2] Toggle Keyboard     |
+-------------------------------------------------------------------------------+
```

---

## 3. The Guided Monospace Typing Canvas

### 3.1 Typographic Geometry & Character States
- **Font:** **`JetBrains Mono`**, 28px regular, line-height 48px (`1.714`), letter-spacing `0.02em`.
- **Character Color Coding:**
  - *Correct:* Electric Sky Blue (`#38BDF8` Dark / `#0284C7` Light) $\rightarrow$ Verified $\ge 4.6:1$ contrast.
  - *Incorrect:* Coral Red (`#EF4444` Dark / `#DC2626` Light) with **wavy red underline**.
  - *Active Target:* High-contrast bounding box highlight (`#2563EB` outline) with active 3px caret bar.
  - *Upcoming Pending:* Muted Slate (`#64748B` Dark / `#94A3B8` Light).

### 3.2 Real-Time Floating Finger Hints
Directly above the active target character, a compact floating hint pill displays the anatomical finger assignment:
- Format: **`[ L-Mid ]`** (Left Middle Finger) or **`[ R-Ind ]`** (Right Index Finger).
- Styling: Capsule pill, background `#1E293B`, text `#38BDF8` in `Inter Semi-Bold 11px`.
- Motion: Glides horizontally alongside the active caret with zero latency.
- Toggleability: Can be toggled on/off instantly via **`F1`** or in application settings.

---

### 3.3 Forgiving Multi-Word Backspacing & D4 Engine Compatibility
In accordance with touch-typing pedagogical theory:
- **Benchmark Mode (`SCR-202`) vs. Learning Mode (`SCR-303`):**
  - In speed benchmark tests, the word-lock boundary rule prevents backspacing into previously committed words to evaluate realistic forward typing cadence.
  - **In Learning Mode drills, the word-lock boundary is deliberately lifted.** Typists are allowed and encouraged to press **Backspace across multiple words** to erase mistakes and re-type words cleanly.
- **Why Multi-Word Backspace is Essential in Learning Mode:**
  - Muscle memory consolidates correct reach patterns through error correction. Forcing a student to leave an uncorrected error in their text reinforces the neural pathway of the mistake. Allowing full backspacing enables the student to immediately overwrite the error with the correct finger motion.
- **D4 Typing Engine Reuse (Zero Divergence):**
  - Learning Mode reuses the identical **D4 calculation specification**:
    - **Correct Character Input ($N_{correct}$):** Increments on initial correct match.
    - **Incorrect Character Input ($N_{incorrect}$):** Increments on initial mismatch.
    - **Corrected Mistakes Retained in Error History:** When an error is backspaced and corrected, the Net WPM word penalty is avoided ($E_{uncorrected} = 0$), but the initial mistake **remains permanently logged in $N_{incorrect}$ and in the per-key diagnostic matrix**. This ensures the weak-key remediation engine accurately identifies reaches that caused hesitation or errors.
    - **Gross & Net WPM:** Strict 5-character word equivalence: $\text{Gross} = (N_{total}/5)/Time$; $\text{Net} = \max(0, (N_{total}/5 - E_{uncorrected})/Time)$.
    - **Accuracy:** $(N_{correct} / N_{total}) \times 100$.
    - **Pause & Resume:** Monotonic clock (`performance.now()`), $\sum T_{paused}$ excluded, 3-second recovery buffer.

---

## 4. Pastel Mechanical Keyboard with Dynamic Reach Arcs

Positioned below the typing canvas (`Height: 260px`, `Width: 920px`).

### 4.1 Synchronized Dynamic Reach Arcs
When an upper or lower row character is the active target:
1. **Target Keycap Illumination:**
   - The target keycap (e.g. `E`) glows in **Electric Sky Blue (`#38BDF8`)** with an illuminated border.
2. **Home Anchor Illumination:**
   - The home-row anchor keycap (e.g. `D`) maintains an illuminated emerald baseline glow, reminding the typist of their starting coordinate.
3. **Animated Trajectory Arc:**
   - A subtle, glowing dashed bezier arc (`rgba(56, 189, 248, 0.45)`, stroke `2px`) connects the home anchor (`D`) to the target (`E`), showing the natural diagonal finger reach trajectory.
4. **Return-to-Home Pulse:**
   - When the user strikes `E` correctly, the trajectory arc flashes green for 120ms, and the home anchor `D` pulses gently, prompting the finger to return home immediately.

---

## 5. Educational Telemetry HUD (Row 0)

Positioned directly above the typing stream (`Height: 64px`, `Width: 1100px`).

```
+-------------------------------------------------------------------------------+
|  STAGE 2/5: BIGRAMS    |     ACCURACY: 98.4%    |   SPEED: 28 WPM   | PROGRESS|
|  [●●○○○] 6 of 15 Words |     (Target: ≥ 95%)    |   (Pace: Steady)  | [████░░]|
+-------------------------------------------------------------------------------+
```

### 5.1 HUD Component Details
1. **Stage Indicator:** Displays active lesson stage (`Stage 2/5: Syllables & N-Grams`) with 5 segmented progress dots.
2. **Live Accuracy Gauge:** Prominent percentage formatted in `JetBrains Mono Bold 20px`. Color-coded dynamically:
   - Green (`#10B981`): $\ge 95.0\%$ (On track for 3 stars).
   - Amber (`#F59E0B`): $90.0\% - 94.9\%$ (Passing, 2 stars).
   - Red (`#EF4444`): $< 90.0\%$ (Alert: *"Slow down slightly to build precision"*).
3. **Current Speed (WPM):** Displayed as secondary information (`28 WPM`), accompanied by a steady pace indicator.
4. **Stage Progress Bar:** Horizontal fill bar tracking word completion within the current stage.

---

## 6. Real-Time Error Remediation Loops

If a typist struggles with a specific reach during a drill:
1. **Three-Strike Error Detection:** If the user strikes an incorrect key on the same character slot 3 times in a row:
   - Typing canvas briefly pauses active input.
   - A friendly tooltip unfurls: *"Stuck on E? Rest your fingers on A-S-D-F. Slide your left middle finger upward from D to strike E."*
   - The reach trajectory arc pulses with high-contrast amber glow.
2. **Immediate Remediation Repeat:**
   - At the conclusion of Stage 4, if any character had an error rate $> 15\%$, the engine automatically generates an extra 20-word mini-drill focused on that specific reach before advancing to Stage 5.

---

## 7. In-Drill Controls & Accelerator Matrix

| Key Binding | Scope | Action Executed | Pedagogical Purpose |
|---|---|---|---|
| **`Esc`** | In-Drill | Pauses drill; halts timers; blurs canvas; displays pause modal. | Instant relaxation break |
| **`F5` / `Ctrl + R`** | In-Drill | Restarts active lesson stage with fresh words. | Quick reset on high errors |
| **`F1`** | In-Drill | Toggles floating finger hints above active characters. | Self-testing / blind touch practice |
| **`F2`** | In-Drill | Collapses / expands the 65% mechanical keyboard visualizer. | Space saving & visual focus |
| **`Ctrl + 3`** | In-Drill | Aborts drill and returns cleanly to Curriculum Roadmap (`SCR-301`). | Macro navigation |
