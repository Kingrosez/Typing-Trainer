# STAGE 2.5 ACCEPTANCE CRITERIA: PRACTICE ARENAS
## Formal Definition of Done, Sub-Stage Quality Gates, Product Owner Decision Register, and Verification Checkpoints

**Project:** Typing Trainer, Windows Desktop Application  
**Phase:** 3  
**Stage:** 2.5 (Practice Arenas: Typing Test, Learning Mode, Developer Mode)  
**Approved Baseline Commit:** `691c7b132c78ada8be9201852798ee993716ccde`  
**Execution Mode:** Acceptance Criteria & Quality Planning Only (Implementation Authorization NOT GRANTED)  
**Author:** Antigravity (Lead Engineer)  
**Product Owner:** Fairoz  

---

## 1. Universal Governance & Engineering Gates

Every implementation sub-stage in Stage 2.5 must satisfy the following universal criteria before submission for Product Owner review:

1. **Scope Enforcement:** Implementation is strictly limited to authorized designs (D4, D5, D7). Zero feature additions, zero layout redesigns.
2. **Architecture Compliance:** Local-first Windows desktop operation; zero external telemetry; zero cloud AI or Ollama dependencies; keyboard input strictly scoped to active practice canvas.
3. **Static Analysis & Compilers:**
   - TypeScript: `tsc --noEmit` exits with **0 errors**.
   - ESLint: `eslint .` exits with **0 errors**.
   - Vite: Production bundling (`npm run build`) completes cleanly without warnings.
   - Rust: `cargo check` and `cargo test` pass with 0 errors.
4. **Regression Invariant:** All 58 backend tests and 88 frontend tests from Stage 2.4 continue to pass.
5. **No Fabricated Evidence:** All test results, logs, and screenshots must be observed from actual command execution.

---

## 2. Product Owner Decision Register (Issue 6)

The following four architectural decisions are formally recorded as **APPROVED PLANNING CONSTRAINTS** (Note: Implementation authorization remains NOT GRANTED):

### Decision 1: Developer Mode Inactivity Auto-Pause (`D7-NU-03`)
- **Status:** **APPROVED PLANNING CONSTRAINT**
- **Decision:** **Manual `Esc` Pause Only** (Consistent with D4 Typing Test). No automatic 15-second inactivity auto-pause will be implemented.
- **Rationale:** Prevents unexpected modal popups during code syntax inspection. Guarantees uniform pause mechanics and state machine predictability across all three arenas.
- **Consequences:** Typists pause explicitly using `Esc`. Inactivity without pressing `Esc` allows the monotonic clock to run, maintaining strict benchmark integrity.

---

### Decision 2: Touch-Typing Curriculum Content Storage
- **Status:** **APPROVED PLANNING CONSTRAINT**
- **Decision:** **Frontend Constants for Static Lesson Content; SQLite for User Progress and Results**.
- **Rationale:** The 32 lessons (target characters, briefing cues, finger reaches, exercise words) are static pedagogical definitions that load instantly offline from frontend constants. Dynamic user state (stars earned, best WPM, accuracy, attempts, unlocks) is stored in the local SQLite table `learning_progress`.
- **Consequences:** Instantaneous roadmap rendering; clean decoupling of immutable curriculum content from mutable user achievements.

---

### Decision 3: Curated Code Snippet Seeding
- **Status:** **APPROVED PLANNING CONSTRAINT**
- **Decision:** **Deterministic Flyway V3 Seeding into SQLite**.
- **Rationale:** Seeding the initial curated snippets for the 6 languages via Flyway V3 SQL inserts (`developer_snippets`) ensures that curated snippets and user-imported custom snippets share a single, unified database table, repository, and query API. Demonstrates full migration compatibility on existing databases (`INSERT OR IGNORE`) and clean table initialization on fresh installs.
- **Consequences:** Unified schema and queries; enables unified search, difficulty filtering, and snippet statistics tracking across all snippets.

