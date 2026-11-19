# LIVE TYPING TEST INTERFACE SPECIFICATION (SCR-202)
**Typing Trainer — Windows Desktop Application**
*Screen ID: SCR-202 | Route: /test/active | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D4 Typing Test Arena Design*
*Date: 2026-11-17 | Status: D4 DESIGN COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Screen Mission & Core UX Philosophy

**`SCR-202: Live Typing Test Arena`** is the operational core of Typing Trainer. It provides an ultra-responsive, distraction-free environment engineered to maximize focus, flow state, and mechanical touch-typing precision.

### 1.1 The Foveal Typing Arena Concept
Typing at high speeds ($60–120+\text{ WPM}$) requires intense visual tracking. The interface isolates the typing stream into the center of the user's field of view:
- **Peripheral Dimming:** The custom titlebar, sidebar navigation, and bottom status bar softly fade to **20% opacity** when active typing commences.
- **Subdued Performance HUD:** Live metrics update at a measured cadence without erratic numeric flashing.
- **Laser-Sharp Text Stream:** Monospace characters with generous line-height (`1.75`) and high-contrast color coding for instantaneous error recognition.

---

## 2. Layout Architecture & Visual Hierarchy (1440 × 900)

```
+-------------------------------------------------------------------------------+
| TITLEBAR: [⌨] Typing Trainer  (Peripheral Dimmed: 20% Opacity)        [—] [□] [✕]|
+-------------------+-----------------------------------------------------------+
| SIDEBAR: (240px)  | MAIN ARENA STAGE (1100px Centered Stage)                  |
|                   |                                                           |
| (Peripheral       | +-------------------------------------------------------+ |
|  Dimmed: 20%      | | LIVE PERFORMANCE HUD (Height: 64px)                   | |
|  Opacity during   | | [⏱ 0:42 REMAINING]   [68 WPM]   [98.4% ACC]   [0 ERR] | |
|  active typing)   | +-------------------------------------------------------+ |
|                   |                                                           |
|                   | +-------------------------------------------------------+ |
|                   | | PRIMARY TYPING CANVAS (Height: 220px, 3-Line Window)  | |
|                   | |                                                       | |
|                   | | standard progress computer practice software          | |
|                   | | algorithm [|]database network terminal interface      | |
|                   | | architecture synchronous deployment execution         | |
|                   | |                                                       | |
|                   | +-------------------------------------------------------+ |
|                   |                                                           |
|                   | +-------------------------------------------------------+ |
|                   | | OPTIONAL 65% MECHANICAL KEYBOARD (Height: 260px)      | |
|                   | | [Tab][ Q ][ W ][ E ][ R ][ T ][ Y ][ U ][ I ][ O ]... | |
|                   | | [Caps][ A ][ S ][ D ][ F ][ G ][ H ][ J ][ K ][ L ]...| |
|                   | | [Shift][ Z ][ X ][ C ][ V ][ B ][ N ][ M ]...         | |
|                   | | [Ctrl][Win][Alt][      SPACEBAR      ][Alt][Fn][Ctrl] | |
|                   | +-------------------------------------------------------+ |
|                   |                                                           |
|                   | IN-ARENA CONTROLS: [Esc] Pause  •  [F5] Restart  •  [F8] Zen Mode|
+-------------------+-----------------------------------------------------------+
| STATUS BAR: (Peripheral Dimmed: 20% Opacity)                                  |
+-------------------------------------------------------------------------------+
```

---

## 3. Primary Typing Canvas Specification

### 3.1 Typographic Foundation
- **Font Family:** **`JetBrains Mono`** (Strict Monospace with OpenType programming ligatures disabled during typing to preserve exact character spacing).
- **Font Size:** **`28px`** (with standard desktop scaling supporting 24px on 720p and 32px on 1440p).
- **Line Height:** **`48px` (`1.714`)** to provide clear vertical breathing room between lines.
- **Letter Spacing:** `0.02em` (`tracking-wide`) for optimal parafoveal character separation.

---

### 3.2 Monospace Character State Rendering

Every character in the active text stream exists in one of five mutually exclusive states:

