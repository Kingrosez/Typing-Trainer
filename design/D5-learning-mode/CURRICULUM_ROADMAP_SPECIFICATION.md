# CURRICULUM ROADMAP SPECIFICATION (SCR-301)
**Typing Trainer — Windows Desktop Application**
*Screen ID: SCR-301 | Route: /learning | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D5 Learning Mode Design*
*Date: 2026-11-17 | Status: D5 DESIGN COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Screen Mission & Functional Role

**`SCR-301: Touch-Typing Curriculum Roadmap`** serves as the macro navigation and progress hub for the educational curriculum. It visualizes the entire touch-typing journey, clearly conveying what the user has mastered, what they are currently learning, and what lies ahead.

The interface balances gaming-inspired progression mechanics (star ratings, milestone unlocks, level crests) with clear educational structure, ensuring typists always know their exact next step.

---

## 2. Layout Architecture & Information Hierarchy (1440 × 900)

```
+-------------------------------------------------------------------------------+
| TITLEBAR: Windows Chrome • [⌨] Typing Trainer • Offline-Ready [●] • [Ctrl+K]  |
+-------------------+-----------------------------------------------------------+
| SIDEBAR (240px)   | MAIN STAGE: Centered Curriculum Container (1100px)        |
|                   |                                                           |
| OVERVIEW          | +-------------------------------------------------------+ |
|   [📊] Dashboard  | | HEADER HERO: CURRICULUM MASTERY (Height: 90px)        | |
| PRACTICE          | | Touch-Typing Curriculum • Overall Progress: 38%       | |
|   [⚡] Test       | | [████████░░░░░░░░░░░░] 12 / 32 Lessons • ⭐ 31 / 96 Stars|
|   [🎓] Learning   | +-------------------------------------------------------+ |
|        (ACTIVE)   |                                                           |
|   [🎯] Drills     | +-------------------------------------------------------+ |
|   [💻] Developer  | | 4-MODULE SELECTOR TABS (Height: 48px)                 | |
|   [🎮] Games      | | [ Mod 1: Home Row ✓ ] [● Mod 2: Top Row ] [ Mod 3 🔒] | |
|                   | +-------------------------------------------------------+ |
| MASTERY           |                                                           |
|   [📈] Analytics  | +-------------------------------------------------------+ |
|   [🏆] Trophies   | | ACTIVE MODULE BANNER: "Module 2: Top Row Reaches"     | |
|   [⚙] Settings    | | Keys: Q W E R T Y U I O P • Status: 4 of 8 Lessons    | |
|                   | | [ Primary CTA: Continue Lesson 13 (Enter) → ]         | |
| [●] Lvl 12 Typist | +-------------------------------------------------------+ |
| 🔥 5 Day Streak   |                                                           |
|                   | +-------------------------------------------------------+ |
|                   | | 8-LESSON PROGRESSION GRID (2 Rows of 4 Cards)         | |
|                   | | [ Lesson 09: E & I  ]  [ Lesson 10: R & U  ]          | |
|                   | | [⭐⭐⭐ 98% • 32 WPM ]  [⭐⭐⭐ 96% • 30 WPM ]          | |
|                   | |                                                       | |
|                   | | [ Lesson 11: T & Y  ]  [ Lesson 12: W & O  ]          | |
|                   | | [⭐⭐☆ 94% • 28 WPM ]  [⭐⭐⭐ 97% • 34 WPM ]          | |
|                   | |                                                       | |
|                   | | [● Lesson 13: Q & P ]  [🔒 Lesson 14: Top Words]      | |
|                   | | [ ACTIVE • START →  ]  [ Requires Lesson 13 ]         | |
|                   | |                                                       | |
|                   | | [🔒 Lesson 15: Sent ]  [🔒 Lesson 16: Module Exam]    | |
|                   | | [ Requires Lesson 14]  [ Capstone Assessment ]        | |
|                   | +-------------------------------------------------------+ |
+-------------------+-----------------------------------------------------------+
| STATUS BAR: [Enter] Continue Lesson 13 | [Tab] Navigate | [Ctrl+1] Dashboard  |
+-------------------------------------------------------------------------------+
```

