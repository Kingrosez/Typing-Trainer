# Phase D7: Developer Mode (The Code Studio)
# Deliverable 8: Master Open Issues, Nuances & Governance Register

**Project:** Typing Trainer — Windows Desktop Application  
**Module:** Phase D7: Developer Mode (The Code Studio)  
**Governance Stage:** Stage 4 Final Design Audit & Engineering Verification  
**Document Version:** 4.0.0 | **Date:** 2026-11-18 | **Status:** ALL DECISIONS APPROVED & VERIFIED (STAGE 4 COMPLETE)

---

## 1. Executive Summary & Governance Status

This document is the official, definitive register of all architectural decisions, implementation nuances, external system constraints, and deferred features for **Phase D7: Developer Mode (The Code Studio)** following completion of the **Stage 4 Final Design Audit**.

### Key Governance Milestones Achieved:
1. **Zero Open Product Owner Decisions:** All architectural and functional decisions (`D7-OD-01` through `D7-OD-06`, `D7-NU-01A`, `D7-NU-01B`, and `D7-NU-02 Option A`) are fully approved and audited.
2. **Mandatory Audit A Resolved:** The uncorrected error penalty misstatement has been corrected across all visual specifications, wireframes, and calculation reports. The dynamic formula $\text{Penalty} = \frac{E_{uncorrected}}{T_{minutes}}\text{ WPM}$ is formally established.
3. **Mandatory Audit B Resolved:** Windows and WebView2 accelerator hazards (`F5`, `Ctrl+R`, `Tab`) are isolated with a complete guarded restart architecture ($> 10\text{s}$ confirmation dialog).
4. **WCAG 2.2 AA Contrast Verified:** 100% mathematical compliance verified across Dark (`#0B0F19`) and Light (`#FFFFFF`) palettes.
5. **Stage 5 Engineering Readiness:** Complete technical specifications, Zustand stores, REST contracts, and Flyway migration schemas are verified for Claude Code handoff.

---

## 2. Master Governance Classification Matrix

| Issue ID | Governance Category | Title & Scope | Governing Stage | Engineering Impact | Resolution Status |
|---|---|---|---|:---:|:---:|
| **D7-OD-01** | **Approved Decision** | Five-Screen Modular Architecture (`SCR-601`–`SCR-605`) | Stage 1 & 2 | Foundational | **APPROVED & AUDITED** |
| **D7-OD-02** | **Approved Decision** | 8 Core Programming Languages + Custom Ingestion | Stage 1 & 2 | High | **APPROVED & AUDITED** |
| **D7-OD-03** | **Approved Decision** | Syntax Category Error Tracking (Delimiters, Operators, etc.) | Stage 1 & 2 | Medium | **APPROVED & AUDITED** |
| **D7-OD-04** | **Approved Decision** | Phase D4 Net WPM Parity (Zero Net Penalty for Corrected Mistakes)| Stage 1 & 2 | Critical | **APPROVED & AUDITED** |
| **D7-OD-05** | **Approved Decision** | Smart Auto-Advance Mode with Zero Keystroke Inflation | Stage 1 & 2 | High | **APPROVED & AUDITED** |
| **D7-OD-06** | **Approved Decision** | Configurable Delimiter Auto-Close Stepping | Stage 1 & 2 | Medium | **APPROVED & AUDITED** |
| **D7-NU-01A**| **Technical Rule** | Raw Byte Storage (`BLOB`) & Normalized Line Endings (`\n`) | Stage 2 & 4 | Critical | **APPROVED & AUDITED** |
| **D7-NU-01B**| **Constraint** | In-Memory Working Copy & Pure React Live Keystroke Buffer | Stage 2 & 4 | Critical | **APPROVED & AUDITED** |
| **D7-NU-02** | **Approved Decision** | Option A Bounded Pagination ($\le 20$ lines for files $> 30$ lines) | Stage 2 & 4 | High | **APPROVED (Option A)** |
| **D7-NU-03** | **Constraint** | Inactivity Auto-Pause Threshold (15 Seconds Idle Timer Halt) | Stage 2 & 4 | Medium | **APPROVED & AUDITED** |
| **D7-DEF-01** | **Deferred Feature** | Terminal & Interactive Shell Command-Line Simulation | Stage 1 | None (D7) | **Deferred to Module 09** |
| **D7-DEF-02** | **Deferred Feature** | Extended Programming Languages (C++, Go, Bash, Swift, Kotlin)| Stage 1 | None (D7) | **Deferred to DLC Pack 1** |
| **D7-EXT-01** | **Runtime Boundary** | WebView2 Browser Accelerator Trapping (`F5`, `Ctrl+R`) | Stage 3 & 4 | Critical | **Mitigation Specified** |
| **D7-EXT-02** | **Runtime Boundary** | SQLite WAL Mode & Busy Timeout for Batch Outbox Sync | Stage 2 & 4 | High | **Mitigation Specified** |
| **D7-EXT-03** | **Tooling Boundary** | Figma Starter Plan MCP Tool-Call Rate Limit Paywall | Stage 3 & 4 | None (Code) | **Documented Honestly** |