```
          Active Caret [|]
                 v
   c o m p u t e r   d a t a b a s e   n e t w o r k
   ^^^^^^^^^^^^^^^   ^
   [CORRECT TEXT]    [INCORRECT STROKE: Underlined Red]
                     [UPCOMING PENDING TEXT: Muted Slate]
```

| Character State | Dark Theme (Midnight Slate) | Light Theme (Daylight Studio) | Non-Color Visual Signifier |
|---|---|---|---|
| **01. Pending (Upcoming)** | `#64748B` (Muted Slate) | `#94A3B8` (Soft Slate) | Standard regular weight text. |
| **02. Correct** | `#38BDF8` (Sky Blue) | `#0284C7` (Cobalt Blue) | Crisp luminance confirmation; high contrast. |
| **03. Incorrect** | `#EF4444` (Coral Red) | `#DC2626` (Crimson Red) | **Solid red wavy underline** (`text-decoration: underline wavy 2px`). |
| **04. Extra (Overtyped)** | `#F87171` text on `#7F1D1D` background pill | `#B91C1C` text on `#FEE2E2` background pill | Elevated background highlight chip behind extra characters. |
| **05. Active Caret** | `#2563EB` (Cobalt Blue) | `#2563EB` (Cobalt Blue) | High-visibility vertical bar (3px width) or smooth block. |

---

### 3.3 Dynamic Caret Physics & Smooth Motion
- **Dimensions:** Width `3px`, Height `34px`, corner radius `1.5px`.
- **Motion Dynamics:** When typing progresses, the caret does not jump instantaneously. It uses a **50ms CSS transform transition** (`transform: translate3d(x, y, 0) cubic-bezier(0.2, 0.8, 0.2, 1)`), producing a fluid, liquid gliding sensation.
- **Blinking Behavior:**
  - *Idle (Ready State):* Pulses smoothly at `1.0 Hz` (`opacity: 1` $\longleftrightarrow$ `opacity: 0.2`).
  - *Active Typing:* **Blinking is automatically suppressed** while keystrokes are actively arriving, remaining solidly visible (`opacity: 1`) to eliminate visual flutter.
  - *Custom Caret Styles (Configurable in Settings):* Standard Bar (`|`), Smooth Block (`█`), or Terminal Underline (`_`).

---

### 3.4 3-Line Smooth Auto-Scrolling Window
To completely eliminate jarring page jumps or layout reflows while reading:
1. The canvas displays exactly **3 active lines** within a 220px fixed-height viewport.
2. The user always types on **Line 2 (Vertical Center)**:
   - *Line 1 (Above):* Previously typed words, displayed at `40% opacity` as historical context.
   - *Line 2 (Center):* Active line containing the current word and active caret.
   - *Line 3 (Below):* Upcoming preview line, displayed at `70% opacity` for parafoveal lookahead.
3. **Smooth Scroll Trigger:** When the active caret reaches the final word of Line 2 and presses `Space`, the container triggers a **180ms smooth vertical translateY scroll**:
   - Line 1 smoothly scrolls upward out of view.
   - Line 2 shifts smoothly to the top position (Line 1).
   - Line 3 shifts smoothly to the center position (Line 2) and receives the active caret.
   - A fresh line of text fades into the bottom position (Line 3).
   - **Zero Eye-Tracking Disruption:** The typist's gaze remains locked at the exact same vertical focal height.

---

## 4. Live Performance HUD (Head-Up Display)

The HUD is positioned directly above the typing stream (`Row 0`, Height `64px`, Width `1100px`). It balances live performance feedback with strict anti-distraction design.

```
+-------------------------------------------------------------------------------+
|  ⏱ 0:42 REMAINING     |     68 WPM     |     98.4% ACC     |     0 ERRORS    |
|  [████████░░░░░░░░░░] | (Rolling Net)  | (Keystroke Acc)   | (Uncorrected)   |
+-------------------------------------------------------------------------------+
```

### 4.1 Refresh Cadence & Anti-Distraction Throttling
- **The Problem:** Re-rendering numbers on every single keystroke causes high-frequency numeric flickering (e.g. jumping between 67, 72, 69 WPM 10 times a second), which pulls visual attention away from the text stream.
- **The Solution (Throttled Telemetry):**
  - **Speed (WPM):** Recomputed continuously in-memory, but the UI display is **throttled to update once every 500ms** with smooth numeric interpolation.
  - **Accuracy (%):** Updated every 500ms alongside WPM.
  - **Timer:** Decrements smoothly once per second (`1.0s` intervals) using `tabular-nums` monospace formatting.
  - **Error Counter:** Increments instantaneously upon an incorrect stroke to provide immediate tactile-optical feedback.