---

## 3. Detailed Component Specifications

### 3.1 Header Hero & Overall Progress Banner
- **Dimensions:** Width `1100px`, Height `90px`, Background `#131B2E` (Dark) / `#FFFFFF` (Light), Border 1px `#1E293B` / `#E2E8F0`, Corner radius `12px`.
- **Anatomy:**
  1. *Curriculum Title:* `"Touch-Typing Curriculum"` in `Inter Bold 22px`.
  2. *Mastery Summary:* `"Overall Mastery: 38% • 12 of 32 Lessons Completed"`.
  3. *Progress Bar:* Width `360px`, Height `8px`, `#1E293B` track with `#2563EB` fill and smooth glowing endpoint.
  4. *Star Badge Cabinet:* Pill displaying `⭐ 31 / 96 Stars` in `JetBrains Mono Bold 14px` (`#F59E0B` Gold).
  5. *Tier Badge:* Small metallic crest reading `"Tier 2: Touch Apprentice"`.

---

### 3.2 Four-Module Selector Tabs (Segmented Navigation)
- **Dimensions:** Width `1100px`, Height `48px`, Flex container, 12px gap.
- **Tab Anatomy:**
  - **Module 1 (Completed):** `"01. Home Row Foundations"` + Green Checkmark (`✓ 8/8 Lessons • 24⭐`). Background `#1E293B`, subtle emerald border.
  - **Module 2 (Active):** `"02. Top Row Reaches"` + Active Progress Tag (`● 4/8 Lessons • 7⭐`). Highlighted Cobalt Blue border (`#2563EB`), bold white text.
  - **Module 3 (Locked):** `"03. Bottom Row Coordination"` + Lock Glyph (`🔒 Locked • Requires Module 2 Mastery`). Opacity 50%, non-interactive until unlocked.
  - **Module 4 (Locked):** `"04. Numbers & Advanced Integration"` + Lock Glyph (`🔒 Locked • Requires Module 3 Mastery`).

---

### 3.3 Active Module Hero Banner
- **Dimensions:** Width `1100px`, Height `100px`, Background `#162035` (Dark) / `#F1F5F9` (Light), Border `1.5px solid #2563EB`, Corner radius `12px`.
- **Anatomy:**
  - *Module Headline:* `"Module 2: Upper Row Diagonal Reaches"`.
  - *Pedagogical Subtitle:* *"Master upward diagonal reaches from the home row without floating your wrists. Learn Q, W, E, R, T and Y, U, I, O, P."*
  - *Keycap Cluster Badge:* Visual pill displaying the 10 target keycaps: `[ Q ][ W ][ E ][ R ][ T ][ Y ][ U ][ I ][ O ][ P ]`.
  - *Primary Call to Action:* Large Cobalt Blue button (`#2563EB`, 5.17:1 contrast with white text):
    `"Continue Lesson 13: Reaching for Q & P (Enter) →"`

---

### 3.4 Eight-Lesson Progression Grid (2 Rows of 4 Cards)
- **Grid Layout:** 4 columns × 2 rows, Width `1100px`, Gap `16px`, Card dimensions `260 × 160px`.

```
+-------------------------------------------------------+
| LESSON CARD ANATOMY (260 × 160px)                     |
|                                                       |
| [ Lesson 13 ]                [ Target: Q, P ]         |
| Reaching for Q & P                                    |
| Left & right pinky upward diagonal extensions         |
|                                                       |
| Status: ACTIVE NEXT LESSON                            |
| [⭐⭐☆] Best: 94.2% Acc • 28 WPM                      |
|                                                       |
| [ START LESSON (Enter) → ]                            |
+-------------------------------------------------------+
```

#### Four Distinct Lesson Card States:
1. **Completed with 3 Stars (Mastered):**
   - Background `#131B2E` (Dark) / `#FFFFFF` (Light), Border `1px solid #10B981` (Emerald).
   - Header: `"Lesson 09: Reaching for E & I"`.
   - Stars: Three luminous golden stars: `⭐⭐⭐` (`#F59E0B`).
   - Telemetry Badge: `Best: 98.4% Acc • 34 WPM`.
   - Action: Discrete secondary link: `"Review Lesson"`.
