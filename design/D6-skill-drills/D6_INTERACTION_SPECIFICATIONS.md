# D6 INTERACTION SPECIFICATIONS: SKILL DRILLS & REMEDIATION STUDIO
**Typing Trainer — Windows Desktop Application**
*Screen IDs: SCR-401, SCR-402, SCR-403, SCR-404, SCR-405*
*Document Version: 1.0.0 | Stage: D6 Stage 2 UX and Functional Specifications*
*Date: 2026-11-18 | Status: SPECIFICATION COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Focus Governance & Desktop Interaction Standards

All five D6 screens adhere strictly to the desktop accessibility focus rules established in D1, D3, D4, and D5:
1. **Uninterrupted Flow State:** A typist can navigate from the Studio Overview (`SCR-401`), inspect weak keys in the Analysis Lab (`SCR-402`), configure a drill (`SCR-403`), complete an arena session (`SCR-404`), and review the improvement scorecard (`SCR-405`) **entirely via keyboard without touching the mouse**.
2. **Context-Aware `Space` and `Enter`:**
   - Outside the active typing canvas (`SCR-401`, `SCR-402`, `SCR-403`, `SCR-405`), `Enter` and `Space` actuate only the currently focused interactive element.
   - Inside the active typing canvas (`SCR-404`), `Space` acts strictly as the word delimiter and input commit key.
   - Pressing `Space` or `Enter` from an un-focused state **never** accidentally launches sessions.
3. **Dedicated, Non-Conflicting Accelerators:** Standardized on function keys (`F1`, `F2`, `F5`, `F11`) and control keys (`Esc`, `Ctrl + 1..4`, `Ctrl + K`) to prevent collisions with character input.

---

## 2. Comprehensive Master Keyboard Accelerator Matrix

| Key Accelerator | Screen Scope | Target Action Executed | Desktop Convention & Accessibility Alignment | Verification Status |
|---|---|---|---|---|
| **`Enter`** | `SCR-401`, `SCR-402`, `SCR-403`, `SCR-405` | Actuates focused button (e.g. "Drill Weak Keys", "Begin Practice", "Next Drill"). | Standard WCAG button actuation | **Design Spec Verified** |
| **`Space`** | `SCR-401`, `SCR-402`, `SCR-403`, `SCR-405` | Actuates focused checkbox, toggle, or secondary button control. | Standard WCAG control actuation | **Design Spec Verified** |
| **`Space`** | `SCR-404` (Arena) | Commits current word buffer and advances caret to next word. | Standard typing input behavior | **Design Spec Verified** |
| **`Tab` / `Shift + Tab`** | All Screens | Cycles focus sequentially through focusable interactive controls. | Universal accessibility focus traversal | **Design Spec Verified** |
| **`Arrow Keys`** | `SCR-401`, `SCR-402`, `SCR-403` | Navigates between mode cards, keyboard keycaps, and configuration tabs. | ARIA grid and tablist keyboard patterns | **Design Spec Verified** |
| **`Esc`** | `SCR-404` (Arena) | Halts session timer, blurs canvas, and opens the Pause Modal. | Standard desktop/gaming pause convention | **Design Spec Verified** |
| **`Esc`** | `SCR-402`, `SCR-403` | Returns up one level in the hierarchy to Studio Overview (`SCR-401`). | Standard hierarchical back-navigation | **Design Spec Verified** |
| **`F1`** | `SCR-404` (Arena) | Toggles floating finger hints overlay above the active caret. | Function key toggle; free of OS conflicts | **Design Spec Verified** |
| **`F2`** | `SCR-404` (Arena) | Collapses / expands the mini mechanical keyboard visualizer. | Function key toggle; free of OS conflicts | **Design Spec Verified** |
| **`F11`** | `SCR-404` (Arena) | Toggles Zen Mode (collapses sidebar, header, and HUD). | Desktop distraction-free view toggle | **Design Spec Verified** |
| **`F5` / `Ctrl + R`** | `SCR-404` (Arena) | Prompts drill stage restart (guarded by >10s confirmation dialog). | Universal refresh accelerator (Intercepted) | **Awaiting Claude Code Runtime Test** |
| **`Ctrl + Shift + R` / `Alt + R`** | `SCR-404` (Arena) | Safe fallback drill stage restart accelerator. | Safe non-browser reload accelerator | **Awaiting Claude Code Runtime Test** |
| **`Ctrl + 1`** | All Screens | Global navigation jump to Dashboard Command Center (`SCR-101`). | Global module numeric accelerator | **Design Spec Verified** |
| **`Ctrl + 2`** | All Screens | Global navigation jump to Typing Test Arena (`SCR-201`). | Global module numeric accelerator | **Design Spec Verified** |
| **`Ctrl + 3`** | All Screens | Global navigation jump to Learning Mode Roadmap (`SCR-301`). | Global module numeric accelerator | **Design Spec Verified** |
| **`Ctrl + 4`** | All Screens | Global navigation jump to Skill Drills Studio Overview (`SCR-401`). | Global module numeric accelerator | **Design Spec Verified** |
| **`Ctrl + Shift + T`** | All Screens | Toggles application visual theme (Dark $\longleftrightarrow$ Light). | Global theme accelerator | **Design Spec Verified** |
| **`Ctrl + K`** | All Screens | Opens Command Palette quick launcher. | Universal desktop quick-search launcher | **Design Spec Verified** |

