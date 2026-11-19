# DASHBOARD APPLICATION STATES (D3)
**Typing Trainer — Windows Desktop Application**
*Screen ID: SCR-101 | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D3 Dashboard Design*

---

## 1. Overview of Dashboard States

A production-ready desktop application must communicate every operational state with complete clarity, eliminating ambiguous blank screens or layout shifts. The Dashboard Command Center implements **8 distinct states**.

---

## 2. Detailed State Specifications

### State 01: New User with No Previous Typing History (First-Time Educational Zero State)
- **Condition:** Fresh installation or newly created local profile with zero completed practice sessions ($N = 0$).
- **Core Philosophy:** Welcoming, educational, and zero-pressure. Avoids confusing empty graphs, broken statistical averages (`0.0 WPM`, `0% Accuracy`), or premature streak pressure.
- **Visual Presentation:**
  1. **Welcoming Hero Header:**
     - Title: *"Welcome to Typing Trainer, Alex! ⌨"*
     - Educational Subtitle: *"An offline desktop application engineered to build touch-typing speed, accuracy, and muscle memory through structured drills and instant feedback."*
  2. **Educational Metric Foundation Cards (Explaining WPM & Accuracy):**
     - Rather than showing misleading `0` or `N/A` values, the four top cards display concise educational explanations:
       - *Card 1 (Net Speed):* **"WPM (Words Per Minute)"** $\rightarrow$ Explains Net WPM (standardized as 5 keystrokes per word minus uncorrected errors).
       - *Card 2 (Accuracy):* **"Precision Target (95%+)"** $\rightarrow$ Explains why touch typing prioritizes cadence and rhythm over frantic key mashing.
       - *Card 3 (Cadence):* **"Consistency %"** $\rightarrow$ Explains second-by-second typing rhythm stability.
       - *Card 4 (Ergonomics):* **"Home Row Form"** $\rightarrow$ Explains tactile anchor points on `F` and `J`.
  3. **Primary Initial Call to Action (Singular Focus):**
     - A prominent, focused card: **"Take Your First 30s Baseline Benchmark"**.
     - Button: Large Cobalt Blue button (`#2563EB`) with label: `"Start Baseline Test (30 Seconds) →"`.
  4. **No Streak or Achievement Pressure:**
     - The streak flame does not display `0 Days Failed` or broken badges; it displays: *"Day 1: Ready to Begin"*.
     - Weekly activity chart is replaced by an illustrated walkthrough of the 4 curriculum modules.
- **Cognitive Outcome:** The user immediately understands the product purpose, grasps what the metrics mean, and has a single, inviting step to take.

### State 02: Returning User with Existing History (Baseline Populated)
- **Condition:** User has completed $\ge 1$ sessions.
- **Visual Presentation:** Fully populated Dashboard with all 10 widgets active, displaying authentic metrics, trend curve, weekly bars, and weak-key diagnostic recommendations.

### State 03: Daily Goal Incomplete
- **Condition:** Practice time logged today $< 20\text{ minutes}$.
- **Visual Presentation:**
  - Progress Ring: Fills proportionally (e.g. `12 / 20 mins`, 60%).
  - Text: *"8 minutes remaining to seal today's streak."*
  - Accent Color: Active Electric Blue (`#2563EB`).
  - Action Button: `"Continue Daily Practice →"`.

### State 04: Daily Goal Completed
- **Condition:** Practice time logged today $\ge 20\text{ minutes}$.
- **Visual Presentation:**
  - Progress Ring: Fully closed 100% ring in Emerald Green (`#10B981`) with a glowing checkmark badge (`✓`) in the center.
  - Celebratory Copy: *"Daily Practice Goal Completed! +150 XP Daily Bonus Awarded."*
  - Streak Icon: Glowing orange flame (`🔥 5 Days`) with an illuminated border.
  - Action Button: Softens to a secondary outline button: `"Bonus Practice (Free Typing)"`.

### State 05: New Achievement Unlocked
- **Condition:** User earned a trophy or milestone in their most recent session.
- **Visual Presentation:**
  - Floating Toast Alert unfurls at the bottom-right corner: *"🏆 Trophy Unlocked: The Sixty-Club! (+300 XP)"*.
  - Achievement Widget: Displays the newly unlocked trophy with a golden animated shimmer border.
  - Level XP Bar: Displays smooth rolling progress increment with bonus XP accounted for.

### State 06: No Weak Keys Detected (Mastery State)
- **Condition:** User maintains $\ge 98\%$ accuracy across all characters in their last 10 sessions.
- **Visual Presentation:**
  - The Weak-Key Hero Card transforms into a prestigious **"Flawless Precision"** celebration card.
  - Copy: *"No significant weak keys detected! Your accuracy is exceptional (98.4% average across all reaches)."*
  - Next Action: Automatically suggests an advanced speed challenge: `"Launch High-Speed Sprint Attack (80+ WPM Target) ↵"`.

### State 07: Loading State (Shimmer Skeleton)
- **Condition:** Loading large multi-month session histories from the local SQLite database.
- **Visual Presentation:**
  - Zero layout shift. Every card, chart, and button is represented by a pulsing SVG skeleton placeholder (`animate-pulse`) matching exact final dimensions.
  - Skeleton fills use `#1E293B` against `#131B2E` in Dark Theme, `#E2E8F0` against `#FFFFFF` in Light Theme.
  - Auto-resolves in $< 100\text{ ms}$ on local desktop SSDs.

### State 08: Error Recovery & Data Retention (Local Database Lock / Backend Disconnect)
- **Condition:** Local SQLite file is temporarily locked by external OS file indexing, antivirus inspection, write contention, or the local Spring Boot background process is restarting during session finalization.
- **Architectural Data Integrity Model:**
  - **In-Flight Active Keystrokes:** Keystroke events are captured and calculated purely in-memory (React/Zustand store) to guarantee 0 ms input lag. If an unrecoverable OS crash or hard power loss occurs *during* an active in-flight test, uncommitted in-flight keystrokes are lost; the application safely treats the aborted sprint as discarded, preventing corrupted statistical fragments from polluting historical averages.
  - **Completed Session Payload Persistence:** Upon session completion (timer expiration or passage completion), the final immutable session payload (metrics, timestamp, per-key error counts) is immediately assembled. If the backend is unavailable or SQLite reports `SQLITE_BUSY`, the payload is written directly to the frontend webview's local persistent storage (IndexedDB offline queue).
  - **Exponential Backoff Synchronization:** The frontend client retries flushing queued sessions to the backend REST endpoint (`/api/v1/sessions/sync`) using exponential backoff ($1\text{ s}, 2\text{ s}, 4\text{ s}, \dots$ up to a maximum of $30\text{ s}$).
  - **Next-Launch Recovery:** If the user exits the app while sessions remain queued, the offline queue is preserved in persistent webview storage and automatically flushed upon the next successful application launch once the Spring Boot service initializes.
- **Visual Presentation:**
  - A non-alarmist amber status banner appears at the top of the Dashboard stage:
    > *"⚠️ Local database temporarily busy. Your completed session is safely saved locally and will sync automatically once available."*
  - **Status Pill:** A compact badge in the status bar indicates: `[🔄 1 Session Queued for Sync]`.
  - **Action Affordances:**
    - Primary CTA: `"Retry Sync Now"` button.
    - Secondary Link: `"Local Diagnostics & Troubleshooting"` opens the diagnostic dialog.
  - **User Experience Guarantee:** The user can continue starting new practice sessions or reviewing cached dashboard statistics without experiencing freezing, data loss, or blocking modal dialogs.
