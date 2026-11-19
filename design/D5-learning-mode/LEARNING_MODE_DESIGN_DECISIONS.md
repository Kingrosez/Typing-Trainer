# LEARNING MODE DESIGN DECISIONS & TRADE-OFFS (D5)
**Typing Trainer — Windows Desktop Application**
*Screen IDs: SCR-301, SCR-302, SCR-303, SCR-304 | Target Resolution: 1440 × 900*
*Document Version: 1.3.0 | Stage: D5 Final Product Owner Approval & Documentation Closure*
*Date: 2026-11-17 | Status: PRODUCT OWNER APPROVED (FINAL)*

---

## 1. Educational & Pedagogical Decisions

### Decision 01: 4-Module, 32-Lesson Progressive Curriculum Structure
- **Context:** Deciding how many lessons and modules should comprise the touch-typing curriculum.
- **Decision:** Structured into **4 modules of 8 lessons each** (32 sequential lessons total), culminating in a capstone assessment at the end of each module.
- **Rationale:** 8 lessons per module represent an achievable cognitive milestone (~40 minutes of total drilling per module). Moving sequentially from Home Row $\rightarrow$ Top Row $\rightarrow$ Bottom Row $\rightarrow$ Numbers/Symbols prevents cognitive overload and builds foundational reach habits before tackling complex combinations.

---

### Decision 02: Realistic 3D Human Hand Anatomy vs. Abstract Blobs
- **Context:** Deciding how hands should be illustrated in briefings (`SCR-302`) and drill guidance (`SCR-303`).
- **Decision:** Use **anatomically accurate human hands** (defined metacarpals, knuckles, natural C-curve finger arches, neutral elevated wrists, fingernails) rendered in stylized WebGL 3D / vector format.
- **Rationale:** Touch typing is a physical discipline grounded in natural hand ergonomics. Abstract geometric blobs, cartoon paws, or flat hands fail to communicate proper wrist alignment and relaxed finger curvature. Realistic anatomy establishes an adult, professional learning ambiance while modeling neutral wrist alignment and comfortable posture.

---

### Decision 03: Forgiving Multi-Word Backspacing in Learning Mode vs. Word-Lock in Benchmark Mode
- **Context:** Deciding whether the word-lock boundary rule from speed tests (`SCR-202`) should apply during learning drills (`SCR-303`).
- **Decision:** **Lift the word-lock rule in Learning Mode.** Students are allowed and encouraged to press **Backspace across multiple words** to clean up previous mistakes and retype words cleanly.
- **Rationale:** Neuroplastic motor learning relies on deliberate practice. Forcing a student to leave an uncorrected error in their text reinforces the neural pathway of the mistake. Allowing full backspacing enables the student to immediately overwrite the erroneous motor program with the correct finger movement.

---

### Decision 04: Accuracy-First Gating & 3-Star Certification Thresholds
- **Context:** Deciding passing criteria for unlocking lessons and modules.
- **Decision:** Mandate **$\ge 95.0\%$ Accuracy** to pass any lesson or module assessment, and **$\ge 98.0\%$ Accuracy** to earn 3 Stars. Speed targets are secondary baselines (20 to 50 WPM).
- **Rationale:** Speed is an emergent byproduct of accuracy. When a typist achieves 98%+ accuracy, high speed follows naturally. Rewarding high speed with poor accuracy produces sloppy typing habits that are exceedingly difficult to unlearn.

---

## 2. Visual & Interaction Ergonomics

### Decision 05: Dynamic Trajectory Reach Arcs & Return-to-Home Cueing
- **Context:** How to visually guide students when reaching from the home row to the upper or lower rows.
- **Decision:** Render an animated, glowing dashed bezier arc from the home-row anchor keycap (e.g. `D`) to the target keycap (e.g. `E`), accompanied by an animated pulse on the home anchor after striking the target.
- **Rationale:** Instills the subconscious reflex of "springing back" to the home row after every reach, rather than allowing fingers to drift or hover over the upper row.

---

