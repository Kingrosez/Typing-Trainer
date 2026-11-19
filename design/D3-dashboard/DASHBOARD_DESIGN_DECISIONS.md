# DASHBOARD DESIGN DECISIONS & TRADE-OFFS (D3)
**Typing Trainer — Windows Desktop Application**
*Screen ID: SCR-101 | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D3 Dashboard Design*

---

## 1. Governance & Design System Refinement

### Decision 01: Standardization of Primary Button Token to `#2563EB`
- **Context:** The D2 design systems audit demonstrated that white text on `#3B82F6` (Electric Blue) yields only **3.67:1**, which violates WCAG AA for normal-sized text. Furthermore, WCAG 2.2 defines large text as $\ge 14\text{pt}$ bold ($\ge 18.66\text{px}$ bold), meaning 13px or 14px bold text does **not** qualify as large text.
- **Decision:** All primary action buttons and focus indicators standardize on **`#2563EB` (Cobalt Blue)** in both Dark and Light themes.
- **Impact:** White text on `#2563EB` achieves an exact **5.17:1** contrast ratio, guaranteeing 100% WCAG AA compliance across all button sizes.

---

## 2. Information Architecture & Metric Strategy

### Decision 02: Metric Hierarchy on Dashboard vs. Analytics Module
- **Context:** Determining which four statistics belong on the top row of the Dashboard vs. the full `/analytics` lab.
- **Decision:** Selected **Best WPM**, **Average WPM**, **Accuracy %**, and **Total Practice Time**.
- **Rationale:** Excluded "Raw Speed" and "Consistency %" from the top row cards. Net WPM and Accuracy reinforce deliberate skill building, whereas highlighting raw speed encourages reckless button mashing. Raw speed and second-by-second cadence curves are accessible in depth on the dedicated Analytics screen (`SCR-701`).

### Decision 03: Deterministic Weak-Key Recommendation Engine
- **Context:** Designing the recommendation logic for the "Keys to Improve" widget.
- **Decision:** Computed strictly via a local deterministic error ratio:
  $$ErrorRate(k) = \frac{Errors(k)}{Keystrokes(k)}$$
  If $ErrorRate(k) > 0.08$ (8% error rate) over the user's trailing 500 strokes, the key is flagged for the top 3 recommendation card.
- **Rationale:** 100% offline, explainable, and private. Users immediately understand *why* a key is recommended ("R: 72% accuracy"), building trust without unpredictable AI hallucinations.

### Decision 04: Non-Punitive Streak & Beginner-Friendly Habit Architecture
- **Context:** Deciding how daily practice completion, streak maintenance, and missed days operate.
- **Decision:**
  1. **Daily Practice Threshold:** Daily streaks advance strictly upon completing the user's defined daily practice goal (default: 20 minutes; configurable to 5–30 minutes), regardless of beginner or advanced skill level.
  2. **Non-Punitive Streak Shields:** Users earn 1 **Streak Freeze Shield** for every 7 consecutive days of meeting their daily goal (maximum inventory: 2 shields). If an unexpected rest day, travel day, or illness occurs, an active shield is automatically consumed to protect the streak.
  3. **No Unfair Accuracy Gates:** Beginner typists are never denied streak progress or shields due to learning-phase accuracy ($80–94\%$). Streaks measure habit commitment and deliberate effort.
- **Rationale:** Prevents habit abandonment and demotivation. In tandem with the balanced XP model (where base effort XP is guaranteed and accuracy adds multipliers), this ensures the application remains welcoming and motivating for typists at every level.

---

## 3. Visual & Component Ergonomics

### Decision 05: Compact WPM Trend vs. Deep Graphing
- **Context:** How much chart telemetry should live on the Dashboard?
- **Decision:** Constrained the Dashboard WPM graph to the **last 15 sessions** in a compact 540 × 240px card with optional error spike dots.
- **Rationale:** Prevents cognitive overload. Typists need to know their immediate trajectory (improving, steady, or erratic). Full multi-month time ranges, finger speed balancing, and keyboard heatmaps belong in the Analytics module (`SCR-701`).

### Decision 06: Dual-Theme Parity & Surface Hierarchy
- **Context:** Ensuring Light Theme receives equal fidelity to Dark Theme.
- **Decision:** Light Theme (Daylight Studio) uses cool off-white (`#F8FAFC`) with pure white card surfaces (`#FFFFFF`) and charcoal text (`#0F172A`), delivering a 17.68:1 contrast ratio.
- **Rationale:** Light theme is not an afterthought or inverted filter; it is calibrated for bright daylight offices and classrooms.

### Decision 07: Acceptance of Figma Starter Plan 3-Page Constraint
- **Context:** The authenticated Figma account operates on a Starter Plan (maximum 3 pages per file, tool call rate limit reached).
- **Decision:** Organized the design system and screen flows into 3 master pages:
  - Page 1: Foundations, Tokens & Themes.
  - Page 2: Component Library & Specialized Systems.
  - Page 3: Desktop Flows & Screen Templates (containing the 1440 × 900 Dashboard Command Center).
- **Rationale:** Respects platform limits while delivering high-fidelity Auto-Layout master frames that serve as the visual source of truth for engineering.
