# PHASE 3 STAGE 2.4: DISCOVERY & GAP AUDIT REPORT
## Gamification Progression, Personal Best Showcase & Recent Session History

**Project:** Typing Trainer  
**Phase:** 3  
**Stage:** 2.4.0 (Discovery & Technical Gap Audit)  
**Approved Baseline Commit:** `22d4dea`  
**Previous Stage:** Stage 2.3, formally approved and closed  
**Product Owner:** Fairoz  
**Lead Engineer:** Antigravity  
**Status:** **DISCOVERY COMPLETE — AWAITING PRODUCT OWNER REVIEW & STAGE 2.4.1 AUTHORIZATION**

---

## 1. Executive Summary & Verification of Baseline

Before analyzing requirements and proposing changes, the workspace and Git status were verified:
- **Current Branch:** `master`
- **Current HEAD Commit:** `22d4dea` (`docs: finalize Phase 3 Stage 2.3 reconciliation audit report with full test evidence`)
- **Working Tree:** Completely clean (`nothing to commit, working tree clean`)
- **Backend Test Status:** 54/54 passing
- **Frontend Test Status:** 64/64 passing
- **Strict Scope Boundary:** No code has been modified. Stage 2.4 is currently in Stage 2.4.0 Discovery only.

This discovery audit evaluates the data, architecture, calculation, and UI requirements for the three authorized Dashboard widgets:
1. **W-08:** Gamification Progression & Streak Widget
2. **W-09:** Personal Best Showcase
3. **W-10:** Recent Practice Sessions Table

---

## 2. Review of Approved Specifications (D1–D7)

### 2.1 W-08: Gamification Progression & Streak Widget
- **Location & Geometry:** Row 5, Left Column (`Width: 540px`, `Height: 180px`).
- **Approved D3/D5 Gamification Rules:**
  - **Base Effort XP:** Separately rounded word component plus separately rounded active-minute component:
    $$\text{Base XP} = \text{round}(\text{WordsTyped} \times 0.2) + \text{round}(\text{ActiveMinutes} \times 5)$$
  - **Performance Multipliers:** Acc $\ge 98\%$ ($1.50\times$), $\ge 95\%$ ($1.20\times$), $\ge 90\%$ ($1.00\times$), $\ge 80\%$ ($0.75\times$), $< 80\%$ ($0.50\times$).
  - **Diminishing Returns:** Applies exclusively to lesson attempts scoped to lesson ID and calendar day (Attempts 1–3: 100%, 4–5: 50%, 6+: 0%).
  - **Daily Goal Bonus:** $+150$ XP awarded strictly once per local calendar day upon reaching the daily practice goal; recorded in `user_reward_ledger`.
  - **Level Progression Curve:** Authoritative formula:
    $$\text{XP\_req}(L) = \text{round}(120 \times L^{1.35})$$
  - **Streak & Freeze Shields:** 1 freeze shield earned per 7 consecutive days of daily goal achievement; inventory capped at 2. Missed day automatically consumes 1 shield if available.
  - **Authoritative Boundary:** The Spring Boot backend computes and persists all gamification state. The React frontend must never compute or award XP.

### 2.2 W-09: Personal Best Showcase
- **Location & Geometry:** Row 5, Right Column (`Width: 540px`, `Height: 180px`).
- **Benchmark Categories & Eligibility Criteria:**
  1. **15-Second Sprint PB:** Fastest sprint with $\ge 95.0\%$ accuracy on the standard corpus.
  2. **Official 60-Second Typing Test PB:** Official benchmark with standard corpus, accuracy $\ge 95.0\%$, pause count $\le 2$, and cumulative pause duration $\le 60.0$ seconds. Paused time is excluded from active elapsed time. Ineligible attempts must not overwrite official records.
  3. **Developer Mode PB:** Highest Net WPM typing multi-line code blocks with syntax symbols with $\ge 95.0\%$ accuracy.
  4. **Longest Practice Session:** Longest uninterrupted continuous session (duration in minutes/seconds).
- **Data Integrity & Non-Fabrication:**
  - Distinguish unrecorded/unavailable records (`null`) from zero-valued records.
  - Never fabricate placeholder personal bests for new users. An empty state must be rendered gracefully with clear qualification guidance.

