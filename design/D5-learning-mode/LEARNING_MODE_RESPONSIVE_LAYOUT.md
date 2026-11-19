# LEARNING MODE RESPONSIVE LAYOUT & GEOMETRY (D5)
**Typing Trainer — Windows Desktop Application**
*Screen IDs: SCR-301, SCR-302, SCR-303, SCR-304 | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D5 Learning Mode Design*
*Date: 2026-11-17 | Status: D5 DESIGN COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Structural Desktop Shell Geometry

All four Learning Mode screens share the unified Tauri desktop shell geometry established in D3:

```
+-------------------------------------------------------------------------------+
| CUSTOM TITLEBAR: Height 36px fixed | Full-width drag region | Controls 138px  |
+-------------------+-----------------------------------------------------------+
| SIDEBAR:          | MAIN WORKSPACE VIEWPORT (calc(100vh - 36px - 32px))       |
| Expanded: 240px   | +-------------------------------------------------------+ |
| Collapsed: 68px   | | CENTRAL STAGE CONTAINER                               | |
|                   | | Max-Width: 1100px (Centered via mx-auto)              | |
| Border-right: 1px | | Padding: px-6 py-6 (24px gutters)                     | |
|                   | +-------------------------------------------------------+ |
+-------------------+-----------------------------------------------------------+
| STATUS BAR: Height 32px fixed | Bottom-anchored                               |
+-------------------------------------------------------------------------------+
```

---

## 2. Multi-Resolution Adaptation Matrix

Typing Trainer supports Windows desktop displays from compact 720p laptops to multi-monitor 4K workstations:

| Viewport Resolution | Window Mode | Layout Adaptation Behavior across SCR-301, SCR-302, SCR-303, SCR-304 |
|---|---|---|
| **1280 × 720 (720p HD)** | Minimum supported desktop resolution | • Sidebar defaults to collapsed **Icon Rail (68px)**.<br>• Central stage width shrinks to **880px**.<br>• **SCR-301:** 8-lesson grid switches to 2 columns × 4 rows.<br>• **SCR-302:** Hand rig and briefing stack vertically with smooth scroll.<br>• **SCR-303:** Keyboard visualizer collapses automatically; text size scales to **24px**.<br>• **SCR-304:** Scorecard stacks vertically. |
| **1440 × 900 (Baseline)** | Default launch resolution | • Sidebar expanded to **240px**.<br>• Central stage at full **1100px** centered.<br>• **SCR-301:** 4 columns × 2 rows lesson grid.<br>• **SCR-302:** Side-by-side dual columns (540px + 540px) fit without scrolling.<br>• **SCR-303:** Text canvas + 65% mechanical keyboard visualizer fit within 900px height.<br>• Text size: standard **28px** `JetBrains Mono`. |
| **1920 × 1080 (1080p FHD)**| Standard desktop display | • Central stage maintained at **1100px** (`mx-auto`) to eliminate excessive eye travel.<br>• Optical side gutters expand gracefully (`px-12`).<br>• Visual breathing room creates a serene, focused learning environment. |
| **2560 × 1440 (2K / QHD)** | High-DPI workstation monitor | • Windows High-DPI display scaling (125%, 150%) rendered with crisp subpixel typography.<br>• Stage centered at 1100px; 3D hand rig renders in full high-definition WebGL textures. |

---

## 3. Screen-by-Screen Vertical Rhythm (4px Baseline)

### 3.1 SCR-301: Curriculum Roadmap Layout (1100px Stage)
```
[Header Hero: Curriculum Title & Progress Bar] (Height: 90px)
[Space: 16px (space-4)]
[4-Module Selector Tabs] (Height: 48px)
[Space: 20px (space-5)]
[Active Module Hero Banner & CTA] (Height: 100px)
[Space: 20px (space-5)]
[8-Lesson Progression Grid: 2 Rows × 4 Cards] (Height: 336px)
Total Vertical Height: ~630px (Zero vertical scroll on 900p)
```

### 3.2 SCR-302: Lesson Briefing Layout (1100px Stage)
```
[Return Link: "← Return to Curriculum"] (Height: 32px)
[Space: 12px (space-3)]
[Lesson Title & Target Keys Badge] (Height: 48px)
[Space: 20px (space-5)]
[Dual Pedagogical Stage: 540px Hand Rig + 540px Theory] (Height: 420px)
[Space: 20px (space-5)]
[Bottom Action Bar & Primary CTA] (Height: 60px)
Total Vertical Height: ~612px (Fits cleanly within 900p viewport)
```

### 3.3 SCR-303: Interactive Drill Stage Layout (1100px Stage)
```
[Educational Telemetry HUD Capsule] (Height: 64px)
[Space: 28px (space-7)]
[3-Line Monospace Canvas with Floating Hints] (Height: 220px, Fixed)
[Space: 28px (space-7)]
[Pastel Mechanical Keyboard with Trajectory Arcs] (Height: 260px, Collapsible)
[Space: 16px (space-4)]
[Hotkey Helper Controls & Status] (Height: 32px)
Total Vertical Height: ~648px (Fits comfortably within 900p viewport)
```

### 3.4 SCR-304: Module Mastery Assessment Layout (1100px Stage)
```
[Return Link & Module Header] (Height: 36px)
[Space: 16px (space-4)]
[Hero Certification Banner: Stars & Speed Telemetry] (Height: 160px)
[Space: 20px (space-5)]
[Dual Telemetry Grid: 540px Heatmap + 540px Stability Graph] (Height: 240px)
[Space: 20px (space-5)]
[Progression Rewards & Shield Badge Card] (Height: 110px)
[Space: 20px (space-5)]
[Bottom Action Buttons & Next Module CTA] (Height: 60px)
Total Vertical Height: ~718px (Smooth, minimal scroll on 720p; zero scroll on 900p+)
```

---

## 4. Spacing & Container Radii Standards

All cards, buttons, and segmented pills adhere strictly to established design tokens:
- **Major Containers & Cards:** `rounded-xl` (`12px`) with 1px border.
- **Buttons & Pills:** `rounded-lg` (`8px`).
- **Status Pills & Micro Badges:** `rounded-full` (capsule).
- **Internal Padding:** `16px` (`p-4`) or `24px` (`p-6`).
