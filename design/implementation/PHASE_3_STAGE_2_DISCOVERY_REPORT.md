# PHASE 3 STAGE 2: DASHBOARD FRONTEND DISCOVERY & WIDGET MAPPING REPORT

**Project:** Typing Trainer  
**Document Version:** 1.0.0  
**Stage:** Phase 3 Stage 2.0 (Audit & Mapping)  
**Author:** Antigravity (Engineering Lead)  
**Reviewed by:** Product Owner (Pending Review)  
**Baseline Commit:** `36e963b45879f166a86de490077806345f6294ba`  
**Previous Phase:** Phase 3 Stage 1 (Backend & Database Reconciliation, Closed)  

---

## 1. Executive Summary & Governance Authorization

Phase 3 Stage 1 successfully implemented, reconciled, and verified the complete local backend foundation, SQLite database schema (`V2__create_dashboard_schema.sql`), deterministic calculation engines, and REST endpoints for the Typing Trainer Dashboard. All 35 backend tests and 15 frontend tests pass cleanly with zero warnings or errors.

Stage 2 authorized scope is **Dashboard Frontend Integration only**. In accordance with mandatory governance rules:
- **Current Substage:** **Stage 2.0 (Audit and Mapping only)**.
- **Mandatory Approval Gate:** No frontend source code (`.ts`, `.tsx`, `.css`) is modified in this stage. Implementation begins only upon formal Product Owner review and authorization of this discovery and mapping report.
- **Strict Anti-Mock Policy:** No fake user statistics, simulated progress, hardcoded XP balances, or fabricated test records will be embedded in components. Unpopulated data must render the approved educational zero state or semantic empty state.
- **Authoritative Backend:** The Spring Boot backend is the sole source of truth for XP, level curves, streak calculation, freeze shield inventory, and weak-key algorithmic recommendations. The frontend never computes or persists gamification metrics independently.

---

## 2. Existing Frontend Code Audit (`desktop/src/features/dashboard/Dashboard.tsx`)

An inspection of the current frontend repository reveals the initial Phase 1 desktop shell placeholder implementation:

### 2.1 Current Implementation State
- **File:** `desktop/src/features/dashboard/Dashboard.tsx` (273 lines)
- **Structure:**
  - Simple `PageHeader` with title "Dashboard" and a navigation button to `/typing-test`.
  - A 3-card top grid containing hardcoded placeholder strings:
    - *"0 Days Active"* (with static subtitle *"Complete a session to start your daily practice streak."*)
    - *"-- WPM"* (with static subtitle *"No tests recorded yet. Start a test to record your baseline."*)
    - *"Level 1 Novice"* (with static subtitle *"0 / 100 XP to reach Level 2 Apprentice."*)
  - A 6-card "Practice Arenas" grid providing route navigation (`/typing-test`, `/learning-mode`, `/skill-drills`, `/developer-mode`, `/typing-games`, `/analytics`) with keyboard shortcut badges (`Ctrl+2` through `Ctrl+7`).

