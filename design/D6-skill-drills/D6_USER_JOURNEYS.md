# D6 USER JOURNEYS & INTERACTION FLOWS
**Typing Trainer — Windows Desktop Application**
*Module: 04. Skill Drills & Remediation Studio | Screen Scope: SCR-401 to SCR-405*
*Document Version: 1.0.0 | Stage: D6 Stage 2 UX and Functional Specifications*
*Date: 2026-11-18 | Status: SPECIFICATION COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Journey 1: Quick Remediation from Dashboard Command Center

### Context & Persona
- **Trigger:** Typist finishes a daily typing session or reviews their Dashboard (`SCR-101`). Widget 06 ("Weak-Key Remediation") displays: *"Top Weak Key Detected: 'P' (12.4% error rate across 89 strokes). Practice Recommended."*
- **User Goal:** Rapidly enter practice and fix the high-friction key without manually configuring complex drill settings.

### Flowchart
```
flowchart TD
    D3Widget[SCR-101: Dashboard Widget 06] -->|Click 'Drill Weak Keys'| D6Preconfig[Route to SCR-403 with Preset 'Auto-Weak: P, B, ;']
    D6Preconfig --> ReviewPreview[Student reviews generated passage & projected impact]
    ReviewPreview -->|Press Enter| LaunchArena[SCR-404: Skill Drill Arena Starts]
    LaunchArena --> TypeExercise[Student types 2-minute targeted passage]
    TypeExercise --> CompleteDrill[Session Completes]
    CompleteDrill --> DisplayScorecard[SCR-405: Results & Verification Scorecard]
    DisplayScorecard --> VerifyDelta[Examine Error Rate Reduction: 12.4% -> 3.1%]
    DisplayScorecard -->|Press Enter| RepeatOrNext[Launch Session 2 of 3 or Return Home]
```

### Step-by-Step Experience:
1. **Entry:** Clicking `"Drill Weak Keys"` on Dashboard Widget 06 routes directly to `SCR-403` with URL parameters `/drills/configure?mode=weak-keys&keys=P,B,;`.
2. **Instant Alignment:** `SCR-403` initializes with the target keys pre-selected, mode set to "Weak-Key Remediation", duration set to 2 minutes, and a deterministic word passage pre-loaded.
3. **Execution:** The student presses **`Enter`** to immediately transition to `SCR-404`. Focus is automatically placed on the hidden typing input. The Target Focus HUD highlights `[ Key: P ] [ Finger: R-Pinky ]`.
4. **Completion:** Upon reaching the time or word limit, the canvas locks and automatically routes to `SCR-405`.
5. **Feedback:** `SCR-405` highlights a green before-and-after improvement metric (`Key 'P': -9.3% Error Reduction`) and advances the Mastery Progress bar from `Session 0 of 3` to `Session 1 of 3 Clean Logged`.

---

## 2. Journey 2: Deep Diagnostic Exploration & Custom Drill

### Context & Persona
- **Trigger:** Typist notices a persistent speed bottleneck and navigates to the Skill Drills module via the sidebar (`Ctrl + 4`).
- **User Goal:** Uncover the root cause of typing errors, understand finger coordination asymmetry, and build a customized drill.

### Flowchart
```
flowchart TD
    SidebarNav[Sidebar: Click 'Skill Drills' or Press Ctrl+4] --> SCR401[SCR-401: Studio Overview Hub]
    SCR401 --> InspectHealth[Review Keyboard Skill Health: 94.2%]
    SCR401 --> ClickAnalysis[Click 'Deep Key Analysis ->']
    ClickAnalysis --> SCR402[SCR-402: Weak-Key Analysis Lab]
    SCR402 --> InspectHeatmap[Explore 65% ANSI Keyboard Heatmap]
    InspectHeatmap --> ClickKey[Click Key 'P' on Heatmap]
    ClickKey --> ViewConfusion[Review Confusion Matrix: 'P' miskeyed as 'O' (62%)]
    ViewConfusion --> ClickConfigure[Click 'Configure Drill for this Key ->']
    ClickConfigure --> SCR403[SCR-403: Drill Configuration Studio]
    SCR403 --> SelectNgrams[Select 'N-Gram Digraph Patterns: op, pl, pr']
    SelectNgrams --> SelectDuration[Set Duration: 3 Minutes]
    SelectDuration --> LaunchDrill[Press Enter -> SCR-404 Arena]
```

