# STAGE 2.5 DISCOVERY REPORT: PRACTICE ARENAS INTEGRATION
## Technical Discovery, Architectural Baseline Audit, Existing Code Inventory, and Gap Analysis

**Project:** Typing Trainer, Windows Desktop Application  
**Phase:** 3  
**Stage:** 2.5 (Practice Arenas: Typing Test, Learning Mode, Developer Mode)  
**Approved Baseline Commit:** `691c7b132c78ada8be9201852798ee993716ccde`  
**Execution Mode:** Technical Discovery and Execution Planning Only (Implementation Authorization NOT GRANTED)  
**Author:** Antigravity (Lead Engineer)  
**Product Owner:** Fairoz  

---

## 1. Executive Summary & Baseline Validation

Typing Trainer is an offline-first Windows desktop application engineered for touch-typing speed, accuracy, consistency, and motor habit remediation. Phase 3 Stages 2.1 through 2.4 successfully delivered and reconciled the primary application shell, navigation, typed API client, and the ten core Dashboard widgets (W-01 through W-10).

Phase 3 Stage 2.5 encompasses the implementation of the three approved practice experiences:
1. **Typing Test Arena (D4):** SCR-201 Configuration, SCR-202 Live Typing Interface, SCR-203 Results Screen.
2. **Learning Mode & Touch-Typing Curriculum (D5):** SCR-301 Curriculum Roadmap, SCR-302 Lesson Briefing, SCR-303 Drill Arena, SCR-304 Module Capstone Assessment (4 Modules, 32 Lessons, 96 Stars).
3. **Developer Mode (The Code Studio) (D7):** SCR-601 Language Hub, SCR-602 Catalog & Configurator, SCR-603 5-Line Monospace Syntax Arena, SCR-604 Custom Importer (500 KB limit, deterministic chunking $\le 20$ lines per part), SCR-605 Syntax Scorecard.

This discovery report documents the verified state of the repository at commit `691c7b1`, inventories reusable components, clarifies existing database structures versus required extensions, and identifies all technical gaps across the frontend, backend, and database layers.

---

## 2. Repository Baseline & Git Status Verification

The repository was inspected and validated against the approved baseline:
- **Git Branch:** `master`
- **HEAD Commit:** `691c7b132c78ada8be9201852798ee993716ccde`
- **Application Source & Migration Baseline:** Pristine and 100% clean (0 modified tracked files across all application source, migrations, and configs).
- **Working Tree Status Distinction:**
  - Tracked Files: Completely clean; `git status --short` shows 0 modified tracked files.
  - Untracked Files: The planning documentation directory `design/planning/` (Stage 2.5 technical specifications) and `desktop/Typing-Trainer/` (empty out-of-band directory).
  - Summary: Zero application code, test files, or migrations have been modified or staged.
- **Existing Test Suites Verified:**
  - Backend: **58 tests run, 0 failures, 0 errors** (`mvnw test` executed in 1m 01s).
  - Frontend: **18 test files passed (18/18), 88 tests passed (88/88)** (`npm test`).
  - Static Analysis: `tsc --noEmit` (**0 errors**), `eslint .` (**0 errors**).
  - Native Desktop: `cargo check` and `cargo test` pass with **0 failures**.

---

## 3. Frontend Discovery & Code Inventory

