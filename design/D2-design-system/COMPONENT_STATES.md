# COMPONENT STATES & INTERACTION MATRIX (D2)
**Typing Trainer — Windows Desktop Application**
*Document Version: 1.0.0 | Stage: D2 Design System*

---

## 1. Interaction Principles & Timing

Typing Trainer balances mechanical desktop responsiveness with smooth visual feedback:
- **Micro-transitions (Buttons, Tabs, Keycaps):** `150ms cubic-bezier(0.16, 1, 0.3, 1)` (snappy spring feel).
- **Elevation & Modal Open/Close:** `200ms cubic-bezier(0.16, 1, 0.3, 1)`.
- **Typing Caret Translation:** `80ms linear` for smooth sliding between character coordinates.
- **`prefers-reduced-motion`:** All duration values drop to `0ms` when reduced motion is enabled in Windows OS settings.

---

## 2. Interactive Component State Matrix

### 2.1 Buttons (CMP-01)

| State | Dark Theme Visuals | Light Theme Visuals | Cursor / Motion |
|---|---|---|---|
| **Default (Primary)** | Fill: `#3B82F6`, Text: `#FFFFFF`, Radius: 8px | Fill: `#2563EB`, Text: `#FFFFFF`, Radius: 8px | `cursor-pointer` |
| **Hover** | Fill: `#2563EB`, Shadow: `0 0 12px rgba(59,130,246,0.3)` | Fill: `#1D4ED8`, Shadow: `0 2px 8px rgba(37,99,235,0.2)` | `scale-[1.01]` |
| **Active / Pressed** | Fill: `#1D4ED8`, Transform: `translateY(1px)` | Fill: `#1E40AF`, Transform: `translateY(1px)` | Tactile depression |
| **Focused** | 2px ring `#0B0F19`, 2px outer outline `#3B82F6` | 2px ring `#FFFFFF`, 2px outer outline `#2563EB` | Visible focus |
| **Disabled** | Fill: `#1E293B`, Text: `#475569`, Opacity: 0.5 | Fill: `#F1F5F9`, Text: `#94A3B8`, Opacity: 0.5 | `cursor-not-allowed` |
| **Loading** | Spinner replaces label; button width fixed | Spinner replaces label; button width fixed | Non-clickable |

### 2.2 Text Input & Search Fields (CMP-02, CMP-03)

| State | Dark Theme Visuals | Light Theme Visuals |
|---|---|---|
| **Default** | Fill: `#131B2E`, Border: 1px `#1E293B`, Text: `#F8FAFC`, Placeholder: `#64748B` | Fill: `#FFFFFF`, Border: 1px `#CBD5E1`, Text: `#0F172A`, Placeholder: `#94A3B8` |
| **Hover** | Border: 1px `#334155` | Border: 1px `#94A3B8` |
| **Focused** | Border: 1px `#3B82F6`, Glow: `0 0 0 3px rgba(59,130,246,0.25)` | Border: 1px `#2563EB`, Glow: `0 0 0 3px rgba(37,99,235,0.2)` |
| **Error** | Border: 1px `#EF4444`, Glow: `0 0 0 3px rgba(239,68,68,0.25)` | Border: 1px `#DC2626`, Glow: `0 0 0 3px rgba(220,38,38,0.2)` |
| **Disabled** | Fill: `#0B0F19`, Border: 1px `#1E293B`, Text: `#475569`, Opacity: 0.6 | Fill: `#F8FAFC`, Border: 1px `#E2E8F0`, Text: `#94A3B8`, Opacity: 0.6 |

### 2.3 Mode Selector Pills & Tabs (CMP-07, CMP-09)

| State | Dark Theme Visuals | Light Theme Visuals |
|---|---|---|
| **Inactive** | Fill: Transparent, Text: `#94A3B8` | Fill: Transparent, Text: `#64748B` |
| **Hover** | Fill: `rgba(255,255,255,0.05)`, Text: `#E2E8F0` | Fill: `rgba(0,0,0,0.04)`, Text: `#0F172A` |
| **Active / Selected**| Fill: `#3B82F6` (or pill background `#1E293B` with blue text), Text: `#FFFFFF` | Fill: `#2563EB`, Text: `#FFFFFF` |
| **Focused** | 2px high-contrast focus ring around pill | 2px high-contrast focus ring around pill |

### 2.4 Keyboard Keycaps (CMP-26)

| State | Dark Theme Visuals | Light Theme Visuals | Tactile Affordance |
|---|---|---|---|
| **Resting** | Fill: Pastel tint (`#1A2234`), Border: `#28354D`, Text: `#CBD5E1` | Fill: Pastel tint (`#F1F5F9`), Border: `#CBD5E1`, Text: `#334155` | 1px bottom shadow |
| **Next Target Key** | Border: 2px `#3B82F6`, Background pulse animation | Border: 2px `#2563EB`, Background pulse animation | Guides finger reach |
| **Actuated / Hit** | Fill: `#3B82F6`, Text: `#FFFFFF`, `translateY(2px)` | Fill: `#2563EB`, Text: `#FFFFFF`, `translateY(2px)` | Physical switch bottom-out |
| **Mistyped Error** | Fill: `#EF4444`, Border: `#DC2626`, Text: `#FFFFFF` | Fill: `#DC2626`, Border: `#B91C1C`, Text: `#FFFFFF` | Instant error feedback |
| **Home-Row Anchor**| Centered raised dot / bar beneath letter `F` and `J` | Centered raised dot / bar beneath letter `F` and `J` | Tactile landmark |

### 2.5 Text Characters in Active Stream (CMP-28)

| Character State | Text Color (Dark) | Text Color (Light) | Background / Decoration |
|---|---|---|---|
| **Pending (Upcoming)** | `#64748B` (Muted Slate) | `#94A3B8` (Medium Slate) | None |
| **Current Target** | `#FFFFFF` (Bright White) | `#0F172A` (Bold Ink) | Background pill `#3B82F6` @ 20% opacity + active caret |
| **Correct** | `#10B981` (Emerald) | `#047857` (Forest Green) | Clean glyph |
| **Incorrect / Mistyped**| `#EF4444` (Coral Red) | `#B91C1C` (Dark Red) | Red wavy underline + coral background badge |
| **Extra Character** | `#EF4444` @ 70% opacity | `#B91C1C` @ 70% opacity | Crossed-out red strikethrough |