### 2.2 Gaps Against Approved D3 Specifications
The current placeholder implementation deviates significantly from the 10-widget command center layout defined in `design/D3-dashboard/DASHBOARD_WIDGET_SPECIFICATIONS.md` and `DASHBOARD_LAYOUT.md`:
1. **Missing Widget 01 (Welcome & User Status Header):** No personalized greeting, user rank pill, or dynamic streak encouragement header.
2. **Missing Widget 02 (Daily Practice Goal Progress Capsule):** No circular SVG progress ring, elapsed vs. target minutes display, or goal-setting modal trigger.
3. **Incomplete Widget 03 (Four Primary Metric Cards):** Shows only 3 unstructured cards instead of the standard 4-card semantic `<dl>` grid (`BEST WPM`, `AVERAGE WPM`, `ACCURACY`, `PRACTICE TIME`).
4. **Missing Widget 04 (Weekly Practice Activity Chart):** No 7-day bar chart, target threshold indicator, or day completion checkmarks.
5. **Missing Widget 05 (WPM Performance Trend Curve):** No 15-session Recharts bezier trend curve with error spike annotations.
6. **Missing Widget 06 (Weak-Key Recommendation Banner):** No algorithmic weak-key hero banner displaying identified problem keys (WPI), diagnostic text, or direct 1-click drill CTA.
7. **Widget 07 (Quick Practice Action Cards):** Needs re-alignment to the approved 5-portal layout (Typing Test, Learning Mode, Skill Drills, Developer Mode, Typing Games) matching D3 Row 4 geometry.
8. **Missing Widget 08 (Gamification Progression & Streak Widget):** No level crest, XP progress bar (`xpProgressInLevel / xpRequiredForNextLevel`), streak flame counter, or streak freeze shield inventory indicator.
9. **Missing Widget 09 (Personal Best Showcase):** No official benchmark showcase for 15s sprint, 60s standard PB ($\ge 95\%$ accuracy), Developer Mode WPM, or longest continuous session.
10. **Missing Widget 10 (Recent Practice Sessions Log Table):** No historical telemetry audit table displaying the last 3 completed sessions.
11. **Missing Operational States (States 01, 07, 08):**
    - No Educational Zero State for new users ($N = 0$).
    - No pulsing shimmer skeleton loading state (`animate-pulse`) matching final card dimensions.
    - No offline / local database busy error recovery banner with retry capabilities.

---

## 3. Backend REST Contracts & DTO Alignment

The backend foundation delivers all required metrics through a unified, high-performance endpoint designed to resolve in $< 15\text{ ms}$ on local SQLite.

### 3.1 Endpoints
| HTTP Method | Path | Headers | Request Body | Response DTO | Purpose |
|---|---|---|---|---|---|
| `GET` | `/api/v1/dashboard/summary` | `X-Request-Token`<br>`X-Timezone` *(optional)* | *None* | `DashboardSummaryResponse` | Unified command center data package |
| `PUT` | `/api/v1/dashboard/daily-goal` | `X-Request-Token`<br>`X-Timezone` *(optional)* | `DailyGoalUpdateRequest` | `DailyGoalDto` | Updates user daily practice target (1–120 mins) |

### 3.2 Backend DTO Field Specification
The backend Java records map directly to the frontend domain models:

```typescript
// Proposed desktop/src/services/api/dashboardTypes.ts

export interface UserStatusDto {
  displayName: string;
  currentLevel: number;
  currentTier: string;
  totalXp: number;
  xpProgressInLevel: number;
  xpRequiredForNextLevel: number;
  currentStreakDays: number;
  longestStreakDays: number;
  freezeShieldsAvailable: number;
}

export interface DailyGoalDto {
  targetMinutes: number;
  completedSecondsToday: number;
  remainingSecondsToday: number;
  progressPercentage: number;
  isCompletedToday: boolean;
}

export interface PrimaryMetricsDto {
  bestWpm: number | null;
  averageWpm: number | null;
  accuracy: number | null;
  totalPracticeSeconds: number;
  completedSessionCount: number;
  currentSessionWpm: number | null;
}

export interface WeeklyActivityDayDto {
  dayOfWeek: string;    // "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
  date: string;         // "YYYY-MM-DD"
  durationSeconds: number;
  goalMet: boolean;
  isToday: boolean;
}

export interface WpmTrendPointDto {
  sessionId: string;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  totalErrors: number;
  completedAt: string;
}

export interface WeakKeyDto {
  keyChar: string;
  errorRate: number;
  accuracy: number;
  opportunities: number;
  errors: number;
  wpi: number;
  tier: string;
  explanation: string;
}

export interface PersonalBestsDto {
  best15sWpm: number | null;
  best60sWpm: number | null;
  bestDevModeWpm: number | null;
  longestSessionSeconds: number | null;
}

export interface RecentSessionSummaryDto {
  id: string;
  sessionMode: string;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  totalErrors: number;
  durationSeconds: number;
  xpEarned: number;
  completedAt: string;
}

export interface DashboardSummaryResponse {
  userStatus: UserStatusDto;
  dailyGoal: DailyGoalDto;
  primaryMetrics: PrimaryMetricsDto;
  weeklyActivity: WeeklyActivityDayDto[];
  wpmTrend: WpmTrendPointDto[];
  weakKeyRecommendations: WeakKeyDto[];
  personalBests: PersonalBestsDto;
  recentSessions: RecentSessionSummaryDto[];
}

export interface DailyGoalUpdateRequest {
  targetMinutes: number; // 1 to 120
}
```

