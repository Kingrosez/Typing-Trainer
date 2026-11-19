# TOUCH-TYPING LEARNING MODE — UX SPECIFICATION (D5)
**Typing Trainer — Windows Desktop Application**
*Screen IDs: SCR-301 (Curriculum Roadmap), SCR-302 (Lesson Briefing), SCR-303 (Interactive Drill), SCR-304 (Mastery Assessment)*
*Target Resolution: 1440 × 900 (Responsive: 1280 × 720 to 2560 × 1440)*
*Document Version: 1.0.0 | Stage: D5 Learning Mode Design*
*Date: 2026-11-17 | Status: D5 DESIGN COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Executive Summary & Module Mission

**Learning Mode (`Module 3`)** transforms Typing Trainer from a pure benchmark testing tool into a comprehensive, structured touch-typing educational platform. Its purpose is to guide users—from absolute beginners who hunt-and-peck to experienced typists looking to eliminate ingrained bad habits—into confident, effortless touch-typists who never need to look down at their keyboard.

The learning journey is founded upon **Musculoskeletal Ergonomics, Neuroplastic Muscle Memory, and Deliberate Practice Theory**:
1. **Ergonomic Tactile Anchoring:** Establishing neutral wrist alignment, natural curved finger arches, and permanent tactile awareness of the **`F` and `J` homing bumps**.
2. **Strict Finger-to-Key Mapping:** Teaching exact, non-negotiable finger assignments for all 47 primary typing keys so every reach is performed by the correct anatomical digit.
3. **Return-to-Home-Row Discipline:** Instilling the automatic neuromuscular reflex of returning fingers to the home row (`A S D F` / `J K L ;`) after every reach.
4. **Accuracy-First Progression:** Speed is an emergent property of accuracy. Lessons mandate high precision ($\ge 95\%$) before unlocking subsequent challenges.
5. **Gaming-Inspired Progression:** Replaces stale school typing drills with motivating XP ladders, 3-star lesson certifications, level badges, and milestone unlocks.

---

## 2. End-to-End Learning User Journey

The Learning Mode journey spans four tightly integrated screens forming a continuous, rewarding loop:

```
+-----------------------------------------------------------------------------------------------+
|                                LEARNING MODE USER JOURNEY                                     |
+---------------------+     +---------------------+     +---------------------+     +-----------+
|       SCR-301       |     |       SCR-302       |     |       SCR-303       |     |  SCR-304  |
|  Curriculum Roadmap | --> |   Lesson Briefing   | --> |   Interactive Drill | --> |  Mastery  |
| (4 Modules, 32 Less,|     | (Ergonomics, Hand   |     | (Monospace Stream,  |     | Assessment|
|  Stars, Unlocks)    |     |  Placements, Theory)|     |  Pastel Keys, Arcs) |     | (Scorecard|
+---------------------+     +---------------------+     +---------------------+     +-----------+
          ^                            |                           |                      |
          |                            +------- Back to Map -------+                      |
          |                                                                               |
          +----------------------------- Next Module Unlocked ----------------------------+
```

1. **SCR-301: Curriculum Roadmap & Module Hub:** The macro view displaying the 4-module progression, overall touch-typing mastery percentage, 32 sequential lessons, earned stars, and current active lesson CTA.
2. **SCR-302: Lesson Briefing & Ergonomic Finger Intro:** A dedicated preparation screen showing sitting posture, neutral wrist elevation, a realistic 3D anatomical hand illustration highlighting the target reaching finger, and tactile homing theory.
3. **SCR-303: Interactive Lesson Drill Stage:** The live practice arena featuring instructional progressive n-grams (single keys $\rightarrow$ bigrams $\rightarrow$ real words), synchronized pastel keyboard with active reach arcs, real-time error remediation, and forgiving multi-word backspacing.
4. **SCR-304: Module Mastery Assessment:** The capstone evaluation testing comprehensive retention of all keys taught in the module, enforcing a $\ge 95\%$ accuracy passing threshold to award certification stars and unlock the subsequent module.

---

## 3. Pedagogical Architecture & The 4-Module Curriculum

The curriculum consists of **4 progressive modules** comprising **32 sequential lessons** (8 lessons per module), moving from basic home-row tactile stabilization to complex alphanumeric and symbol coordination:

