# SPACING, LAYOUT & ELEVATION (D2)
**Typing Trainer — Windows Desktop Application**
*Document Version: 1.0.0 | Stage: D2 Design System*

---

## 1. The 4px Grid Foundation

Typing Trainer enforces a strict **4px baseline spacing grid**. Every layout dimension, margin, padding, height, and gap is an exact multiple of 4px.

### 1.1 Spacing Scale Tokens

| Token | Dimension (px) | Tailwind Utility | Primary Usage |
|---|---|---|---|
| `space-1` | 4px | `p-1`, `gap-1` | Micro-spacing, badge padding, dot margins |
| `space-2` | 8px | `p-2`, `gap-2` | Keycap gaps, button internal vertical padding |
| `space-3` | 12px | `p-3`, `gap-3` | Compact card padding, button horizontal padding |
| `space-4` | 16px | `p-4`, `gap-4` | Standard card internal padding, list gaps |
| `space-5` | 20px | `p-5`, `gap-5` | Section spacing, modal margins |
| `space-6` | 24px | `p-6`, `gap-6` | Main content stage padding, card row gaps |
| `space-8` | 32px | `p-8`, `gap-8` | Top header gutters, typing canvas internal padding |
| `space-10` | 40px | `p-10`, `gap-10`| Major container dividers, onboarding card gutters |
| `space-12` | 48px | `p-12`, `gap-12`| Hero section vertical spacing |
| `space-16` | 64px | `p-16`, `gap-16`| Wide screen canvas vertical centering margins |

---

## 2. Desktop Shell Layout Standards

Typing Trainer is optimized for standard Windows desktop resolutions:
- **Minimum Supported Window:** 1280 × 720 (720p HD).
- **Default Baseline Window:** 1440 × 900 (Widescreen standard).
- **Expanded Full HD:** 1920 × 1080 (1080p).
- **High-DPI 2K / 4K:** 2560 × 1440 and beyond.

### 2.1 Shell Structural Blueprint

```
+-----------------------------------------------------------------------------+
|  CUSTOM WINDOW TITLEBAR: Height 36px fixed                                  |
+-----------------------------------------------------------------------------+
|  SIDEBAR:              |  MAIN VIEWPORT: Fluid width                        |
|  Expanded: 240px       |  TOP BAR: Height 56px                              |
|  Collapsed: 68px       |  +-----------------------------------------------+ |
|                        |  | CENTRAL CONTENT STAGE:                        | |
|  Padding: 16px         |  | Max-width: 1100px (Centered horizontally)     | |
|  Nav item: 40px height |  | Internal gutter: 24px                         | |
|  Nav gap: 4px          |  +-----------------------------------------------+ |
|                        |  STATUS BAR: Height 32px fixed                     |
+-----------------------------------------------------------------------------+
```

### 2.2 Content Centering & Reading Ergonomics
- The primary typing canvas is constrained to a **maximum width of 1100px** and centered horizontally within the main viewport.
- Why 1100px? Research in cognitive ergonomics shows that passages exceeding 80–90 characters per line increase eye-tracking fatigue. Centering the canvas with generous margins allows typists to keep their gaze fixed in the central visual cone.

---

## 3. Component Dimensions & Density Standards

| Component Class | Standard Height | Internal Padding | Corner Radius |
|---|---|---|---|
| **Primary Action Button** | 44px (`h-11`) | `px-5 py-2.5` | 8px (`rounded-lg`) |
| **Secondary / Compact Button** | 36px (`h-9`) | `px-3.5 py-1.5` | 6px (`rounded-md`) |
| **Icon Button** | 36 × 36px (`w-9 h-9`)| `p-2` | 6px (`rounded-md`) |
| **Input & Search Field** | 40px (`h-10`) | `px-3.5 py-2` | 8px (`rounded-lg`) |
| **Mode Selector Pill** | 44px (`h-11`) | `px-4 py-1.5` | 22px (`rounded-full`) |
| **Keyboard Keycap (Standard)** | 42 × 42px | Center aligned | 6px (`rounded-md`) |
| **Keyboard Spacebar** | 42 × 260px | Center aligned | 6px (`rounded-md`) |
| **Sidebar Navigation Item** | 40px (`h-10`) | `px-3 py-2` | 6px (`rounded-md`) |
| **Statistic Card** | 110px – 130px | `p-5` | 12px (`rounded-xl`) |
| **Modal Dialog** | Max 640px wide | `p-6` | 16px (`rounded-2xl`) |

---

## 4. Corner Radius Scale Tokens

- `rounded-sm`: **4px** — Micro-badges, keycap tactile dots.
- `rounded-md`: **6px** — Individual mechanical keycaps, dropdown items, icon buttons.
- `rounded-lg`: **8px** — Standard buttons, text input fields, sidebar navigation rows.
- `rounded-xl`: **12px** — Statistic cards, preview containers, toast notification banners.
- `rounded-2xl`: **16px** — Modal dialogs, central typing canvas container, onboarding cards.
- `rounded-full`: **9999px** — Mode selector pills, user avatars, status indicator dots.

---

## 5. Elevation & Shadow Tokens

In a dark gaming UI, elevation is conveyed through **surface lightness** and **subtle luminous glows** rather than murky black shadows:

1. **Elevation 0 (Canvas Level):** `#0B0F19` (Dark) / `#F8FAFC` (Light). No shadow.
2. **Elevation 1 (Card & Sidebar):** `#131B2E` (Dark) / `#FFFFFF` (Light).
   - Border: 1px solid `#1E293B` (Dark) / `#E2E8F0` (Light).
   - Shadow: `0 1px 3px rgba(0, 0, 0, 0.3)` (Dark) / `0 1px 3px rgba(0, 0, 0, 0.05)` (Light).
3. **Elevation 2 (Elevated Popovers & HUD):** `#1E293B` (Dark) / `#F1F5F9` (Light).
   - Shadow: `0 4px 12px rgba(0, 0, 0, 0.4)` (Dark) / `0 4px 12px rgba(0, 0, 0, 0.08)` (Light).
4. **Elevation 3 (Floating Modals & Dialogs):** `#1E293B` (Dark) / `#FFFFFF` (Light).
   - Shadow: `0 12px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(59, 130, 246, 0.2)` (Dark).
5. **Active Focus Glow:**
   - Dark: `box-shadow: 0 0 0 2px #0B0F19, 0 0 0 4px #3B82F6, 0 0 12px rgba(59, 130, 246, 0.4)`.
   - Light: `box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #2563EB`.
