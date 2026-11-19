# LESSON BRIEFING SPECIFICATION (SCR-302)
**Typing Trainer — Windows Desktop Application**
*Screen ID: SCR-302 | Route: /learning/lesson/:id | Target Resolution: 1440 × 900*
*Document Version: 1.1.0 | Stage: D5 Final Governance Correction*
*Date: 2026-11-17 | Status: RESOLVED (AWAITING PRODUCT OWNER APPROVAL)*

---

## 1. Screen Mission & Pedagogical Role

**`SCR-302: Lesson Briefing & Ergonomic Finger Intro`** is the conceptual and physical preparation stage preceding every interactive drill. Sustainable, comfortable touch typing benefits from clear posture and ergonomic awareness before striking a single key.

### 1.1 Core Educational Objectives
1. **Physical Posture & Ergonomics:** Teach neutral wrist alignment, relaxed shoulders, comfortable elbow positioning, and avoiding prolonged wrist compression to promote comfortable, fatigue-free practice.
2. **Tactile Homing Anchors:** Reinforce the subconscious tactile awareness of the physical raised bumps on the **`F` and `J`** keycaps.
3. **Finger Assignment:** Clearly illustrate which digit is responsible for the new target keys using an articulated visual hand diagram with natural finger movement.
4. **The Return-to-Home-Row Discipline:** Emphasize that fingers should return toward their home-row resting positions after completing reach strokes.

---

## 2. Layout Architecture & Information Hierarchy (1440 × 900)

```
+-------------------------------------------------------------------------------+
| TITLEBAR: Windows Chrome • [⌨] Typing Trainer • Offline-Ready [●] • [Ctrl+K]  |
+-------------------+-----------------------------------------------------------+
| SIDEBAR (240px)   | MAIN STAGE: Centered Briefing Container (1100px)          |
|                   |                                                           |
| OVERVIEW          | [ ← Return to Curriculum (Ctrl+3) ]                       |
|   [📊] Dashboard  |                                                           |
| PRACTICE          | # LESSON 09: REACHING FOR E & I                           |
|   [⚡] Test       | Module 2: Upper Row Diagonal Reaches • Target Keys: [E] [I|
|   [🎓] Learning   |                                                           |
|        (ACTIVE)   | +-----------------------------+-------------------------+ |
|   [🎯] Drills     | | LEFT COLUMN: 3D ANATOMICAL  | RIGHT COLUMN: ERGONOMIC | |
|   [💻] Developer  | | HAND RIG VISUALIZATION      | THEORY & REACH RULES    | |
|   [🎮] Games      | | (540 × 420px)               | (540 × 420px)           | |
|                   | |                             |                         | |
| MASTERY           | | [ Realistic Human Hands ]   | • Target Key Anatomy:   | |
|   [📈] Analytics  | | - Defined knuckles & arches |   Left Middle -> [ E ]  | |
|   [🏆] Trophies   | | - Left Middle finger glows  |   Right Middle -> [ I ] | |
|   [⚙] Settings    | |   with cyan reach vector    |                         | |
|                   | | - Right Middle finger glows | • The Golden Rule:      | |
| [●] Lvl 12 Typist | | - F & J homing ridges lit   |   "Never look down.     | |
| 🔥 5 Day Streak   | | - Neutral elevated wrists   |    Feel the F & J bumps.| |
|                   | |                             |    Always return home." | |
|                   | | [ Pastel 65% Keyboard ]     |                         | |
|                   | |   E & I illuminated above   | • Posture Checklist:    | |
|                   | |   D & K home positions      |   [✓] Wrists hovering   | |
|                   | |                             |   [✓] Elbows at 90°     | |
|                   | +-----------------------------+-------------------------+ |
|                   |                                                           |
|                   | +-------------------------------------------------------+ |
|                   | | BOTTOM ACTION CONTROLS (Height: 60px)                 | |
|                   | | [ START INTERACTIVE DRILL (Space / Enter) → ]         | |
|                   | | [ Skip Briefing ]                Target: 95% Accuracy | |
|                   | +-------------------------------------------------------+ |
+-------------------+-----------------------------------------------------------+
| STATUS BAR: [Space/Enter] Start Drill | [Esc] Curriculum | Latency: 0ms       |
+-------------------------------------------------------------------------------+
```

---

## 3. Left Column: 3D Anatomical Hand Rig & Keyboard Visualization

- **Dimensions:** Width `540px`, Height `420px`, Background `#131B2E` (Dark) / `#FFFFFF` (Light), Border 1px `#1E293B` / `#E2E8F0`, Corner radius `12px`.
- **Anatomy & Visual Execution:**

```
               LEFT HAND                           RIGHT HAND
            (Resting on ASDF)                   (Resting on JKL;)
                
                [MIDDLE]                            [MIDDLE]
                 REACH                               REACH
                   ^                                   ^
                 [ E ]                               [ I ]
                   |                                   |
              (D) [ o ]                           (K) [ o ]
             /    |    \                         /    |    \
          (A)    (S)    (F)*                   *(J)   (L)   (;)
          Pinky  Ring  Index                   Index  Ring  Pinky
                         \                       /
                       [ THUMBS RESTING ON SPACEBAR ]
```