```
+-----------------------------------------------------------------------------------------------+
|                                THE 4-MODULE PROGRESSION MATRIX                                |
+-------------------------------+-------------------------------+-------------------------------+
| Module & Title                | Keycaps Taught                | Primary Pedagogical Objective |
+-------------------------------+-------------------------------+-------------------------------+
| **Module 1: Getting Started &**| Home Row Anchor Keys:         | • Neutral wrist posture & home row anchoring  |
| **Home Row Foundations**      | `F`, `J`, `D`, `K`, `S`, `L`, | • Tactile awareness of `F` & `J` homing bumps |
| (Lessons 01 – 08)             | `A`, `;`, `Spacebar`          | • Single-finger isolation & rhythm cadence    |
+-------------------------------+-------------------------------+-------------------------------+
| **Module 2: Top Row**         | Upper Diagonal Reaches:       | • Upward diagonal reaches from home row       |
| **Reaches**                   | `E`, `I`, `R`, `U`, `T`, `Y`, | • Left/right index finger extension           |
| (Lessons 09 – 16)             | `W`, `O`, `Q`, `P`            | • Immediate return-to-home-row reflex         |
+-------------------------------+-------------------------------+-------------------------------+
| **Module 3: Bottom Row**      | Lower Diagonal Reaches:       | • Downward reaches & wrist curl avoidance     |
| **Coordination**              | `V`, `M`, `C`, `,`, `X`, `.`, | • Left pinky/ring reach dexterity (`Z`, `X`)  |
| (Lessons 17 – 24)             | `Z`, `/`, `B`, `N`            | • Punctuation cadence (comma, period, slash)  |
+-------------------------------+-------------------------------+-------------------------------+
| **Module 4: Numbers, Shift**  | Upper Number Row & Symbols:   | • Full hand extension without floating        |
| **& Advanced Integration**    | `1–0`, `Left/Right Shift`,    | • Two-handed Shift key coordination           |
| (Lessons 25 – 32)             | Capitalization, Symbols       | • Comprehensive paragraph integration         |
+-------------------------------+-------------------------------+-------------------------------+
```

---

## 4. Design Governance & Project Alignment

All D5 deliverables strictly comply with the approved project baseline:

| Dimension | Approved Governance Standard | Application in D5 Learning Mode |
|---|---|---|
| **Platform Model** | Tauri 2 + Rust + React Desktop | Local-first, offline execution; zero cloud calls during active practice. |
| **Visual Direction** | Direction D: Gaming-Inspired Learning | Energetic, polished desktop UI; sleek metallic tier crests, zero childish cartoon tropes. |
| **Theme System** | Dual Theme: Midnight Slate & Daylight Studio | Validated across both themes with 100% token parity. |
| **Primary Action Color** | `#2563EB` (Cobalt Blue) with white text | Verified **5.17:1** contrast ratio (WCAG AA compliant). |
| **Monospace Typography** | `JetBrains Mono` for typing content & HUD | Monospace character grid aligns perfectly with finger reach visualizers. |
| **Interface Typography** | `Inter` for headers, labels, and theory | High readability across desktop resolutions. |
| **Hand Representation** | Realistic Human Anatomy | Anatomically accurate hands (defined metacarpals, phalanges, fingernails, neutral wrist) rather than abstract geometric blobs or childish cartoon paws. |
| **Keyboard Visual** | 65% ANSI Pastel Mechanical Keyboard | DSA uniform profile keycaps, PBT texture, homing ridges on `F` and `J`. |
| **Data Privacy** | Single-user, local-first | Progress saved strictly to local SQLite database; no telemetry. |

---

## 5. Architectural Information Hierarchy