---

## 3. Desktop Runtime & Tauri/WebView2 Accelerator Interception

### 3.1 The Desktop WebView Reload Risk
In Windows WebView2 (the desktop web runtime utilized by Tauri 2), `F5` and `Ctrl + R` trigger native page reloads (`Reload()`). In a single-page React desktop application, an unintercepted reload destroys the in-memory React component tree, resetting ephemeral drill telemetry and discarding session progress.

### 3.2 Corrective Technical Architecture (D5 Alignment)
1. **Frontend Capture-Phase Trap:**
   - A top-level keydown listener attached to `window` with `{ capture: true }` intercepts `F5` and `Ctrl + R`:
     ```typescript
     window.addEventListener('keydown', (e) => {
       if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
         e.preventDefault();
         handleDrillRestartPrompt();
       }
     }, { capture: true });
     ```
2. **Rust Desktop Window Layer:**
   - During Tauri 2 window initialization in Rust, native browser accelerator keys must be disabled at the WebView2 settings level:
     ```rust
     // src-tauri/src/main.rs (Implementation note for Claude Code)
     webview_builder.with_webview(|webview| {
       unsafe {
         webview.controller().CoreWebView2Settings()?
           .put_AreBrowserAcceleratorKeysEnabled(FALSE)?;
       }
       Ok(())
     });
     ```
3. **Ten-Second Discard Confirmation Guard:**
   - If active elapsed practice time in `SCR-404` is **$\le 10\text{ seconds}$**, pressing `F5` / `Ctrl + R` restarts the drill stage instantaneously.
   - If active elapsed practice time is **$> 10\text{ seconds}$**, a modal confirmation dialog is rendered:
     `"Discard active drill progress and restart? [Enter: Confirm / Esc: Cancel]"`
   - This prevents accidental finger slips from destroying meaningful practice data.
4. **Modal Focus Awareness:**
   - When any modal (e.g. Pause Modal, Confirmation Dialog, Settings) is open, `F5` and `Ctrl + R` are strictly suppressed to avoid resetting state behind the overlay.
5. **Safe Fallbacks:**
   - An always-visible, keyboard-focusable `"Restart Stage"` button is provided in the arena toolbar.
   - Secondary conflict-free accelerators **`Ctrl + Shift + R`** and **`Alt + R`** are supported.

---

## 4. Screen-by-Screen Micro-Interactions

