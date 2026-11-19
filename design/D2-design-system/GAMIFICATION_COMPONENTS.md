# GAMIFICATION COMPONENTS (D2)
**Typing Trainer — Windows Desktop Application**
*Document Version: 1.0.0 | Stage: D2 Design System*

---

## 1. Gamification Component Philosophy

In accordance with our **"Gaming-Inspired Learning"** direction, gamification components are designed to feel satisfying and prestigious like an esports or RPG progression dashboard, while remaining strictly unobtrusive during active typing practice.

---

## 2. Component Specifications

### 2.1 Component G-01: XP Progress Bar & Level Pill
- **Purpose:** Anchors the user's overall progression in the sidebar footer and dashboard header.
- **Anatomy:**
  - **Level Hexagon Badge:** Compact badge displaying current Level (e.g. `14`).
  - **Tier Title:** Small uppercase label (e.g. `APPRENTICE TYPIST`).
  - **XP Numerical Counter:** `4,250 / 5,000 XP (85%)` in tabular JetBrains Mono.
  - **Gradient Track:** 8px high progress track with gradient fill from `#3B82F6` (Electric Blue) to `#06B6D4` (Cyan).
- **Animation:** On level-up, the bar fills to 100%, flashes white, and rolls back to 0% with a level-increment number spring.

### 2.2 Component G-02: Daily Streak Flame & Shield Counter
- **Purpose:** Reinforces the daily practice habit loop.
- **Anatomy:**
  - **Flame Icon:** Animated SVG flame tinted `#F97316` (Orange) with subtle glowing drop shadow.
  - **Streak Counter:** Bold tabular text (e.g., `7 Days`).
  - **Freeze Shield Indicator:** Ice cyan shield badge (`#38BDF8`) displaying available freeze count (e.g., `🛡 1/2`).
  - **Status Text:** e.g., `"Goal met today ✓"` or `"12 mins remaining"`.

### 2.3 Component G-03: Personal Best (PB) Celebration Banner
- **Purpose:** Surfaces at the top of the Results screen (`SCR-203`) when a new all-time high speed is set.
- **Anatomy:**
  - Pill badge with golden gradient background (`rgba(245, 158, 11, 0.15)`), 1px gold border (`#F59E0B`).
  - Icon: Glowing trophy glyph (`🏆`) + text: `"NEW PERSONAL BEST! +8 WPM"`.
  - Sparkle particles: Subtle CSS twinkle dots around the badge border.

### 2.4 Component G-04: Achievement Badge & Trophy Card
- **Variants:**
  1. *Unlocked Trophy:* Metallic 3D emblem (Brushed Bronze, Polished Silver, Gold, Platinum, Diamond) with high-contrast title, description, unlock date, and "+500 XP" tag.
  2. *Locked Trophy:* Dark silhouette with translucent border, lock icon (`🔒`), and a live progress tracker (e.g., `"Hit 100 WPM on 60s test: 94 / 100 WPM"`).
  3. *Secret Achievement:* Obfuscated title (`"???"`) with hint: `"Achieve rhythmic mastery in Zen mode"`.

### 2.5 Component G-05: Challenge & Daily Mission Card
- **Purpose:** Surfaces 3 daily objectives on the Dashboard to incentivize focused practice.
- **Examples:**
  - *"Precision Drill: Complete two 60s tests with $\ge 98\%$ accuracy."*
  - *"Pinky Workout: Drill 'P' and 'Q' for 5 minutes."*
  - *"Code Sprint: Type 50 lines of Python syntax."*
- **Anatomy:** Mission title, XP bounty pill (`+200 XP`), progress bar (`1 / 2 Completed`), and one-click "Start Mission" action button.

### 2.6 Component G-06: Reward Notification Toast
- **Purpose:** Alerts the user to an unlocked trophy, level-up, or earned freeze shield.
- **Behavior:**
  - Strictly deferred during active typing; unfurls smoothly on the Results screen or Dashboard.
  - Slides in from bottom-right (`translateY(20px) -> translateY(0)`), auto-dismisses after 4500ms or on click.

### 2.7 Component G-07: Arcade Game Score HUD
- **Purpose:** Floating HUD for arcade games (*Falling Words*, *Time Attack*).
- **Anatomy:**
  - Live Score: Tabular 6-digit score (`048,250`).
  - Combo Multiplier Pill: Luminous cyan badge (`4x COMBO`).
  - Defense Shield Health Bar: Color-shifting bar (Emerald $100\% \rightarrow$ Amber $50\% \rightarrow$ Red $20\%$).
