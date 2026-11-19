# D7 GAMIFICATION SPECIFICATION: DEVELOPER MODE
**Typing Trainer — Windows Desktop Application**
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 2 UX Architecture & Functional Specifications*
*Document Version: 1.0.0 | Date: 2026-11-18 | Status: COMPLETE & READY FOR REVIEW*

---

## 1. Executive Summary

This specification defines the gamification, Experience Points (XP) calculation order, diminishing returns rules, achievement milestones, and habit-tracking integration for **Developer Mode (Module 06)**.

In strict compliance with `AGENTS.md` and approved D5/D6 governance:
- **Zero Invented Milestone XP:** Per-snippet completions award zero unapproved milestone bonuses.
- **D5 XP Formula Preservation:** Standard Base Effort XP and accuracy multipliers scale session rewards.
- **Option A Daily Diminishing Returns:** Protects the local XP economy from repetitive exercise grinding.
- **Authentic Practice Time Protection:** 100% of physical active practice time is credited toward daily goals and streak maintenance.

---

## 2. Reconciled XP Calculation Pipeline

Developer Mode strictly follows the approved mathematical calculation pipeline established in D3, D5, and D6:

$$\mathbf{Words = \text{round}(\text{Correct Characters} / 5)}$$
$$\mathbf{Minutes = \text{Elapsed Active Seconds} / 60}$$
$$\mathbf{XP_{base} = \text{round}(Words \times 0.2) + \text{round}(Minutes \times 5)}$$
$$\mathbf{XP_{adjusted} = \text{round}(XP_{base} \times AccuracyMultiplier)}$$
$$\mathbf{XP_{final} = \text{round}(XP_{adjusted} \times RetakeTier)}$$

### 2.1 Accuracy Multiplier Thresholds (D3 Alignment)
- $\ge 98.0\%$ Accuracy: **$1.50\times$** (+50% Precision Bonus)
- $95.0\% – 97.9\%$ Accuracy: **$1.20\times$** (+20% Competence Bonus)
- $90.0\% – 94.9\%$ Accuracy: **$1.00\times$** (Par Execution)
- $85.0\% – 89.9\%$ Accuracy: **$0.75\times$** (-25% Friction Penalty)
- $< 85.0\%$ Accuracy: **$0.50\times$** (-50% High Friction Floor)

### 2.2 Option A Daily Diminishing Returns Policy (D5 Alignment)
- **Scope:** Evaluated per unique Snippet ID per calendar day.
- **Attempt 1:** Represents the student's initial attempt of the day.
- **Multiplier Schedule:**
  - **Attempts 1–3:** **100% Base XP** ($1.00\times$)
  - **Attempts 4–5:** **50% Base XP** ($0.50\times$)
  - **Attempts 6+:** **0% Base XP** ($0.00\times$)
- **Daily Goal Guarantee:** All legitimate practice sessions continue contributing **100% of active elapsed time** toward the student's 20-minute daily practice goal and streak maintenance, even on attempt 6 and beyond.

---

## 3. Developer Mode Achievement Milestones

All achievement rewards are one-time grants stored in the SQLite table `user_reward_ledger`. Duplicate awards are strictly blocked by the unique constraint `UNIQUE(user_id, reward_type, entity_id)`:

| Achievement ID | Badge Name | XP Grant | Trigger Condition | Pedagogical Objective |
|---|---|:---:|---|---|
| `ACH_DEV_POLYGLOT` | **Polyglot Developer** | **+250 XP** | Complete at least 1 production snippet in 5 distinct programming languages. | Broad syntactic dexterity across programming paradigms. |
| `ACH_DEV_BRACKET_NINJA`| **Bracket Ninja** | **+200 XP** | Attain $\ge 99.0\%$ Symbol Accuracy on a Tier-3 or Tier-4 exercise. | Flawless right-pinky delimiter coordination. |
| `ACH_DEV_CLEAN_COMPILE`| **Clean Compile** | **+150 XP** | Complete a $\ge 15$-line production code block with 0 uncorrected errors. | Rhythmic consistency and accuracy on long code blocks. |
| `ACH_DEV_TS_MASTER` | **TypeScript Champion** | **+300 XP** | Attain Stage 4 Language Mastery Certification in TypeScript. | Language mastery and asynchronous pipeline fluency. |
| `ACH_DEV_PY_MASTER` | **Pythonic Flow** | **+300 XP** | Attain Stage 4 Language Mastery Certification in Python. | Semantic indentation mastery and clean Python syntax. |
| `ACH_DEV_RUST_MASTER` | **Systems Rustacean** | **+300 XP** | Attain Stage 4 Language Mastery Certification in Rust. | Complex operator, lifetime, and macro syntax mastery. |

---

## 4. Habit Tracking & Personal Best Integration

1. **Dashboard Widget 02 (Daily Goal Progress Capsule):**
   - Developer Mode sessions credit minutes directly to the 20-minute target.
   - Example: Completing a 2-minute Java exercise advances the ring by +2m.
2. **Dashboard Widget 09 (Personal Best Showcase):**
   - The third official benchmark slot showcases the **60s Developer Mode Benchmark**.
   - Displays: Net WPM, Symbol Accuracy, Language, and Date.
   - Idempotent update: A new record replaces the existing PB only if Net WPM is strictly higher with $\ge 95.0\%$ overall accuracy.
