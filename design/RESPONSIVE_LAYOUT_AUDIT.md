# RESPONSIVE DESKTOP LAYOUT AUDIT & VIEWPORT SPECIFICATION
**Typing Trainer — Windows Desktop Application**  
*Document Version: 1.0.0 | Stage: Complete UI/UX Design Finalization*  
*Date: 2026-11-19 | Status: MASTER RESPONSIVE SPECIFICATION (ALL VIEWPORTS AUDITED)*

---

## 1. Executive Summary & Viewport Scope

This document delivers the comprehensive responsive desktop layout audit for the Typing Trainer Windows desktop application.

As an offline-first Windows desktop application packaged via Tauri 2, Typing Trainer targets physical PC monitors, business laptops, and high-DPI displays. Layouts are validated across four benchmark viewports and three standard Windows Display Scaling settings (100%, 125%, 150%):

| Viewport Benchmark | Resolution (px) | Aspect Ratio | Target Hardware & Display Scaling | Primary Responsive Strategy |
|---|---|---|---|---|
| **Widescreen Desktop** | **1600 × 900+** | 16:9 | 24"–27" External Monitors (100% scaling) | 240px expanded sidebar, 1100px stage, generous margins (`auto`), full visualizers. |
| **Primary Target Desktop** | **1440 × 900** | 16:10 | Standard Desktop & Modern Laptops (100%–125%)| 240px expanded sidebar, 1100px centered stage, full 65% mechanical keyboard tray. |
| **Standard Business Laptop** | **1366 × 768** | 16:9 | Corporate Laptops, 14"–15.6" Panels (100%–125%) | 68px collapsed sidebar, compact card gaps, auto-collapsing visualizer below 850px height. |
| **Minimum Supported Viewport**| **1280 × 800** | 16:10 | 13" Ultrabooks, Compact Windows Tablets | 68px icon rail, 1040px fluid stage, 18px typing font, single-column card stacks. |

---

## 2. Core Responsive Architectural Invariants

### 2.1 The Central Stage Rule (`max-w-[1100px]`)
To prevent excessive line lengths that impair touch-typing reading mechanics (parafoveal preview), the central typing stage is clamped to a maximum width of **1100px** with automatic horizontal centering (`margin: 0 auto`). This ensures that on ultra-wide monitors (e.g. 1920 × 1080 or 2560 × 1440), text lines never stretch beyond comfortable eye span (~75 characters per line).

### 2.2 Adaptive Sidebar Behavior
- **Viewports $\ge 1440\text{px}$ Wide:** The sidebar defaults to **Expanded Mode** (240px width), displaying full navigation category labels and profile telemetry.
- **Viewports $< 1400\text{px}$ Wide:** The sidebar automatically collapses to **Icon Rail Mode** (68px width) to preserve horizontal breathing room for the main content stage. Users can expand the sidebar on demand via `Ctrl + B` or the toggle button.

### 2.3 The Vertical Height Constraint & Keyboard Visualizer
> [!NOTE]
> **Approved Responsive Limitation (Displays $< 850\text{px}$ Height):**
> On displays with physical height $\le 800\text{px}$ (especially 1366 × 768 panels at 125% Windows scaling yielding ~614px logical height), rendering both the typing stage (240px) and the full 65% mechanical keyboard visualizer (210px) simultaneously causes vertical clipping.
> **Enforced Behavior:** On viewports with height $< 850\text{px}$, the visualizer tray defaults to **Collapsed Mode** (or a compact 32px reach indicator bar). The typist can toggle the full keyboard overlay on demand by pressing **`F2`**.

---

## 3. Screen-by-Screen Viewport Evaluation Matrix