### Step-by-Step Experience:
1. **Overview Exploration:** On `SCR-401`, the user inspects the **Overall Keyboard Skill Health** gauge and notes that the Right Pinky zone is highlighted in amber (6.8% error rate vs 2.1% keyboard baseline).
2. **Deep Dive:** Clicking `"Deep Key Analysis →"` transitions to `SCR-402`. The interactive 65% keyboard heatmap displays color-coded keycaps. Key `P` is highlighted in Coral Red.
3. **Confusion Matrix Inspection:** Clicking `P` opens the Key Inspector drawer. The confusion matrix reveals that 62% of errors on `P` are caused by striking adjacent key `O`, with an average hesitation latency of $+85\text{ms}$ above baseline.
4. **Explainability Insight:** The plain-language card summarizes: *"Key 'P' demonstrates high lateral drift into adjacent 'O'. Recommended practice: N-gram reach drills linking 'P' to anchor home keys."*
5. **Tailored Builder:** Clicking `"Configure Drill for this Key →"` brings the user to `SCR-403` with `P` locked as target. The user toggles on the `N-Gram Digraphs` preset to specifically practice `op`, `pl`, and `pr` combinations.

---

## 3. Journey 3: Multi-Session Mastery Graduation Path

### Context & Persona
- **Context:** A weak key requires sustained verification across three distinct sessions to graduate from the active weak-key list.
- **Rule Enforced (Decision D6-03):** 3 distinct completed sessions, $\ge 30$ opportunities each, $ErrRate \le 3.0\%$ each.

### Progression Timeline
```
+---------------------------------------------------------------------------------------------------+
|                            MULTI-SESSION MASTERY GRADUATION TIMELINE                              |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [Session 1: Day 1] ──► Types 42 target strokes on 'P' @ 2.4% error rate                          |
|                         └─► RESULT: Session 1 of 3 Logged (Key status: In Training)               |
|                                                                                                   |
|  [Session 2: Day 2] ──► Types 35 target strokes on 'P' @ 2.9% error rate                          |
|                         └─► RESULT: Session 2 of 3 Logged (Key status: Validating)                |
|                                                                                                   |
|  [Failed Attempt]   ──► Types 38 target strokes on 'P' @ 5.3% error rate                          |
|                         └─► RESULT: Verification Fails; Session Counter Resets to 0 of 3          |
|                                                                                                   |
|  [Session 3A: Day 3]──► Types 45 target strokes on 'P' @ 0.0% error rate                          |
|                         └─► RESULT: Session 1 of 3 Logged                                         |
|  [Session 3B: Day 4]──► Types 50 target strokes on 'P' @ 2.0% error rate                          |
|                         └─► RESULT: Session 2 of 3 Logged                                         |
|  [Session 3C: Day 5]──► Types 60 target strokes on 'P' @ 1.7% error rate                          |
|                         └─► RESULT: Session 3 of 3 Logged!                                        |
|                             └─► KEY 'P' OFFICIALLY GRADUATES TO MASTERED (#10B981)                |
|                             └─► Removed from Watchlist; Added to Mastered Keys Registry           |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### Deterministic Rules:
1. **Independent Session Verification:** Each qualifying session must contain at least 30 target-key opportunities. If a session contains only 28 target strokes, it provides normal practice and XP, but *cannot* count toward the 3-session mastery threshold.
2. **Consecutive Threshold:** If an intermediate session fails the $\le 3.0\%$ error threshold, the consecutive clean session counter resets to zero. This guarantees that mastery reflects unshakeable motor competence.
3. **Mastery Graduation Event:** Upon logging the 3rd clean session, `SCR-405` displays an illuminated golden badge: *"🏆 Key 'P' Remediated & Certified Mastered! (3 of 3 Clean Sessions Completed)"*.

---

## 4. Journey 4: Custom Material Import & Technical Practice

### Context & Persona
- **Trigger:** Software developer or legal professional wants to practice typing real-world documentation, code snippets, or specialized technical vocabulary.
- **User Goal:** Import a local Markdown file (`API_GUIDE.md`) or paste text into the studio and execute a targeted practice session.

### Flowchart
```
flowchart TD
    EnterConfig[SCR-403: Drill Configuration] --> ClickCustomTab[Click 'Custom Text Import' Tab]
    ClickCustomTab --> ChooseInput{Import Method?}
    ChooseInput -- Paste Text --> PasteBuffer[Paste text into textarea]
    ChooseInput -- File Import --> NativeDialog[Open Native File Dialog: .txt / .md]
    NativeDialog --> FileValidation[Sanitize UTF-8, strip non-printable chars, max 500 KB]
    PasteBuffer --> FileValidation
    FileValidation --> DisplayWordCount[Display Parsed Telemetry: 450 words, 2,340 characters]
    DisplayWordCount --> ConfigureDuration[Select Scope: Full Text or 3-Minute Slice]
    ConfigureDuration --> LaunchDrill[Press Enter -> SCR-404 Arena]
    LaunchDrill --> ExecutePractice[Student types custom material]
    ExecutePractice --> CustomScorecard[SCR-405: Results showing custom material precision]
