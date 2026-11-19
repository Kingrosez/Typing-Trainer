# TYPOGRAPHY SPECIFICATION (D2)
**Typing Trainer — Windows Desktop Application**
*Document Version: 1.0.0 | Stage: D2 Design System*

---

## 1. Typographic Architecture

Typing Trainer pairs a clean, modern geometric sans-serif for desktop UI and navigation with an ultra-legible, tabular monospaced typeface for the typing canvas, code syntax, and real-time numeric telemetry.

### 1.1 Font Family Hierarchy
1. **Primary UI Font (`Inter`):**
   - Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
   - Used for all navigation, headings, cards, buttons, badges, and documentation.
2. **Monospace & Telemetry Font (`JetBrains Mono`):**
   - Fallback: `"Fira Code", Consolas, "Courier New", monospace`.
   - Features tabular figures (`font-variant-numeric: tabular-nums`) so that high-frequency numeric counters (WPM ticking from 99 to 100, timer counting from 0:10 to 0:09) never cause horizontal layout jitter.
   - Distinct character glyphs prevent confusion between `0` (slashed zero) and `O`, `1` (serifed) and `l` (lowercase L) or `I` (uppercase i).
3. **Dyslexic Support Font (`OpenDyslexic`):**
   - User-selectable in Settings (`SCR-904`) for neurodivergent and dyslexic typists. Features weighted bottoms to anchor letters and reduce visual crowding.

---

## 2. Complete Typographic Scale

| Style Level | Font Family | Size (px / rem) | Line Height | Weight | Letter Spacing | Primary Usage Context |
|---|---|---|---|---|---|---|
| **Display / Hero** | `Inter` | 36px / 2.25rem | 44px (1.22) | Bold (700) | -0.02em | Celebration milestones, Level up titles |
| **Numeric Hero** | `JetBrains Mono` | 32px / 2.00rem | 36px (1.12) | Bold (700) | Tabular (0) | Hero WPM and Accuracy on Results screen |
| **Heading 1** | `Inter` | 26px / 1.625rem | 34px (1.30) | Bold (700) | -0.015em | Top-level module titles (Dashboard, Test) |
| **Heading 2** | `Inter` | 20px / 1.25rem | 28px (1.40) | Semi-Bold (600)| -0.01em | Card headers, section dividers |
| **Heading 3** | `Inter` | 16px / 1.00rem | 24px (1.50) | Semi-Bold (600)| 0 | Widget titles, modal dialog headers |
| **Subtitle** | `Inter` | 14px / 0.875rem | 20px (1.42) | Medium (500) | 0 | Sub-headings, explanatory header copy |
| **Typing Stream (Base)** | `JetBrains Mono` | 24px / 1.50rem | 40px (1.66) | Medium (500) | 0.05em | Primary interactive text canvas |
| **Typing Stream (Code)** | `JetBrains Mono` | 16px / 1.00rem | 26px (1.62) | Regular (400) | 0 | Developer mode multi-line syntax blocks |
| **Body Large** | `Inter` | 15px / 0.937rem | 22px (1.46) | Regular (400) | 0 | Onboarding reading passages, guides |
| **Body (Default)** | `Inter` | 13px / 0.812rem | 18px (1.38) | Regular (400) | 0 | Standard UI copy, tooltips, descriptions |
| **Body Small** | `Inter` | 12px / 0.75rem | 16px (1.33) | Regular (400) | +0.01em | Table data rows, card subtext |
| **Caption / Helper** | `Inter` | 11px / 0.687rem | 14px (1.27) | Medium (500) | +0.02em | Keyboard shortcut helpers (`Tab + Enter`) |
| **HUD Stat Label** | `Inter` | 10px / 0.625rem | 12px (1.20) | Bold (700) | +0.05em uppercase | Telemetry labels ("WPM", "ERRORS") |

---

## 3. Numeric & Telemetry Rules

To ensure rock-solid visual stability during real-time typing:
1. **Always Tabular:** Numeric counters must apply CSS `font-variant-numeric: tabular-nums` or Tailwind class `tabular-nums`. Every digit shares identical horizontal bounding width.
2. **Fixed Unit Offsets:** Unit abbreviations (e.g., "WPM", "%", "s") are rendered as separate sibling text nodes with fixed margins rather than concatenated into the number string, preventing text reflow as the number changes digit length.
3. **Subpixel Antialiasing:** Typography on Windows desktop rendering uses CSS `font-feature-settings: "rlig" 1, "calt" 1; -webkit-font-smoothing: antialiased;` to ensure crisp letterforms across high-DPI scaling (100%, 125%, 150%, 200%).