### Decision 06: Floating Finger Hints Above Active Characters
- **Context:** Providing real-time finger hints during active drilling without forcing the student to look down at the keyboard visualizer.
- **Decision:** Position a compact floating pill (e.g. `[ L-Mid ]`) directly above the active target character, gliding alongside the caret. Toggled via **`F1`**.
- **Rationale:** Keeps the student's foveal gaze locked on the text stream, training them to keep their eyes on the screen while learning finger assignments.

---

### Decision 07: Non-Mandatory Visual Aids & Accessibility Parity
- **Context:** Ensuring students with visual impairments or motor sensitivities can complete the curriculum without barriers.
- **Decision:** Both the 3D hand rig and pastel mechanical keyboard visualizers are **strictly optional** (toggleable via `F2` or settings). Reduced-motion mode replaces fluid animations with instantaneous line swaps and step-wise cursors. 100% of the curriculum is operable via keyboard alone.
- **Rationale:** Full compliance with WCAG 2.2 AA; educational tools must adapt to the user's sensory needs.

---

## 3. Architecture & Data Integrity

### Decision 08: Offline-First Local Progress Persistence in SQLite
- **Context:** Storing lesson progress, stars, best scores, and module unlocks.
- **Decision:** Persisted in local SQLite tables (`lesson_progress`, `module_progress`) managed via Spring Boot. All progress is 100% local-first and functions offline without remote telemetry or cloud logins.
- **Rationale:** Adheres strictly to the architectural baseline of single-user privacy and desktop independence.

---

### Decision 09: Standardization of Primary Button Token to `#2563EB`
- **Context:** Maintaining WCAG AA contrast on all primary buttons.
- **Decision:** All primary CTAs (`"Continue Lesson"`, `"Begin Practice"`, `"Start Assessment"`) use `#2563EB` (Cobalt Blue) with `#FFFFFF` text.
- **Rationale:** Guarantees a verified **5.17:1** contrast ratio across both Dark (Midnight Slate) and Light (Daylight Studio) themes.

---

### Decision 10: Acceptance of Figma Starter Plan 3-Page Architecture
- **Context:** Respecting platform boundaries of the authenticated Figma workspace.
- **Decision:** Master screen templates are anchored on Page 3 (`🖥 03. Desktop Flows & Screen Templates`) under Node `5:2` (`SCR-301`), referencing master components on Page 1 and Page 2.
- **Rationale:** Full visual source of truth delivered within platform constraints.

---

### Decision 11: Exhaustive Star Decision Boundaries & Separation of Lesson Completion vs. Module Mastery
- **Context:** Defining strict progression criteria and eliminating ambiguity between completing an individual lesson and mastering an entire module.
- **Decision:** 
  1. Standard lessons (01–07, 09–15, 17–23, 25–31) unlock the next sequential lesson upon achieving $\ge 1\text{ Star}$ ($\ge 90.0\%$ accuracy).
  2. Module Capstone Assessments (08, 16, 24, 32) require $\ge 2\text{ Stars}$ ($\ge 95.0\%$ accuracy AND speed target met: 20/30/40/50 WPM) to award Module Mastery and unlock the subsequent module.
  3. Achieving 1 Star on a Capstone logs the attempt as a valid lesson completion record, but explicitly **fails** the Module Mastery gate and does **not** unlock the next module.
  4. Accuracy is strictly dominant: achieving 100 WPM with $< 90.0\%$ accuracy results in 0 Stars (fail/incomplete).
- **Rationale:** Prevents students from advancing to higher keyboard rows with uncorrected sloppy habits, while recognizing partial practice without corrupting curriculum progression.

---