```

### Security & Parsing Standards:
- **Local File Boundary:** Constrained to user-selected files via Tauri native file dialog.
- **Sanitization:** Strips unsupported ASCII control characters, normalizes line endings (`\r\n` $\rightarrow$ `\n`), and replaces tab indentations with 2 or 4 spaces.
- **Offline Authoritative:** The file is parsed strictly in-memory without remote transmission.

---

## 5. Journey 5: New User & Insufficient Data Calibration Path

### Context & Persona
- **Context:** A new user opens Typing Trainer for the first time or has typed $< 20$ opportunities on target keys.
- **System Behavior (Decision D6-01):** The key cannot be classified as "Weak" or "Stable". It must display "Insufficient Data / Calibrating".

### Experience & Guidance:
1. **SCR-401 Empty / Calibration State:**
   - Instead of a misleading empty grid or fabricated error rates, the **Keyboard Skill Health** gauge displays `Calibrating... (12 / 20 Baseline Keys Logged)`.
   - The Weak-Key Watchlist displays a supportive placeholder card:
     `[ ℹ️ Gathering Keystroke Telemetry ]`  
     *"Typing Trainer requires at least 20 keystrokes per key to calculate accurate diagnostic insights. Complete a 60-second Typing Test or a lesson in Learning Mode to calibrate your diagnostic baseline."*
   - Two direct action buttons are presented:
     - `[ Take 60s Benchmark Test (Enter) ]` $\rightarrow$ Routes to `SCR-201`.
     - `[ Continue Learning Mode ]` $\rightarrow$ Routes to `SCR-301`.
2. **Transition to Active Diagnostics:** As soon as the student logs their 20th target opportunity in any module, the key immediately transitions to active classification.

---

## 6. Edge-Case Journeys: Pause, Restart, and Discard

### 6.1 Pause / Resume Handling (`SCR-404`)
1. Student presses **`Esc`** during an active drill.
2. The drill timer halts instantaneously.
3. The typing canvas is obscured with an opaque frosted-glass overlay (`backdrop-filter: blur(8px)`) to prevent students from memorizing upcoming text during pauses.
4. A modal dialog appears:
   - `[ Resume Drill (Esc / Space) ]`
   - `[ Restart Drill (F5 / Ctrl+R) ]`
   - `[ Discard & Return to Studio (Ctrl+4) ]`
5. Pressing **`Resume`** displays a 3-second animated visual countdown (`3... 2... 1... GO!`) before keystroke capture and the timer resume.

### 6.2 Discard Confirmation Guard (`F5` / `Ctrl + R`)
1. If the student presses `F5` or `Ctrl + R` with **$\le 10\text{ seconds}$** elapsed, the drill restarts instantaneously.
2. If **$> 10\text{ seconds}$** have elapsed, a modal confirmation dialog is rendered:
   *"Discard active drill progress and restart? [Enter: Confirm / Esc: Cancel]"*.
3. This prevents accidental loss of progress from keyboard slip.
