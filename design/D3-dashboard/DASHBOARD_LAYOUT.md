# DASHBOARD LAYOUT & RESPONSIVE GEOMETRY (D3)
**Typing Trainer — Windows Desktop Application**
*Screen ID: SCR-101 | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D3 Dashboard Design*

---

## 1. Desktop Shell Structural Dimensions

The desktop shell provides a stable, zero-jitter frame for the entire desktop experience.

```
+-----------------------------------------------------------------------------+
|  CUSTOM WINDOW TITLEBAR: Height 36px fixed | Windows Controls: 138 × 36px   |
+-----------------------------------------------------------------------------+
|  SIDEBAR:              |  MAIN WORKSPACE VIEWPORT:                          |
|  Expanded: 240px       |  Scrollable Y-axis container                       |
|  Collapsed: 68px       |  +-----------------------------------------------+ |
|                        |  | CENTRAL CONTENT STAGE:                        | |
|  Internal Padding: 16px|  | Max-width: 1100px (Centered horizontally)     | |
|  Item Height: 40px     |  | Stage Padding: px-6 py-6 (24px gutters)       | |
|  Item Gap: 4px         |  +-----------------------------------------------+ |
|                        |  STATUS BAR: Height 32px fixed                     |
+-----------------------------------------------------------------------------+
```

### 1.1 Shell Component Dimensions
- **Titlebar:** Height `36px` fixed. Full-width drag region (`data-tauri-drag-region`).
- **Sidebar (Expanded):** Width `240px`, height `calc(100vh - 36px)`. Border-right `1px solid var(--border)`.
- **Sidebar (Collapsed):** Width `68px` (Icon Rail). Automatically transitions on `Ctrl + B` or toggle click.
- **Main Viewport Stage:** Fluid width, height `calc(100vh - 36px - 32px)`. Internal max-width: `1100px`, centered via `mx-auto`.
- **Status Bar:** Height `32px` fixed. Bottom-anchored across the main viewport.

---

## 2. Vertical Visual Rhythm & Grid Geometry (4px Baseline)

Every widget adheres strictly to the 4px grid spacing tokens:

```
[Row 0: Greeting & Daily Goal Hero]
Height: 120px | Gap: 20px | Width: 1100px (Full Stage)
Left: Greeting, Level Badge, Motivation Copy | Right: Goal Progress Capsule

[Space: 20px (space-5)]

[Row 1: Four Primary Performance Cards]
Height: 124px | 4-Column Flex Grid | Gap: 20px
Card 1: Best WPM (260px)  | Card 2: Average WPM (260px)
Card 3: Accuracy (260px)  | Card 4: Practice Time (260px)

[Space: 24px (space-6)]

[Row 2: Dual Telemetry Charts (Weekly Activity & WPM Trend)]
Height: 240px | 2-Column Grid | Gap: 20px
Col 1 (Left 540px): 7-Day Weekly Practice Activity Bar & Goal Heatmap
Col 2 (Right 540px): Compact WPM & Error Timeline Curve (Recharts)

[Space: 24px (space-6)]

[Row 3: Algorithmic Weak-Key Recommendation Banner]
Height: 140px | 1-Column Full Width (1100px) | Border: 1.5px Solid #2563EB
Left: Problem Key Badges (R, T, P) + Error Diagnostics | Right: "Practice Weak Keys" CTA

[Space: 24px (space-6)]

[Row 4: Quick Practice Action Cards]
Height: 130px | 5-Column Grid | Gap: 16px (204px per card)
[Typing Test] | [Learning Mode] | [Weak Keys] | [Developer Mode] | [Games]

[Space: 24px (space-6)]

[Row 5: Gamification Progression & Personal Best Showcase]
Height: 180px | 2-Column Grid | Gap: 20px
Col 1 (540px): Streak Flame, Freeze Shield Inventory, Next Trophy Tracker
Col 2 (540px): Official PB Benchmarks (15s Sprint, 60s Standard, Dev Mode)

[Space: 24px (space-6)]

[Row 6: Recent Practice Sessions Log Table]
Height: 200px | 1-Column Full Width (1100px) | 3 Recent Practice Rows + Summary
```

---

## 3. Responsive Breakpoints & Multi-Resolution Adaptation

Typing Trainer supports standard Windows desktop display environments and scaling factors:

| Viewport Resolution | Window Mode | Layout Adaptation Behavior |
|---|---|---|
| **1280 × 720 (720p HD)** | Minimum supported | Sidebar defaults to collapsed (`68px`); 4 stat cards shrink to `230px` width; vertical scrolling enabled with smooth momentum. |
| **1440 × 900 (Baseline)** | Default launch | Sidebar expanded (`240px`); full 1100px stage centered; dual charts sit comfortably side-by-side. |
| **1920 × 1080 (1080p FHD)** | Full HD desktop | Central stage maintains `1100px` max-width with generous optical margins (`px-12`); zero eye-tracking fatigue. |
| **2560 × 1440 (2K / QHD)** | High-DPI display | Stage remains centered at `1100px`; High-DPI Windows display scaling (125%, 150%) scales typography without layout degradation. |

---

## 4. Container Padding & Border Radii Standards

- **Stage Outer Padding:** `p-6` (24px top, bottom, left, right).
- **Major Widgets (Charts, Hero Banner, Log Table):** Corner radius `rounded-xl` (12px), internal padding `p-5` (20px).
- **Metric Cards & Quick Action Cards:** Corner radius `rounded-xl` (12px), internal padding `p-4` (16px).
- **Badges, Buttons & Pills:** Corner radius `rounded-lg` (8px), padding `px-4 py-2`.
- **Keycap Pills & Circular Meters:** Corner radius `rounded-full` (9999px).