```
+-------------------------------------------------------------------------------+
| TITLEBAR: Windows Chrome • [⌨] Typing Trainer • Offline-Ready [●] • [Ctrl+K]  |
+-------------------+-----------------------------------------------------------+
| SIDEBAR (240px)   | MAIN WORKSPACE STAGE (Max-width: 1100px Centered)         |
|                   |                                                           |
| OVERVIEW          | [SCR-301: CURRICULUM ROADMAP VIEW]                        |
|   [📊] Dashboard  | - Header: Touch-Typing Curriculum & Overall Progress (34%)|
| PRACTICE          | - Active Module Hero: "Module 2: Top Row Reaches"         |
|   [⚡] Test       | - 8 Lesson Cards in Active Module (Locked/Active/Starred) |
|   [🎓] Learning   | - Module Carousel / Selector: [Mod 1 ✓] [Mod 2 ●] [Mod 3 🔒|
|        (ACTIVE)   | - Primary Action: [ Continue Active Lesson: 11 (Enter) → ]|
|   [🎯] Drills     |                                                           |
|   [💻] Developer  | [SCR-302: LESSON BRIEFING VIEW - PRE-DRILL]               |
|   [🎮] Games      | - Target Key Badges: [ E ] and [ I ] (Upper Reaches)      |
| MASTERY           | - 3D Anatomical Hand Model highlighting Middle Fingers    |
|   [📈] Analytics  | - Ergonomic Posture & Reach Theory Callouts               |
|   [🏆] Trophies   | - Action: [ Start Interactive Drill (Space / Enter) → ]   |
|   [⚙] Settings    |                                                           |
|                   | [SCR-303: INTERACTIVE DRILL STAGE VIEW]                   |
| [●] Lvl 12 Typist | - Top Telemetry HUD: [Acc: 98%] [Speed: 28 WPM] [Stage 3/5|
| 🔥 5 Day Streak   | - Monospace Text Stream with Real-Time Guided Cues        |
|                   | - 65% Mechanical Pastel Keyboard with Active Reach Arcs   |
|                   | - Return-to-Home-Row Visual Indicator                     |
|                   | - Actions: [Esc] Pause  •  [F5] Restart Drill             |
|                   |                                                           |
|                   | [SCR-304: MODULE MASTERY ASSESSMENT VIEW]                 |
|                   | - Capstone Challenge Scorecard: 3-Star Mastery Achieved!  |
|                   | - Comprehensive Speed & Error Heatmap for the Module      |
|                   | - Next Module Unlock Badge (+150 XP Awarded)              |
|                   | - Actions: [ Begin Module 3 → ]  •  [ Review Roadmap ]    |
+-------------------+-----------------------------------------------------------+
| STATUS BAR: [Enter] Continue | [Esc] Pause | [F2] Toggle Hands | Latency: 0ms|
+-------------------------------------------------------------------------------+
```

---

## 6. Color Token Reference for Educational Guidance

| Pedagogical Function | Dark Theme (Midnight Slate) | Light Theme (Daylight Studio) | Contrast vs Card Surface |
|---|---|---|---|
| **Active Target Keycap** | `#2563EB` (Cobalt Blue fill, `#FFFFFF` text)| `#2563EB` (Cobalt Blue fill, `#FFFFFF` text)| **5.17:1** (WCAG AA Pass) |
| **Home Row Anchor Keycap** | `#1E293B` (Elevated slate with cyan rim)   | `#E2E8F0` (Crisp gray with cobalt rim)     | **4.85:1** (WCAG AA Pass) |
| **Active Finger Reach Glow**| `#38BDF8` (Sky Blue illumination, 2px)    | `#0284C7` (Cobalt Blue illumination, 2px)  | **4.62:1** (WCAG AA Pass) |
| **Reach Arc Trajectory Line**| `rgba(56, 189, 248, 0.4)` (Dashed bezier)| `rgba(2, 132, 199, 0.4)` (Dashed bezier)   | Graphical non-text ($3:1$) |
| **Correct Stroke** | `#10B981` (Emerald Green)                  | `#059669` (Forest Green)                   | **5.24:1** (WCAG AA Pass) |
| **Incorrect Stroke** | `#EF4444` (Coral Red with wavy underline)   | `#DC2626` (Crimson Red with wavy underline)| **4.68:1** (WCAG AA Pass) |
| **Gold Star (3 Stars)** | `#F59E0B` (Amber Gold with metallic rim)   | `#D97706` (Warm Ochre with crisp rim)      | **4.55:1** (WCAG AA Pass) |

---

## 7. Figma Deliverables Reference

In compliance with the Starter Plan page architecture:
- **Figma File:** `https://www.figma.com/design/LvHRp11TZikdxNFeZvapO0`
- **Page 3: `🖥 03. Desktop Flows & Screen Templates`**
  - **Node ID `5:2`:** `04. Screen — Touch-Typing Curriculum & Learning Mode (1440x900)` (`SCR-301`)
  - Additional sub-flow templates for `SCR-302`, `SCR-303`, and `SCR-304` are specified with exact coordinate geometries, Auto-Layout constraints, and token mappings in the subsequent specification files.
