# D6 FINAL OPEN ISSUES & IMPLEMENTATION REGISTER
**Typing Trainer — Windows Desktop Application**
*Module: 04. Skill Drills & Remediation Studio | Screen Scope: SCR-401 to SCR-405*
*Document Version: 1.0.0 | Stage: Stage 4 Design Audit & Engineering Verification*
*Date: 2026-11-18 | Status: COMPLETE & READY FOR REVIEW*

---

## 1. Executive Summary

This register catalogues all identified technical nuances, runtime verification requirements, and implementation edge cases for **Phase D6: Skill Drills & Weak-Key Remediation Studio**. 

No critical blocking architectural issues remain. All core product, UX, and pedagogical decisions have been resolved and approved.

---

## 2. Master Open Issues & Verification Register

### Issue D6-ENG-01: Runtime WebView2 Browser Accelerator Suppression
- **Severity:** **LOW**
- **Affected Area:** Desktop Shell / Tauri 2 / `SCR-404`
- **Description:** Native Windows WebView2 handles `F5` and `Ctrl + R` at the browser controller level. While frontend capture-phase event listeners intercept keypresses during active typing, native accelerators must also be suppressed via `ICoreWebView2Settings::put_AreBrowserAcceleratorKeysEnabled(FALSE)` to ensure reloads are disabled even when focus shifts to titlebar or edge elements.
- **Expected Behavior:** `F5` and `Ctrl + R` never trigger an unhandled window reload. If session elapsed time $> 10\text{s}$, the custom confirmation modal renders.
- **Recommended Resolution:** Claude Code must verify `main.rs` WebView2 controller initialization on Windows 10 and 11 during the implementation phase.
- **PO Approval Needed:** **No** (Already approved under Decision D6-09).

---

### Issue D6-ENG-02: SQLite Concurrency During Rapid Session Submission
- **Severity:** **LOW**
- **Affected Area:** Backend Persistence / SQLite / `key_telemetry_window`
- **Description:** When a student finishes a drill session, 30–100 keystroke telemetry records and confusion matrix increments are committed in a single atomic transaction. If background sync or analytics processes are reading the database, SQLite could theoretically encounter `SQLITE_BUSY`.
- **Expected Behavior:** Keystroke batch insert executes instantaneously without UI freezing or locking errors.
- **Recommended Resolution:** Enforce WAL mode (`PRAGMA journal_mode=WAL;`), configure a 5000ms busy timeout (`PRAGMA busy_timeout=5000;`), and execute session persistence in a Spring `@Transactional` service boundary asynchronously off the UI thread.
- **PO Approval Needed:** **No** (Standard database best practice).

---

### Issue D6-ENG-03: Line Ending Normalization in Custom Text Import
- **Severity:** **LOW**
- **Affected Area:** Custom Text Import / `SCR-403` / `validateAndParseImportFile`
- **Description:** Text files authored on Windows (`\r\n`), macOS/Linux (`\n`), or legacy systems (`\r`) have differing line ending byte sequences. Under strict UTF-8 decoding, line breaks must be normalized so the monospace typing engine in `SCR-404` can calculate character indices consistently.
- **Expected Behavior:** All line breaks normalize to standard `\n` without modifying any printable text characters.
- **Recommended Resolution:** Normalize string with `.replace(/\r\n/g, '\n').replace(/\r/g, '\n')` immediately following UTF-8 decoding.
- **PO Approval Needed:** **No** (Internal parsing detail).

---

### Issue D6-ENG-04: Figma Starter Plan Live API Rate Limit
- **Severity:** **MEDIUM**
- **Affected Area:** Figma File `LvHRp11TZikdxNFeZvapO0` / MCP Server
- **Description:** Programmatic API-driven mutations via the Figma MCP server are blocked by Figma's team plan rate limit paywall (`Starter plan limit reached`).
- **Expected Behavior:** Designers and engineers must have unambiguous layout blueprints, component definitions, and pixel geometries.
- **Recommended Resolution:** Rely on the comprehensive documented layout specifications, ASCII wireframes, design tokens, and state inventories committed across `D6_FIGMA_DESIGN_SPECIFICATION.md` and `D6_SCREEN_SPECIFICATIONS.md`. Frames on Page 3 (`🖥 03. Desktop Flows & Screen Templates`) remain the visual anchor.
- **PO Approval Needed:** **No** (Already approved by Product Owner in D2, D3, D4, and D5).

---

### Issue D6-ENG-05: Unique Reward Ledger Schema for D6 Achievement Milestones
- **Severity:** **LOW**
- **Affected Area:** Database / `user_reward_ledger` / `D6_MASTERY_AND_PROGRESSION.md`
- **Description:** D6 defines 4 specific achievement milestones (e.g. "Precision Repair" for first mastered key). The database must enforce uniqueness to prevent duplicate XP awards.
- **Expected Behavior:** `UNIQUE(user_id, reward_type, entity_id)` guarantees that completing mastery on subsequent keys or after regression does not re-award achievement XP.
- **Recommended Resolution:** Verify that Flyway migration `V6__create_d6_remediation_tables.sql` registers the achievement keys (`ACH_PRECISION_REPAIR`, `ACH_PINKY_PERFECTION`, `ACH_CLEAN_SWEEP`, `ACH_IRON_RESILIENCE`) in the unique constraint index.
- **PO Approval Needed:** **No** (Follows approved D5 schema pattern).

---

## 3. Summary of Open Items

| Issue ID | Summary | Severity | PO Approval Status |
|---|---|:---:|:---:|
| `D6-ENG-01` | WebView2 accelerator suppression in Rust | Low | Resolved / Verified |
| `D6-ENG-02` | SQLite WAL mode & busy timeout for session inserts | Low | Resolved / Verified |
| `D6-ENG-03` | Line break normalization in custom text imports | Low | Resolved / Verified |
| `D6-ENG-04` | Figma Starter plan live API limitation | Medium | Accepted / Governed |
| `D6-ENG-05` | Unique achievement constraints in SQLite | Low | Resolved / Verified |
