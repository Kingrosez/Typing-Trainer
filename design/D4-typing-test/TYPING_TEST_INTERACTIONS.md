# TYPING TEST INTERACTIONS & MICRO-INTERACTIONS (D4)
**Typing Trainer — Windows Desktop Application**
*Screen IDs: SCR-201, SCR-202, SCR-203 | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D4 Typing Test Arena Design*
*Date: 2026-11-17 | Status: D4 DESIGN COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Overview & Interaction Principles

The Typing Test Arena interaction design adheres to three core mechanical desktop principles:
1. **Zero Input Lag:** Active keystroke evaluation runs on the local UI thread with 0 ms perceptible latency.
2. **Strict Accessibility Focus Model:** Global hotkeys never hijack standard typing keys. `Space` and `Enter` actuate only the currently focused element outside the typing canvas; during active typing, `Space` is strictly a word delimiter.
3. **Frictionless Keyboard Continuity:** A typist can configure, start, pause, restart, review results, and retake tests entirely from the home row without ever reaching for the mouse.

---

## 2. Interaction Specifications by Screen

### 2.1 SCR-201: Test Configuration Interactions
- **Segmented Control Pills (Duration & Difficulty):**
  - *Click / Tap:* Selects active pill immediately; smoothly translates the active indicator pill (`transition: all 150ms ease`).
  - *Keyboard Focus (`Tab`):* Focuses the pill group with a **2px solid `#2563EB`** outline (offset 2px).
  - *Arrow Keys (`Left / Right`):* Cycles through duration presets (15s $\longleftrightarrow$ 30s $\longleftrightarrow$ 60s $\longleftrightarrow$ 120s $\longleftrightarrow$ Custom).
  - *Enter / Space:* Confirms the focused pill selection.
- **Modifier Checkbox Pills (Punctuation, Numbers, Capitalization):**
  - *Click / Space:* Toggles checkbox state on/off.
  - *Visual Transition:* Checkmark icon smoothly scales from 0 to 1 with an emerald pulse.
- **Custom Duration Input:**
  - *Focus:* Automatically selects existing numeric text.
  - *Validation on Blur:* If value $< 10$, clamps to 10; if $> 300$, clamps to 300; displays non-intrusive coral helper note.
- **"Start Typing Test" Primary CTA:**
  - *Keyboard Activation:* Pressing **`Enter`** anywhere on the configuration view (unless another input is actively focused) immediately initiates the test transition to `SCR-202`.

---

### 2.2 SCR-202: Live Typing Arena Interactions
- **Canvas Focus Initialization:**
  - Upon transitioning to `SCR-202`, the active typing canvas is automatically focused (`inputRef.current.focus()`).
  - A hidden, accessible text capture element buffers native keyboard events without displaying a native OS input box.
- **Active Keystroke Processing:**
  - *Standard Character Key (`a-z`, `0-9`, punctuation):*
    1. Compares `event.key` with `expectedChar` at current buffer index.
    2. If match: marks character correct (Electric Blue `#38BDF8`), advances caret 1 glyph width.
    3. If mismatch: marks character incorrect (Coral Red `#EF4444` with wavy underline), increments error counter, advances caret.
  - *Spacebar (` `):*
    - Evaluates word completion. If the word has uncorrected mistakes, marks whole word as flagged; advances active cursor to next word.
    - If active caret is on Line 2 end, triggers 180ms smooth translateY scroll.
  - *Backspace (`\b`):*
    - Erases previous character in active word, retreats caret 1 glyph width, restores pending state.
    - Cannot backspace into previous committed words.
- **Peripheral Dimming Transition:**
  - First keystroke triggers `document.body.classList.add('typing-active')`.
  - CSS rule: `.typing-active .desktop-sidebar, .typing-active .desktop-titlebar { opacity: 0.20; transition: opacity 300ms ease; }`.
  - Dimming immediately lifts if the test is paused, completed, or mouse cursor hovers over the sidebar.
- **Pause Modal Trigger (`Esc`):**
  - Pressing **`Esc`** immediately halts timer, records pause timestamp, and unfurls pause modal with backdrop blur.
  - Pressing `Esc` again or pressing `Space`/`Enter` while "Resume" is focused initiates the 3-second unpause countdown.
- **Instant Quick Restart (`F5` or `Ctrl + R`):**
  - Standardized on **`F5`** or **`Ctrl + R`** (universal refresh/restart accelerators).
  - *Removal of Tab + Enter:* The ambiguous `Tab + Enter` shortcut was removed because `Tab` must remain dedicated to standard accessibility focus traversal. Stealing `Tab` during typing causes focus traps and conflicts with screen readers.
  - *Discard Confirmation:* If $> 10\text{ seconds}$ have elapsed in an active benchmark, pressing `F5` or clicking Restart prompts a non-blocking confirmation dialog (`"Discard active benchmark? Your current run of 74 WPM will be lost."`), preventing accidental loss of high-scoring runs. If $< 10\text{ seconds}$, restart is instantaneous.