---

### Decision 4: Custom Code File Export & Security Boundary (Issue 2 & Issue 3)
- **Status:** **APPROVED PLANNING CONSTRAINT**
- **Decision:** **Rust-Owned Native Save Dialog and Safe Replacement with Deferred Browser Fallback**.
- **Technical Specification:**
  - **Ownership:** Rust owns the native save dialog and file write lifecycle. The frontend passes NO filesystem paths to Rust, eliminating forged destination vulnerabilities.
  - **Rust Command:** `export_snippet_file(app, default_file_name, extension, content)`.
  - **Native Dialog:** Directly invoked in Rust via `tauri_plugin_dialog::DialogExt::dialog()`.
  - **Payload & Extension Enforcement:** Rejects payloads $> 512,000\text{ bytes}$ (500 KB limit). Whitelists extensions strictly to `.ts`, `.js`, `.py`, `.java`, `.rs`, `.go`, `.txt`, `.json`, `.sql`, `.md`.
  - **Destination & System Directory Guards:** Rejects root drives and system paths (`%WINDIR%`, `Program Files`, traversal sequences).
  - **Existing-File Handling:** Windows native dialog prompts user replacement confirmation. If confirmed, Rust replaces file safely.
  - **Safe Replacement Strategy:** Writes to sibling temporary file `.<name>.<uuid>.tmp`, flushes buffers with `sync_all()`, and executes safe backup-and-rename replacement pattern (explicitly avoiding false claims of atomic `std::fs::write`).
  - **Scoped Capability:** Only `"dialog:default"` (or `"dialog:allow-save"`) granted in `capabilities/default.json`. Zero filesystem write permissions granted to webview.
  - **Browser Fallback:** Uses in-memory Blob and anchor click with **deferred `URL.revokeObjectURL` cleanup (60s delay)**, preventing premature download cancellation in Chromium/Firefox.
- **Rationale:** Ensures professional native Windows 11 integration while strictly upholding AGENTS.md Section 9 and SECURITY.md least-privilege standards (zero shell execution, zero unrestricted filesystem access, verifiable user destination intent).

---

## 3. Sub-Stage Specific Acceptance Gates

### 3.1 Stage 2.5.0: Headless Typing Engine Core & Telemetry Foundation
- [ ] **Mathematical Invariance:**
  - Gross WPM strictly equals $(N_{\text{total}} / 5) / t_{\text{minutes}}$.
  - Net WPM applies the 5-stroke word penalty for uncorrected errors: $\max(0, (N_{\text{total}} / 5) - E_{\text{uncorrected}}) / t_{\text{minutes}}$.
  - Accuracy % strictly equals $(N_{\text{correct}} / N_{\text{total}}) \times 100$.
- [ ] **Backspace Accounting:**
  - Backspace erases preceding character and retreats caret.
  - Backspace **does not increment** $N_{\text{total}}$ and **does not count** toward Gross or Net WPM.
  - Correcting an error with Backspace prevents incrementing $E_{\text{uncorrected}}$, eliminating the 5-stroke word penalty.
  - Corrected mistakes still reduce final Accuracy because $N_{\text{total}}$ includes the initial incorrect stroke.
- [ ] **Modifier Key Segregation:**
  - Presses of Shift, Ctrl, Alt, Meta, CapsLock, Tab, Esc generate 0 character counts and 0 errors.
- [ ] **Telemetry Buffer:**
  - Diagnostic error attribution: initial incorrect stroke is permanently recorded for the target key even if subsequently erased by Backspace.
  - Per-key opportunities, errors, and latencies are accumulated accurately in memory.
- [ ] **Performance:** Input-to-render latency is $< 1\text{ ms}$ with 60 FPS smooth liquid caret animation.

---