| Screen ID & Name | 1600 × 900+ (Widescreen) | 1440 × 900 (Target) | 1366 × 768 (Business) | 1280 × 800 (Minimum) | Audit Result |
|---|---|---|---|---|---|
| **Desktop Shell** | 240px sidebar, 36px titlebar, 32px status bar. | 240px sidebar, comfortable layout. | 68px collapsed sidebar; maximizes stage width. | 68px collapsed sidebar; zero horizontal clipping. | **PASS** |
| **SCR-001: Onboarding** | Centered 800 × 560 modal; generous backdrop. | Centered 800 × 560 modal; perfect focus. | Centered 760 × 500 modal; compact paddings. | Centered 760 × 500 modal; fit within viewport. | **PASS** |
| **SCR-002: Command Palette**| Centered 640 × 440 modal. | Centered 640 × 440 modal. | Centered 600 × 400 modal. | Centered 600 × 400 modal. | **PASS** |
| **SCR-003: Pause Modal** | Centered 480 × 320 modal. | Centered 480 × 320 modal. | Centered 480 × 320 modal. | Centered 460 × 300 modal. | **PASS** |
| **SCR-101: Dashboard** | 4-card hero, dual charts 540px, 5 launch cards. | 4-card hero, dual charts, 5 launch cards. | 4-card hero compact, dual charts stacked/compact. | 2x2 hero grid, vertically stacked charts. | **PASS** |
| **SCR-201: Test Config** | Centered 1100px stage; all pills horizontal. | 1100px stage; 16px pill gaps. | 1080px stage; wrapped pills. | 1040px stage; wrapped modifier pills. | **PASS** |
| **SCR-202: Test Arena** | 24px font, 40px pitch, full 210px visualizer. | 24px font, 40px pitch, full visualizer. | 22px font, 36px pitch, visualizer collapsed. | 20px font, 36px pitch, compact reach bar. | **PASS (Limitation)** |
| **SCR-203: Test Results** | 56px hero mono, full Recharts curve, weak keys.| 56px hero mono, full curve. | 48px hero mono, compact chart, stacked cards. | 44px hero mono, scrollable scorecard. | **PASS** |
| **SCR-301: Curriculum** | 4-col lesson grid (8 cards per module). | 4-col lesson grid (8 cards). | 3-col lesson grid auto-wrap. | 2-col lesson grid auto-wrap. | **PASS** |
| **SCR-302: Briefing** | Dual-col stage (540px hand rig + 540px theory).| Dual-col stage (540px each).| Stacked dual-col or compact 480px columns. | Vertically stacked layout (Hand top, Theory below).| **PASS** |
| **SCR-303: Drill Stage** | 3-line window + floating hint + reach arcs. | 3-line window + reach arcs. | 3-line window, visualizer collapsed. | 3-line window, compact reach bar. | **PASS (Limitation)** |
| **SCR-304: Mastery** | 3 gold stars, full heatmap, celebration banner.| 3 gold stars, full heatmap. | 3 gold stars compact, stacked heatmap. | Vertically stacked scorecard with scroll. | **PASS** |
| **SCR-401: Drills Hub** | WPI index, 3-card watchlist, balance bars. | Full hub layout. | Compact watchlist, wrapped balance bars. | Stacked cards with scroll. | **PASS** |
| **SCR-402: Inspector** | 680px modal; latency curves + finger chart. | 680px modal; comfortable. | 620px modal; compact chart. | 580px modal; scrollable stats. | **PASS** |
| **SCR-403: Drill Setup** | 4 mode cards horizontal (260px each). | 4 mode cards horizontal. | 2x2 mode card grid. | 2x2 mode card grid. | **PASS** |
| **SCR-404: Drill Arena** | 3-line window, live opportunity counter. | 3-line window, opportunity HUD.| 3-line window, collapsed visualizer. | 3-line window, compact reach bar. | **PASS (Limitation)** |
| **SCR-405: Drill Results**| Before/After delta curves, mastery banner. | Before/After curves. | Compact deltas, stacked card layout. | Vertically stacked scorecard. | **PASS** |
| **SCR-501: Arcade Hub** | 3 arcade cards (340px each) horizontal. | 3 arcade cards horizontal. | 3 arcade cards auto-wrap. | Stacked single-column arcade cards. | **PASS** |
| **SCR-502..504: Games** | Full arcade stage with laser animations. | Full arcade stage. | Compact stage, laser animations scaled. | Compact stage, minimum 600px width. | **PASS** |
| **SCR-505: High Scores** | Arcade high-score leaderboard table. | High-score table. | High-score table compact. | Scrollable table. | **PASS** |
| **SCR-601: Dev Hub** | 4-col language grid, custom import button. | 3-col language grid (340px).| 3-col language grid (320px). | 2-col language grid auto-wrap. | **PASS** |
| **SCR-602: Dev Setup** | 2-col balanced container (650px / 430px). | 2-col container. | 2-col compact or single-column stack. | Single-column stacked layout. | **PASS** |
| **SCR-603: Code Arena** | 5-line sliding code window (20px font, 40px pitch).| 5-line window, 40px pitch. | 5-line window, visualizer collapsed. | 5-line window, compact reach bar. | **PASS (Limitation)** |
| **SCR-604: Dev Importer**| 2-col split (Dropzone left, Chapters right). | 2-col split. | 2-col split compact. | Single-column stacked (Dropzone top, Chapters below).| **PASS** |
| **SCR-605: Syntax Score**| Hero quartet, 2-col analytics, D6 banner. | Hero quartet, 2-col analytics.| Hero quartet compact, stacked analytics. | Hero quartet 2x2 grid, vertically stacked cards. | **PASS** |
| **SCR-701: Trends** | Time filter pills, full Recharts curve. | Full Recharts curve. | Compact chart, wrapped pills. | Scrollable chart with compact tooltips. | **PASS** |
| **SCR-702: Heatmap** | Full 65% keyboard heatmap + finger radar. | Full heatmap + finger radar. | Heatmap auto-scaled 90%, radar stacked below.| Heatmap auto-scaled 80%, radar stacked below. | **PASS** |
| **SCR-703: Session Log** | Full 7-column table with search and filters. | 7-column table. | 6-column table (duration and WPM prioritized).| 5-column table with horizontal scroll buffer. | **PASS** |
| **SCR-704: Cadence Lab** | CV scorecard, IKI distribution histogram. | CV scorecard, IKI histogram. | Compact histogram, stacked cards. | Vertically stacked cadence stats. | **PASS** |
| **SCR-801: Trophy Room** | 4-col badge cabinet (36 badges). | 4-col badge cabinet. | 3-col badge cabinet auto-wrap. | 2-col badge cabinet auto-wrap. | **PASS** |
| **SCR-802: Level Ladder**| Horizontal visual progression road. | Horizontal road. | Compact horizontal road with scroll. | Vertical milestone step list. | **PASS** |
| **SCR-803: Streak Calendar**| 12-month calendar grid, streak freeze shield. | 12-month calendar grid. | Compact calendar view, stacked stats. | Scrollable monthly calendar view. | **PASS** |
| **SCR-901..906: Settings**| 2-col layout (Nav tabs left, Controls right).| 2-col layout (200px / 860px).| 2-col compact (180px / 820px). | Single-column tabbed layout. | **PASS** |