### 2.3 W-10: Recent Practice Sessions Table
- **Location & Geometry:** Row 6, Full Width (`Width: 1100px`, `Height: 200px+`).
- **Required Columns:**
  - Date & Time (formatted in user's local timezone)
  - Practice Mode ("60s Benchmark", "15s Sprint", "Learning Mode", "Skill Drills", "Developer Mode", "Typing Game")
  - Duration (formatted mm:ss)
  - Net WPM
  - Accuracy (%)
  - XP Earned
  - Session Status / Benchmark Badge ("Official Benchmark", "Practice", "Custom")
- **Architecture Requirements:**
  - Backend pagination support (`page`, `size`, `sort`).
  - Chronological descending order (newest first).
  - Accessible HTML `<table>` with ARIA labeling.
  - Explicit empty, loading, error, and populated states.
  - Zero redundant backend requests on initial load.

---

## 3. Existing Backend Architecture & Data Audit

### 3.1 Database Schema (Flyway V1 & V2)
Inspection of `backend/src/main/resources/db/migration/V2__create_dashboard_schema.sql` reveals:
- `user_gamification`: `user_id, total_xp, current_level, current_tier, current_streak_days, longest_streak_days, freeze_shields_available, last_practice_date, updated_at`.
- `user_reward_ledger`: `reward_event_id, session_id, reward_type, xp_amount, awarded_at`.
- `typing_sessions`: `id, gross_wpm, net_wpm, accuracy, total_errors, raw_characters, correct_characters, duration_seconds, passage, completed_at, session_mode, test_duration_target, is_official_benchmark, xp_earned`.

**Result:** The database schema already possesses all necessary tables, columns, indexes, and constraints. **No new database migrations are required for Stage 2.4.**

### 3.2 Existing API Endpoints
1. `GET /api/v1/dashboard/summary` (supports `X-Timezone` header):
   - Currently returns `userStatus`, `dailyGoal`, `primaryMetrics`, `weeklyActivity`, `wpmTrend`, `weakKeyRecommendations`, `weakKeyOverview`, `personalBests`, and `recentSessions` (top 5).
2. `GET /api/v1/sessions?page=0&size=20&sort=completedAt,desc`:
   - Returns `PagedResponse<TypingSessionResponse>`.
   - Supports paginated session retrieval.

---

## 4. Technical Gaps & Required Smallest Changes

### 4.1 Gap 1: 15-Second Benchmark Eligibility in Backend
- **Current Behavior:**
  In `TypingSessionService.java`:
  ```java
  public boolean evaluateBenchmarkEligibility(double accuracy, int durationTarget, String corpusType,
                                              int pauseCount, double cumulativePauseSeconds) {
      if (accuracy < 95.0) return false;
      if (durationTarget != 60) return false; // <-- CRITICAL DEFECT
      if ("CUSTOM".equalsIgnoreCase(corpusType)) return false;
      if (pauseCount > 2) return false;
      if (cumulativePauseSeconds > 60.0) return false;
      return true;
  }
  ```
  `evaluateBenchmarkEligibility` rejects any session where `durationTarget != 60`. Consequently, official 15-second sprints have `officialBenchmark = false`. When `findTopBenchmark(15, 95.0, ...)` runs in `DashboardService`, it queries `s.officialBenchmark = true` and fails to find any 15-second records.
- **Proposed Smallest Fix:**
  Update the duration gate to allow both approved benchmark durations:
  ```java
  if (durationTarget != 60 && durationTarget != 15) return false;
  ```

### 4.2 Gap 2: Personal Best DTO Metadata (Accuracy and Timestamps)
- **Current Behavior:**
  In `DashboardSummaryResponse.PersonalBestsDto`:
  ```java
  public record PersonalBestsDto(
          Double best15sWpm,
          Double best60sWpm,
          Double bestDevModeWpm,
          Double longestSessionSeconds
  ) {}
  ```
  The DTO only returns four raw numeric metrics. The accuracy and completion timestamps of the winning sessions (e.g., `84 WPM @ 99.1% Acc`, `Nov 18`) are discarded.
- **Proposed Smallest Fix:**
  Enhance `PersonalBestsDto` with companion accuracy and date fields:
  ```java
  public record PersonalBestsDto(
          Double best15sWpm,
          Double best60sWpm,
          Double bestDevModeWpm,
          Double longestSessionSeconds,
          Double best15sAccuracy,
          Double best60sAccuracy,
          Double bestDevModeAccuracy,
          Double longestSessionAccuracy,
          String best15sDate,
          String best60sDate,
          String bestDevModeDate,
          String longestSessionDate
  ) {
      // Backward-compatible constructor for existing tests
      public PersonalBestsDto(Double best15sWpm, Double best60sWpm, Double bestDevModeWpm, Double longestSessionSeconds) {
          this(best15sWpm, best60sWpm, bestDevModeWpm, longestSessionSeconds, null, null, null, null, null, null, null, null);
      }
  }
  ```
  In `DashboardService.java`, extract `top15s.get(0).getAccuracy()`, `top60s.get(0).getAccuracy()`, `topDev.get(0).getAccuracy()`, and `completedAt`.

### 4.3 Gap 3: `TypingSessionResponse` Missing Fields for Pagination
- **Current Behavior:**
  In `TypingSessionResponse.java`:
  ```java
  public record TypingSessionResponse(
          String id,
          double grossWpm,
          double netWpm,
          double accuracy,
          int totalErrors,
          int rawCharacters,
          int correctCharacters,
          double durationSeconds,
          String passage,
          Instant completedAt
  ) {}
  ```
  The paginated endpoint `GET /api/v1/sessions` drops `sessionMode`, `xpEarned`, and `officialBenchmark`. W-10 needs these fields to render the "Practice Mode", "XP Earned", and "Status" columns during pagination.
- **Proposed Smallest Fix:**
  Add `sessionMode`, `xpEarned`, and `isOfficialBenchmark` to `TypingSessionResponse` and update `TypingSessionService.toResponse()`. Provide an overloaded constructor for complete backward compatibility with existing tests.

### 4.4 Gap 4: Frontend Typed Session Client & Types
- **Current Behavior:**
  No `sessionService.ts` exists in `desktop/src/services/api/`.
- **Proposed Smallest Fix:**
  Create `desktop/src/services/api/sessionService.ts` exporting:
  ```typescript
  export class SessionService {
    public async getRecentSessions(page = 0, size = 5, sort = "completedAt,desc"): Promise<PagedResponse<TypingSessionResponse>> {
      return apiClient.get<PagedResponse<TypingSessionResponse>>(`/api/v1/sessions?page=${page}&size=${size}&sort=${sort}`, {
        requiresAuth: true,
      });
    }
  }
  ```
  Declare `PagedResponse<T>` and `TypingSessionResponse` in `desktop/src/services/api/types.ts`.

### 4.5 Gap 5: Zero-Redundant Requests Strategy for W-10
- **Implementation Strategy:**
  1. On initial Dashboard render, W-10 receives `summary.recentSessions` from `DashboardSummaryResponse`.
  2. No secondary network request is dispatched on initial load.
  3. If the user navigates pages (Next/Previous), W-10 invokes `sessionService.getRecentSessions(page, 5)` to fetch the requested page from the backend.

---

## 5. UI/UX Widget Design & Accessibility Specifications

### 5.1 W-08: Gamification Progression & Streak Widget
- **Geometry:** Height 180px, rounded-xl border border-border bg-card shadow-sm.
- **Components:**
  - Level Crest: Hexagonal badge with current level (`Level 12`) and tier rank title (`Apprentice Typist`).
  - Dual-Gradient Progress Bar: `#2563EB` (Cobalt) to `#06B6D4` (Cyan).
  - XP Details: `2,450 / 3,000 XP (81.6%)` + `550 XP remaining to Level 13`.
  - Active Streak: `🔥 5-Day Active Streak`.
  - Freeze Shield Inventory: `🛡️ 1 Freeze Shield Available` (max 2) with status tooltip.
  - Daily Goal Status Pill: "Daily Goal Achieved (+150 XP credited)" vs "Goal in Progress".
- **Empty State:** For new user (Level 1, Novice, 0 XP, 0 streak), displays initial milestone *"Complete your first practice session to earn Base Effort XP"*.

### 5.2 W-09: Personal Best Showcase
- **Geometry:** Height 180px, rounded-xl border border-border bg-card shadow-sm.
- **Components:**
  - 4 Benchmark Tiles:
    1. 15s Speed Sprint (`⚡ 15s Sprint`)
    2. 60s Official Test (`🏆 60s Benchmark`)
    3. Developer Mode (`💻 Dev Studio`)
    4. Longest Session (`⏱️ Longest Session`)
  - Each tile displays:
    - Primary value: Net WPM (e.g. `84 WPM`) or Duration (e.g. `42m 15s`).
    - Secondary metadata: `@ 98.4% Acc` and completion date.
    - Status: "Verified Benchmark" (gold badge).
- **Empty State (Unrecorded Benchmarks):**
  - Renders dashed border with muted placeholder `"— WPM"` and educational subtext *"Requires ≥95% accuracy on standard benchmark"*.
  - Clearly distinguishes unrecorded (`null`) from zero.

### 5.3 W-10: Recent Practice Sessions Table
- **Geometry:** Full width (Row 6), rounded-xl border border-border bg-card shadow-sm.
- **Table Columns:**
  1. **Mode / Activity:** Mode badge (Typing Test, Learning Mode, Skill Drills, Dev Mode, Games).
  2. **Net Speed:** Formatted Net WPM with raw gross speed.
  3. **Accuracy:** Formatted percentage with color tier (emerald for $\ge 95\%$, amber for $90–94\%$, rose for $< 90\%$).
  4. **Errors:** Error count tally.
  5. **Duration:** Formatted active duration (e.g., `1m 00s`).
  6. **XP Earned:** Green badge (e.g. `+45 XP`).
  7. **Date & Time:** Localized timestamp via user timezone.
- **Pagination Bar:**
  - "Showing 1 to 5 of N sessions"
  - `Previous` and `Next` buttons with disabled states.
- **Accessibility:**
  - Full semantic `<table>`, `<thead>`, `<tbody>`, `<th> scope="col"`, `<caption>`.
  - Keyboard focusable pagination controls with visible focus rings.
- **Empty State:**
  - Clean illustration, message *"No practice sessions recorded yet"*, and CTA *"Start your first session →"*.

---

## 6. Proposed Implementation Plan & Approval Gates

Upon Product Owner review and authorization, implementation will proceed through the established gates:

1. **Stage 2.4.1: Backend and Database Implementation**
   - Update `TypingSessionService.evaluateBenchmarkEligibility` to allow 15s and 60s benchmarks.
   - Enhance `PersonalBestsDto` with companion accuracy and date fields.
   - Update `DashboardService.java` to populate PB accuracy and dates.
   - Extend `TypingSessionResponse` with `sessionMode`, `xpEarned`, and `officialBenchmark`.
   - Add unit and integration tests covering:
     - 15s vs 60s benchmark eligibility.
     - Ineligible attempts ($< 95\%$ accuracy, custom corpus, $> 2$ pauses, $> 60$s pause duration) rejection.
     - Personal best query accuracy and null handling.
     - Paginated session queries and sorting.
   - Run `.\backend\mvnw.cmd test` and verify 100% pass.
   - Stop and report.

2. **Stage 2.4.2: Frontend Widget Implementation**
   - Implement `desktop/src/services/api/sessionService.ts` and update types in `dashboardTypes.ts` and `types.ts`.
   - Build `desktop/src/features/dashboard/components/GamificationProgressionWidget.tsx` (W-08).
   - Build `desktop/src/features/dashboard/components/PersonalBestShowcase.tsx` (W-09).
   - Build `desktop/src/features/dashboard/components/RecentSessionsTable.tsx` (W-10).
   - Add unit tests for each component covering empty, populated, boundary, and error states.
   - Integrate widgets into `desktop/src/features/dashboard/Dashboard.tsx` (Rows 5 & 6).
   - Stop and report.

3. **Stage 2.4.3: Integration and Verification**
   - Execute full test suites:
     - `.\backend\mvnw.cmd test -f backend/pom.xml`
     - `npm --prefix desktop test`
     - `npm --prefix desktop run typecheck`
     - `npm --prefix desktop run lint`
     - `npm --prefix desktop run build`
   - Capture 1440 × 900 screenshots in dark and light themes.
   - Stop and report.

4. **Stage 2.4.4: Documentation and Final Closure**
   - Produce `PHASE_3_STAGE_2_4_COMPLETION_REPORT.md`.
   - Stop and await Product Owner acceptance.

---

## 7. Stop Condition

In strict accordance with Section 9 of the Stage 2.4 Authorization:
- **No source code has been modified.**
- **Stage 2.4.1 has NOT been started.**
- **Antigravity has stopped and is awaiting Product Owner review and authorization of the Discovery Report to proceed to Stage 2.4.1.**