### 3.2 Stage 2.5.1: Backend Schema Migration (V3) & Telemetry Ingestion
- [ ] **Flyway V3 Migration:**
  - Migration script `V3__create_practice_arenas_schema.sql` applies cleanly on existing SQLite database.
  - Tables `learning_progress`, `developer_snippets`, and `developer_snippet_stats` created with proper primary keys, foreign keys, and indexes.
  - **Does NOT alter or recreate `key_telemetry`** (which already exists in V2).
  - Seeds curated snippets deterministically (Decision 3).
- [ ] **Telemetry Ingestion Pipeline (Issue 1):**
  - `POST /api/v1/sessions` accepts `List<KeyTelemetryDto> keyTelemetry` up to a strict limit of $\le 100$ items.
  - Payloads exceeding 100 unique key summaries are **strictly rejected with HTTP 400 Bad Request** (`VALIDATION_ERROR`). Zero silent truncation.
  - Batches with duplicate `keyChar` entries are rejected with HTTP 400 Bad Request.
  - Supports multi-byte UTF-8 keys from international layouts (e.g. `ä`, `ö`, `ü`, `ß`, `é`, `ñ`, `ç`, `€`).
  - Telemetry rows are persisted to `key_telemetry` table in SQLite within the same `@Transactional` boundary as `TypingSessionEntity`.
  - Preserves D6 `MIN_OPPORTUNITIES = 20` rule and 3-session mastery qualification.
  - Ingested telemetry is immediately visible to on-demand D6 `RecommendationService` queries.
  - Duplicate session UUID submission returns existing record without re-awarding XP or re-inserting telemetry.

---

### 3.3 Stage 2.5.2: Typing Test Arena (D4)
- [ ] **SCR-201 Configuration View:**
  - Allows selecting test durations: 15s sprint, 30s, 60s benchmark, 120s marathon.
  - Allows selecting corpus: Common Words, Standard Prose, Complex Quotes.
  - Supports keyboard navigation and shortcut selection.
- [ ] **SCR-202 Live Typing Arena:**
  - Monospace typography (`JetBrains Mono`, `Inter`) on 1100px centered stage.
  - 3-line rolling paragraph layout with smooth line scrolling.
  - Liquid caret smoothly glides across active characters.
  - Pressing `Esc` pauses the test, freezes the clock, blurs text, and opens standard Pause Modal.
- [ ] **SCR-203 Results Scorecard:**
  - Displays Net WPM, Gross WPM, Accuracy %, Consistency %, and total errors.
  - Displays 1-second interval WPM sparkline chart.
  - Badges official benchmarks (15s sprint, 60s benchmark) when criteria are met ($\ge 95\%$ accuracy, standard corpus, $\le 2$ pauses).
  - Automatically submits session to backend `POST /api/v1/sessions`.
  - Navigating back to `/dashboard` instantly updates W-01, W-02, W-03, W-08, W-09, and W-10 without manual refresh.

---

### 3.4 Stage 2.5.3: Learning Mode & Touch-Typing Curriculum (D5)
- [ ] **Backend Endpoints:**
  - `GET /api/v1/learning/progress` and `POST /api/v1/learning/lessons/{id}/complete` operational.
- [ ] **SCR-301 Curriculum Roadmap:**
  - Displays 4 module selector tabs (Home Row, Top Row, Bottom Row, Numbers & Symbols).
  - Displays 8-lesson progression grid for active module (32 lessons total).
  - Star cabinet displays cumulative stars earned (e.g. `⭐ 31 / 96 Stars`).
  - Locked lessons and modules are visibly distinguished with lock glyphs and non-interactive states.
- [ ] **SCR-302 Lesson Briefing:**
  - Interactive visual keyboard displaying target home-row anchor keys (F & J bumps).
  - Anatomical finger color-coding and reach trajectory vectors.
- [ ] **SCR-303 Interactive Drill Stage:**
  - Real-time cadence audio/visual metronome cue.
  - Evaluates star ratings upon completion: 1 Star ($\ge 90\%$), 2 Stars ($\ge 95\%$), 3 Stars ($\ge 98\%$).
  - Submitting completion updates `learning_progress` and unlocks next sequential lesson.