### 3.1 Anatomically Accurate Hand Representation
In strict accordance with project design governance:
- **No Cartoon Paws or Floating Blobs:** Hands are rendered with realistic human musculoskeletal proportions, showing natural knuckle joints, distinct phalanges, fingernails, and palm contours.
- **Natural Curved Arches:** Fingers are not depicted flat or rigid; they display a natural relaxed curvature (the "relaxed tennis ball grip").
- **Neutral Elevated Wrist Angle:** Forearms and wrists are shown elevated 10–15mm above the desk plane, demonstrating proper non-planted posture.

### 3.2 Dynamic Reaching Finger Highlight
- In Lesson 09 (teaching `E` and `I`):
  - **Left Middle Finger:** Highlighted in **Electric Sky Blue (`#38BDF8`)** with an illuminated gradient extending from the proximal knuckle to the fingertip.
  - **Reach Vector:** A subtle glowing dashed vector arrow extends upward from the `D` home keycap to the `E` upper keycap, illustrating the exact diagonal trajectory.
  - **Right Middle Finger:** Identically highlighted with a vector extending upward from `K` to `I`.
  - **All Other Digits:** Rendered in translucent pastel tones corresponding to their finger zone, remaining anchored on their respective home-row keycaps (`A`, `S`, `F`, `J`, `L`, `;`).
  - **Homing Ridge Indicator:** A small luminous amber dot highlights the physical homing ridge on the index fingers (`F` and `J`).

---

## 4. Right Column: Ergonomic Theory & Touch-Typing Rules

- **Dimensions:** Width `540px`, Height `420px`, Background `#131B2E` (Dark) / `#FFFFFF` (Light), Border 1px `#1E293B` / `#E2E8F0`, Corner radius `12px`, Padding `24px`.
- **Content Sections:**

### 4.1 Target Key Mechanical Breakdown
- **Target Keys:** `[ E ]` (Left Hand) and `[ I ]` (Right Hand).
- **Physical Reach Rule:**
  > *"To reach **E**, extend your **Left Middle Finger** forward and slightly to the left from its home anchor **D**. Do not twist your wrist or lift your other fingers off the home row. Strike E, then immediately snap the middle finger back to rest on D."*
  > *"To reach **I**, extend your **Right Middle Finger** upward from **K**. Strike I with a light tap, then immediately return home."*

### 4.2 The Three Golden Rules of Touch Typing
1. **Rule 1: Blind Confidence (Never Look Down):**
   - Looking down forces your visual cortex to verify every stroke, hard-capping your speed at 40 WPM. Trust your fingers; use the screen's visual cues.
2. **Rule 2: Tactile Orientation (The F & J Homing Bumps):**
   - If you ever feel lost on the keyboard, slide your index fingers until you feel the small physical ridges on `F` and `J`. Your other fingers automatically fall into place on `A S D` and `K L ;`.
3. **Rule 3: The Spring-Back Reflex:**
   - The home row is your home base. Never let your fingers linger on the top or bottom rows after typing a letter.

### 4.3 Ergonomic Posture Checklist
A dedicated card displaying ergonomic posture best practices:
- `[✓] Neutral Wrist Alignment & Floating Wrists:` Keep forearms and hands in a straight line without excessive bending; avoid prolonged wrist compression against hard desk edges.
- `[✓] Relaxed Shoulders & 90°–100° Elbow Angle:` Upper arms hang naturally from relaxed shoulders with elbows comfortably positioned.
- `[✓] Natural Finger Movement:` Maintain gentle finger curves and smooth keystroke transitions.
- `[✓] Eye Level Display:` Monitor positioned so top of screen is at or slightly below eye level, preventing neck strain.

---

## 5. Action Controls & Transitions

- **Primary Action: "Begin Interactive Practice"**
  - Dimensions: `300 × 48px`, `#2563EB` fill, white text (contrast 5.17:1).
  - Keyboard Accelerator: **`[ Space / Enter ]`**.
  - Action: Immediately transitions into the active drill stage (`SCR-303`).
- **Secondary Action: "Skip Briefing"**
  - Dimensions: `140 × 48px`, Outline border.
  - Enabled for returning users who have previously viewed the briefing, jumping directly to practice.
- **Back Navigation:**
  - `[ ← Return to Curriculum ]` link in top-left (Shortcut: **`Ctrl + 3`** or **`Esc`**).

---

## 6. Accessibility & Motor Considerations (SCR-302)

1. **Screen Reader Architecture:**
   - The 3D hand diagram includes comprehensive descriptive text:
     `<div role="img" aria-label="Anatomical diagram of hands on keyboard. Left middle finger is highlighted reaching from home key D to upper key E. Right middle finger reaches from K to I. Wrists are elevated.">`
2. **Color-Blind Safe Highlighting:**
   - Active fingers are distinguished by high luminance contrast, animated trajectory arrows, and textual labels (`"Left Middle Finger"`), ensuring full clarity for users with red-green or blue-yellow color vision deficiencies.
3. **Focus Sequencing:**
   - Initial focus on page load sits directly on the `"Begin Interactive Practice"` button. Typists can immediately press `Enter` or `Space` to begin drilling without reaching for the mouse.
