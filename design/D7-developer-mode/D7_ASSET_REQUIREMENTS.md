# D7 ASSET REQUIREMENTS: 3D MODELS & VECTOR GRAPHICS
**Typing Trainer — Windows Desktop Application**  
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 3 Visual Design & Figma Frame Creation*  
*Document Version: 1.0.0 | Date: 2026-11-18 | Status: COMPLETE & SPECIFIED*

---

## 1. Executive Summary & Asset Strategy

This document defines the 3D anatomical models, mechanical keyboard assets, 2D vector iconography, and static fallback representations for **Phase D7: Developer Mode (The Code Studio)**.

All assets adhere to the approved product personality: **premium gaming-inspired, polished, energetic, and professional**. 3D assets serve strictly to reinforce ergonomic touch-typing technique, finger reach awareness, and posture, never distracting from active source code practice.

---

## 2. 3D Mechanical Keyboard Visualizer Asset

### 2.1 Technical Specifications

| Parameter | Authoritative Specification |
|---|---|
| **Keyboard Layout** | **65% ANSI US QWERTY** (Compact layout: alpha-numeric cluster + dedicated arrow keys + column of navigation keys: `Del`, `PgUp`, `PgDn`). |
| **Keycap Profile** | **DSA Uniform Profile** (Flat keycap top, uniform height across all rows; spherical top indent for tactile finger positioning). |
| **Material & Texture** | **Matte PBT Finish** (Micro-textured surface roughness: 0.45; zero glossy reflections; diffused ambient occlusion). |
| **Tactile Homing Bumps** | Prominent raised horizontal tactile homing bars on **`F`** and **`J`** keys. |
| **Legends** | Centered **`JetBrains Mono`** typeface, dye-sublimated appearance, high-contrast legend colors. |
| **Case Geometry** | Low-profile CNC aluminum chassis, 5° typing angle, subtle chamfered edges, dark matte slate anodized finish (`#131B2E`). |

### 2.2 Ergonomic Finger Zone Color Coding

To reinforce proper touch-typing ergonomics during programming symbol practice, keycaps are subtly color-coded by finger responsibility:

