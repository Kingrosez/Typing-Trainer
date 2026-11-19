# D6 MASTERY & PROGRESSION SPECIFICATION
**Typing Trainer — Windows Desktop Application**
*Module: 04. Skill Drills & Remediation Studio | Screen Scope: SCR-401 to SCR-405*
*Document Version: 1.0.0 | Stage: D6 Stage 2 UX and Functional Specifications*
*Date: 2026-11-18 | Status: SPECIFICATION COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. The Multi-Session Mastery Lifecycle

A core finding from pedagogical research is that **a single successful drill does not prove sustained motor mastery**. A student can achieve 100% accuracy on a short exercise through slow, hyper-cautious key hunting, only to regress to high-error adjacent drifting when typing at full speed.

To establish genuine, permanent motor competence, D6 enforces a **3-Session Mastery Qualification Lifecycle** (Decision D6-03).

```
+---------------------------------------------------------------------------------------------------+
|                                 3-SESSION MASTERY STATE MACHINE                                    |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [State 0: WEAK KEY] ───────────────────────────────────────────────────┐                         |
|    - Error Rate > 8.0% across >= 20 strokes                             │                         |
|    - Consecutive Clean Sessions: 0 of 3                                 │                         |
|         │                                                               │                         |
|         ▼ (Session 1: >=30 strokes, <=3.0% error)                       │                         |
|  [State 1: IN TRAINING]                                                 │                         |
|    - Consecutive Clean Sessions: 1 of 3                                 │                         |
|         │                                                               │                         |
|         ├──► Fails Gate (Error > 3.0% on >=30 strokes) ─────────────────┤                         |
|         │                                                               │ (Reset Counter to 0)    |
|         ▼ (Session 2: >=30 strokes, <=3.0% error)                       │                         |
|  [State 2: VALIDATING]                                                  │                         |
|    - Consecutive Clean Sessions: 2 of 3                                 │                         |
|         │                                                               │                         |
|         ├──► Fails Gate (Error > 3.0% on >=30 strokes) ─────────────────┘                         |
|         │                                                                                         |
|         ▼ (Session 3: >=30 strokes, <=3.0% error)                                                 |
|  [State 3: MASTERED / REMEDIATED] ◄── [CERTIFIED GOLD BADGE]                                      |
|    - Consecutive Clean Sessions: 3 of 3                                                           |
|    - Keycap turns Emerald Green (#10B981)                                                         |
|    - Graduated from active Weak-Key Watchlist                                                     |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Formal State Definitions & Transitions

### State 0: WEAK KEY (Active Friction)
- **Entry Condition:** Key has $O_k \ge 20$ opportunities in `key_telemetry_window` with $ErrRate_k > 8.0\%$.
- **UI Presentation:** Highlighted in Coral Red (`#EF4444`) on heatmap; listed on `SCR-401` Watchlist.
- **Mastery Counter:** `consecutive_clean_sessions = 0`.

### State 1: IN TRAINING (First Qualifying Session)
- **Transition Event:** Student completes a drill or test session containing $O_{session}(k) \ge 30$ target opportunities with $ErrRate_{session}(k) \le 3.0\%$.
- **Action:** `consecutive_clean_sessions` increments from 0 to 1.
- **UI Presentation:** Progress bar in `SCR-405` displays `1 of 3 Clean Sessions Logged (33%)`.

### State 2: VALIDATING (Second Qualifying Session)
- **Transition Event:** Student completes a second distinct session containing $O_{session}(k) \ge 30$ with $ErrRate_{session}(k) \le 3.0\%$.
- **Action:** `consecutive_clean_sessions` increments from 1 to 2.
- **UI Presentation:** Progress bar in `SCR-405` displays `2 of 3 Clean Sessions Logged (66%)`. Badge reads: *"Validating Technique — 1 Clean Session Remaining"*.

### State 3: MASTERED (Certified Remediation)
- **Transition Event:** Student completes the third qualifying session with $\ge 30$ opportunities and $\le 3.0\%$ error.
- **Action:** 
  - `consecutive_clean_sessions` reaches 3.
  - `current_status` in `key_mastery_tracker` updates to `'MASTERED'`.
  - Timestamp written to `mastered_at`.
- **UI Presentation:** Golden celebration toast in `SCR-405`; keycap on `SCR-402` heatmap transitions to **Emerald Green (`#10B981`)**; key is removed from the active Weak-Key Watchlist on `SCR-401`.

---

## 3. Demotion & Regression Safeguards

Typing mastery requires maintenance. If a previously mastered key later regresses during regular typing:
1. **The 100-Stroke Rolling Safety Net:**
   - Because the heatmap is driven by the rolling 100-stroke window (`key_telemetry_window`), if a student's error rate on key $k$ rises above $5.0\%$ during general tests, the key status automatically shifts from `MASTERED` to `DEVELOPING`.
   - If error rate rises above $8.0\%$, the key returns to `WEAK_KEY` and re-enters the active Watchlist.
2. **Grace Threshold:**
   - Occasional single errors do not instantly demote a mastered key. Demotion occurs strictly when the 100-stroke rolling average crosses the classification boundary, preventing frustrating flickers.

---

## 4. Gamification, XP & Achievement Integration

D6 remediation seamlessly integrates with the established D3/D5 gamification architecture:

### 4.1 Base XP & Accuracy Multiplier Allocation
Every completed drill awards deterministic Base Effort XP scaled by the session accuracy multiplier:
$$\mathbf{XP_{session} = \text{round}(XP_{adjusted\_base} \times RetakeTier)}$$
- Reuses the D3 base formula: $XP_{base} = \text{round}(Words \times 0.2) + \text{round}(Minutes \times 5)$.
- Applies D3 performance multipliers: $+50\%$ for $\ge 98\%$, $+20\%$ for $95–97.9\%$.
- Enforces approved **Option A Daily Diminishing Returns** (Attempts 1–3: 100%, Attempts 4–5: 50%, Attempts 6+: 0% Base XP; Attempt 1 includes the initial attempt).

### 4.2 Daily Practice Goal Contribution
- 100% of physical active practice minutes logged in `SCR-404` accumulate toward the student's daily goal (e.g. 20 minutes) and protect their active streak, even if the session is past attempt 5 and earns 0 XP.

### 4.3 D6 Specific Achievement Milestones (Stored in `user_reward_ledger`):
- **"Precision Repair" (+100 XP):** Graduate your first weak key to Mastered status.
- **"Pinky Perfection" (+250 XP):** Bring all Right Pinky keys (`P, ;, /, 0, -, =`) to $\ge 97\%$ accuracy.
- **"Clean Sweep" (+500 XP):** Eliminate all active weak keys from the studio watchlist with zero keys above 8% error.
- **"Iron Resilience" (+300 XP):** Recover a key from $> 15\%$ error rate to Mastered ($\le 3\%$).