2. **Completed with 1–2 Stars (Needs Improvement):**
   - Border `1px solid #F59E0B` (Amber).
   - Stars: `⭐⭐☆` (2 Gold, 1 Dimmed Gray).
   - Telemetry Badge: `Best: 93.8% Acc • 26 WPM`.
   - Helper Badge: `"Retake to earn 3rd star (requires ≥ 98% Acc)"`.
   - Action: Button: `"Retake Lesson"`.
3. **Active Next Lesson (Current Focus):**
   - Elevated border: **`2px solid #2563EB`** with subtle luminous glow.
   - Background `#1A243B` (Dark) / `#EFF6FF` (Light).
   - Status Badge: Glowing blue pill reading `● ACTIVE`.
   - Action: Primary button: **`"Start Lesson (Enter) →"`**.
4. **Locked Lesson (Future):**
   - Opacity `40%`, grayscale filter.
   - Center Icon: Padlock glyph (`🔒`).
   - Helper Text: *"Unlocks after completing Lesson 13."*
   - Non-interactive; keyboard focus skips locked cards.

---

## 4. The 32-Lesson Progressive Curriculum Breakdown & Complete Mapping

The curriculum contains **exactly 32 lessons organized into 4 modules of exactly 8 lessons each**, numbered continuously from 01 to 32.

### 4.1 Module Prerequisites & Separation of States
- **Separation of Lesson Completion vs. Module Mastery:**
  - A student achieves **"Lesson Completion"** by earning $\ge 1\text{ Star}$ ($\ge 90.0\%$ Accuracy). This unlocks the immediately following lesson in the sequence.
  - A student achieves **"Module Mastery"** *only* by completing the Module Capstone Assessment (Lessons 08, 16, 24, 32) with **$\ge 2\text{ Stars}$ ($\ge 95.0\%$ Accuracy AND Speed $\ge WPM_{target}$)**.
  - **Zero Accident Unlocks:** Scoring 1 Star on a Capstone Assessment completes the lesson record for that specific attempt, but **STRICTLY PREVENTS** unlocking the next module. The subsequent module remains locked with a padlock glyph until the student retakes the capstone with $\ge 95\%$ accuracy.
- **Module Prerequisites:**
  - **Module 1 (Home Row):** Unlocked by default for all users.
  - **Module 2 (Upper Row):** Requires Module 1 Mastery Certification (Lesson 08 $\ge 2$ Stars, $\ge 95\%$ Acc, $\ge 20$ WPM).
  - **Module 3 (Bottom Row):** Requires Module 2 Mastery Certification (Lesson 16 $\ge 2$ Stars, $\ge 95\%$ Acc, $\ge 30$ WPM).
  - **Module 4 (Numbers & Advanced):** Requires Module 3 Mastery Certification (Lesson 24 $\ge 2$ Stars, $\ge 95\%$ Acc, $\ge 40$ WPM).

---

### 4.2 Comprehensive 32-Lesson Curriculum Specification Table

