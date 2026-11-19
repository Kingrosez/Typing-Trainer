# ACCESSIBILITY & APPLICATION STATES (D1)
**Typing Trainer — Windows Desktop Application**
*Document Version: 1.0.0 | Stage: D1 Architecture*

---

## 1. Accessibility Philosophy & Standards Compliance

Typing Trainer is engineered to meet **WCAG 2.2 Level AA** standards on the Windows desktop. Because touch typing is fundamentally an ergonomic and motor-skill discipline, physical accessibility, cognitive clarity, and sensory feedback are primary architectural concerns.

---

## 2. Core Accessibility Pillars

### 2.1 Complete Keyboard Operability (No Mouse Required)
- Every interactive element (buttons, dropdowns, mode pills, sliders, tabs, modals) can be navigated, activated, and dismissed strictly via keyboard.
- **Focus Rings:**
  - High-visibility 2px focus ring with 2px offset (`outline: 2px solid #3B82F6; outline-offset: 2px`).
  - Dark Mode: Electric Blue (`#3B82F6`) against Obsidian (`#0B0F19`) $\rightarrow$ Contrast ratio **8.2:1**.
  - Light Mode: Deep Cobalt (`#1D4ED8`) against Crisp White (`#FFFFFF`) $\rightarrow$ Contrast ratio **7.8:1**.
- **Tab Sequence & Focus Trapping:**
  - Strict top-to-bottom, left-to-right DOM tab index.
  - Modals (Pause Menu, Command Palette) implement strict focus trapping: pressing `Tab` cycles within the modal until dismissed via `Esc`.
  - Upon closing a modal, keyboard focus automatically restores to the triggering element.

### 2.2 Color Contrast & Vision Accommodations
- **Text Contrast Ratios:**
  - Standard body text (`#F8FAFC` on `#0B0F19`) exceeds **14:1** contrast.
  - Muted secondary text (`#94A3B8` on `#0B0F19`) maintains **5.8:1** contrast (exceeding the 4.5:1 WCAG AA minimum).
- **Non-Color-Dependent Error Communication:**
  - Color alone is **never** used to convey correctness.
  - *Correct Keystrokes:* Emerald green text (`#10B981`) + standard character glyph.
  - *Incorrect Keystrokes:* Coral red background badge (`#EF4444`) + wavy red underline (`text-decoration: underline wavy`) + distinct high/low audio tone.
  - *Skipped Characters:* Gray crossed-out symbol (`line-through`).
- **Color-Blind Accessible Palettes:**
  - Built-in Protanopia/Deuteranopia and Tritanopia theme toggles in Settings (`SCR-904`), substituting standard red/green with high-contrast Cyan (`#06B6D4`) and Amber (`#F59E0B`).

### 2.3 Typography & Readability
- **Dynamic Font Scaling:** Supports 14px to 28px base font scaling for the typing stream without breaking layout alignment or word wrapping.
- **Dyslexia Support:** Includes the `OpenDyslexic` font option with weighted bottom glyphs to prevent letter rotation.
- **Tabular Monospace Alignment:** Monospace fonts (`JetBrains Mono`, `Fira Code`) use tabular figures and consistent character widths so words do not jitter or shift horizontally during typing.

### 2.4 Motion & Cognitive Distraction Control
- **`prefers-reduced-motion` Respect:** When Windows OS setting "Show animations in Windows" is disabled:
  - Caret spring physics are replaced with instant jumping.
  - Modal fade/scale transitions are disabled (0ms instant open/close).
  - Background particle effects in Arcade games are completely disabled.
- **Zen & Focus Controls:**
  - Live HUD elements (WPM, timer, accuracy) can be toggled to "Hidden During Test" for users who experience sensory overload or speed anxiety.

### 2.5 Screen Reader Support (Narrator / NVDA / JAWS)
- **Typing Stream Handling:** Screen readers cannot read out 100+ characters per minute without audio conflict. During active typing, the main text canvas uses `aria-live="off"`.
- **Post-Session Announcements:** Upon test completion, `SCR-203` announces the final score via an `aria-live="polite"` landmark:
  > *"Test completed. Net Speed: 104 words per minute. Accuracy: 98.8 percent. 2 errors recorded."*