### 3.3 API Client Infrastructure Extension
The existing `ApiClient` (`desktop/src/services/api/apiClient.ts`) supports standard `GET`, `POST`, `PUT`, `DELETE` with authentication. To support timezone-aware day boundaries on Windows:
- Enhance `ApiClient.request()` options to accept custom headers: `headers?: Record<string, string>`.
- When invoking `/api/v1/dashboard/summary` and `/api/v1/dashboard/daily-goal`, supply:
  ```typescript
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  headers: { "X-Timezone": timezone }
  ```
- This ensures daily goal progress and weekly calendar bars align perfectly with the user's local Windows clock without complex UTC shifts in the frontend.

---

## 4. Comprehensive Widget-by-Widget Mapping (W-01 through W-10)

| Widget ID | Name & Row | DTO Mapping Source | Data Fields Utilized | Visual & Semantic Rules | Empty / Zero-State Handling |
|---|---|---|---|---|---|
| **W-01** | **Welcome & User Status Header**<br>`Row 0 (Left 680px)` | `userStatus` | `displayName`, `currentLevel`, `currentTier`, `currentStreakDays` | - `<h1>` display headline.<br>- Luminous rank pill ("Level {L} • {Tier}").<br>- Motivational streak subtext. | If $N = 0$: *"Welcome to Typing Trainer, {displayName}! ⌨"* with educational intro. |
| **W-02** | **Daily Goal Progress Capsule**<br>`Row 0 (Right 380px)` | `dailyGoal` | `targetMinutes`, `completedSecondsToday`, `remainingSecondsToday`, `progressPercentage`, `isCompletedToday` | - Circular SVG ring (diameter 56px, stroke 5px).<br>- Electric Blue (`#2563EB`) if incomplete; Emerald Green (`#10B981`) with checkmark (`✓`) when met.<br>- JetBrains Mono tabular text: `{completed} / {target} mins`.<br>- Click opens `DailyGoalModal`. | When 0 seconds: Ring empty, shows `0 / {target} mins`, *"Start a session to seal today's streak."* |
| **W-03** | **Four Primary Metric Cards**<br>`Row 1 (4-col flex, 124px)` | `primaryMetrics` | `bestWpm`, `averageWpm`, `accuracy`, `totalPracticeSeconds`, `completedSessionCount` | - Semantic `<dl>` list with `<dt>` and `<dd>`.<br>- Numerical typography: `JetBrains Mono Bold 28px` with `tabular-nums`.<br>- Card 1: BEST WPM (60s benchmark).<br>- Card 2: AVERAGE WPM (trailing 30 mean).<br>- Card 3: ACCURACY (weighted precision).<br>- Card 4: PRACTICE TIME (`{h}h {m}m`). | If $N = 0$: Transforms into State 01 Educational Foundation cards explaining WPM, 95%+ Precision target, Cadence, and Home Row ergonomics. |
| **W-04** | **Weekly Practice Activity Chart**<br>`Row 2 (Left 540px, 240px)` | `weeklyActivity` | Array of 7 `WeeklyActivityDayDto` (`dayOfWeek`, `durationSeconds`, `goalMet`, `isToday`) | - 7 Day vertical columns.<br>- Goal threshold dashed horizontal line at target height.<br>- Day met: Emerald bar + `✓` checkmark.<br>- Rest day: Subtle outline bar + `-`.<br>- Today: Glowing blue highlight border.<br>- Hidden `<table class="sr-only">` for screen readers. | If $N = 0$: Shows empty bars for past 6 days and active Day 1 highlight, or educational curriculum roadmap. |
| **W-05** | **WPM Performance Trend Curve**<br>`Row 2 (Right 540px, 240px)` | `wpmTrend` | Array of up to 15 `WpmTrendPointDto` (`sessionId`, `netWpm`, `grossWpm`, `accuracy`, `totalErrors`, `completedAt`) | - Recharts smooth bezier curve in Electric Cobalt (`#2563EB`).<br>- Area gradient drop (`rgba(37,99,235,0.15)` to `transparent`).<br>- Error spike dots (`#EF4444`) when `totalErrors > 4`.<br>- Interactive hover tooltip with Net/Gross WPM, Accuracy, and Date. | If $N < 2$: Displays clean placeholder box: *"Complete at least 2 sessions to unlock speed and consistency trend visualization."* |
| **W-06** | **Weak-Key Hero Recommendation Banner**<br>`Row 3 (1100px, 140px)` | `weakKeyRecommendations` | Array of `WeakKeyDto` (`keyChar`, `errorRate`, `accuracy`, `opportunities`, `errors`, `wpi`, `tier`, `explanation`) | - Full-width banner with Cobalt border (`#2563EB`).<br>- Key badges: High-contrast red pills (`#EF4444` / `#DC2626`) showing key and accuracy %.<br>- Diagnostic explanatory text.<br>- Primary CTA button: `"Practice Weak Keys (3m Drill) ↵"`. Routes to `/skill-drills` with pre-seeded keys. | If empty or all keys $\ge 98\%$ accuracy: Transforms to **State 06 (Flawless Precision)** celebration card with speed sprint CTA. |
| **W-07** | **Quick Practice Action Cards**<br>`Row 4 (5-col grid, 130px)` | *Static client routes* | Route targets: `/typing-test`, `/learning-mode`, `/skill-drills`, `/developer-mode`, `/typing-games` | - 5 cards with distinctive iconography and color accents.<br>- Keyboard accelerator hints: `Ctrl+2` through `Ctrl+6`.<br>- Micro-interactions: 2px upward hover translation, active press depress, focus ring. | Always active and navigable in all states. |
| **W-08** | **Gamification Progression & Streak Widget**<br>`Row 5 (Left 540px, 180px)` | `userStatus` | `currentLevel`, `currentTier`, `totalXp`, `xpProgressInLevel`, `xpRequiredForNextLevel`, `currentStreakDays`, `freezeShieldsAvailable` | - Level Crest badge with Tier title.<br>- XP Progress bar: `{xpProgressInLevel} / {xpRequiredForNextLevel} XP` (`{percentage}%`).<br>- Streak status: `🔥 {currentStreakDays}-Day Active Streak`.<br>- Shield inventory: `🛡 {freezeShieldsAvailable} Streak Freeze Shield(s) Available`. | Displays Level 1 Novice, 0 / 120 XP, Day 1 readiness. |
| **W-09** | **Personal Best Showcase**<br>`Row 5 (Right 540px, 180px)` | `personalBests` | `best15sWpm`, `best60sWpm`, `bestDevModeWpm`, `longestSessionSeconds` | - 4 metric tiles in a 2x2 grid.<br>- Subdued metallic badge styling.<br>- Values in `JetBrains Mono`.<br>- Only official benchmarks ($\ge 95\%$ accuracy) displayed. | If metric is null: Displays `—` with tooltip *"Record a verified benchmark test with ≥ 95% accuracy to claim."* |
| **W-10** | **Recent Practice Sessions Log Table**<br>`Row 6 (1100px, 200px)` | `recentSessions` | Array of up to 3 `RecentSessionSummaryDto` (`id`, `sessionMode`, `netWpm`, `accuracy`, `totalErrors`, `durationSeconds`, `xpEarned`, `completedAt`) | - Audit table with headers: Activity, Speed, Accuracy, Errors, Duration, XP, Date.<br>- High-contrast status badges.<br>- Row hover highlight with pointer cursor. | If $N = 0$: Displays welcoming empty state card: *"No practice sessions recorded yet. Start your first typing test above to view telemetry logs."* |