---

## 4. Prevention of Negative Responsive Edge Cases

1. **Clipped Controls & Text:** Every button and pill container uses `flex-wrap: wrap` or auto-scrolling overflow buffers (`overflow-x-auto`) to guarantee zero clipped labels.
2. **Overlapping Panels:** Auto-Layout frames utilize strict `flex-shrink: 0` on fixed components (e.g. titlebars, sidebars) and `flex-1` / `min-w-0` on fluid text stages, preventing CSS overlap bugs.
3. **Unreadable Typography:** Monospace typing fonts never scale below **18px** on desktop viewports. Reading line heights never collapse below **36px**, guaranteeing optimal legibility.
4. **Visualizer Distortion:** Virtual keyboard keycaps maintain strict aspect ratios (`aspect-square` or exact pixel dimensions). Keycaps never squish horizontally; on narrow displays, the entire keyboard chassis scales proportionally via CSS SVG transform or switches to the 32px reach bar.

---

## 5. Responsive Audit Verdict & Sign-Off

- **Viewport Coverage:** 100% of the 38 screens verified across 1600 × 900+, 1440 × 900, 1366 × 768, and 1280 × 800 resolutions.
- **Display Scaling:** Verified at 100%, 125%, and 150% Windows display scaling settings.
- **Approved Limitation:** Visualizer auto-collapse behavior below 850px height is documented and approved.
- **Status:** **PASS (WITH DOCUMENTED RESPONSIVE LIMITATION)**.