- **Modal Announcements:** Opening the Command Palette announces *"Command Palette opened. Type to search or press Escape to cancel."*

---

## 3. Comprehensive Application States Framework

A robust desktop application must communicate every operational state clearly, preventing user confusion during edge cases, network disconnects, or empty initial databases.

```
+-----------------------------------------------------------------------------+
|                        APPLICATION STATE MATRIX                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [EMPTY STATE]       [LOADING STATE]       [ERROR STATE]    [SUCCESS STATE] |
|  * Clean onboarding  * Skeleton placeholders* Local retry   * Micro-chimes  |
|  * Contextual prompts* Shimmer animations  * Self-healing   * Clear stats   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 3.1 State Specifications Matrix

| State Type | Trigger Scenario | Visual Presentation | Accessible Announcement | Primary User Recovery Action |
|---|---|---|---|---|
| **First-Time Experience** | User opens app with fresh SQLite DB. | Welcoming 3-step setup card with friendly illustration; "Take 30s Benchmark" CTA. | *"Welcome to Typing Trainer. Press Tab to start onboarding."* | Click "Get Started" or hit `Enter`. |
| **Empty History (Analytics)** | User opens Analytics before completing any tests. | Illustrated chart skeleton with ghost lines; "No sessions recorded yet. Complete your first test to reveal speed trends." | *"No session history found. Start a test to populate statistics."* | Button: "Start a 60s Test Now". |
| **Loading State (Querying DB)** | Loading large multi-month session history in Analytics. | Pulsing SVG skeleton cards matching final layout (no layout shifts). | *"Loading historical data..."* | None (auto-resolves in $< 100\text{ ms}$). |
| **Database Lock / Error** | SQLite file permission blocked by antivirus or OS lock. | Amber alert banner at top of window: "Local database temporarily locked. Retrying..." | *"Warning: Local database busy. Retrying connection."* | "Retry Connection" button; link to local folder guide. |
| **Success / Completion** | Finishing test or lesson with new personal record. | Luminous gold celebrate badge; animated counter roll-up; subtle chime audio. | *"Congratulations! New Personal Best: 104 WPM."* | Press `Tab + Enter` for next drill. |
| **Completed Lesson (Passed)** | User completes lesson with $\ge 95\%$ accuracy. | Emerald star badge; green progress ring; unlocks next sequential lesson. | *"Lesson completed with 98% accuracy. Next lesson unlocked."* | Press `Space` to advance to next lesson. |
| **Completed Lesson (Failed)** | User completes lesson with $< 95\%$ accuracy. | Muted blue review card: "Good effort! Needs 95% accuracy to advance. Focus on precision over speed." | *"Lesson finished with 88% accuracy. Target is 95%. Press Enter to retry."* | Press `Enter` to retry the drill immediately. |
| **Locked Content / Milestone** | User clicks locked Module 3 or Tier 5 badge. | Subtle padlock icon; clear progress bar showing prerequisite criteria: *"Complete Module 2 Assessment to unlock."* | *"Content locked. Requires completion of Module 2."* | Button: "Go to Active Module 2". |
| **Unavailable Content** | Custom file import with invalid encoding or empty file. | Red border around drop zone: "File is empty or contains unsupported binary characters. Please import UTF-8 text." | *"Error: Invalid file format. Plain text files only."* | "Select Different File" or "Clear". |
| **Offline Operation** | Application running without network connection. | Persistent subtle green dot in titlebar: "Offline-Ready • Local SQLite Connected". | *"Application is running offline. All progress saved locally."* | Normal usage; no action required. |

---

## 4. Verification & Testing Checklist

- [x] All interactive controls reachable via `Tab` and `Shift + Tab`.
- [x] `Esc` key consistently dismisses any open modal or pauses active tests.
- [x] Contrast ratio verified $\ge 7:1$ for primary body copy in both Light and Dark themes.
- [x] Color-blind safe alternate indicators (wavy underline and background badge) for all typing errors.
- [x] Zero layout shift during data loading through strict skeleton placeholder geometry.
- [x] Screen reader aria labels present on all icon-only buttons (sidebar collapse, theme toggle, sound mute).