---

## 5. Dashboard State Matrix (D3 States 01 through 08)

```
+---------------------------------------------------------------------------------------------------+
| DASHBOARD STATE CONTROLLER                                                                        |
|                                                                                                   |
|  [Loading?] --------(Yes)--------> State 07: Shimmer Skeleton (Zero Layout Shift)                 |
|      |                                                                                            |
|     (No)                                                                                          |
|      v                                                                                            |
|  [Error / Offline?] --(Yes)------> State 08: Amber Database Lock / Disconnect Recovery Banner     |
|      |                                                                                            |
|     (No)                                                                                          |
|      v                                                                                            |
|  [Sessions N == 0?] --(Yes)------> State 01: Educational Zero State (First-Time User)             |
|      |                                                                                            |
|     (No, N >= 1)                                                                                  |
|      v                                                                                            |
|  State 02: Returning User Command Center                                                          |
|      +-- Daily Goal: Incomplete (State 03) vs. Complete (State 04: Emerald + 150 XP Bonus)        |
|      +-- Weak Keys: Detected (Problem Badges) vs. None (State 06: Flawless Precision Card)        |
|      +-- Achievements: Unlocked in Session (State 05: Golden Shimmer Toast)                       |
+---------------------------------------------------------------------------------------------------+
```

### State 01: Educational Zero State ($N = 0$)
- **Trigger:** `primaryMetrics.completedSessionCount === 0`.
- **Presentation:**
  - Header displays *"Welcome to Typing Trainer, {displayName}! ⌨"*.
  - Metric cards display educational explanations of Net WPM, 95%+ Accuracy target, Typing Cadence, and Home Row positioning instead of confusing `0` or `N/A`.
  - Prominent Call to Action: `"Start Baseline Test (30 Seconds) →"`.
  - Streak displays *"Day 1: Ready to Begin"*.

