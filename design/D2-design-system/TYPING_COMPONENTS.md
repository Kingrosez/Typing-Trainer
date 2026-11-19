# TYPING COMPONENTS & ERGONOMIC GUIDANCE (D2)
**Typing Trainer — Windows Desktop Application**
*Document Version: 1.0.0 | Stage: D2 Design System*

---

## 1. The Virtual Pastel Mechanical Gaming Keyboard

The on-screen virtual keyboard is engineered to deliver immediate ergonomic guidance while establishing a distinctive, premium mechanical gaming aesthetic.

```
+-----------------------------------------------------------------------------+
|              VIRTUAL PASTEL MECHANICAL KEYBOARD (65% ANSI LAYOUT)           |
+-----------------------------------------------------------------------------+
|  [ESC] [1] [2] [3] [4] [5] [6] [7] [8] [9] [0] [-] [=] [BACKSPACE]          |
|  [TAB]   [Q] [W] [E] [R] [T] [Y] [U] [I] [O] [P] [[] []] [\]                |
|  [CAPS]   [A] [S] [D] [F*] [G] [H] [J*] [K] [L] [;] ['] [ENTER]             |
|  [SHIFT]    [Z] [X] [C] [V] [B] [N] [M] [,] [.] [/] [SHIFT]                 |
|  [CTRL] [WIN] [ALT]        [SPACEBAR]       [ALT] [FN] [CTRL]               |
+-----------------------------------------------------------------------------+
```

### 1.1 Hardware Specifications & Standards
- **Layout Standard:** **65% ANSI Standard (US QWERTY)**. Features single-row horizontal Enter (2.25u) and wide left Shift (2.25u), as opposed to European ISO layouts.
- **Keycap Profile:** **DSA Uniform Profile**. DSA features uniform height across all rows with a spherical dish top. Unlike row-sculpted profiles (OEM or Cherry), DSA's uniform height ensures predictable, flat 2D on-screen scaling and consistent 3D mesh rendering.
- **Keycap Material:** **PBT (Polybutylene Terephthalate)**. Modeled with a textured matte finish that avoids oil shine.
- **Standard Alpha Keycaps:** 44 × 42px with 6px corner radius (`rounded-md`).
- **Horizontal & Vertical Key Spacing:** Strict 6px gap between keycaps.
- **Row Stagger Angles:**
  - Row 1 (Numbers) $\rightarrow$ Row 2 (QWERTY): 11px left stagger.
  - Row 2 (QWERTY) $\rightarrow$ Row 3 (Home Row): 6px left stagger.
  - Row 3 (Home Row) $\rightarrow$ Row 4 (ZXCVB): 16px left stagger.
- **Tactile Homing Bumps:** Keycaps **`F`** and **`J`** include a distinct 2px raised bar with accent illumination (`#3B82F6`) representing physical mechanical key homing markers.
- **Spacebar:** 280 × 42px (6.25u) rounded keycap dedicated to left and right thumbs.

---

## 2. Realistic Human Hand Anatomy & Finger Placement

Unlike crude cartoon gloves or distorted stick figures, Typing Trainer employs **anatomically accurate human hand posture** to demonstrate proper touch-typing technique.