---

## 3. Detailed Register of Approved Technical Rules & Nuances

### 3.1 D7-NU-01A: Original Byte Preservation & Line Normalization
- **Category:** Category B Technical Design Rule (Governed by `D7_DATA_REQUIREMENTS.md` Sec 3.1, 6; `D7_SCREEN_SPECIFICATIONS.md` Sec 3.4; `SECURITY.md`).
- **Policy:**
  1. **Database Preservation:** When a custom source file is imported via `SCR-604`, its exact raw UTF-8 bytes are stored verbatim in SQLite table `custom_code_files.raw_bytes` along with SHA-256 hash `content_hash`.
  2. **Memory Normalization:** For the frontend typing engine, line endings (`\r\n` or `\r`) are sanitized to standard `\n` in memory (`.replace(/\r\n/g, '\n').replace(/\r/g, '\n')`).
- **Engineering Status:** Fully specified in Flyway migration `V7` and frontend ingestion pipeline.

### 3.2 D7-NU-01B: In-Memory Working Representation & Live Keystroke Buffer
- **Category:** Category B Implementation Constraint (Derived from `D7-OD-06` and `AGENTS.md` Sec 2 & 6).
- **Policy:**
  1. **Zero Keystroke REST Calls:** All keypress processing, error checking, and sliding-window scrolling execute exclusively in React memory (`typingArenaStore`).
  2. **Session Persistence:** Only after the user finishes or terminates the drill is the aggregated session payload dispatched via the IndexedDB outbox.

### 3.3 D7-NU-02: Option A Bounded Pagination for Custom Files
- **Category:** Approved Product Owner Decision.
- **Policy:**
  1. Files containing **1–30 lines** remain a single exercise.
  2. Files containing **> 30 lines** are divided into sequential parts where **no part exceeds 20 lines**.
  3. Structural AST boundaries (blank lines, function closures) are prioritized when selecting split points.
  4. Each part operates as an independent typing session staged in IndexedDB.

### 3.4 D7-NU-03: Inactivity Auto-Pause Threshold (15 Seconds)
- **Category:** Engineering Constraint.
- **Policy:**
  If the typist is idle for $> 15.0$ seconds during an active exercise in `SCR-603`, the active session timer automatically pauses, mounting the Pause Modal. Active typing duration excludes idle time upon resumption.

---

## 4. Deferred Scope Items (Formally Locked)

| Deferred Item | Feature Description | Target Phase | Governing Rationale |
|---|---|---|---|
| **D7-DEF-01** | **Terminal & CLI Shell Simulation:** Interactive shell prompt (`bash`/`pwsh`), PTY pipe emulation, and ANSI terminal escape code parsing. | Module 09 (DevOps Studio) | Typing Trainer is an ergonomic touch-typing tutor, not an interactive shell or REPL. Terminal simulation requires separate architectural mechanics. |
| **D7-DEF-02** | **Extended Languages Pack:** Additional curated snippets for C++, Go, Bash, Swift, Kotlin, PHP, and Ruby. | Developer Mode DLC Pack 1 | The initial 8 core languages provide comprehensive coverage across paradigms (OOP, functional, systems, markup, query). |

---

## 5. External System Boundaries & Mitigations

### 5.1 D7-EXT-01: WebView2 Global Accelerator Trapping
- **Hazard:** Pressing `F5` or `Ctrl+R` reloads the webview, wiping React state.
- **Mitigation:**
  1. Top-level window `keydown` listener intercepts `F5` and `Ctrl+R`, routing to the guarded restart modal for sessions $> 10\text{s}$.
  2. Tauri 2 configuration disables browser accelerator keys (`put_AreBrowserAcceleratorKeysEnabled(0)`).

### 5.2 D7-EXT-02: SQLite Concurrent Write Contention
- **Hazard:** Rapid flushing of offline outbox sessions during backend recovery could encounter `SQLITE_BUSY`.
- **Mitigation:**
  1. SQLite configured in WAL mode with a 5000ms busy timeout (`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;`).
  2. Spring Boot service uses `@Retryable` backoff on database locks.

### 5.3 D7-EXT-03: Figma Starter Plan MCP Tool-Call Rate Limit
- **Hazard:** Calling `figma_figma:use_figma` and `get_metadata` triggers the Starter Plan paywall.
- **Mitigation:**
  All D7 Stage 3 designs are documented as production-quality layout specifications, complete Auto-Layout hierarchies, and executable Figma Plugin API scripts in `design/D7-developer-mode/`. No fabricated node IDs are claimed.

---

## 6. Audit Sign-Off & Governance Clearance

- **Open Decision Count:** **0 (Zero)**
- **Unresolved Nuances:** **0 (Zero)**
- **Audit Findings Outstanding:** **0 (Zero)**
- **Governance Status:** **CLEARED FOR STAGE 5 IMPLEMENTATION (CLAUDE CODE)**.