### State 02: Returning User ($N \ge 1$)
- Full 10-widget live layout rendered with real SQLite telemetry.

### State 03 & 04: Daily Goal Status
- **State 03 (Incomplete):** Ring fills with Electric Blue (`#2563EB`). Subtitle indicates remaining minutes to seal streak.
- **State 04 (Completed):** Ring closes with Emerald Green (`#10B981`) and glowing checkmark (`✓`). Subtitle announces: *"Daily Practice Goal Completed! +150 XP Daily Bonus Awarded."* Streak flame glows.

### State 05: Achievement Unlocked
- Triggered when session results include newly unlocked milestone rewards from the backend ledger.

### State 06: No Weak Keys Detected (Mastery State)
- **Trigger:** `weakKeyRecommendations.length === 0`.
- Weak-Key Banner switches to "Flawless Precision" card with high-speed sprint CTA.

### State 07: Loading State (Shimmer Skeleton)
- Pulsing SVG skeletons (`animate-pulse`) strictly mirroring the geometry of Rows 0 through 6 (`#1E293B` dark / `#E2E8F0` light) to ensure **zero layout shift (CLS = 0)** while data fetches.

### State 08: Error Recovery & Data Retention
- Non-blocking amber banner (`#F59E0B`) displayed at the top:
  > *"⚠️ Local database temporarily busy. Your completed session is safely saved locally and will sync automatically once available."*
- Includes `"Retry Connection"` action button.

---

## 6. Frontend Component Architecture Plan

To maintain modularity, readability, and testability, `Dashboard.tsx` will be refactored from a monolithic file into cohesive subcomponents located in `desktop/src/features/dashboard/components/`:

