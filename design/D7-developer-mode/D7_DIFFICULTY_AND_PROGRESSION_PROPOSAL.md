# D7 DIFFICULTY & PROGRESSION PROPOSAL
**Typing Trainer — Windows Desktop Application**
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 1 Product Discovery & Requirements Analysis*
*Document Version: 1.0.0 | Date: 2026-11-18 | Status: COMPLETE & READY FOR REVIEW*

---

## 1. Executive Summary

This proposal defines the pedagogical progression, difficulty scoring methodology, and mastery certification framework for **Developer Mode**. 

The goal is to structure code typing practice so developers can steadily advance from foundational punctuation conditioning to fluid composition of dense, multi-line production code without experiencing cognitive overload or physical strain.

---

## 2. The Four-Tier Difficulty Framework

Developer Mode organizes code exercises across four progressive difficulty tiers:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         D7 FOUR-TIER PROGRESSION                                 │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   TIER 1: SYNTAX FOUNDATIONS (BEGINNER DEVELOPER)                                │
│   • Snippet Length: 1–3 lines (15–40 characters per line).                      │
│   • Nesting Depth: 0–1 levels.                                                   │
│   • Token Profile: Basic keywords (if, return, let), simple operators (=, +),   │
│     isolated paired brackets ({}, ()), minimal capitalization shifts.            │
│   • Indentation: Pre-indented / Auto-advanced.                                   │
│   • Goal: Overcoming initial symbol hunting; learning bracket keycap locations.  │
│                                                                                  │
│   TIER 2: IDIOMATIC CONSTRUCTS (INTERMEDIATE DEVELOPER)                          │
│   • Snippet Length: 4–8 lines.                                                   │
│   • Nesting Depth: 1–2 levels.                                                   │
│   • Token Profile: Method declarations, parameter lists, camelCase / snake_case, │
│     standard control flow (for, while, if/else), semicolons, commas, quotes.     │
│   • Indentation: Auto-advance on Enter with visual indentation guidelines.       │
│   • Goal: Sustained rhythmic typing of authentic single functions and queries.   │
│                                                                                  │
│   TIER 3: PRODUCTION PATTERNS (ADVANCED DEVELOPER)                               │
│   • Snippet Length: 8–16 lines.                                                  │
│   • Nesting Depth: 2–3 levels.                                                   │
│   • Token Profile: Generics (<T, K>), arrow functions (=>), template strings,    │
│     chained calls (.filter().map()), error handling (try/catch), type unions (|). │
│   • Indentation: Auto-advance with manual indentation verification option.       │
│   • Goal: High-speed cadence through complex syntax chords and Shift reaches.    │
│                                                                                  │
│   TIER 4: ARCHITECTURE & DENSE SYNTAX (EXPERT DEVELOPER)                         │
│   • Snippet Length: 15–25 lines.                                                 │
│   • Nesting Depth: 3–4 levels.                                                   │
│   • Token Profile: Lifetimes ('a), complex macros, nested SQL joins, regexes,    │
│     bitwise operators, multi-line interfaces, deep object destructuring.        │
│   • Indentation: Strict multi-level indentation blocks.                          │
│   • Goal: Effortless, subconscious touch-typing of production-grade systems code.│
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Mathematical Code Complexity Scoring Formula

To ensure objective snippet difficulty classification, every exercise is assigned a **Code Complexity Score ($CCS$)** ranging from `1.0` to `10.0`:

$$\mathbf{CCS = (D_{sym} \times 0.35) + (N_{max} \times 0.25) + (R_{case} \times 0.20) + (L_{avg} \times 0.20)}$$

Where:
1. **$D_{sym}$ (Symbol Density Score, 1–10):** Percentage of non-alphanumeric punctuation characters in the snippet, normalized:
   $$D_{sym} = \min\left(10, \frac{\text{Symbol Characters}}{\text{Total Characters}} \times 40\right)$$
2. **$N_{max}$ (Maximum Nesting Depth Score, 1–10):** Maximum block indentation level in the snippet ($0 = 1.0, 1 = 3.0, 2 = 6.0, 3 = 8.5, \ge 4 = 10.0$).
3. **$R_{case}$ (Case Shifting Ratio Score, 1–10):** Frequency of mid-identifier uppercase transitions (camelCase) or underscore reaches (snake_case) per 100 characters.
4. **$L_{avg}$ (Average Line Length Score, 1–10):** Average line length normalized against the 80-character ceiling ($L_{avg} = \min(10, \frac{\text{Avg Chars/Line}}{8})$).

### Tier Thresholds:
- **Tier 1 (Foundations):** $CCS < 3.5$
- **Tier 2 (Idiomatic):** $3.5 \le CCS < 6.0$
- **Tier 3 (Production):** $6.0 \le CCS < 8.0$
- **Tier 4 (Architecture):** $CCS \ge 8.0$

---

## 4. Language Mastery Progression & Gamification

### 4.1 Four-Stage Language Track Certification
In each supported language (e.g. TypeScript Track), typists advance through sequential certification gates:
1. **Stage 1 Certification (Syntax Novice):** Complete 5 Tier-1 snippets with $\ge 95\%$ accuracy and $\ge 25$ Code WPM.
2. **Stage 2 Certification (Idiomatic Typist):** Complete 5 Tier-2 snippets with $\ge 96\%$ accuracy and $\ge 40$ Code WPM.
3. **Stage 3 Certification (Senior Coder):** Complete 5 Tier-3 snippets with $\ge 97\%$ accuracy and $\ge 55$ Code WPM.
4. **Stage 4 Certification (Language Master):** Complete 5 Tier-4 snippets with $\ge 98\%$ accuracy and $\ge 70$ Code WPM.

### 4.2 Reconciled Gamification & Reward Governance
- **Base XP Formula:** Reuses the approved D3/D5 base formula:
  $$XP_{base} = \text{round}(Words \times 0.2) + \text{round}(Minutes \times 5)$$
  *(Where $Words = \text{Characters} / 5$)*.
- **Accuracy Multiplier:** D3 multipliers apply normally ($1.50\times$ for $\ge 98\%$, $1.20\times$ for $95–97.9\%$).
- **Daily Diminishing Returns:** Option A (Attempts 1–3: 100%, Attempts 4–5: 50%, Attempts 6+: 0% Base XP).
- **Daily Goals:** 100% of active physical practice time accumulates toward the user's 20-minute daily practice goal.
- **Milestone Rewards:** Per-exercise completion awards **0** duplicate milestone XP. Milestone awards are strictly limited to one-time achievements stored in `user_reward_ledger`.

### 4.3 D7 Achievement Milestones (Stored in `user_reward_ledger`):
- **"Polyglot Coder" (+250 XP):** Complete at least 1 production snippet in 5 different programming languages.
- **"Bracket Ninja" (+200 XP):** Maintain $\ge 99\%$ symbol accuracy across a Tier-3 or Tier-4 session.
- **"Clean Compile" (+150 XP):** Complete a 15-line production code block with 0 uncorrected errors.
- **"TypeScript Champion" (+300 XP):** Attain Stage 4 Language Mastery Certification in TypeScript.
