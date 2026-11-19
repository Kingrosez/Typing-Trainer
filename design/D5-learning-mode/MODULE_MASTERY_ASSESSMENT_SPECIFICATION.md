# MODULE MASTERY ASSESSMENT SPECIFICATION (SCR-304)
**Typing Trainer — Windows Desktop Application**
*Screen ID: SCR-304 | Route: /learning/module/:id/mastery | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D5 Learning Mode Design*
*Date: 2026-11-17 | Status: D5 DESIGN COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Screen Mission & Pedagogical Role

**`SCR-304: Module Mastery Assessment`** is the rigorous capstone evaluation concluding each of the 4 curriculum modules (Lessons 08, 16, 24, and 32). It verifies that the user has internalized the finger placements, reach trajectories, and home-row returns taught across the module before unlocking more advanced keys.

### 1.1 Strict Mastery Passing Gates
To ensure students do not develop sloppy habits or progress prematurely:
- **Accuracy Gate:** Must achieve **$\ge 95.0\%$ Accuracy** across the entire comprehensive assessment.
- **Speed Gate:** Must meet the module baseline speed threshold:
  - *Module 1 Capstone (Lesson 08):* $\ge 20\text{ WPM}$
  - *Module 2 Capstone (Lesson 16):* $\ge 30\text{ WPM}$
  - *Module 3 Capstone (Lesson 24):* $\ge 40\text{ WPM}$
  - *Module 4 Grand Capstone (Lesson 32):* $\ge 50\text{ WPM}$
- **Certification Stars Awarded:**
  - `⭐⭐⭐` (3 Stars): $\ge 98.0\%$ Accuracy and speed threshold met (Flawless mastery; unlocks next module; $+15\text{ XP}$ bonus).
  - `⭐⭐☆` (2 Stars): $95.0\% - 97.9\%$ Accuracy and speed threshold met (Proficient pass; **unlocks next module**; $+150\text{ XP}$ module bonus).
  - `⭐☆☆` (1 Star): $90.0\% - 94.9\%$ Accuracy (Passing for individual lesson score, but **STRICTLY INSUFFICIENT for module capstone unlock**; next module remains locked; retake required).
  - `☆☆☆` (0 Stars): $< 90.0\%$ Accuracy (Incomplete; retake required).

> [!IMPORTANT]
> **Strict Separation of Lesson Completion vs. Module Mastery:** Earning 1 Star on a Capstone Assessment records the attempt in `lesson_attempts` and marks the lesson completed, but **DOES NOT grant Module Mastery** and **CANNOT unlock the next module**. Next-module unlocking strictly mandates $\ge 2\text{ Stars}$ ($\ge 95.0\%$ Accuracy AND Speed $\ge WPM_{target}$).

---

## 2. Layout Architecture & Information Hierarchy (1440 × 900)

```
+-------------------------------------------------------------------------------+
| TITLEBAR: Windows Chrome • [⌨] Typing Trainer • Offline-Ready [●] • [Ctrl+K]  |
+-------------------+-----------------------------------------------------------+
| SIDEBAR (240px)   | MAIN STAGE: Centered Mastery Scorecard (1100px)           |
|                   |                                                           |
| OVERVIEW          | [ ← Return to Curriculum (Ctrl+3) ]                       |
|   [📊] Dashboard  |                                                           |
| PRACTICE          | +-------------------------------------------------------+ |
|   [⚡] Test       | | HERO CERTIFICATION BANNER (Height: 160px)             | |
|   [🎓] Learning   | | 🏆 MODULE 2 MASTERED: UPPER ROW CERTIFIED!            | |
|        (ACTIVE)   | | [⭐⭐⭐ 3 STARS EARNED]  Acc: 98.2%  •  Speed: 34 WPM   | |
|   [🎯] Drills     | | +150 XP Mastery Bonus Awarded • Module 3 Now Unlocked!| |
|   [💻] Developer  | +-------------------------------------------------------+ |
|   [🎮] Games      |                                                           |
|                   | +-----------------------------+-------------------------+ |
| MASTERY           | | MODULE KEY ACCURACY HEATMAP | CADENCE STABILITY GRAPH | |
|   [📈] Analytics  | | (540 × 240px)               | (540 × 240px Recharts)  | |
|   [🏆] Trophies   | | Accuracy per reach key:     | Second-by-second WPM    | |
|   [⚙] Settings    | | • E: 99.1% (Flawless)       | Consistency: 88%        | |
|                   | | • I: 98.4% (Flawless)       | Metronomic rhythm       | |
| [●] Lvl 12 Typist | | • R: 96.2% (Strong)         | Zero excessive pauses   | |
| 🔥 5 Day Streak   | | • P: 94.1% (Needs review)   |                         | |
|                   | +-----------------------------+-------------------------+ |
|                   |                                                           |
|                   | +-------------------------------------------------------+ |
|                   | | PROGRESSION REWARDS & BADGE (Height: 110px)           | |
|                   | | [🛡 Top Row Aeronaut Shield] • Curriculum Progress: 50%| |
|                   | +-------------------------------------------------------+ |
|                   |                                                           |
|                   | +-------------------------------------------------------+ |
|                   | | BOTTOM ACTION CONTROLS (Height: 60px)                 | |
|                   | | [ BEGIN MODULE 3: BOTTOM ROW (Enter) → ]              | |
|                   | | [ Review Roadmap ]               [ Retake for 3 Stars]| |
|                   | +-------------------------------------------------------+ |
+-------------------+-----------------------------------------------------------+
| STATUS BAR: [Enter] Begin Next Module | [Ctrl+3] Curriculum | Latency: 0ms    |
+-------------------------------------------------------------------------------+
```