```
+----------------------------------------------------------------------------------------------------------------+
| [~`] [1!] [2@] [3#] [4$] [5%] [6^] [7&] [8*] [9(] [0)] [-_] [=+] [Backspace]                     [Del]         |
| [Tab]  [Q]  [W]  [E]  [R]  [T]  [Y]  [U]  [I]  [O]  [P]  [{[] [}] [\|]                        [PgUp]        |
| [Caps]   [A]  [S]  [D]  [F]  [G]  [H]  [J]  [K]  [L]  [;:] ['"] [Enter]                         [PgDn]        |
| [Shift]    [Z]  [X]  [C]  [V]  [B]  [N]  [M]  [,<] [.>] [/?] [Shift]               [▲]                       |
| [Ctrl] [Win] [Alt]             [Spacebar]             [Alt] [Fn] [Ctrl]         [◀]  [▼]  [▶]                  |
+----------------------------------------------------------------------------------------------------------------+
```

| Finger Assignment | Key Scope | Dark Theme Keycap Color | Light Theme Keycap Color | UI Ergonomic Role |
|---|---|:---:|:---:|---|
| **Left Pinky** | `~`, `!`, `1`, `Q`, `A`, `Z`, `Tab`, `Caps`, `Shift` | `#3B1D28` (Subtle Coral Tint) | `#FCE7F3` (Pastel Pink) | Left modifier & perimeter |
| **Left Ring** | `@`, `2`, `W`, `S`, `X` | `#382618` (Subtle Amber Tint) | `#FEF3C7` (Pastel Amber) | Ring finger column |
| **Left Middle** | `#`, `3`, `E`, `D`, `C` | `#1A3026` (Subtle Emerald Tint)| `#D1FAE5` (Pastel Mint) | Middle finger column |
| **Left Index** | `$`, `%`, `4`, `5`, `R`, `T`, `F`, `G`, `V`, `B` | `#1E294B` (Subtle Cobalt Tint) | `#DBEAFE` (Pastel Sky) | Left inner clusters & homing `F` |
| **Thumbs** | `Spacebar` | `#261C38` (Subtle Purple Tint) | `#EDE9FE` (Pastel Lavender) | Whitespace pacing |
| **Right Index** | `^`, `&`, `6`, `7`, `Y`, `U`, `H`, `J`, `N`, `M` | `#1E294B` (Subtle Cobalt Tint) | `#DBEAFE` (Pastel Sky) | Right inner clusters & homing `J` |
| **Right Middle**| `*`, `8`, `I`, `K`, `,` | `#1A3026` (Subtle Emerald Tint)| `#D1FAE5` (Pastel Mint) | Middle finger column |
| **Right Ring** | `(`, `9`, `O`, `L`, `.` | `#382618` (Subtle Amber Tint) | `#FEF3C7` (Pastel Amber) | Delimiter reach: `(`, `9` |
| **Right Pinky** | `)`, `0`, `-`, `=`, `P`, `[`, `]`, `\`, `;`, `'`, `Enter`, `Shift` | `#3B1D28` (Subtle Coral Tint) | `#FCE7F3` (Pastel Pink) | **Critical programming zone:** `{}`, `[]`, `;`, `'` |

---

## 3. Realistic Anatomical Human Hand Model

### 3.1 Anatomical & Ergonomic Rigging
- **Geometry:** High-fidelity anatomical hand model with realistic proportional finger lengths.
- **Posture:** Natural **C-curved finger arches** resting over the home row (`ASDF` / `JKL;`), with the knuckles elevated 18mm above the keycaps.
- **Wrist Alignment:** Neutral straight wrist positioning (zero lateral ulnar or radial deviation; zero wrist hyperextension).
- **Prohibition on Cartoon Hands:** Hand models must feature realistic anatomical joint articulation, subtle nail geometry, and realistic skin tone shading. Stylized, low-poly, or exaggerated cartoon hands are strictly prohibited.
- **Target Reach Arc Visualization:** When a student hesitates on an outer programming delimiter (e.g. `{` or `[`), an illuminated semi-transparent reach arc extends from the right pinky homing position to the target keycap, visually guiding the physical reach motion.

---

## 4. 2D Vector Iconography & Brand Glyphs

All vector assets are authored on an integer pixel grid (`16px`, `20px`, `24px`) with `2px` stroke width and round caps/joins.

### 4.1 Programming Language Brand Glyphs

| Language Track | Glyph Representation | Vector Dimensions | Primary Brand Tint |
|---|---|:---:|:---:|
| **TypeScript** | Distinctive square `TS` monogram badge | 24 × 24 px | `#2563EB` (Cobalt) |
| **JavaScript** | Distinctive square `JS` monogram badge | 24 × 24 px | `#F59E0B` (Amber) |
| **Python** | Interlocking dual-serpent vector icon | 24 × 24 px | `#38BDF8` & `#FBBF24` |
| **Java** | Classic coffee cup with stylized steam arcs | 24 × 24 px | `#EF4444` (Crimson) |
| **SQL** | Cylindrical relational database disc stack | 24 × 24 px | `#10B981` (Emerald) |
| **Rust** | Precision mechanical gear with central `R` | 24 × 24 px | `#F97316` (Orange) |
| **JSON** | Dual curly braces `{ }` containing a colon `:` | 24 × 24 px | `#06B6D4` (Cyan) |

### 4.2 Operational & Diagnostic Icons
- `UploadCloudIcon` (24px): Drag-and-drop dropzone in `SCR-604`.
- `DottedIndentGuideIcon` (16px): Monospace column alignment glyph (`┆`).
- `ZenModeIcon` (20px): Distraction-free toggle in `SCR-603` (`F11`).
- `WeakKeyAlertIcon` (20px): Closed-loop remediation warning banner in `SCR-605` (`⚠️`).
- `SyncStatusIcon` (16px): Outbox status indicators (Checkmark, Spinning retry, Queued warning).

---

## 5. Static Asset Placeholders & Fallback Strategy

For systems with low GPU hardware capabilities, reduced-motion preferences, or in situations where 3D WebGL contexts are disabled:

```
+----------------------------------------------------------------------------------------------------+
| 2D CSS / CANVAS FALLBACK KEYBOARD VISUALIZER (Height: 160px)                                       |
| Rendered using lightweight CSS Grid and SVG keycap cells.                                          |
| Zero WebGL initialization overhead; sub-millisecond DOM render time.                               |
| Keycap glow achieved via CSS outline: 2px solid #2563EB and box-shadow.                            |
| Reach arc rendered via 2px dashed SVG cubic bezier path.                                           |
+----------------------------------------------------------------------------------------------------+
```

- **Fallback Priority:** If WebGL context creation fails or `prefers-reduced-motion` is active, Developer Mode seamlessly falls back to the 2D SVG keyboard matrix without visual layout shift.
- **Asset Storage Location:** All vector SVGs and texture maps are stored in the client application assets bundle (`src/assets/developer/`). Zero external network requests are made to fetch graphics.

---

## 6. Verification Summary

- **Keyboard Specification:** 65% ANSI layout, DSA profile, matte PBT, full finger-zone color coding specified.
- **Hand Model:** C-curved posture, neutral wrist, anatomical realism, no cartoon elements.
- **Vector Icons:** 7 language brand glyphs and 5 operational icons fully mapped.
- **Fallbacks:** 2D CSS/SVG fallback architecture fully defined.