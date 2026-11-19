# DASHBOARD UX SPECIFICATION (D3)
**Typing Trainer — Windows Desktop Application**
*Screen ID: SCR-101 | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D3 Dashboard Design*

---

## 1. Executive Summary & Governance Alignment

The **Dashboard Command Center (`SCR-101`)** is the primary home workspace of the Typing Trainer desktop application. It serves as the user's daily anchor, immediately communicating performance trajectory, daily habit progress, touch-typing curriculum advancement, algorithmic practice recommendations, and access to all practice modes.

### 1.1 Governance Record & D2 Resolution
In accordance with Product Owner approval:
1. **Figma Starter Plan Constraint Accepted:** The existing Auto-Layout master frames on Page 2 and Page 3 of the Figma file (`LvHRp11TZikdxNFeZvapO0`) serve as the official visual design source of truth. Formal React component publishing is scheduled for application implementation.
2. **Primary Button Contrast Rule Corrected:**
   - The D2 audit proved that white text on `#3B82F6` yields **3.67:1**, which fails WCAG AA for normal text ($< 18.5\text{px}$ bold or $< 24\text{px}$ regular).
   - **Resolution:** In both Dark and Light themes, all primary buttons and interactive focus states standardize on **`#2563EB` (Cobalt Blue)**, achieving a verified **5.17:1** contrast ratio with `#FFFFFF` (exceeding WCAG AA $\ge 4.5:1$).
3. **Deterministic Logic Baseline:** All recommendations on the Dashboard are computed strictly from local SQLite keystroke matrices without cloud APIs, local LLMs, or telemetry transmission.

---

## 2. Core User Experience Goals

| User Goal | Dashboard Affordance | Time-to-Action |
|---|---|---|
| **Resume Daily Habit** | Prominent Daily Goal progress ring + "Start Daily Practice" primary button. | $< 2$ seconds |
| **Check Current Performance** | Four hero metric cards: Best WPM, Average WPM, Accuracy %, Total Practice Time. | At-a-glance ($< 1\text{ s}$) |
| **Fix Specific Mistakes** | Algorithmic "Keys to Improve" recommendation card highlighting top 3 error keys. | 1-click drill launch |
| **Inspect Habit Consistency** | 7-day Weekly Practice Activity chart + Compact WPM trend curve. | At-a-glance |
| **Choose Specific Mode** | 5 Quick Practice Action Cards (Typing Test, Learning, Weak Keys, Dev Mode, Games). | 1-click routing |
| **Review Progression & Tiers** | Level indicator (Levels 1–100), XP progress track, streak flame, and trophy highlights. | At-a-glance |

---

## 3. Visual Personality & Emotional Tone

The visual personality adheres to **Direction D: Gaming-Inspired Learning**:
- **Professional & Modern:** Clean typographic hierarchy (`Inter` + `JetBrains Mono`), structured 4px grid spacing, consistent card radii (`rounded-xl` 12px), and restrained 1px surface borders.
- **Motivating & Luminous:** Subtle glowing status accents (Electric Blue `#2563EB`, Emerald `#10B981`, Amber Gold `#F59E0B`), celebratory streak flame, and metallic achievement emblems.
- **Calm & Uncluttered:** No flashing arcade marquees, no intrusive popups, no garish rainbow gradients, and no juvenile cartoon characters.

---

## 4. High-Level Information Architecture (9 Functional Regions)

```
+-------------------------------------------------------------------------------+
| TITLEBAR: Windows Chrome • [⌨] Typing Trainer • Offline-Ready [●] • [Ctrl+K]  |
+-------------------+-----------------------------------------------------------+
| SIDEBAR (240px)   | 01. WELCOME & DAILY GOAL HERO (Greeting, Goal Ring, CTA)  |
|                   +-----------------------------------------------------------+
| OVERVIEW          | 02. PERFORMANCE CARDS (Best WPM, Avg WPM, Acc %, Time)    |
|   [📊] Dashboard  +-----------------------------+-----------------------------+
|        (ACTIVE)   | 03. WEEKLY ACTIVITY CHART   | 04. WPM PERFORMANCE TREND   |
| PRACTICE          |     (7-Day Duration & Goals)|     (Recent Sessions Curve) |
|   [⚡] Test       +-----------------------------+-----------------------------+
|   [🎓] Learning   | 05. WEAK-KEY RECOMMENDATIONS (Algorithmic: R, T, P keys)  |
|   [🎯] Drills     +-----------------------------------------------------------+
|   [💻] Developer  | 06. QUICK PRACTICE ACTION CARDS (5 Interactive Portals)   |
|   [🎮] Games      +-----------------------------+-----------------------------+
| MASTERY           | 07. GAMIFICATION & STREAKS  | 08. PERSONAL BEST SHOWCASE  |
|   [📈] Analytics  |     (Lvl 12, XP, 5-Day Flame|     (Sprint, 60s, Dev Mode) |
|   [🏆] Trophies   +-----------------------------+-----------------------------+
|   [⚙] Settings    | 09. RECENT SESSIONS HISTORY LOG TABLE                     |
| [●] Lvl 12 Typist +-----------------------------------------------------------+
| 🔥 5 Day Streak   | STATUS BAR: [Tab+Enter] Quick Test | [Ctrl+K] Search | 0ms|
+-------------------+-----------------------------------------------------------+
```

---

## 5. Sample Data Profile (Illustrative Baseline & Metric Definitions)

To ground the high-fidelity design without fabricating unverified user data, the Dashboard visualizes a realistic intermediate touch-typist. 

> [!NOTE]
> All sample metrics shown below are strictly illustrative design placeholders and do not represent actual live user telemetry. As an offline-first desktop application without remote telemetry, all metrics are computed locally. Fictitious external population claims (such as "Top 15% worldwide") are strictly omitted.

- **User Alias:** "Alex (Typing Enthusiast)"
- **Current Rank:** Level 12 (Apprentice Typist, Tier 2 of 6)
- **XP Status:** 2,450 / 3,000 XP (81.6% to Level 13)
- **Daily Goal:** 20 Minutes / Day (Completed: 12m, Remaining: 8m)
- **Practice Streak:** 5 Days (Protected by 1 Streak Freeze Shield)
- **Standardized Performance Metrics:**
  - **All-Time Personal Best (PB):** **72 WPM** (Standard 60s benchmark test)
  - **Average WPM:** **58 WPM** (Rolling 30-session arithmetic mean of completed sessions)
  - **Highest 15-second WPM:** **78 WPM** (Short-burst sprint benchmark)
  - **Highest 60-second WPM:** **72 WPM** (Standard endurance benchmark)
  - **Developer Mode WPM:** **51 WPM** (Syntax, bracket, and symbol typing benchmark)
  - **Accuracy:** **96.4%** (Overall mean accuracy; target is $\ge 95\%$)
  - **Total Practice Time:** **18h 35m** across 142 completed sessions
- **Identified Weak Keys (Deterministic Local Analysis):** `R` (72% accuracy), `T` (78% accuracy), `P` (81% accuracy)