```
desktop/src/features/dashboard/
├── Dashboard.tsx                           # Main container, layout grid & state controller
├── components/
│   ├── WelcomeStatusHeader.tsx             # W-01: Greeting, tier pill, motivation
│   ├── DailyGoalCapsule.tsx                # W-02: Circular SVG progress ring & time summary
│   ├── DailyGoalModal.tsx                  # Goal Setting modal (slider / minute presets)
│   ├── PrimaryMetricCards.tsx              # W-03: 4-card semantic <dl> metric grid
│   ├── WeeklyActivityChart.tsx             # W-04: 7-day practice duration & goal bar chart
│   ├── WpmTrendChart.tsx                   # W-05: Recharts bezier curve & error markers
│   ├── WeakKeyHeroBanner.tsx               # W-06: Problem key badges & practice launch CTA
│   ├── QuickPracticeCards.tsx              # W-07: 5 practice portal navigation cards
│   ├── GamificationStreakWidget.tsx        # W-08: Level crest, XP bar, streak & freeze shields
│   ├── PersonalBestsShowcase.tsx           # W-09: 15s, 60s PB, Dev Mode, Longest session
│   ├── RecentSessionsTable.tsx             # W-10: Historical practice session telemetry table
│   ├── DashboardZeroState.tsx              # State 01: Educational introductory layout
│   └── DashboardSkeleton.tsx               # State 07: Zero-layout-shift loading skeleton
└── hooks/
    └── useDashboard.ts                     # React hook managing API query, cache, error, and goal updates
```

---

## 7. Accessibility & UI Quality Baseline

1. **Contrast Standards (WCAG 2.2 AA):**
   - Headings & Primary Numbers: `#F8FAFC` on `#0B0F19` / `#131B2E` (Dark: 18.2:1 / 16.2:1).
   - Primary Action Button: `#FFFFFF` on `#2563EB` (Contrast: 5.17:1, exceeds AA 4.5:1).
   - Weak Key Badges: Red pills paired with explicit character labels and percentage text.
2. **Tabular Numerics:** All numeric values rendered with `font-mono tabular-nums` (JetBrains Mono) to eliminate layout jitter.
3. **Screen Reader Support:**
   - Visual charts backed by `<table class="sr-only">` or explicit `aria-label` summaries.
   - Dynamic goal updates announced via `aria-live="polite"`.
4. **Keyboard Accessibility:**
   - Full keyboard navigation sequence: `Tab`, `Shift+Tab`, `Enter`, `Space`.
   - Clear 2px solid `#2563EB` focus ring with 2px offset.
   - Global shortcuts: `Ctrl+1` through `Ctrl+6`, `Ctrl+B` (Sidebar toggle), `Ctrl+Shift+T` (Theme).

---

## 8. Proposed Stage 2 Substage Breakdown for Authorization

Upon Product Owner review and approval of this mapping report, implementation will proceed in orderly, test-verified substages:

- **Stage 2.1: API Layer & Typed Services**
  - Extend `ApiClient` with optional header support (`X-Timezone`).
  - Create `desktop/src/services/api/dashboardTypes.ts` and `dashboardService.ts`.
  - Add unit tests for `dashboardService.ts` in Vitest.
- **Stage 2.2: Top Stage Widgets (W-01, W-02, W-03, W-07)**
  - Implement `WelcomeStatusHeader`, `DailyGoalCapsule`, `DailyGoalModal`, `PrimaryMetricCards`, and `QuickPracticeCards`.
  - Unit tests verifying data binding, zero states, and goal updates.
- **Stage 2.3: Telemetry Charts & Remediation (W-04, W-05, W-06)**
  - Implement `WeeklyActivityChart`, `WpmTrendChart` (using Recharts), and `WeakKeyHeroBanner`.
  - Unit tests verifying SVG rendering, error marker annotations, and drill routing.
- **Stage 2.4: Gamification, Personal Bests & Logs (W-08, W-09, W-10)**
  - Implement `GamificationStreakWidget`, `PersonalBestsShowcase`, and `RecentSessionsTable`.
  - Unit tests verifying shield display, PB eligibility filtering, and date formatting.
- **Stage 2.5: Full State Orchestration, Zero State, Skeleton & E2E Verification**
  - Implement `DashboardSkeleton`, `DashboardZeroState`, and integrate everything into `Dashboard.tsx`.
  - Verify all 8 states, keyboard navigation, contrast compliance, and complete frontend test suite.

---

## 9. Recommendation & Authorization Request

Stage 2.0 (Audit & Mapping) is **COMPLETE**.  
The data structures, widget layouts, operational states, accessibility requirements, and component modularity plans are fully specified and cross-referenced with approved D1–D7 documentation.

**Status:** Awaiting Product Owner authorization to proceed to **Stage 2.1 (API Layer & Typed Services)**.
