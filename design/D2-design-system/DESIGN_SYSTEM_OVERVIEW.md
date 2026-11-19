# DESIGN SYSTEM OVERVIEW (D2)
**Typing Trainer — Windows Desktop Application**
*Document Version: 1.0.0 | Stage: D2 Design System*

---

## 1. System Vision & Architecture

The **Typing Trainer Design System** is an engineering-grade design framework built specifically for a high-performance Windows desktop application. It translates the approved visual direction—**"Gaming-Inspired Learning"**—into a coherent, scalable, and reusable library of foundations, semantic tokens, and UI components.

### 1.1 Core Tenets
1. **Zero-Cognitive Load During Typing:** Peripheral elements never visually compete with the central typing stream. High contrast, precise monospace typography, and distraction-dimming rules ensure uninterrupted flow states.
2. **Tactile & Responsive Affordance:** Buttons, keycaps, and HUD widgets deliver tactile visual feedback (mechanical spring depressions, luminous active borders, crisp focus rings).
3. **Dual-Theme Parity:** Both **Dark Theme (Midnight Gaming Slate)** and **Light Theme (Warm Daylight Studio)** are first-class citizens built from unified semantic color tokens. Light theme is not an afterthought or inverted filter; it is independently calibrated for long reading sessions and high contrast.
4. **Feasibility in Target Stack:** Every token, layout grid, and component is designed for drop-in implementation using **Tailwind CSS**, **shadcn/ui**, **Radix UI primitives**, and **Lucide Icons** on **Tauri 2**.

---

## 2. Visual Identity & 3D Integration

### 2.1 Aesthetic Foundations
- **Personality:** Premium, energetic, focused, professional.
- **Palette Mood:** Deep obsidian/navy backgrounds paired with vibrant cobalt, electric cyan, and emerald telemetry accents, balanced by clean pastel keycaps.
- **Avoided Tropes:** No chaotic RGB rainbow disco animations, no unreadable neon cyber-scripts, no childish cartoon mascots, and no fake 3D isometric perspectives that impair usability.

### 2.2 3D Visual Strategy (Meshy AI & Blender Pipeline)
- **Custom Pastel Mechanical Gaming Keyboard:** A bespoke 65% / TKL mechanical keyboard aesthetic featuring subtle rounded PBT keycaps with soft pastel colorways (mint, lavender, cream, coral) indicating finger placement zones.
- **Realistic Human Hand Anatomy:** When illustrating touch-typing ergonomics, hand postures feature anatomically correct finger reaches (no distorted 3D joints, no exaggerated rubbery fingers, exact home-row anchors on `F` and `J`).
- **Trophy & Milestone Assets:** Stylized 3D low-poly / smooth-shaded metallic badges (brushed bronze, polished silver, cobalt gold, diamond obsidian) rendered with consistent top-down 45° key lighting.

---

## 3. Design System Hierarchy

```
+-----------------------------------------------------------------------------+
|                      TYPING TRAINER DESIGN SYSTEM                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [ FOUNDATIONS ]      [ CORE COMPONENTS ]    [ SPECIALIZED PATTERNS ]       |
|  * Color Tokens       * Buttons & Inputs     * Pastel Mechanical Keyboard   |
|  * Typography Scale   * Navigation & Tabs    * Realistic Hand Finger Guide  |
|  * Spacing & Layout   * Cards & Dialogs      * Active Monospace Stream      |
|  * Elevation & Glows  * Tooltips & Toasts    * Live Telemetry HUD           |
|  * Motion Curves      * Data Tables          * Gaming Badges & XP Meters    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 4. Documentation Index

The complete D2 specification comprises the following documents:
- `DESIGN_SYSTEM_OVERVIEW.md`: Master design system architecture (this file).
- `COLOR_TOKENS.md`: Light and dark semantic palette, WCAG contrast ratios, and token mapping.
- `TYPOGRAPHY.md`: Typographic scale, tabular figures, and font family hierarchy (`Inter`, `JetBrains Mono`).
- `SPACING_AND_LAYOUT.md`: Layout grid, responsive breakpoints, density rules, and border radii.
- `COMPONENT_INVENTORY.md`: Catalog of all 32 core and specialized UI components.
- `COMPONENT_STATES.md`: State matrix (Default, Hover, Active, Focus, Disabled, Loading) for all components.
- `GAMIFICATION_COMPONENTS.md`: XP bars, Level badges, Streak shields, and Challenge cards.
- `TYPING_COMPONENTS.md`: Virtual pastel keyboard, finger matrix, caret physics, and text streams.
- `FIGMA_STRUCTURE.md`: Exact layout, component set hierarchy, and page anatomy of the Figma file.
- `ACCESSIBILITY_GUIDELINES.md`: WCAG 2.2 AA requirements, focus rings, contrast, and color-blind modes.
- `DESIGN_DECISIONS.md`: Log of design system trade-offs, token naming conventions, and technical rationale.
- `D2_COMPLETION_REPORT.md`: Comprehensive delivery report and Figma design verification.
