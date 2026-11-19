# COLOR TOKENS & PALETTES (D2)
**Typing Trainer — Windows Desktop Application**
*Document Version: 1.0.0 | Stage: D2 Design System*

---

## 1. Dual-Theme Color Architecture

Typing Trainer utilizes a strict **semantic token abstraction layer**. Rather than hardcoding raw hex values in components, all UI surfaces reference functional tokens that automatically resolve to appropriate theme values in Dark Theme (Midnight Slate) or Light Theme (Daylight Studio).

### 1.1 Contrast & Accessibility Benchmarks
- **Normal Text (< 18px / < 14pt bold):** WCAG AA requires contrast ratio $\ge 4.5:1$.
- **Large Text (≥ 18px bold / ≥ 24px regular):** WCAG AA requires contrast ratio $\ge 3.0:1$.
- **Interactive UI Components & Focus Borders:** Contrast ratio $\ge 3.0:1$.
- **Non-Color Error Communication:** Character correctness and status indicators pair color with shape (wavy underlines, badges, icons).
- **Audit Rule:** Contrast ratio is calculated per individual foreground/background pair, not generalized as a single theme-wide number.

---

## 2. Complete Semantic Color Token Table & Contrast Verification

### 2.1 Dark Theme (Midnight Slate: Canvas `#0B0F19`, Surface Card `#131B2E`)

| Semantic Token | Functional Role | Hex Value | Evaluated Against | Actual Contrast | WCAG AA Status |
|---|---|---|---|---|---|
| `bg-app` | Window root canvas | `#0B0F19` | N/A | Base Canvas | - |
| `bg-surface` | Primary cards, sidebar, popovers | `#131B2E` | `#0B0F19` | Surface step | - |
| `text-primary` | Headings, active characters, stats | `#F8FAFC` | `#0B0F19` / `#131B2E` | **18.20:1** / **16.20:1** | ✅ Passes AAA ($\ge 7:1$) |
| `text-secondary` | Subtitles, labels, secondary copy | `#94A3B8` | `#0B0F19` / `#131B2E` | **7.46:1** / **6.64:1** | ✅ Passes AAA / AA |
| `text-disabled` | Inactive controls, locked lessons | `#475569` | `#131B2E` | **2.26:1** | ℹ️ Exempt (WCAG 1.4.3) |
| `brand-primary` | Action buttons, active navigation | `#3B82F6` | White text `#FFFFFF` | **3.67:1** | ⚠️ Passes for Bold $\ge 14\text{px}$ |
| `border-focus` | Keyboard focus ring | `#3B82F6` | `#0B0F19` | **5.19:1** | ✅ Passes UI ($\ge 3:1$) |
| `status-success` | Completed lessons, targets passed | `#10B981` | `#131B2E` | **6.69:1** | ✅ Passes AA |
| `status-error` | Validation errors, failed checks | `#EF4444` | `#131B2E` | **4.51:1** | ⚠️ Passes AA (requires underline) |
| `typing-pending` | Upcoming passage text | `#64748B` | `#131B2E` | **3.55:1** | ✅ Passes Large Text (24px stream) |

### 2.2 Light Theme (Daylight Studio: Canvas `#F8FAFC`, Surface Card `#FFFFFF`)