| # | Mod | Lesson Title | Learning Objective | Target Keys | Exercise Stages (1–5) | Completion Criteria |
|---|---|---|---|---|---|---|
| **01** | 1 | **Tactile Anchors (F & J)** | Discover physical homing bumps; index finger positioning | `F`, `J` | 1: F/J solo; 2: ff jj; 3: f j f j; 4: j f j f; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **02** | 1 | **Left Hand Home Row** | Establish left pinky, ring, middle, index baseline | `A`, `S`, `D`, `F` | 1: asdf solo; 2: aa ss dd ff; 3: as df sa; 4: fads as; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **03** | 1 | **Right Hand Home Row** | Establish right index, middle, ring, pinky baseline | `J`, `K`, `L`, `;` | 1: jkl; solo; 2: jj kk ll ;; ; 3: jk l; kj; 4: ;lkj; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **04** | 1 | **Spacebar Cadence** | Thumb alternation and rhythmic word spacing | `Spacebar` + Home | 1: a s d f ; 2: as df jk; 3: fall glad; 4: sad lass; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **05** | 1 | **Left-Right Coordination** | Cross-hand alternating syllables on home row | All Home Keys | 1: al sk dj; 2: la ks jd; 3: flask salad; 4: dad falls; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **06** | 1 | **Home Row Words** | High-frequency words using only home row keys | All Home Keys | 1: ask all; 2: sad glad; 3: fall dad; 4: flash salad; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **07** | 1 | **Home Row Flow & Rhythm** | Metronomic cadence stability without pauses | All Home Keys | 1: 3-word chunks; 2: phrases; 3: sentences; 4: prose; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **08** | 1 | **[CAPSTONE] Home Row Exam** | Module 1 mastery verification across all 8 keys | All Home Keys | 1: Warmup; 2: Phrases; 3: Sentences; 4: Paragraph; 5: Capstone | **$\ge 95\%$ Acc AND $\ge 20$ WPM (Unlocks Mod 2)** |
| **09** | 2 | **Reaching for E & I** | Middle finger upward diagonal reaches; return home | `E` (L-Mid), `I` (R-Mid)| 1: ded kik; 2: ed id die; 3: did fed; 4: side line; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **10** | 2 | **Reaching for R & U** | Index finger upward diagonal reaches; return home | `R` (L-Ind), `U` (R-Ind)| 1: frf juj; 2: ru ur red; 3: run fur; 4: sure fire; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **11** | 2 | **Lateral Reach: T & Y** | Index finger lateral diagonal extensions | `T` (L-Ind), `Y` (R-Ind)| 1: ftf jyj; 2: ty yt try; 3: tell you; 4: stay yet; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **12** | 2 | **Reaching for W & O** | Ring finger upward diagonal reaches | `W` (L-Ring), `O` (R-Ring)| 1: sws lol; 2: wo ow owl; 3: slow flow; 4: word work; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **13** | 2 | **Reaching for Q & P** | Pinky finger upward reaches; hand stability | `Q` (L-Pin), `P` (R-Pin)| 1: aqa ;p;; 2: qu pi quit; 3: past play; 4: quick step; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **14** | 2 | **Two-Row Word Families** | Seamless transitions between home row and top row | Home + Top Keys | 1: syllables; 2: short words; 3: full words; 4: phrases; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **15** | 2 | **Top Row Fluid Sentences** | Contextual sentence construction across 2 rows | Home + Top Keys | 1: 4-word clauses; 2: sentences; 3: dialogue; 4: story; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **16** | 2 | **[CAPSTONE] Top Row Exam** | Module 2 mastery verification across 18 keys | Home + Top Keys | 1: Warmup; 2: Vocabulary; 3: Sentences; 4: Paragraph; 5: Capstone | **$\ge 95\%$ Acc AND $\ge 30$ WPM (Unlocks Mod 3)** |
| **17** | 3 | **Reaching for V & M** | Index finger downward reaches; wrist elevation | `V` (L-Ind), `M` (R-Ind)| 1: fvf jmj; 2: vm mv view; 3: move time; 4: make move; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **18** | 3 | **Reaching for C & Comma** | Middle finger downward reaches; comma cadence | `C` (L-Mid), `,` (R-Mid)| 1: dcd k,k; 2: c, ,c cat; 3: come, can; 4: call, calm; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **19** | 3 | **Reaching for X & Period** | Ring finger downward reaches; sentence termination| `X` (L-Ring), `.` (R-Ring)| 1: sxs l.l; 2: x. .x fix; 3: next. fox.; 4: text. box.; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **20** | 3 | **Lateral Down: B & N** | Index finger lateral downward extensions | `B` (L-Ind), `N` (R-Ind)| 1: fbf jnj; 2: bn nb been; 3: bone band; 4: blend brand; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **21** | 3 | **Reaching for Z & Slash** | Pinky finger downward reaches; reach discipline | `Z` (L-Pin), `/` (R-Pin)| 1: aza ;/; 2: z/ /z zone; 3: zero/size; 4: zoom/maze; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **22** | 3 | **Three-Row Vocabulary** | Coordination across home, top, and bottom rows | All 26 Letters | 1: syllables; 2: common words; 3: complex; 4: phrases; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **23** | 3 | **Punctuation & Syntax** | Commas, periods, and sentence flow integration | Letters + `,` + `.` | 1: clauses; 2: sentences; 3: compound; 4: prose; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **24** | 3 | **[CAPSTONE] Bottom Row Exam**| Module 3 mastery verification across 28 keys | All 3 Alpha Rows | 1: Warmup; 2: Reaches; 3: Punctuation; 4: Paragraph; 5: Capstone | **$\ge 95\%$ Acc AND $\ge 40$ WPM (Unlocks Mod 4)** |
| **25** | 4 | **Two-Handed Shift Key** | Opposite hand shift coordination for capitals | `Shift` (L & R) | 1: Fa Ja; 2: London Paris; 3: The Quick; 4: Proper nouns; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **26** | 4 | **Left-Hand Numbers (1–5)** | Upper number reaches from left home row | `1`, `2`, `3`, `4`, `5` | 1: 1 2 3 4 5; 2: a1 s2 d3; 3: 42 cats; 51 items; 4: 1984; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **27** | 4 | **Right-Hand Numbers (6–0)**| Upper number reaches from right home row | `6`, `7`, `8`, `9`, `0` | 1: 6 7 8 9 0; 2: j6 k7 l8; 3: 89 miles; 70 users; 4: 2026; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **28** | 4 | **Essential Quotes & Symbols**| Question marks, exclamation points, hyphens, quotes| `?`, `!`, `-`, `'`, `"` | 1: "Hello!" 2: Isn't it? 3: self-control; 4: "Why not?"; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **29** | 4 | **Program & Math Symbols** | Parentheses, brackets, equals, and logic symbols | `( )`, `[ ]`, `=`, `+`, `&`| 1: (a + b); 2: [0, 1]; 3: item = true; 4: array[i]; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **30** | 4 | **Mixed Alphanumeric Text** | Addresses, dates, technical specs, and numbers | All Keys | 1: 123 Main St.; 2: Nov 17, 2026; 3: 100% Pass; 4: Codes; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **31** | 4 | **Full Literature Passages** | Uninterrupted touch-typing on classic literature | Full 47 Keys | 1: 3-line chunks; 2: paragraph 1; 3: paragraph 2; 4: flow; 5: 60s Flow | $\ge 90\%$ Acc (1⭐) • $\ge 95\%$ (2⭐) • $\ge 98\%$ (3⭐) |
| **32** | 4 | **[GRAND CAPSTONE] Certified** | Complete Touch-Typist Certification | Full Keyboard | 1: Benchmark; 2: Alphanumeric; 3: Prose; 4: Code; 5: 3-Min Exam | **$\ge 95\%$ Acc AND $\ge 50$ WPM (Grand Certification)** |

---

## 5. Keyboard Navigation & Accessibility Model (SCR-301)

- **Sequential Focus Flow:**
  `Header Summary` $\rightarrow$ `Module Selector Tabs` $\rightarrow$ `Primary CTA (Continue Lesson)` $\rightarrow$ `Lesson Cards Grid` $\rightarrow$ `Status Bar`.
- **Arrow Key Navigation in Grid:**
  - `Arrow Right / Left`: Moves focus between adjacent lesson cards in the same row.
  - `Arrow Down / Up`: Moves focus vertically between rows.
- **Card Activation:**
  - Pressing **`Enter`** or **`Space`** on any unlocked lesson card immediately opens `SCR-302` (Lesson Briefing).
  - Attempting to activate a locked card triggers an accessible audio-visual feedback cue (gentle lock rattle, screen reader announces: *"Lesson locked. Complete previous lesson first."*).
- **Shortcut Accelerators:**
  - **`Ctrl + 1`**: Returns to Dashboard (`SCR-101`).
  - **`Ctrl + 2`**: Jumps to Typing Test (`SCR-201`).
  - **`Ctrl + Shift + T`**: Toggles Dark / Light visual theme.
