# TYPING TEST ARENA STATES (D4)
**Typing Trainer — Windows Desktop Application**
*Screen IDs: SCR-201, SCR-202, SCR-203 | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D4 Typing Test Arena Design*
*Date: 2026-11-17 | Status: D4 DESIGN COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Overview of Test Arena States

A production-ready desktop typing arena must maintain absolute determinism across all operational conditions. Every state transition is rigorously mapped to ensure zero visual flicker, zero input lag, and complete data integrity.

The Typing Test Arena (`SCR-202`) implements **10 distinct operational states**.

---

## 2. Detailed Specifications for the 10 Test States

### State 01: Ready to Start (Armed State)
- **Condition:** User enters `SCR-202` from configuration or completes a restart action.
- **Visual Presentation:**
  - Timer displays initial duration (e.g. `1:00`).
  - Active caret sits at index 0 of Line 2, gently pulsating at `1.0 Hz` in Electric Cobalt (`#2563EB`).
  - The first expected character is highlighted with a subtle underline.
  - Centered helper notice appears below the keyboard: *"Type the first character to start the timer..."*
  - Peripheral UI (sidebar, titlebar) remains at **100% normal opacity**.
- **State Transition:** The very first valid character keypress triggers an instantaneous, seamless transition to **State 02** within $< 1\text{ ms}$.

---

### State 02: Active Typing State
- **Condition:** Test timer is running; user is actively striking keys.
- **Visual Presentation:**
  - Peripheral chrome (sidebar, titlebar, status bar) softly dims to **20% opacity** (300ms transition).
  - Caret switches from pulsating to solid continuous illumination (`opacity: 1`), gliding smoothly with active typing.
  - Correct characters render in Electric Sky Blue (`#38BDF8`); mistakes render in Coral Red (`#EF4444`) with wavy red underlines.
  - Top HUD updates WPM and Accuracy at throttled 500ms intervals; time decrements once per second.
  - Next expected key on the mechanical keyboard visualizer is illuminated with a glowing blue border.

---

### State 03: Paused State & Comprehensive Pause/Resume Lifecycle
- **Condition:** User presses `Esc` during an active test.
- **Detailed Lifecycle Specifications:**
  1. **Initial Pause:**
     - High-resolution monotonic timer halts immediately (`T_pause_start = performance.now()`).
     - Active elapsed time counter is frozen.
     - Keystroke buffer locks; all typing inputs are intercepted and prevented from reaching the canvas.
     - Typing canvas is blurred using a CSS backdrop filter (`backdrop-blur-md`).
     - Peripheral dimming is lifted; full 100% opacity returns to window chrome.
     - A centered modal card appears:
       - Title: *"Test Paused"*
       - Subtitle: *"Time remaining: 0:42 • Current pace: 68 WPM"*
       - Primary Button: `"Resume Test"` (Cobalt Blue `#2563EB`, white text, receiving default keyboard focus).
       - Secondary Button: `"Restart Test (F5 / Ctrl + R)"`.
       - Tertiary Button: `"Exit to Configuration"`.
  2. **Resume Request:**
     - Triggered by clicking `"Resume Test"`, pressing `Esc`, or pressing `Space` / `Enter` on the focused Resume button.
     - The pause dialog smoothly dismisses.
  3. **Three-Second Countdown:**
     - A centered visual countdown overlay unfurls above the blurred canvas:
       `3... 2... 1... GO!`
     - The monotonic test timer **remains completely stopped** during this 3-second recovery buffer.
     - Any keystrokes entered during the countdown are ignored to prevent premature mis-hits.
  4. **Timer Resumption:**
     - When the countdown reaches `0.0s ("GO!")`, the delta $\Delta T_{pause} = T_{pause\_end} - T_{pause\_start}$ is added to the cumulative paused counter $\sum T_{paused}$.
     - Monotonic timer resumes exactly at the pre-pause millisecond mark.
     - Canvas unblurs; peripheral dimming smoothly re-engages to 20% opacity.
  5. **Focus Restoration:**
     - Keyboard focus is automatically restored to the invisible typing input capture element (`inputRef.current.focus()`).
     - Caret switches from static to active gliding upon the next character strike.
  6. **Repeated Pause & Integrity Tracking:**
     - Typists may pause and resume multiple times; all paused intervals are tracked cumulatively.
     - In official 60s benchmark tests, a maximum of **2 pause events** and **$\le 60\text{ seconds}$ total paused time** is permitted. Exceeding these limits marks the session as `pbEligible: false` to prevent split-test gaming or memorization.
  7. **Exit While Paused:**
     - If the user selects `"Exit to Configuration"` or `"Return to Dashboard"` from the pause modal, the active run is cleanly aborted without logging a partial or corrupted record to SQLite.

