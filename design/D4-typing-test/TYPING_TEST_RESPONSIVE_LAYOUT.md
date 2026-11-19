# TYPING TEST RESPONSIVE LAYOUT & GEOMETRY (D4)
**Typing Trainer — Windows Desktop Application**
*Screen IDs: SCR-201, SCR-202, SCR-203 | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D4 Typing Test Arena Design*
*Date: 2026-11-17 | Status: D4 DESIGN COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Structural Desktop Geometry

All three Typing Test Arena screens (`SCR-201`, `SCR-202`, `SCR-203`) share the unified Tauri desktop shell geometry established in D3:

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

Typing Trainer is engineered to support Windows desktop environments from 720p laptops to 4K multi-monitor workstations:

| Viewport Resolution | Window Mode | Layout Adaptation Behavior across SCR-201, SCR-202, SCR-203 |
|---|---|---|
| **1280 × 720 (720p HD)** | Minimum supported desktop resolution | • Sidebar defaults to collapsed **Icon Rail (68px)**.<br>• Central stage width shrinks to **880px**.<br>• **SCR-202 Keyboard Visualizer:** Automatically collapsed to maximize vertical text space.<br>• Text size scales to **24px** (`JetBrains Mono`).<br>• Vertical scrolling enabled where content exceeds 652px viewport height. |
| **1440 × 900 (Baseline)** | Default launch resolution | • Sidebar expanded to **240px**.<br>• Central stage at full **1100px**.<br>• **SCR-202:** 3-line text window (220px) + 65% mechanical keyboard (260px) fit comfortably without scrolling.<br>• Text size at standard **28px**.<br>• Zero layout shift, zero vertical jitter. |
| **1920 × 1080 (1080p FHD)**| Standard desktop display | • Central stage maintained at **1100px** centered (`mx-auto`) to avoid excessive eye travel.<br>• Optical side gutters expand gracefully (`px-12`).<br>• Text size: 28px or 32px (user-selectable in settings). |
| **2560 × 1440 (2K / QHD)** | High-DPI workstation monitor | • Windows High-DPI display scaling (125%, 150%) rendered with crisp subpixel typography.<br>• Stage centered at 1100px; generous whitespace creates an executive, focused ambiance. |

---

## 3. Screen-by-Screen Vertical Rhythm (4px Grid Tokens)

### 3.1 SCR-201: Configuration Screen Layout (Stage: 920px Centered)
```
[Return Link: "← Return to Dashboard"] (Height: 32px)
[Space: 16px (space-4)]
[Title & Subtitle: "Configure Your Typing Test"] (Height: 64px)
[Space: 24px (space-6)]
[Section 1: Test Duration Pills] (Height: 76px)
[Space: 20px (space-5)]
[Section 2: Corpus Source Tabs] (Height: 84px)
[Space: 20px (space-5)]
[Section 3: Difficulty Tier Selector] (Height: 88px)
[Space: 20px (space-5)]
[Section 4: Modifier Toggles & Language] (Height: 52px)
[Space: 24px (space-6)]
[Active Selection Pill & Action Controls] (Height: 56px)
Total Vertical Height: ~556px (Fits cleanly within 900px and 720p viewports)
```

### 3.2 SCR-202: Live Arena Layout (Stage: 1100px Centered)
```
[Row 0: Performance HUD Capsule] (Height: 64px)
[Space: 32px (space-8)]
[Row 1: Primary 3-Line Typing Stream Canvas] (Height: 220px, Fixed)
[Space: 32px (space-8)]
[Row 2: 65% Mechanical Keyboard Visualizer] (Height: 260px, Collapsible)
[Space: 20px (space-5)]
[Row 3: Hotkey Helper Controls] (Height: 32px)
Total Vertical Height: ~640px (Fits within 900px height without scrolling)
```

### 3.3 SCR-203: Results Screen Layout (Stage: 1100px Centered)
```
[Return Header & New Test Action] (Height: 40px)
[Space: 16px (space-4)]
[Row 0: Hero Scorecard & Milestone Badges] (Height: 140px, Full Width)
[Space: 24px (space-6)]
[Row 1: Dual Telemetry Grid] (Height: 240px, 2 Columns: 640px Chart + 440px Stats)
[Space: 24px (space-6)]
[Row 2: Deterministic Weak-Key Recommendation Banner] (Height: 130px, Full Width)
[Space: 24px (space-6)]
[Row 3: Action Buttons & CTAs] (Height: 56px, Full Width)
Total Vertical Height: ~714px (Generates smooth, subtle scroll on 720p; zero scroll on 900p+)
```

---

## 4. Spacing & Container Radii Governance

All card surfaces, input pills, and button containers adhere to strict design-system token radii:
- **Major Cards & Stages:** `rounded-xl` (`12px`) with 1px border.
- **Buttons & Segmented Pills:** `rounded-lg` (`8px`).
- **Status Pills & Micro Badges:** `rounded-full` (capsule).
- **Internal Padding:** Uniform `16px` (`p-4`) or `24px` (`p-6`).