- [ ] **SCR-304 Module Capstone Assessment:**
  - Comprehensive assessment requiring $\ge 95\%$ accuracy to graduate module and unlock subsequent module.

---

### 3.5 Stage 2.5.4: Developer Mode (The Code Studio) (D7)
- [ ] **Backend Endpoints:**
  - `GET /api/v1/developer/tracks`, `GET /api/v1/developer/tracks/{track}/snippets`, and `POST /api/v1/developer/snippets/import` operational.
- [ ] **SCR-601 Language Hub:**
  - Displays cards for all 6 approved languages (Java, TypeScript, JavaScript, Python, SQL, Rust).
  - Displays aggregate code WPM, symbol accuracy %, and total lines typed.
- [ ] **SCR-602 Catalog & Configurator:**
  - Curated snippets organized by difficulty tier (1 through 4).
  - Delimiter and operator practice category tabs.
  - Indentation mode toggle (Smart Auto-Advance vs Manual Spacebar).
- [ ] **SCR-603 5-Line Monospace Syntax Arena:**
  - Monospace canvas displaying exactly 5 lines (context lines dimmed, active working line highlighted).
  - Accessible syntax color palette ($\ge 4.5:1$ contrast in both dark and light modes).
  - Smart Auto-Advance: Pressing Enter indents cursor automatically to matching line level.
  - Dotted vertical indent guides aligned with active block indentation.
  - Safe Plaintext Rendering: code is rendered as inert text nodes; zero execution or eval.
- [ ] **SCR-604 Custom Code Importer:**
  - Drag-and-drop file browser supporting `.java`, `.ts`, `.js`, `.py`, `.sql`, `.rs`, `.json`.
  - 500 KB raw byte limit enforced strictly upfront (`file.size <= 512,000 bytes`).
  - Strict UTF-8 validation (zero invalid byte sequences).
  - Deterministic Bounded Pagination splits files $> 30$ lines into balanced parts of $\le 20$ lines ($K = \lceil N / 20 \rceil$).
  - Dual Content Representation: raw UTF-8 bytes preserved for download; normalized `\n` line endings used in typing arena.
  - Export invokes Rust-owned native file save dialog with safe replacement write; browser fallback uses deferred `URL.revokeObjectURL` cleanup (Decision 4).
- [ ] **SCR-605 Syntax Scorecard:**
  - Error breakdown by syntax category (Delimiters, Operators, Punctuation, Identifiers, Keywords).
  - Code Net WPM and symbol accuracy badge displayed.

---

### 3.6 Stage 2.5.5: Cross-Arena Integration & Desktop Packaging
- [ ] **Dependency Satisfaction:** Stage 2.5.5 begins only after **BOTH Stage 2.5.3 AND Stage 2.5.4 are 100% completed and passed**.
- [ ] **Dashboard Cohesion:**
  - Completing any practice session updates Dashboard widgets W-01 (XP/Streak), W-02 (Daily Goal Ring), W-03 (Primary Metrics), W-04 (Weekly Activity), W-05 (WPM Trend), W-08 (Gamification Level), W-09 (Personal Bests), and W-10 (Recent Sessions).
  - Key telemetry from all arenas directly updates W-06 Weak-Key Remediation overview status.
- [ ] **Desktop Validation:**
  - Tauri packaged desktop binary (`app.exe`) launches, supervises Spring Boot backend, exchanges security tokens, and functions 100% offline.
  - Windows display scaling (100%, 125%, 150%) supported without layout clipping at 1440 × 900.

---

## 4. Product Owner Sign-Off Protocol

Stage 2.5 is formally accepted only when:
1. All sub-stage criteria have been fulfilled and independently verified with automated test evidence.
2. The complete test suite (unit, integration, and E2E) passes with zero failures.
3. The Product Owner reviews and signs off on the final completion report.
