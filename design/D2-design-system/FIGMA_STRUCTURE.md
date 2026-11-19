# FIGMA FILE STRUCTURE & ORGANIZATION (D2)
**Typing Trainer — Windows Desktop Application**
*Document Version: 1.0.0 | Stage: D2 Design System*

---

## 1. Overview of Figma File Architecture

The official Figma design file for Typing Trainer is maintained at:
🔗 **`https://www.figma.com/design/LvHRp11TZikdxNFeZvapO0`** *(File Key: `LvHRp11TZikdxNFeZvapO0`)*

The file is organized into dedicated, logical pages following enterprise design systems standards. Components utilize **Auto Layout 5.0**, **Figma Variables (Tokens)**, and **Component Variant Sets**.

---

## 2. Page Directory & Inventory

```
+-----------------------------------------------------------------------------+
|                         FIGMA PAGE ARCHITECTURE                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  01. ❖ Cover & Overview       • Project branding, version log, quick links  |
|  02. 🎨 Design Foundations     • Color palettes, elevation, radius, icons    |
|  03. 🌓 Color System (Themes)  • Light & Dark semantic variables mapping     |
|  04. 🔤 Typography             • Type scale, tabular numbers, font stacks    |
|  05. 📐 Spacing & Layout Grid  • 4px grid, container rules, shell blueprints |
|  06. 🧩 Core Components        • Buttons, Inputs, Selects, Dialogs, Cards    |
|  07. 🎮 Gaming Components      • XP bars, Streaks, Trophies, HUD badges      |
|  08. ⌨ Typing Components       • Pastel keyboard, Hand guide, Text canvas    |
|  09. ☀️ Light Theme Showcase   • Daylight Studio full screen mockups         |
|  10. 🌙 Dark Theme Showcase    • Midnight Slate full screen mockups          |
|  11. 🧊 3D Visual Guidelines   • 3D pastel keyboard & anatomy specifications |
|  12. 📋 Design Documentation   • Engineering handoff rules, specs, and tokens|
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 3. Component Set & Variant Naming Standards

All components follow the slash-delimited naming standard:
`Category / ComponentName / VariantProperties`

### Examples:
- `Control / Button / Variant=Primary, Size=md, State=Default`
- `Control / Button / Variant=Secondary, Size=sm, State=Hover`
- `Typing / Keycap / Type=Alpha, Finger=Index, State=Resting`
- `Typing / Keycap / Type=Spacebar, Finger=Thumb, State=Actuated`
- `Gaming / TrophyBadge / Tier=Gold, Status=Unlocked`
- `Feedback / Toast / Type=Achievement, Theme=Dark`

---

## 4. Variable Collections (Figma Design Tokens)

The Figma file is configured with two variable modes: **Mode 1: Dark (Default)** and **Mode 2: Light**:

1. **Collection `color/semantic`:**
   - `background/app` $\rightarrow$ Dark: `#0B0F19` | Light: `#F8FAFC`
   - `background/surface` $\rightarrow$ Dark: `#131B2E` | Light: `#FFFFFF`
   - `text/primary` $\rightarrow$ Dark: `#F8FAFC` | Light: `#0F172A`
   - `text/secondary` $\rightarrow$ Dark: `#94A3B8` | Light: `#475569`
   - `border/subtle` $\rightarrow$ Dark: `#1E293B` | Light: `#E2E8F0`
   - `brand/primary` $\rightarrow$ Dark: `#3B82F6` | Light: `#2563EB`
   - `keystroke/correct` $\rightarrow$ Dark: `#10B981` | Light: `#047857`
   - `keystroke/error` $\rightarrow$ Dark: `#EF4444` | Light: `#B91C1C`

2. **Collection `dimensions/spacing`:**
   - `space-1` = 4px, `space-2` = 8px, `space-4` = 16px, `space-6` = 24px, `space-8` = 32px.

3. **Collection `radius/corner`:**
   - `radius-sm` = 4px, `radius-md` = 6px, `radius-lg` = 8px, `radius-xl` = 12px, `radius-2xl` = 16px, `radius-full` = 9999px.
