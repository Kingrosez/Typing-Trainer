# LEARNING MODE OPERATIONAL STATES (D5)
**Typing Trainer — Windows Desktop Application**
*Screen IDs: SCR-301, SCR-302, SCR-303, SCR-304 | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D5 Learning Mode Design*
*Date: 2026-11-17 | Status: D5 DESIGN COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Overview of Educational States

A robust educational platform must manage state transitions with total transparency, guiding the student smoothly from initial orientation through structured practice to capstone certification without jarring visual jumps or broken progress logic.

Learning Mode implements **10 distinct operational states** across its 4 screens.

---

## 2. Detailed Specifications for the 10 Learning States

### State 01: First-Time Zero State (Curriculum Roadmap `SCR-301`)
- **Condition:** Fresh local profile; zero completed lessons ($N = 0$).
- **Visual Presentation:**
  - Curriculum progress bar at `0% (0 / 32 Lessons)`.
  - Star Cabinet: `⭐ 0 / 96 Stars`.
  - Welcoming Hero Banner:
    > *"Welcome to Touch Typing! Touch typing allows you to type at the speed of thought without ever looking at your fingers. Start with Lesson 01 to master your home row tactile anchors."*
  - **Module 1:** Unlocked and active; **Lesson 01 (The Tactile Anchors: F & J)** is highlighted with an active glowing blue border (`#2563EB`).
  - **Modules 2, 3, and 4:** Locked with padlock icons (`🔒`), displaying clear prerequisites.
  - **Primary CTA:** Large Cobalt Blue button: `"Begin Lesson 01: The Tactile Anchors (Enter) →"`.

---

### State 02: Returning Student In-Progress Roadmap (`SCR-301`)
- **Condition:** User has completed multiple lessons across one or more modules.
- **Visual Presentation:**
  - Overall progress bar filled proportionally (e.g. `38% • 12 / 32 Lessons`).
  - Completed lessons display earned stars (`⭐⭐⭐` or `⭐⭐☆`) and best accuracy/WPM telemetry.
  - The next uncompleted lesson card is automatically elevated with an illuminated **`● ACTIVE`** badge.
  - Primary CTA dynamically labels the active target: `"Continue Lesson 13: Reaching for Q & P (Enter) →"`.

---

### State 03: Lesson Briefing Armed State (`SCR-302`)
- **Condition:** User enters a lesson briefing before launching the interactive drill.
- **Visual Presentation:**
  - 3D Anatomical Hand Rig displays the neutral elevated wrist posture and highlights the active reaching digits in Sky Blue (`#38BDF8`).
  - Dynamic trajectory reach vectors indicate the exact diagonal travel from the home row to the target keys.
  - Ergonomic checklist is verified; primary focus is placed on the `"Begin Interactive Practice (Space / Enter)"` button.

---

### State 04: Active Interactive Drill State (`SCR-303`)
- **Condition:** Student is actively typing text inside the instructional drill.
- **Visual Presentation:**
  - Peripheral application chrome (sidebar, titlebar, status bar) is dimmed to **20% opacity**.
  - Monospace text stream displays Sky Blue for correct keystrokes, Coral Red with wavy underline for errors, and active 3px fluid caret.
  - Floating finger hint pills (`[ L-Mid ]`) glide above the active target character.
  - Pastel mechanical keyboard visualizer illuminates target keycap and displays dashed reach arc from the home-row anchor.

---

### State 05: Drill Paused State (`SCR-303`)
- **Condition:** Student presses `Esc` during an active drill.
- **Visual Presentation:**
  - Drill timer halts immediately; keystroke input buffer locks.
  - Canvas blurs via CSS `backdrop-blur-md`; peripheral dimming lifts to 100% normal opacity.
  - Centered Pause Modal appears:
    - Title: *"Practice Paused"*
    - Subtitle: *"Stage 2 of 5 • Current Accuracy: 98.4%"*
    - Actions: `[ Resume Practice (Space) ]`  •  `[ Restart Stage (F5) ]`  •  `[ Exit to Roadmap ]`.

---

### State 06: Three-Second Unpause Countdown (`SCR-303`)
- **Condition:** Student requests resume from pause modal.
- **Visual Presentation:**
  - Pause dialog closes; a circular countdown overlay appears over the blurred canvas:
    `3... 2... 1... GO!`
  - The drill timer remains frozen during the 3 seconds; keystrokes are ignored.
  - On `"GO!"`, the timer resumes seamlessly, the canvas unblurs, peripheral dimming re-engages, and focus is restored to the typing capture element.

---

### State 07: Drill Stage Transition State (`SCR-303`)
- **Condition:** Student successfully completes all words in Stages 1, 2, 3, or 4 of the lesson.
- **Visual Presentation:**
  - Subtle 200ms celebratory micro-burst: *"Stage 2 Complete! Advancing to Stage 3: Word Families..."*.
  - Next stage text stream loads smoothly; stage segmented progress dots increment.
  - Real-time accuracy and pacing metrics are carried forward without interruption.

---

### State 08: Lesson 3-Star Celebration State (`SCR-303` Completion)
- **Condition:** Student completes Stage 5 of a lesson with $\ge 98.0\%$ accuracy and speed threshold met.
- **Visual Presentation:**
  - Screen transitions to the Lesson Scorecard overlay:
    - Title: *"⭐⭐⭐ Flawless Touch Mastery!"*
    - Scorecard displays: `Accuracy: 98.6% • Speed: 32 WPM • +40 XP Awarded`.
    - Golden stars play a subtle shimmer animation.
    - Primary CTA: `"Next Lesson: Lesson 10 (Enter) →"`.

---

### State 09: Module Capstone Passed & Unlock State (`SCR-304`)
- **Condition:** Student passes the Module Capstone Assessment with $\ge 95.0\%$ accuracy and speed target met.
- **Visual Presentation:**
  - Hero Certification Banner in Emerald Green:
    - Title: *"🏆 MODULE 2 COMPLETE: UPPER ROW CERTIFIED!"*
    - Scorecard: `3 Stars • Accuracy: 98.2% • Speed: 34 WPM`.
    - Rewards: `+150 XP Module Bonus Awarded • Top Row Aeronaut Shield Unlocked`.
  - Next Module Unlock Animation: Module 3 padlock icon unlocks with a crisp metallic chime.
  - Primary CTA: `"Begin Module 3: Bottom Row Coordination (Enter) →"`.

---

### State 10: Module Capstone Incomplete State (`SCR-304`)
- **Condition:** Student scores $< 95.0\%$ accuracy or fails to meet the module baseline speed target on the capstone exam.
- **Visual Presentation:**
  - Hero Banner in Amber Gold (`#F59E0B`):
    - Title: *"MODULE 2 ASSESSMENT INCOMPLETE — 95% ACCURACY REQUIRED"*.
    - Telemetry: `Accuracy: 92.4% (Threshold: 95.0%) • Speed: 28 WPM (Threshold: 30 WPM)`.
    - Constructive Feedback: Highlights specific error-prone keys (e.g. `Q` and `P`) and recommends reviewing preparatory lessons before retrying.
    - Next Module remains locked (`🔒`).
    - Primary CTA: `"Retake Assessment (Enter) →"`.