### Decision 12: Idempotent Reward Ledger, D3 Accuracy Multipliers, and Retake Anti-Exploit Policy (Option A Approved)
- **Context:** Preventing duplicate XP, star inflation, and double-awarding of milestone bonuses during offline retakes or retry bursts, while aligning with D3 gamification rules.
- **Decision:** 
  1. *Calculation Order & Scope:* Raw Base Effort XP ($XP_{base} = \text{round}(Words \times 0.2) + \text{round}(Minutes \times 5)$) is multiplied strictly by the approved D3 accuracy multiplier ($1.50\times$, $1.20\times$, $1.00\times$, $0.75\times$, $0.50\times$). Multipliers never scale milestone bonuses. Base XP rate is mathematically derived as $\mathbf{\text{Base XP per minute} \approx 5 + (0.2 \times \text{WPM})}$ before rounding and multipliers.
  2. *Milestone Guarantees:* First-time completion bonus (+25 XP), 3-star bonus (+15 XP), and module mastery bonus (+150 XP) are flat additive and protected by unique SQLite constraints in `user_reward_ledger`. Daily goal bonus is reconciled to the approved D3 value of **+150 XP**.
  3. *Approved Retake Policy (Option A: Daily Diminishing Returns):* 
     - Evaluated per lesson ID per calendar day.
     - **Attempt 1 includes the initial lesson attempt on that calendar day** (the daily counter begins on the very first completion of that lesson ID today).
     - Schedule: Attempts 1–3: **100% Base XP**; Attempts 4–5: **50% Base XP**; Attempts 6 onwards: **0% Base XP**.
     - All legitimate attempts continue contributing **100% of their active practice time toward daily goals, streak eligibility, and diagnostic statistics**. The diminishing-return policy affects base XP only.
- **Rationale:** Guarantees database integrity, predictable user motivation, 100% offline-first idempotency, and balanced gamification progression.

---

### Decision 13: Full D4 Typing Engine Reuse & Keystroke Accounting under Multi-Word Backspace
- **Context:** Reusing the approved D4 frontend typing engine without corrupting metric precision when students backspace across word boundaries.
- **Decision:** The core D4 keystroke calculation model (5 characters per word standard: $WPM = \frac{\text{Correct Chars} / 5}{\text{Minutes}}$, uncorrected errors reducing Net WPM) is reused directly in Learning Mode. However, unlike D4 Speed Benchmark (`SCR-202`) which enforces a rigid word-lock boundary, Learning Mode (`SCR-303`) permits multi-word backspacing. When a user backspaces across a space into a previous word, characters edited are tracked in an immutable keystroke audit log. Uncorrected errors are evaluated solely on the final submitted text state, while corrected errors increment the diagnostic mistake ledger for targeted drill recommendations.
- **Rationale:** Preserves identical metric definitions across the application while optimizing pedagogical motor reinforcement during learning drills.

---

### Decision 14: Tauri Desktop Keyboard Accelerator Verification Boundary
- **Context:** Ensuring `F5` and `Ctrl + R` accelerators do not trigger native Windows WebView2 page reloads, destroying active React application state.
- **Decision:** 
  1. Frontend keydown handlers use `{ capture: true }` and `e.preventDefault()` to trap `F5` / `Ctrl + R` during active drilling. If $> 10\text{s}$ have elapsed, a discard confirmation dialog is required.
  2. In the Tauri 2 Rust layer, WebView2 browser accelerators must be explicitly disabled (`put_AreBrowserAcceleratorKeysEnabled(FALSE)`).
  3. Safe fallback accelerators (`Ctrl + Shift + R`, `Alt + R`) and a keyboard-focusable `"Restart Stage"` button are provided.
  4. Formally designated as an **implementation verification requirement for Claude Code** rather than claiming verification in the design phase without runtime testing.
- **Rationale:** Protects user session data and maintains strict integrity regarding verified design vs runtime testing boundaries.

---

## 4. Verification Status Taxonomy

| Category | Scope | Verification Status | Governance Owner |
|---|---|---|---|
| **Design Specification** | UX flows, screen wireframes, component tokens, curriculum catalog, and interaction architectures. | **VERIFIED** | Antigravity Design Phase (Approved) |
| **Mathematical Calculation** | Base XP formula, D3 accuracy multipliers, star thresholds, and worked examples. | **VERIFIED** | Antigravity Design Phase (Approved) |
| **Runtime Implementation Behavior** | Tauri/Rust WebView2 accelerator suppression, SQLite concurrent file locking, and offline IndexedDB sync. | **AWAITING CLAUDE CODE IMPLEMENTATION & TESTING** | Implementation Phase (Claude Code) |