```
+-----------------------------------------------------------------------------+
|                   ANATOMICALLY ACCURATE TOUCH-TYPING CONVENTIONS            |
+-----------------------------------------------------------------------------+
|                                                                             |
|  LEFT HAND POSTURE:                        RIGHT HAND POSTURE:              |
|  - Wrists: Neutral, floating (no desk sag) - Wrists: Neutral, floating       |
|  - Fingers: Natural gentle curve (c-shape) - Fingers: Natural gentle curve  |
|                                                                             |
|  FINGER-TO-KEY MAPPING:                                                     |
|  * Pinky:   1, Q, A (Anchor), Z, Caps, Tab * Index:   7, 6, Y, U, J (Anchor),|
|             (Soft Lavender: #C4B5FD)                  H, N, M                |
|  * Ring:    2, W, S (Anchor), X                       (Soft Mint: #A7F3D0)   |
|             (Soft Rose: #FECDD3)           * Middle:  8, I, K (Anchor), ,    |
|  * Middle:  3, E, D (Anchor), C                       (Soft Cream: #FEF08A)  |
|             (Soft Cream: #FEF08A)          * Ring:    9, O, L (Anchor), .    |
|  * Index:   4, 5, R, T, F (Anchor), G, V, B           (Soft Rose: #FECDD3)   |
|             (Soft Mint: #A7F3D0)           * Pinky:   0, -, =, P, [, ], ;,   |
|  * Thumb:   Spacebar (Left half)                      ', Enter, Shift        |
|             (Muted Slate: #E2E8F0)                    (Soft Lavender: #C4B5FD|
|                                            * Thumb:   Spacebar (Right half)  |
|                                                       (Muted Slate: #E2E8F0) |
+-----------------------------------------------------------------------------+
```

### 2.1 Ergonomic Visual Rules
- **No Joint Distortion:** Finger segments bend naturally at the distal, middle, and proximal phalanges.
- **Ghost Hand Overlay:** When finger placement guidance is turned on, semi-transparent realistic hand silhouettes hover below the keyboard, with the active finger reaching cleanly to the target keycap.

---

## 3. Interactive Text Stream & Caret Physics

### 3.1 Text Stream Structure
The typing text stream renders within an elevated container (`#131B2E` Dark, `#FFFFFF` Light) with 3 visible lines of text:
1. **Line 1 (Passed / Active):** Completed words in emerald green, followed by current word.
2. **Line 2 (Upcoming):** Muted slate preview line.
3. **Line 3 (Upcoming Horizon):** Faintly dimmed horizon line.

### 3.2 Dynamic Character States
- **Completed Correct (`typing-correct`):** `#10B981` (Dark) / `#047857` (Light). Clean tabular letterform.
- **Completed Incorrect (`typing-incorrect`):** `#EF4444` (Dark) / `#B91C1C` (Light). High-contrast red badge background + bottom wavy underline.
- **Active Character (`typing-current`):** `#FFFFFF` (Dark) / `#0F172A` (Light). Surrounded by active caret pill.
- **Pending (`typing-pending`):** `#64748B` (Dark) / `#94A3B8` (Light).

### 3.3 Animated Caret Physics
- **Caret Dimensions:** 3.5px width, 32px height, 1.5px corner radius.
- **Color:** `#3B82F6` (Electric Blue) with a subtle 4px glow in dark mode.
- **Translation Animation:** Smooth 80ms CSS linear interpolation across character coordinates (`transform: translate3d(x, y, 0)`), providing an ultra-satisfying fluid glide.
- **Idle State:** When typing pauses for $> 1000\text{ ms}$, caret smoothly pulses (opacity $1.0 \leftrightarrow 0.3$).

---

## 4. Live Telemetry HUD

Mounted directly above the typing stream, the HUD delivers vital stats without visual clutter:

```
+-----------------------------------------------------------------------------+
|    [ 98 WPM ]           [ 99.4% ACC ]         [ 0:38 TIME ]     [ 1 ERR ]   |
|    Electric Blue        Emerald Green         Crisp White       Coral Red   |
+-----------------------------------------------------------------------------+
```

- **WPM Counter:** Tabular 32px bold numbers with smooth spring digit roll-up.
- **Accuracy Meter:** Computed in real-time ($Correct / Total \times 100$).
- **Progress Timer:** Large `MM:SS` countdown timer with optional top horizontal progress bar.
- **Error Tally:** Real-time counter of mistyped characters.
- **Zen Mode Toggle:** Hitting `Ctrl + H` immediately collapses the HUD to a blank state during typing for anxiety-free practice.