### 4.2 HUD Metric Definitions
1. **Time Remaining:** High-contrast countdown (`0:42`) paired with a slim horizontal progress track (`Height: 4px`, `#2563EB` fill).
2. **Current Rolling Net WPM:** Standardized Net WPM calculated over the trailing 10 seconds of active typing.
3. **Accuracy Percentage:** Current cumulative keystroke precision ($Correct / Total \times 100$).
4. **Uncorrected Errors:** Real-time tally of erroneous characters currently active in the text buffer.

### 4.3 Zen Mode (HUD Hidden)
Users who experience performance anxiety or desire a pure minimalist typing screen can press **`F8`** or **`Ctrl + Shift + H`** (or click the HUD visibility icon). This cleanly hides the entire top HUD, leaving only a hairline progress bar at the very top of the window.

> [!NOTE]
> The shortcut was explicitly updated from `Shift + H` to `F8` / `Ctrl + Shift + H` because typing capital letters in English prose requires the `Shift + H` key combination. The new accelerator guarantees zero conflict with standard character typing.

---

## 5. Keyboard Visualization (65% Pastel Mechanical)

Positioned below the typing stream (`Row 2`, Height `260px`, Width `920px`).

```
+-------------------------------------------------------------------------------+
|  [Esc] [ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][ 9 ][ 0 ][ - ][ = ][Backspace]|
|  [Tab]  [ Q ][ W ][ E ][*R*][ T ][ Y ][ U ][ I ][ O ][ P ][ [ ][ ] ][ \ ]    |
|  [Caps]  [ A ][ S ][ D ][ F ][ G ][ H ][ J ][ K ][ L ][ ; ][ ' ][ Enter ]     |
|  [Shift]   [ Z ][ X ][ C ][ V ][ B ][ N ][ M ][ , ][ . ][ / ]  [Shift][ ▲ ]   |
|  [Ctrl][Win][Alt][           SPACEBAR           ][Alt][Fn][ ◄ ][ ▼ ][ ► ]     |
+-------------------------------------------------------------------------------+
```

### 5.1 Mechanical Visual Language
- **Form Factor:** 65% ANSI Standard US-QWERTY layout (compact, gaming-inspired, includes dedicated arrow cluster).
- **Keycap Profile:** DSA Uniform Profile (flat, concave spherical top surface, non-sculpted height).
- **Material Aesthetic:** Textured matte PBT finish with crisp dye-sublimated legends (`JetBrains Mono Semi-Bold 12px`).
- **Tactile Landmarks:** Distinct tactile homing ridges rendered on the **`F`** and **`J`** keycaps.

### 5.2 Dynamic Next-Key Illumination
- As the user types, the keycap corresponding to the **next expected character** is illuminated:
  - Keycap outline glows in **`#2563EB` (Cobalt Blue, 2px border)**.
  - Legend shifts to bold white with a subtle 15% electric blue surface tint.
  - If the user strikes an incorrect key, the struck keycap briefly flashes coral red (`#EF4444`) for 120ms before returning to neutral.

### 5.3 Finger-Zone Color Mapping (Subdued Pastel Palette)
To teach touch-typing finger assignments without visual chaos, the keyboard uses a muted pastel color scheme:

