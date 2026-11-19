# LEARNING MODE INTERACTIONS & MICRO-INTERACTIONS (D5)
**Typing Trainer — Windows Desktop Application**
*Screen IDs: SCR-301, SCR-302, SCR-303, SCR-304 | Target Resolution: 1440 × 900*
*Document Version: 1.1.0 | Stage: D5 Final Governance Correction*
*Date: 2026-11-17 | Status: RESOLVED (AWAITING PRODUCT OWNER APPROVAL)*

---

## 1. Interaction Principles & Focus Governance

Learning Mode interaction design adheres to strict desktop usability standards:
1. **Uninterrupted Flow State:** Typists can navigate from the curriculum roadmap to a lesson briefing, complete an interactive drill, review their mastery scorecard, and advance to the next lesson without touching the mouse.
2. **Strict Accessibility Focus Model:** `Space` and `Enter` actuate only the currently focused interactive element outside the typing canvas. During active drilling in `SCR-303`, `Space` functions strictly as a word delimiter.
3. **Dedicated, Non-Conflicting Accelerators:** Avoids character key collisions (no `Shift + H` traps); utilizes standardized function keys (`F1` for finger hints, `F2` for keyboard toggle, `F5` for restart, `Esc` for pause).

---

## 2. Screen-by-Screen Interaction Specifications

### 2.1 SCR-301: Curriculum Roadmap Interactions
- **Module Selector Tabs:**
  - *Click / Arrow Left/Right:* Shifts the active module view with a 150ms smooth crossfade.
  - *Tab Navigation:* Focuses module tabs with high-visibility **2px solid `#2563EB`** outline.
- **Lesson Cards Grid (2 × 4):**
  - *Hover:* Card lifts 2px (`transform: translateY(-2px)`), border shifts to luminous `#2563EB`, background shifts to `#162035` (Dark).
  - *Keyboard Arrow Navigation:* `Arrow Right / Left` moves between horizontal cards; `Arrow Down / Up` moves vertically between rows.
  - *Enter / Space:* Opens `SCR-302` for the focused unlocked lesson.
  - *Locked Card Click:* Triggers a subtle horizontal wiggle animation (3px for 120ms) and audio-visual feedback indicating the lesson is locked.
- **Primary Action ("Continue Active Lesson"):**
  - Initial focus on page load sits on the primary CTA button. Pressing **`Enter`** immediately launches the briefing for the next uncompleted lesson.

---

### 2.2 SCR-302: Lesson Briefing Interactions
- **Initial Focus:** Sits squarely on `"Begin Interactive Practice"`.
- **Keyboard Launch:** Pressing **`Enter`** or **`Space`** immediately transitions to `SCR-303`.
- **Interactive Finger Assignment Check:**
  - Clicking or pressing keys corresponding to target letters triggers an interactive highlight on the 3D hand diagram.
- **Back Navigation:** Pressing **`Esc`** or clicking `"← Return to Curriculum"` routes back to `SCR-301`.

---

### 2.3 SCR-303: Interactive Drill Stage Interactions
- **Canvas Focus Initialization:** Focus is automatically grabbed by the hidden typing input element on transition.
- **Active Keystroke Processing:**
  - *Correct Strike:* Struck glyph turns Electric Sky Blue (`#38BDF8`); reach trajectory arc flashes green for 120ms; home-row anchor pulses gently to prompt finger return.
  - *Incorrect Strike:* Struck glyph turns Coral Red (`#EF4444`) with wavy underline; error counter increments; floating finger hint flashes amber.
  - *Spacebar:* Commits word and advances caret. Unlike benchmark tests, **multi-word backspacing is permitted** in Learning Mode.
- **Floating Finger Hint Toggle (`F1`):**
  - Pressing **`F1`** cleanly toggles the floating finger pills (`[ L-Mid ]`) above the text stream without pausing the drill.
- **Keyboard Visualizer Toggle (`F2`):**
  - Pressing **`F2`** smoothly collapses or expands the mechanical keyboard visualizer (`height: 0` $\longleftrightarrow$ `260px`).
- **Pause Trigger (`Esc`):**
  - Pressing **`Esc`** immediately halts the drill timer, blurs the canvas, and opens the pause modal with a 3-second unpause buffer upon resumption.
- **Quick Stage Restart (`F5` or `Ctrl + R`):**
  - Standardized on **`F5`** or **`Ctrl + R`** (consistent with D4).
  - *Discard Confirmation:* If $> 10\text{ seconds}$ have elapsed in an active drill stage, pressing `F5` / `Ctrl + R` prompts a non-blocking confirmation dialog (`"Restart active drill stage? Current stage progress will be reset. [Enter: Confirm / Esc: Cancel]"`), preventing accidental disruption. If $\le 10\text{ seconds}$, restart is instantaneous.
  - *Tauri / WebView2 Desktop Runtime Interception:*
    - In standard Windows WebView2, `F5` and `Ctrl + R` trigger native browser window reloads (`Reload()`). An unintercepted reload destroys the in-memory React application tree, erasing active drill telemetry.
    - *Frontend Interception:* A top-level keydown event listener (`{ capture: true }`) calls `e.preventDefault()` to trap `F5` and `Ctrl + R` before browser bubbling occurs.
    - *Rust Desktop Layer:* During Tauri 2 window initialization, native browser accelerator keys must be disabled at the WebView2 controller level (`ICoreWebView2Settings::put_AreBrowserAcceleratorKeysEnabled(FALSE)` or via webview args).
    - *Focus Awareness:* When an active modal (e.g. Pause Modal, Settings, or Confirmation Dialog) is open, `F5` and `Ctrl + R` are strictly suppressed to avoid resetting state behind the active overlay.
    - *Safe Fallbacks:* An always-visible, keyboard-focusable `"Restart Stage"` button is provided in the drill toolbar. Secondary fallback accelerators **`Ctrl + Shift + R`** and **`Alt + R`** are supported as safe alternatives if platform-specific webview hooks fail.

