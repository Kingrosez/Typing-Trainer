# DASHBOARD INTERACTIONS & MICRO-INTERACTIONS (D3)
**Typing Trainer — Windows Desktop Application**
*Screen ID: SCR-101 | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D3 Dashboard Design*

---

## 1. Overview of Dashboard Interaction Model

The Dashboard Command Center is designed for frictionless keyboard-first control alongside intuitive mouse navigation. Micro-interactions balance mechanical desktop precision with modern gaming visual flair.

---

## 2. Interaction Specifications by Feature

### 2.1 Sidebar Navigation Interaction
- **Expanded State (Default):**
  - Hover: Background highlights to `rgba(255, 255, 255, 0.05)` (Dark) / `rgba(0, 0, 0, 0.04)` (Light) with a 150ms ease-out transition.
  - Active Route: The Dashboard row displays a 3px solid `#2563EB` left border, 15% blue tint fill, and bold white text (`#FFFFFF`).
  - Click: Transitions instantly without full page reloads.
- **Collapsed State (Icon Rail 68px):**
  - Toggled via `Ctrl + B` or the bottom collapse button.
  - Hovering an icon unfurls a floating tooltip within 150ms: displays destination title and shortcut (e.g. `"Typing Test [Ctrl + 2]"`).
- **Keyboard Navigation:**
  - `Ctrl + 1` jumps directly to Dashboard.
  - `Ctrl + 2` to `Ctrl + 8` jump directly to other modules.
  - `Arrow Up / Down` cycles focus through sidebar items.

### 2.2 Theme Switching Interaction
- **Trigger:** Moon / Sun icon in custom titlebar, or global shortcut **`Ctrl + Shift + T`**.
- **Behavior:**
  - Instant CSS class swap on root `<html>` element (`.dark` $\longleftrightarrow$ `.light`).
  - Transition duration: `150ms ease-in-out` on background and text colors to prevent jarring flashes.
  - Local SQLite settings table immediately persists user preference (`theme: "dark"` or `"light"`).

### 2.3 "Start Typing Test" & Quick Action Flows
- **Strict Accessibility Focus Model:**
  - `Space` and `Enter` activate **only the currently focused interactive element** in accordance with WAI-ARIA and desktop OS accessibility standards.
  - There are **no unprompted global keystroke triggers** for launching practice sessions. Pressing `Space` while scrolling or navigating will never inadvertently start a timer.
  - On initial Dashboard load, focus is placed on a hidden accessible skip-link or the primary "Start Typing Test" CTA button. Hitting `Enter` or `Space` activates that specific focused button.
  - Clicking the "Start Typing Test" card (`Card 1` in Row 4) routes immediately to `SCR-201`, focusing the typing canvas.
- **Micro-Interactions on Quick Action Cards:**
  - Resting: Border 1px `#1E293B`, subtle card background.
  - Hover: Card lifts 2px (`transform: translateY(-2px)`), border shifts to luminous `#2563EB`, background shifts to `#162035`.
  - Active Press: Card depresses 1px (`translateY(0)`), creating a tactile physical switch feel.
  - Keyboard Focus: Standard 2px solid `#2563EB` outline with 2px offset. Hitting `Enter` or `Space` triggers navigation.

### 2.4 "Practice Weak Keys" Recommendation Flow
- **Trigger:** Focused button activation on Widget 06 (`Enter` / `Space`) or mouse click.
- **Behavior:**
  1. The Dashboard packages the top 3 problem keys (`R`, `T`, `P`).
  2. Routes directly to `SCR-402` (Weak-Key Remediation Stage).
  3. The typing canvas is pre-seeded with an algorithmically generated 3-minute drill emphasizing words and bigrams containing those letters (e.g. `practice sprint proper return report`).

### 2.5 Weekly Activity & WPM Trend Chart Telemetry
- **Mouse Hover on WPM Curve:**
  - Moving the cursor across the Recharts curve snaps a vertical indicator line to the nearest session node.
  - Floating Tooltip: Appears 8px above the data node displaying Session Number, Date/Time, Net WPM (e.g. `72 WPM`), Accuracy (`98.4%`), and Errors (`2`).
- **Mouse Hover on Weekly Day Columns:**
  - Hovering a day bar highlights the column with a 20% blue tint.
  - Tooltip reveals: Day name, Total minutes typed, Target status (`✓ Goal Reached (24/20 mins)` or `- Rest Day`).

---

## 3. Keyboard Accelerator Map for Dashboard

All shortcuts follow unambiguous, non-conflicting Windows desktop application conventions:

| Key Binding | Scope | Action Executed | Accessibility / OS Alignment |
|---|---|---|---|
| `Tab` / `Shift + Tab` | Dashboard Stage | Moves focus sequentially through interactive elements. | Standard desktop focus sequence |
| `Enter` / `Space` | Focused Element | Actuates the currently focused button, tab, or card. | Standard WCAG keyboard interaction |
| `Ctrl + K` | Global | Opens Command Palette search overlay. | Universal desktop quick-launcher |
| `Ctrl + B` | Global | Toggles Sidebar (Expanded 240px $\longleftrightarrow$ Collapsed 68px). | Standard developer/IDE shortcut |
| `Ctrl + Shift + T` | Global | Toggles Visual Theme (Dark $\longleftrightarrow$ Light). | Custom application toggle |
| `Ctrl + 1` | Global | Jumps directly to Dashboard (`/dashboard`). | Numeric module accelerator |
| `Ctrl + 2` | Global | Jumps directly to Typing Test (`/test`). | Numeric module accelerator |
| `Ctrl + 3` | Global | Jumps directly to Learning Mode (`/learning`). | Numeric module accelerator |
| `Ctrl + 4` | Global | Jumps directly to Skill Drills (`/drills`). | Numeric module accelerator |
| `Ctrl + 5` | Global | Jumps directly to Developer Mode (`/developer`). | Numeric module accelerator |
| `Ctrl + 6` | Global | Jumps directly to Typing Games (`/games`). | Numeric module accelerator |
| `Ctrl + 7` | Global | Jumps directly to Analytics (`/analytics`). | Numeric module accelerator |
| `Ctrl + 8` | Global | Jumps directly to Achievements (`/achievements`). | Numeric module accelerator |
| `Ctrl + ,` | Global | Jumps directly to Settings (`/settings`). | Standard Windows app settings |
| `Esc` | Modal / Overlay | Closes active modal, popover, or dropdown; restores focus. | Standard dialog cancellation |

---

## 4. Focus Ring & Accessibility Motion

- **Focus Ring Standard:** Every interactive button, card, and tab displays a high-visibility **2px solid `#2563EB`** outline with a **2px offset** upon keyboard tab selection.
- **Reduced Motion:** If `prefers-reduced-motion` is enabled:
  - Card hover translateY translations are disabled (`transform: none`).
  - Recharts curve draws immediately without initial stroke-dashoffset animation.
  - Progress ring endpoint glow maintains steady illumination without pulsating.