| Finger Assignment | Keycaps Covered | Dark Theme Tint | Light Theme Tint |
|---|---|---|---|
| **Left Pinky** | `1, Q, A, Z, Left Shift, Tab` | Pastel Rose (`rgba(244, 63, 94, 0.15)`) | Pastel Rose (`#FFE4E6`) |
| **Left Ring** | `2, W, S, X` | Pastel Peach (`rgba(251, 146, 60, 0.15)`) | Pastel Peach (`#FFEDD5`) |
| **Left Middle** | `3, E, D, C` | Pastel Amber (`rgba(245, 158, 11, 0.15)`) | Pastel Amber (`#FEF3C7`) |
| **Left Index** | `4, 5, R, T, F, G, V, B` | Pastel Emerald (`rgba(16, 185, 129, 0.15)`) | Pastel Emerald (`#D1FAE5`) |
| **Thumbs** | `Spacebar` | Pastel Cobalt (`rgba(37, 99, 235, 0.15)`) | Pastel Cobalt (`#DBEAFE`) |
| **Right Index** | `6, 7, Y, U, H, J, N, M` | Pastel Teal (`rgba(20, 184, 166, 0.15)`) | Pastel Teal (`#CCFBF1`) |
| **Right Middle** | `8, I, K, ,` | Pastel Cyan (`rgba(6, 182, 212, 0.15)`) | Pastel Cyan (`#CFFAFE`) |
| **Right Ring** | `9, O, L, .` | Pastel Indigo (`rgba(99, 102, 241, 0.15)`) | Pastel Indigo (`#E0E7FF`) |
| **Right Pinky** | `0, -, =, P, [, ], ;, ', /, Enter`| Pastel Violet (`rgba(139, 92, 246, 0.15)`) | Pastel Violet (`#EDE9FE`) |

### 5.4 Space Conservation & Collapsible Mechanics
- On standard displays ($\ge 900\text{px}$ height), the keyboard sits comfortably below the typing stream.
- On compact displays ($720\text{p}$ HD) or when the user toggles it off (`F2` or UI button), the keyboard visualizer smoothly collapses downward (`height: 0`, `opacity: 0`), dedicating full vertical space to the text stream.
- Keyboard visualization is **strictly optional**: typists can complete any test with it collapsed, and animations or visual guidance are non-mandatory.

---

## 6. In-Arena Controls & Robust Pause/Resume Architecture

### 6.1 Pause and Resume Multi-Stage Lifecycle

```
  [ ACTIVE TYPING ]
         |
         | Press 'Esc'
         v
  [ 01. INITIAL PAUSE ]: Monotonic timer halts instantly; T_pause_start logged;
                         typing buffer locks; canvas backdrop blurs; dimming lifts.
         |
         | Click 'Resume' / Press 'Esc' / Press Space on 'Resume'
         v
  [ 02. 3-SECOND COUNTDOWN ]: Pause modal closes; 3... 2... 1... GO! overlay displays;
                              timer remains frozen; early keystrokes are suppressed.
         |
         | Countdown Reaches 'GO!' (0.0s)
         v
  [ 03. TIMER RESUMPTION ]: Delta added to Σ T_paused; monotonic timer resumes;
                            dimming re-engages to 20% opacity.
         |
         v
  [ 04. FOCUS RESTORATION ]: Focus automatically returned to hidden typing capture target;
                             caret unfreezes and flows on next keypress.
```

- **Repeated Pauses & Integrity Limits:**
  - $\Delta T_{pause}$ accumulates across all pause events: $\sum T_{paused} = \sum (T_{pause\_end} - T_{pause\_start})$.
  - For official 60s benchmark runs, a maximum of **2 pause events** and **$\le 60\text{ seconds}$ cumulative pause duration** is permitted. Exceeding either limit marks the session as `pbEligible: false` to prevent memorization or split-time gaming.
- **Exit While Paused:**
  - If the user selects `"Exit to Configuration"` or `"Return to Dashboard"` while in the pause modal, the active session is cleanly terminated without saving partial or corrupted telemetry.
- **Strict Keyboard Convention:** While paused, `Space` and `Enter` actuate the currently focused dialog button (`Resume`, `Restart`, or `Exit`). `Tab` navigates through dialog controls.

### 6.2 Discard & Restart Confirmation Modal
- **Quick Restart Shortcut:** Standardized on **`F5`** or **`Ctrl + R`** (or the on-screen "Restart" button).
- **Accidental Discard Protection:**
  - If active elapsed time $> 10\text{ seconds}$, pressing `F5` / `Ctrl + R` opens a confirmation modal:
    > *"Restart active benchmark? Your current run of 74 WPM will be discarded."*
    > Actions: `[ Discard & Restart (Enter) ]`  •  `[ Keep Typing (Esc) ]`
  - If elapsed time $\le 10\text{ seconds}$, restart executes instantly with zero confirmation overhead, supporting rapid warm-up restarts.