### 4.1 SCR-401: Studio Overview Micro-Interactions
- **Health Radial Gauge Animation:** On page load, the radial progress ring smoothly animates from $0\%$ to the user's current health score over $400\text{ms}$ (`ease-out-cubic`).
- **Watchlist Card Hover:** Hovering over a weak key row lifts the row by `1px`, changes the background to `#1E293B`, and reveals a direct `"Quick Drill"` arrow icon.
- **Finger-Zone Bar Hover:** Hovering over any finger bar highlights the corresponding keys on the miniature keyboard preview with a subtle pulse.

### 4.2 SCR-402: Weak-Key Analysis Lab Micro-Interactions
- **Keyboard Heatmap Keycap Hover:**
  - Hovering over any keycap renders an instantaneous floating tooltip (`100ms` delay) displaying:
    `[ Key 'P' | Error Rate: 12.4% | Opportunities: 89 | Top Miskey: 'O' (62%) ]`.
  - The keycap scales up by $1.05\times$ with a `2px solid #2563EB` highlight ring.
- **Keycap Click / Key Press:**
  - Clicking any keycap (or typing that letter on the physical keyboard while viewing the heatmap) selects that key in the **Key Inspector** card.
  - The confusion matrix table updates with a smooth $120\text{ms}$ crossfade.

### 4.3 SCR-403: Drill Configuration Micro-Interactions
- **Mode Tab Switching:**
  - Switching between "Weak-Key Remediation", "N-Grams", "Vocabulary Tiers", and "Custom Import" updates the live passage preview in real-time ($80\text{ms}$ debounce).
- **Target Key Chip Addition:**
  - Clicking an unselected keycap on the mini-keyboard instantly adds a removable pill to the target key bar with a spring scale-in animation (`transform: scale(0) -> scale(1)` over $150\text{ms}$).
- **Custom File Drag-and-Drop & Validation Flow:**
  - Dragging a `.txt` or `.md` file over the custom dropzone triggers a dashed Cobalt border pulse (`2px dashed #2563EB`).
  - Pre-Check: If file size exceeds 500 KB, immediately rejects file and displays red error banner: *"File exceeds 500 KB limit. Please select a shorter chapter or snippet."*
  - Encoding Validation: File bytes are strictly validated for UTF-8 conformity. If invalid byte sequences are detected, parsing halts and displays an actionable error: *"Encoding Error: File contains invalid UTF-8 byte sequences. Please re-save the file with UTF-8 encoding in your text editor and re-import."* Invalid bytes are **never silently stripped or modified**.
  - Upon valid UTF-8 decoding, text is preserved exactly and a preview of the first 3 lines is displayed. Empty files are rejected with a warning.

### 4.4 SCR-404: Skill Drill Arena Micro-Interactions
- **Caret Glide:**
  - The caret is rendered as a 3px wide vertical Cobalt bar (`#2563EB`) with a $50\text{ms}$ horizontal glide transition (`transform: translateX()`).
- **Forgiving Multi-Word Backspace:**
  - In strict alignment with D5 Decision 03, students can press `Backspace` across multiple words to delete and overwrite mistakes.
  - When backspacing past a space character, the caret smoothly retreats to the preceding word, and previously typed characters revert from Sky Blue to active editing state.
- **Stumble Warning Cue:**
  - If a student miskeys a designated target weak key twice consecutively (e.g. strikes `O` instead of `P`, then backspaces and strikes `O` again), a gentle amber warning badge pulses above the caret: `"Take your time — reach right pinky up from L"`.

### 4.5 SCR-405: Results & Verification Micro-Interactions
- **Delta Stat Rollup:** Before-and-after accuracy metrics count up smoothly over $500\text{ms}$ from historical value to drill session value.
- **Mastery Gauge Shimmer:** If a session qualifies as a verified clean session, the mastery progress segment illuminates with a golden shimmer border.