| Semantic Token | Functional Role | Hex Value | Evaluated Against | Actual Contrast | WCAG AA Status |
|---|---|---|---|---|---|
| `bg-app` | Window root canvas | `#F8FAFC` | N/A | Base Canvas | - |
| `bg-surface` | Primary cards, sidebar, popovers | `#FFFFFF` | `#F8FAFC` | Surface step | - |
| `text-primary` | Headings, active characters, stats | `#0F172A` | `#F8FAFC` / `#FFFFFF` | **16.89:1** / **17.68:1** | ✅ Passes AAA ($\ge 7:1$) |
| `text-secondary` | Subtitles, labels, secondary copy | `#475569` | `#F8FAFC` / `#FFFFFF` | **7.16:1** / **7.50:1** | ✅ Passes AAA |
| `text-disabled` | Inactive controls, locked lessons | `#94A3B8` | `#FFFFFF` | **2.55:1** | ℹ️ Exempt (WCAG 1.4.3) |
| `brand-primary` | Action buttons, active navigation | `#2563EB` | White text `#FFFFFF` | **5.17:1** | ✅ Passes AA for all sizes |
| `border-focus` | Keyboard focus ring | `#2563EB` | `#FFFFFF` | **5.17:1** | ✅ Passes UI ($\ge 3:1$) |
| `status-success` | Completed lessons, targets passed | `#047857` | `#FFFFFF` | **5.50:1** | ✅ Passes AA |
| `status-error` | Validation errors, failed checks | `#DC2626` | `#FFFFFF` | **4.82:1** | ✅ Passes AA |
| `typing-pending` | Upcoming passage text (Corrected) | `#64748B` | `#FFFFFF` | **4.77:1** | ✅ Passes AA (Replaced #94A3B8) |

---

## 3. Typing-Specific Keystroke Tokens

The core typing engine utilizes dedicated tokens calibrated for maximum legibility at high typing speeds:

| Token Name | Purpose | Dark Theme | Light Theme | Visual Ergonomics |
|---|---|---|---|---|
| `typing-correct` | Correctly typed character | `#10B981` (Emerald) | `#047857` (Forest Green) | Instant positive feedback without glare. |
| `typing-incorrect` | Mistyped character | `#EF4444` (Coral Red) | `#B91C1C` (Dark Red) | Paired with red wavy underline (`~`). |
| `typing-current` | Active target character | `#FFFFFF` (Bright White) | `#0F172A` (Bold Ink) | Background pill `#3B82F6` @ 20% opacity. |
| `typing-pending` | Remaining upcoming characters | `#64748B` (Slate Muted) | `#94A3B8` (Medium Slate) | Distinctly readable but non-distracting. |
| `typing-caret` | Smooth animated cursor | `#3B82F6` (Electric Blue) | `#2563EB` (Cobalt) | 3px wide rounded pill with spring glide. |

---

## 4. Pastel Mechanical Keyboard & Finger-Zoning Palette

To support intuitive touch-typing ergonomics, the on-screen mechanical keyboard uses a **soft pastel colorway** that maps finger assignments across both hands:

```
+-----------------------------------------------------------------------------+
|                     FINGER PLACEMENT COLOR ZONING                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  LEFT HAND:                          RIGHT HAND:                            |
|  * Pinky:   Soft Lavender (`#C4B5FD`)   * Index:   Soft Mint     (`#A7F3D0`) |
|  * Ring:    Soft Rose     (`#FECDD3`)   * Middle:  Soft Cream    (`#FEF08A`) |
|  * Middle:  Soft Cream    (`#FEF08A`)   * Ring:    Soft Rose     (`#FECDD3`) |
|  * Index:   Soft Mint     (`#A7F3D0`)   * Pinky:   Soft Lavender (`#C4B5FD`) |
|  * Thumbs:  Muted Slate   (`#E2E8F0`)   * Thumbs:  Muted Slate   (`#E2E8F0`) |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.1 Tactile Landmark Keycaps
- Home-row anchor keys **`F`** and **`J`** feature an illuminated accent underline and subtle tactile dot indicator to mirror the physical physical homing bumps on mechanical keycaps.

---

## 5. Gamification & Progression Tokens

| Token Name | Associated Game Element | Color Value (Dark / Light) | Usage |
|---|---|---|---|
| `xp-meter` | Experience Points & Progress Bars | `#3B82F6` $\rightarrow$ `#06B6D4` Gradient | XP bar fills and level-up bars. |
| `streak-fire` | Daily Practice Streak Counter | `#F97316` (Vibrant Flame) | Active streak flame icon & counter. |
| `shield-freeze` | Streak Freeze Protection Inventory | `#38BDF8` (Ice Cyan) | Shield badge preserving streaks. |
| `tier-novice` | Mastery Tier 1 (Levels 1–10) | `#94A3B8` (Matte Slate) | Badge border and tier banner. |
| `tier-apprentice`| Mastery Tier 2 (Levels 11–20) | `#CBD5E1` (Brushed Silver) | Badge border and tier banner. |
| `tier-journeyman`| Mastery Tier 3 (Levels 21–40) | `#FBBF24` (Polished Gold) | Badge border and tier banner. |
| `tier-typist` | Mastery Tier 4 (Levels 41–60) | `#22D3EE` (Luminous Platinum)| Badge border and tier banner. |
| `tier-pro` | Mastery Tier 5 (Levels 61–80) | `#34D399` (Electric Emerald) | Badge border and tier banner. |
| `tier-grandmaster`| Mastery Tier 6 (Levels 81–100) | `#A855F7` (Holographic Amethyst)| Iridescent obsidian badge styling. |