---

## 3. Detailed Component Specifications

### 3.1 Hero Certification Banner (Passed State)
- **Dimensions:** Width `1100px`, Height `160px`, Background `#131B2E` (Dark) / `#FFFFFF` (Light), Border `1.5px solid #10B981` (Emerald), Corner radius `12px`.
- **Anatomy:**
  1. *Mastery Trophy & Headline:* `"🏆 MODULE 2 COMPLETE: UPPER ROW CERTIFIED!"` in `Inter Bold 24px`.
  2. *Large Star Rating Display:* Three oversized metallic golden stars: **`⭐⭐⭐`** in `#F59E0B` Gold with subtle ambient drop-glow.
  3. *Primary Telemetry:*
     - **Accuracy:** `98.2%` in `JetBrains Mono Bold 36px` (`#10B981` Emerald).
     - **Net Speed:** `34 WPM` in `JetBrains Mono Bold 28px` (`#38BDF8` Sky Blue) $\rightarrow$ Exceeds 30 WPM passing threshold.
     - **Consistency:** `88%` in `JetBrains Mono Semi-Bold 22px`.
  4. *Celebration Subtext:* *"Exceptional touch-typing precision! You have mastered all 10 upper-row reach keys. Module 3 (Bottom Row Coordination) is now unlocked."*
  5. *XP Award Badge:* Luminous green pill: `+150 XP Module Bonus Awarded`.

---

### 3.2 Hero Coaching Banner (Failed / Incomplete State)
If the student scores $< 95.0\%$ Accuracy or fails to achieve the module speed target:
- **Border:** `1.5px solid #F59E0B` (Amber).
- **Headline:** `"MODULE 2 ASSESSMENT INCOMPLETE — 95% ACCURACY REQUIRED"`.
- **Primary Telemetry:** `Accuracy: 92.4% (Threshold: 95.0%) • Speed: 28 WPM (Threshold: 30 WPM)`.
- **Constructive Coaching Feedback:**
  > *"You are close! However, touch typing demands high muscle memory precision before moving to the next row. Review Lessons 10 (R & U) and 13 (Q & P), then retake the assessment to unlock Module 3."*
- **Primary CTA:** Switches to `"Retake Assessment (Enter) →"` (`#2563EB` button).

---

### 3.3 Module Key Accuracy Heatmap (Left Column)
- **Dimensions:** Width `540px`, Height `240px`, Background `#131B2E` (Dark) / `#FFFFFF` (Light), Border 1px `#1E293B` / `#E2E8F0`, Corner radius `12px`, Padding `20px`.
- **Telemetry Visualized:**
  A structured 2-column list of all keys taught in the module, showing individual key accuracy:
  - `E`: **`99.1%`** $\rightarrow$ `[ Mastered ]` (Green badge)
  - `I`: **`98.4%`** $\rightarrow$ `[ Mastered ]` (Green badge)
  - `R`: **`96.2%`** $\rightarrow$ `[ Proficient ]` (Blue badge)
  - `U`: **`97.0%`** $\rightarrow$ `[ Proficient ]` (Blue badge)
  - `T`: **`95.8%`** $\rightarrow$ `[ Proficient ]` (Blue badge)
  - `Y`: **`95.1%`** $\rightarrow$ `[ Proficient ]` (Blue badge)
  - `W`: **`96.5%`** $\rightarrow$ `[ Proficient ]` (Blue badge)
  - `O`: **`95.5%`** $\rightarrow$ `[ Proficient ]` (Blue badge)
  - `Q`: **`94.8%`** $\rightarrow$ `[ Review Needed ]` (Amber badge)
  - `P`: **`93.6%`** $\rightarrow$ `[ Review Needed ]` (Amber badge)

---

### 3.4 Cadence Stability Graph (Right Column)
- **Dimensions:** Width `540px`, Height `240px`.
- **Technology:** Recharts Area component (`#2563EB` stroke, linear gradient drop).
- **Telemetry:** Visualizes the student's second-by-second speed curve across the 2-minute capstone assessment. Demonstrates whether the student maintained a steady rhythm or had pauses during reach transitions.

---

### 3.5 Progression Rewards & Module Badge Card
- **Dimensions:** Width `1100px`, Height `110px`, Background `#162035` (Dark) / `#F1F5F9` (Light), Border 1px `#1E293B` / `#E2E8F0`, Corner radius `12px`.
- **Anatomy:**
  - *Metallic Shield Emblem:* 3D stylized emblem: `"Top Row Aeronaut Badge"`.
  - *Curriculum Increment:* Animated bar showing overall touch-typing progress jumping from **25% to 50%**.
  - *Streak Affirmation:* Daily practice streak sealed (+12 minutes logged toward today's goal).

---

### 3.6 Bottom Action Controls
- **Passed State Actions:**
  1. **Primary Button:** `"Begin Module 3: Bottom Row Coordination (Enter) →"` (Cobalt Blue `#2563EB`, white text, 5.17:1 contrast).
  2. **Secondary Button:** `"Return to Curriculum Roadmap"`.
  3. **Tertiary Button:** `"Retake for 3 Stars"` (if passed with 2 stars).
- **Failed State Actions:**
  1. **Primary Button:** `"Retake Assessment (Enter) →"`.
  2. **Secondary Button:** `"Practice Weak Keys (Q & P)"`.
  3. **Tertiary Button:** `"Return to Curriculum Roadmap"`.