---

### 2.4 SCR-304: Module Mastery Assessment Interactions
- **Initial Focus:** Default focus is placed on the primary CTA:
  - If Passed: `"Begin Next Module (Enter) →"`.
  - If Failed: `"Retake Assessment (Enter) →"`.
- **Pressing `Enter` / `Space`:** Immediately executes the focused primary action.
- **Interactive Heatmap Hover:**
  - Hovering over any key in the module heatmap highlights the responsible finger on a mini-hand diagram and reveals the error count.
- **Navigation:** `Ctrl + 3` returns to `SCR-301` (Curriculum Roadmap).

---

## 3. Comprehensive Master Keyboard Accelerator Matrix

| Key Binding | Screen Scope | Action Executed | Accessibility & OS Alignment | Verification Status |
|---|---|---|---|---|
| **`Enter`** | `SCR-301`, `SCR-302`, `SCR-304` | Actuates focused button (e.g. "Continue Lesson", "Begin Next Module"). | Standard WCAG button actuation | **Design Spec Verified** |
| **`Space`** | `SCR-301`, `SCR-302`, `SCR-304` | Actuates focused button or checkbox control. | Standard WCAG control actuation | **Design Spec Verified** |
| **`Tab` / `Shift + Tab`**| All Screens | Cycles focus sequentially through interactive controls.| Universal accessibility traversal | **Design Spec Verified** |
| **`Arrow Keys`** | `SCR-301` (Roadmap) | Navigates through 4-column lesson card grid. | Standard ARIA grid navigation | **Design Spec Verified** |
| **`Esc`** | `SCR-303` (Drill) | Pauses active drill and displays Pause Modal. | Standard desktop pause convention | **Design Spec Verified** |
| **`Esc`** | `SCR-302` (Briefing) | Returns to Curriculum Roadmap (`SCR-301`). | Standard dialog dismissal | **Design Spec Verified** |
| **`F5` / `Ctrl + R`** | `SCR-303` (Drill) | Prompts drill stage restart (with >10s guard dialog). | Universal desktop refresh accelerator | **Awaiting Claude Code Runtime Verification** |
| **`Ctrl + Shift + R` / `Alt + R`** | `SCR-303` (Drill) | Safe fallback drill stage restart accelerator. | Conflict-free secondary accelerator | **Awaiting Claude Code Runtime Verification** |
| **`F1`** | `SCR-303` (Drill) | Toggles floating finger hints above active characters.| Dedicated non-character accelerator | **Design Spec Verified** |
| **`F2`** | `SCR-303` (Drill) | Collapses / expands mechanical keyboard visualizer. | Function key toggle | **Design Spec Verified** |
| **`Ctrl + 1`** | All Screens | Returns to Dashboard (`SCR-101`). | Global numeric module accelerator | **Design Spec Verified** |
| **`Ctrl + 2`** | All Screens | Jumps to Typing Test (`SCR-201`). | Global numeric module accelerator | **Design Spec Verified** |
| **`Ctrl + 3`** | All Screens | Jumps to Learning Mode Roadmap (`SCR-301`). | Global numeric module accelerator | **Design Spec Verified** |
| **`Ctrl + Shift + T`** | All Screens | Toggles Visual Theme (Dark $\longleftrightarrow$ Light). | Global theme accelerator | **Design Spec Verified** |
| **`Ctrl + K`** | All Screens | Opens Command Palette quick launcher. | Universal desktop launcher | **Design Spec Verified** |

---

## 4. Verification Status & Desktop Runtime Boundaries

To ensure complete transparency regarding desktop environment behavior:

1. **Design Specification Verified:**
   - Keyboard navigation schemas, non-character accelerator allocation (`F1`, `F2`), modal focus traps, ARIA focus indices, and screen transition flows are fully specified and verified against Windows usability patterns.
2. **Mathematical & Logic Specification Verified:**
   - The 10-second elapsed threshold for triggering restart confirmation dialogs is deterministic and verified.
3. **Runtime Implementation Behavior Awaiting Claude Code Testing:**
   - The actual suppression of WebView2 browser reload under `F5` / `Ctrl + R` cannot be executed in the current design phase and is formally designated as an **implementation verification requirement for Claude Code**.
   - Claude Code must verify that Tauri's Rust initialization disables native browser accelerator keys (`put_AreBrowserAcceleratorKeysEnabled(FALSE)`) and test whether `e.preventDefault()` reliably intercepts keystrokes across all Windows display focus states.