- **Zen Mode HUD Toggle (`F8` or `Ctrl + Shift + H`):**
  - *Conflict Resolution:* In English text, `Shift + H` is used to type the capital letter `'H'`. Mapping `Shift + H` to a shortcut caused severe input collisions during capitalized sentences.
  - *Resolution:* HUD / Zen Mode visibility is toggled exclusively via **`F8`** or **`Ctrl + Shift + H`** (or an on-screen HUD visibility button), completely protecting standard character typing.

---

### 2.3 SCR-203: Results Screen Interactions
- **Hero WPM Roll-Up Animation:**
  - On initial render, the Net WPM number counts up smoothly from 0 to final score over **600ms** (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Interactive Recharts Telemetry Hover:**
  - Hovering the mouse across the WPM curve snaps a vertical cursor rule to the exact second.
  - Tooltip card unfurls displaying instant WPM, cumulative errors, and accuracy at that specific point.
- **Action Button Navigation & Focused Element Activation:**
  - On page load, initial keyboard focus is placed squarely on the primary CTA: **"Retry Same Test"**.
  - Pressing **`Enter`** or **`Space`** actuates the currently focused button, immediately starting a fresh test.
  - Pressing **`Tab`** cycles focus sequentially: `"Retry Same Test"` $\rightarrow$ `"Practice Weak Keys"` $\rightarrow$ `"Configure New Test"` $\rightarrow$ `"Return to Dashboard"`.
  - **`Ctrl + N`**: Navigates to `SCR-201` for a new test configuration.
  - **`Ctrl + 1`**: Returns cleanly to Dashboard.
  - Clicking "Practice Weak Keys" immediately bundles detected error characters (`R, T, P`) and opens the weak-key drill stage (`SCR-402`).

---

## 3. Comprehensive Master Keyboard Accelerator Matrix

| Key Binding | Screen Scope | Action Executed | Accessibility & OS Alignment |
|---|---|---|---|
| **`Enter`** | `SCR-201` & `SCR-203` | Actuates focused button (e.g. "Start Test", "Retry"). | Standard WCAG button actuation |
| **`Space`** | `SCR-201` & `SCR-203` | Actuates focused button or toggles focused checkbox. | Standard WCAG control actuation |
| **`Tab` / `Shift + Tab`**| All Screens | Cycles focus sequentially through interactive controls.| Universal accessibility traversal |
| **`Arrow Left / Right`** | `SCR-201` (Config) | Navigates between segmented duration/difficulty pills.| Standard ARIA segmented control |
| **`Esc`** | `SCR-202` (Live Test) | Pauses active test and displays Pause Modal. | Standard gaming/desktop pause |
| **`F5` / `Ctrl + R`** | `SCR-202` (Live Test) | Restarts active test (with confirm if $> 10\text{s}$). | Universal desktop restart accelerator |
| **`F8` / `Ctrl+Shift+H`**| `SCR-202` (Live Test) | Toggles live HUD visibility (Zen Mode). | Dedicated non-character shortcut |
| **`F2`** | `SCR-202` (Live Test) | Collapses / Expands mechanical keyboard visualizer. | Function key toggle |
| **`Ctrl + N`** | `SCR-203` (Results) | Opens Configuration (`SCR-201`) for a new test. | Standard document/test accelerator |
| **`Ctrl + 1`** | All Screens | Returns to Dashboard (`SCR-101`). | Global numeric module accelerator |
| **`Ctrl + 2`** | All Screens | Jumps to Typing Test Configuration (`SCR-201`). | Global numeric module accelerator |
| **`Ctrl + Shift + T`** | All Screens | Toggles Visual Theme (Dark $\longleftrightarrow$ Light). | Global theme accelerator |
| **`Ctrl + K`** | All Screens | Opens Command Palette quick launcher. | Universal desktop launcher |

---

## 4. Visual Feedback & Tactile Animations

- **Correct Keystroke Spark:** An ultra-subtle, non-distracting 50ms luminance flash on the typed glyph.
- **Incorrect Keystroke Shake:** A micro horizontal jitter ($1\text{px}$ left/right for 80ms) applied strictly to the incorrect character glyph, providing instantaneous peripheral awareness of a mistake without breaking rhythm.
- **Smooth Caret Spring:** The caret glides horizontally across the baseline using a spring physics simulation (`stiffness: 400`, `damping: 30`), eliminating the rigid, jerky motion of basic browser text inputs.