---

### State 04: Resumed State (Smooth Recovery)
- **Condition:** 3-second countdown concludes; active typing restarts.
- **Visual Presentation:**
  - Canvas blur is fully removed.
  - Caret re-engages at the exact character index where the user paused.
  - Next expected keycap illuminates on the mechanical keyboard.
  - Peripheral chrome re-dims to 20% opacity.
  - Active typing resumes with zero time penalty.

---

### State 05: Time Warning State (Final 5 Seconds)
- **Condition:** Remaining test time $\le 5.0\text{ seconds}$ in timed benchmark mode.
- **Visual Presentation:**
  - Anti-Distraction Constraint: **No loud alarm sounds, no violent screen shaking, and no blocking popups** that would break typing flow.
  - Subtle Optical Cue: The horizontal progress bar at the top of the canvas and the timer numerals shift from Electric Blue to a warm **Amber Gold (`#F59E0B`)**.
  - A gentle, non-distracting pulse animation informs the peripheral vision that the sprint is concluding.

---

### State 06: Completed State (Session Finalization)
- **Condition:** Monotonic timer reaches `0:00` or final character of passage is typed.
- **Visual Presentation:**
  - Keystroke input capture closes immediately; further keypresses are ignored.
  - Caret freezes in place.
  - A celebratory overlay briefly flashes (150ms): *"Sprint Complete! Compiling Telemetry..."*.
- **Data Action:**
  - The frontend engine compiles the final immutable session payload (`sessionId`, `grossWpm`, `netWpm`, `accuracy`, `uncorrectedErrors`, `keyStats`, `timestamp`).
  - Initiates local synchronization with Spring Boot REST endpoint (`POST /api/v1/sessions`).
  - Automatically transitions to **`SCR-203: Results Screen`** within 300ms.

---

### State 07: Restart Confirmation State
- **Condition:** User presses `F5` / `Ctrl + R` or clicks "Restart" while active elapsed time $> 10\text{ seconds}$.
- **Visual Presentation:**
  - To prevent catastrophic accidental loss of a high-scoring run, a compact toast confirmation dialog appears:
    > *"Restart active benchmark? Your current run of 74 WPM will be discarded."*
  - Actions: `[ Discard & Restart (Enter) ]`  •  `[ Keep Typing (Esc) ]`.
- **Note:** If elapsed time is $\le 10\text{ seconds}$, restart is instantaneous without confirmation, enabling rapid warm-up restarts.

---

### State 08: Exit Confirmation State
- **Condition:** User clicks a sidebar navigation link or presses `Ctrl + 1` while a test is actively running.
- **Visual Presentation:**
  - Test timer pauses immediately.
  - Confirmation dialog appears:
    > *"Leave typing arena? Your in-progress benchmark will not be saved."*
  - Actions: `[ Leave (Discard Session) ]`  •  `[ Resume Practice ]`.

---

### State 09: Empty or Unavailable Text State (Corpus Fallback)
- **Condition:** Custom text file import fails to read, contains only invalid whitespace, or local database corpus file is corrupted/missing.
- **Visual Presentation:**
  - A prominent amber/coral recovery card replaces the typing canvas:
    > *"⚠️ Selected text source is empty or could not be loaded. Defaulting to Common English Words benchmark."*
  - Action Button: `"Load Default Corpus & Start (Enter) →"`.
  - Engine automatically recovers by streaming standard 1,000-lemma text, preventing application crashes.

---

### State 10: Unexpected Application Interruption & Data Retention
- **Condition:** Operating system crash, hard power cut, or local Spring Boot backend restart occurs during a session.
- **Architectural Recovery & Retention Guarantee:**
  1. **In-Flight Active Keystrokes:** Keystroke streams live in volatile React/Zustand memory to guarantee 0 ms input latency. If an unrecoverable hard crash occurs *mid-test*, in-flight keystrokes are lost; the aborted run is discarded cleanly, preventing corrupted partial runs from skewing user averages.
  2. **Completed Session Persistence:** Once a session completes (timer hits 0:00), the session payload is finalized. If the Spring Boot child process is busy or SQLite reports `SQLITE_BUSY`, the completed session payload is stored in the frontend webview's **IndexedDB offline queue**.
  3. **Automatic Sync Recovery:** A background worker retries flushing queued sessions with exponential backoff.
  4. **Next-Launch Recovery:** If the user exits before sync finishes, the session queue persists in IndexedDB and flushes to SQLite automatically upon the next application launch.