### 3.1 Routing & Navigation Architecture
- **[desktop/src/App.tsx](file:///d:/Windows%20app/Typing%20Trainer/desktop/src/App.tsx):**
  - Routes configured:
    - `/` and `/dashboard` $\rightarrow$ `Dashboard` (Phase 3 Stages 2.1–2.4 complete).
    - `/typing-test` $\rightarrow$ `TypingTestRoute` wrapping `features/typing-test/TypingTest.tsx`.
    - `/learning` and `/learning-mode` $\rightarrow$ `pages/LearningMode.tsx`.
    - `/developer-mode` $\rightarrow$ `pages/DeveloperMode.tsx`.
    - `/skill-drills`, `/typing-games`, `/analytics`, `/achievements`, `/settings` $\rightarrow$ Placeholder views.
- **Shell & Navigation:**
  - `AppShell.tsx`, `Sidebar.tsx`, `TopUtilityBar.tsx`, `StatusBar.tsx`, `CommandPalette.tsx`.
  - Global shortcuts registered in `useKeyboardShortcuts.ts` (`Ctrl+1` through `Ctrl+8`, `Ctrl+K`, `Ctrl+,`). Focus guards properly prevent shortcuts from firing inside input elements and dialogs.

### 3.2 State Management (`desktop/src/store/`)
- **[useShellStore.ts](file:///d:/Windows%20app/Typing%20Trainer/desktop/src/store/useShellStore.ts):**
  - Manages sidebar collapse state, command palette visibility, and theme selection (`light` / `dark`).
- **Verified Gaps in State Architecture:**
  - **No Centralized Typing Engine Store:** Input tracking, character indices, errors, and timers are currently isolated inside local component state.
  - **No Learning Mode Store:** Curriculum navigation, lesson state, active drill parameters, and star ratings are not managed in Zustand.
  - **No Developer Mode Store:** Active language track, snippet selection, indentation mode preferences, and custom file import chunks have no centralized state store.

### 3.3 Existing Practice Screen Implementations (Verified Baseline vs Gaps)

#### 1. Typing Test (`desktop/src/features/typing-test/TypingTest.tsx`):
- **Verified Existing Code:** A legacy prototype component.
- **Gaps Identified:**
  - Uses a standard HTML `<textarea>` with naive character matching.
  - Lacks SCR-201 Configuration stage (duration selection: 15s sprint, 30s, 60s benchmark, 120s marathon; corpus selection).
  - Does not enforce the D4 calculation specification:
    - No segregation of Backspace from $N_{\text{total}}$.
    - No calculation of Gross WPM vs Net WPM with the 5-keystroke uncorrected error word penalty.
    - No diagnostic error attribution (errors erased by Backspace are lost in current state).
    - No per-key latency or stroke telemetry collection.
  - Lacks SCR-203 Results Screen (WPM trend sparkline, consistency percentage, benchmark badges, key breakdown).
  - Does not submit session results to backend `POST /api/v1/sessions`.

#### 2. Learning Mode (`desktop/src/pages/LearningMode.tsx`):
- **Verified Existing Code:** A static informational card grid displaying 4 modules with hardcoded "Available" / "Upcoming" tags.
- **Gaps Identified:**
  - Non-functional CTA buttons ("Resume Current Lesson", "Start Module").
  - Lacks SCR-301 Curriculum Roadmap (no 32-lesson progression grid, no star count cabinet, no milestone locks).
  - Lacks SCR-302 Lesson Briefing (anatomical finger placement, home row anchor cues, key reach previews).
  - Lacks SCR-303 Interactive Drill Stage (metronome cadence cue, target key highlight, instant error buzz).
  - Lacks SCR-304 Module Capstone Exam assessment.

#### 3. Developer Mode (`desktop/src/pages/DeveloperMode.tsx`):
- **Verified Existing Code:** A static card catalog displaying 6 language tracks (Java, TypeScript, JavaScript, Python, SQL, Rust) with non-functional "Launch Syntax Arena" buttons.
- **Gaps Identified:**
  - Lacks SCR-601 Overview with aggregated code WPM and symbol accuracy.
  - Lacks SCR-602 Snippet Catalog & Configurator.
  - Lacks SCR-603 5-Line Monospace Syntax Arena (no liquid caret, no syntax color palette, no smart auto-advance on Enter, no dotted indent guides).
  - Lacks SCR-604 Custom Code Importer (no 500 KB drag-and-drop file browser, no deterministic $\le 20$-line chunker, no UTF-8 validator).
  - Lacks SCR-605 Syntax Scorecard (no delimiter / operator / keyword error taxonomy).

---

## 4. Backend Discovery & Code Inventory

### 4.1 Existing Endpoints & Controllers
- **[TypingSessionController.java](file:///d:/Windows%20app/Typing%20Trainer/backend/src/main/java/com/typingtrainer/typing/controller/TypingSessionController.java):**
  - `GET /api/v1/sessions` $\rightarrow$ Paged list of past sessions.
  - `GET /api/v1/sessions/{id}` $\rightarrow$ Single session lookup.
  - `POST /api/v1/sessions` $\rightarrow$ Submits completed typing session.
- **[DashboardController.java](file:///d:/Windows%20app/Typing%20Trainer/backend/src/main/java/com/typingtrainer/dashboard/controller/DashboardController.java):**
  - `GET /api/v1/dashboard/summary?clientTimeZone=...` $\rightarrow$ Comprehensive dashboard summary payload.
  - `PUT /api/v1/dashboard/daily-goal` $\rightarrow$ Updates daily practice target minutes.

### 4.2 Existing Services & Logic
- **[TypingSessionService.java](file:///d:/Windows%20app/Typing%20Trainer/backend/src/main/java/com/typingtrainer/typing/service/TypingSessionService.java):**
  - `evaluateBenchmarkEligibility(...)`: Accurately checks 15s sprint and 60s benchmark rules ($\ge 95\%$ accuracy, $\le 2$ pauses, $\le 60$s pause duration, standard corpus).
  - `submitSession(...)`: Persists `TypingSessionEntity`, computes Base XP and Adjusted XP, records entry in `user_reward_ledger` (`SESSION_<id>`).
  - **CRITICAL TELEMETRY INGESTION GAP:** `submitSession(...)` currently does **not accept or persist character telemetry** into `key_telemetry`!
- **[RecommendationService.java](file:///d:/Windows%20app/Typing%20Trainer/backend/src/main/java/com/typingtrainer/recommendation/service/RecommendationService.java):**
  - D6 Weak-Key Remediation engine actively reads from `KeyTelemetryRepository` (`findObservedKeysSince`, `findRecentForKeySince`).
  - Because `submitSession` does not currently save to `KeyTelemetryRepository`, the D6 engine only has data during mock/test scenarios. Live typing tests must feed `key_telemetry`!
- **[GamificationService.java](file:///d:/Windows%20app/Typing%20Trainer/backend/src/main/java/com/typingtrainer/gamification/service/GamificationService.java):**
  - Fully implements D5 Base Effort XP, accuracy multipliers, level progression curves, streak evaluation, and daily goal bonuses. Fully reusable.

---

## 5. Database Discovery & Actual Schema Audit (Issue C)

### 5.1 Verification of Existing Database Tables
An audit of `V1__create_initial_schema.sql` and `V2__create_dashboard_schema.sql` clarifies the exact persistent state:
1. **`typing_sessions` (V1 + V2):** Contains `id`, `gross_wpm`, `net_wpm`, `accuracy`, `total_errors`, `raw_characters`, `correct_characters`, `duration_seconds`, `passage`, `completed_at`, `session_mode`, `test_duration_target`, `is_official_benchmark`, `xp_earned`.
2. **`user_profile` (V2):** Stores user identity.
3. **`user_gamification` (V2):** Stores XP, level, tier, streaks, and freeze shields.
4. **`user_reward_ledger` (V2):** Immutable ledger ensuring idempotent XP awards.
5. **`key_telemetry` (V2 - ALREADY EXISTS):**
   ```sql
   CREATE TABLE IF NOT EXISTS key_telemetry (
       id TEXT PRIMARY KEY NOT NULL,
       session_id TEXT NOT NULL,
       key_char TEXT NOT NULL,
       opportunities INTEGER NOT NULL,
       errors INTEGER NOT NULL,
       total_latency_ms INTEGER NOT NULL DEFAULT 0,
       recorded_at TEXT NOT NULL,
       FOREIGN KEY (session_id) REFERENCES typing_sessions(id) ON DELETE CASCADE
   );
   CREATE INDEX IF NOT EXISTS idx_key_telemetry_key_date ON key_telemetry(key_char, recorded_at);
   CREATE INDEX IF NOT EXISTS idx_key_telemetry_session ON key_telemetry(session_id);
   ```
   **Crucial Architectural Clarification:** Table `key_telemetry`, entity `KeyTelemetryEntity.java`, and repository `KeyTelemetryRepository.java` **already exist in the repository**! 
   Therefore, **Flyway V3 MUST NOT re-create `key_telemetry`**. The only missing component for key telemetry is the ingestion pipeline in `TypingSessionService.submitSession()`.

### 5.2 Schema Gaps Required for Stage 2.5 (Flyway V3 Migration)
The V3 migration (`V3__create_practice_arenas_schema.sql`) must create strictly the new structures:
1. **Learning Mode Progress Table (`learning_progress`):**
   - Offline-first persistence for 32 lessons:
     - `lesson_id TEXT PRIMARY KEY NOT NULL` (e.g. `"MOD1_LES01"`)
     - `module_id TEXT NOT NULL`
     - `stars INTEGER NOT NULL DEFAULT 0` (0–3 stars)
     - `best_wpm REAL`
     - `best_accuracy REAL`
     - `attempts INTEGER NOT NULL DEFAULT 0`
     - `unlocked BOOLEAN NOT NULL DEFAULT 0`
     - `completed_at TEXT`
2. **Developer Mode Snippets Table (`developer_snippets`):**
   - Offline-first persistence for curated and custom imported code files:
     - `id TEXT PRIMARY KEY NOT NULL`
     - `track TEXT NOT NULL` (e.g. `"JAVA"`, `"TYPESCRIPT"`)
     - `title TEXT NOT NULL`
     - `language TEXT NOT NULL`
     - `difficulty_tier INTEGER NOT NULL DEFAULT 1`
     - `raw_source_bytes BLOB` (original unmodified UTF-8 bytes for export/inspection)
     - `working_source TEXT NOT NULL` (normalized `\n` line endings)
     - `line_count INTEGER NOT NULL`
     - `symbol_count INTEGER NOT NULL`
     - `is_custom BOOLEAN NOT NULL DEFAULT 0`
     - `created_at TEXT NOT NULL`
3. **Developer Mode Snippet Performance Table (`developer_snippet_stats`):**
   - `snippet_id TEXT PRIMARY KEY NOT NULL`
   - `best_net_wpm REAL`
   - `best_symbol_accuracy REAL`
   - `attempts INTEGER NOT NULL DEFAULT 0`
   - `last_practiced_at TEXT`
   - Foreign key referencing `developer_snippets(id) ON DELETE CASCADE`.

---

## 6. Categorization: Existing vs Required vs Proposed Decisions

### 6.1 Verified Existing Implementation (Reusable As-Is)
- Shell layout, responsive sidebar navigation, top bar, and theme provider.
- `apiClient.ts` with Tauri IPC token handshake and loopback base URL configuration.
- `DashboardService.java` and gamification XP economy (`GamificationService.java`).
- `TypingSessionEntity` and basic session submission pipeline.
- `KeyTelemetryEntity` and `KeyTelemetryRepository` query definitions.
- SQLite WAL configuration, foreign key pragmas, and Flyway migration runner.

### 6.2 Required Implementation for Stage 2.5
- **Framework-Independent Typing Engine Core:**
  - Pure calculation core separated from React, Zustand, DOM, and Tauri.
  - Keystroke taxonomy event classifier (Printable characters vs Backspace vs Modifiers).
  - High-precision monotonic timer (`performance.now()`).
  - Standardized metric calculator (Gross WPM, Net WPM with 5-stroke word penalty, Accuracy %, Consistency %).
  - Character-level telemetry buffer collecting per-key opportunities, errors, and latency.
- **Typing Test Arena (D4):**
  - Full implementation of SCR-201, SCR-202, and SCR-203.
  - Standard passage corpus generator.
  - Integration with `POST /api/v1/sessions` and key telemetry ingestion.
- **Learning Mode (D5):**
  - Full implementation of SCR-301, SCR-302, SCR-303, and SCR-304.
  - 32-lesson curriculum definitions (4 modules × 8 lessons).
  - Star rating evaluation engine (1 Star $\ge 90\%$, 2 Stars $\ge 95\%$, 3 Stars $\ge 98\%$) and capstone module exam gates ($\ge 95\%$).
- **Developer Mode (D7):**
  - Full implementation of SCR-601, SCR-602, SCR-603, SCR-604, and SCR-605.
  - Multi-line 5-line monospace canvas with liquid caret and smart auto-advance indentation.
  - Custom code file importer with 500 KB limit, strict UTF-8 validator, and deterministic chunking algorithm ($\le 20$ lines per part).
  - Syntax category error tracking (delimiters, operators, punctuation, identifiers, keywords).
  - Tauri native file save dialog integration for custom snippet export.
- **Backend & Database:**
  - Update `POST /api/v1/sessions` to batch-persist `keyTelemetry`.
  - Add `V3__create_practice_arenas_schema.sql` for `learning_progress`, `developer_snippets`, and `developer_snippet_stats`.
  - Add controllers and services for Learning Mode curriculum and Developer Mode snippets.

---

## 7. Discovery Conclusion

The baseline application is stable, well-tested (58 backend tests, 88 frontend tests), and architecturally ready for Stage 2.5. The existing session, dashboard, and gamification infrastructure provides a solid foundation. Stage 2.5 requires building the framework-independent typing engine, completing the three practice arenas, and connecting telemetry back to the backend database.
