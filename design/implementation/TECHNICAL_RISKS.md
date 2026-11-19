# TECHNICAL RISKS & MITIGATION MATRIX
**Project:** Typing Trainer — Windows Desktop Application  
**Auditor:** Antigravity (Google DeepMind) — Senior Engineering Assessment  
**Date:** 2026-11-19  
**Review Cycle:** Takeover & Phase 0 Verification  

---

## 1. Risk Evaluation Framework

Risks are categorized across Likelihood (Low, Medium, High) and Impact (Low, Medium, High, Critical), yielding an overall Severity score:
- **CRITICAL**: Immediate threat to build, runtime stability, or security boundary; must be resolved before progression.
- **HIGH**: Substantial architectural friction or potential runtime failure under normal usage.
- **MEDIUM**: Engineering complexity or tooling inconvenience requiring deliberate architectural control.
- **LOW**: Minor maintenance or cosmetic concern.

---

## 2. Technical Risk Matrix

| Risk ID | Risk Domain | Description | Likelihood | Impact | Severity | Primary Mitigation | Remediation Status |
|---|---|---|:---:|:---:|:---:|---|:---:|
| **TR-01** | Tooling / Stack | Tailwind v4 + React 19 + shadcn/ui friction | **High** | **High** | **CRITICAL** | Handcraft accessible Tailwind-based primitives rather than relying on brittle CLI code generation. | **MITIGATED** (Primitives built & verified) |
| **TR-02** | Desktop / Windows | Windows GNU toolchain vs MSVC for WiX MSI bundling | **Medium** | **High** | **HIGH** | Use GNU for fast dev; prepare MSVC or standalone NSIS/MSI pipeline for Phase 11 release. | **ACTIVE** (Phase 11 Target) |
| **TR-03** | Architecture / OS | Spring Boot child process abandonment (Zombie processes) | **High** | **Critical** | **CRITICAL** | Implement Windows Job Objects in Rust to guarantee child termination on parent exit. | **ACTIVE** (Phase 1 Target) |
| **TR-04** | Security / IPC | Port collision and unauthorized local access | **Medium** | **Critical** | **CRITICAL** | Ephemeral port assignment (`server.port=0`) with per-launch cryptographic token passed via Tauri IPC. | **ACTIVE** (Phase 1 / 2 Target) |
| **TR-05** | Performance / UI | Keystroke latency and React re-render churn | **High** | **High** | **HIGH** | Localize high-frequency typing state in a dedicated Zustand store with fine-grained selectors. | **ACTIVE** (Phase 4 Target) |
| **TR-06** | Persistence | SQLite single-writer lock contention during rapid bursts | **Medium** | **Medium** | **MEDIUM** | WAL mode (`PRAGMA journal_mode=WAL;`), short transactions, and client-side outbox queue. | **DESIGNED** (Documented in DATABASE.md) |
| **TR-07** | Build / Network | Offline Maven / npm dependency caching gaps | **Medium** | **High** | **HIGH** | Pre-cache all build plugins and dependencies; strictly commit package lockfiles. | **MITIGATED** (Surefire cached & verified) |
| **TR-08** | Governance | Zero-commit Git state and disaster recovery risk | **Low** | **Critical** | **HIGH** | Establish baseline Git commit immediately after foundation verification. | **RESOLVED** (Baseline Commit Created) |
| **TR-09** | Architecture | API contract drift between Spring Boot and React | **Medium** | **High** | **HIGH** | Enforce shared TypeScript contract interfaces derived directly from `API_CONTRACT.md`. | **MITIGATED** (PagedResponse & DTO aligned) |

---

## 3. Deep-Dive Risk Analysis and Concrete Mitigations

---

### TR-01: Tailwind v4 + React 19 + shadcn/ui Ecosystem Incompatibility
- **Root Cause:**
  Claude Code configured `package.json` with React 19 (`^19.3.1`) and Tailwind CSS v4 (`@tailwindcss/vite: ^4.3.5`). The standard `shadcn-ui` CLI (`npx shadcn-ui@latest init`) was designed around Tailwind v3 with PostCSS and React 18. Attempting to run standard shadcn scaffolding against Tailwind 4 fails or generates incompatible configuration.
- **Consequence:**
  Engineers wrote imports to `components/ui/button`, `card`, `skeleton`, etc., without ever having the files generated, resulting in catastrophic TypeScript compilation failure (33 errors).
- **Mitigation Strategy:**
  1. Do not downgrade React or Tailwind if not strictly necessary, as Tailwind 4 Vite plugin offers substantial build speed improvements.
  2. Implement cleanly styled, accessible UI primitives (`Button`, `Card`, `Skeleton`, `Tooltip`, `Dialog`) directly under `src/components/ui/` using Tailwind utility classes and Radix UI primitives.
  3. Ensure all CSS variables in `globals.css` map correctly to the D2 Design System color tokens (Midnight Slate and Daylight Studio).

---

### TR-02: Windows GNU Toolchain vs. MSVC for Tauri & MSI Packaging
- **Root Cause:**
  Tauri on Windows officially recommends the MSVC toolchain (`x86_64-pc-windows-msvc`) with Visual Studio C++ Build Tools. The current environment has the GNU toolchain (`x86_64-pc-windows-gnu`) configured as default.
- **Consequence:**
  `cargo check` succeeds under GNU. However, during Phase 11 (Windows packaging with WiX for MSI bundles), the build may fail if WiX tools or Windows SDK linkers cannot find MSVC libraries.
- **Mitigation Strategy:**
  1. Continue using the GNU toolchain for Phase 1 through Phase 10 development, as `cargo check` and local compilation function smoothly.
  2. Before Phase 11 packaging, test Tauri Windows build targets (`tauri build`) early. If WiX requires MSVC, switch the toolchain via `rustup default stable-x86_64-pc-windows-msvc` or utilize Tauri's NSIS bundler.

---

### TR-03: Spring Boot Child Process Abandonment (Zombie Processes on Windows)
- **Root Cause:**
  Typing Trainer runs Spring Boot as a separate child process launched by Tauri (Rust). On Windows, if a parent process crashes, is killed via Task Manager, or terminates abruptly, standard child processes are **not** automatically killed and become orphaned "zombie" processes holding port 8080 or the SQLite database lock.
- **Consequence:**
  Subsequent launches of Typing Trainer will fail to start the backend because the port is already bound or SQLite database file is locked (`SQLITE_BUSY`).
- **Mitigation Strategy:**
  1. In `src-tauri`, wrap the spawned Java/Spring Boot child process inside a **Windows Job Object** (`job.set_extended_limit_info(JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE)`).
  2. Under Windows Job Objects, the Windows kernel automatically terminates all child processes when the parent process handle is closed, guaranteeing zero orphaned Java processes even on hard crashes.
  3. Register graceful shutdown hooks on Tauri window events (`RunEvent::Exit`, `WindowEvent::CloseRequested`) to send a SIGTERM or HTTP shutdown signal first before forceful termination.

---

### TR-04: Port Collision & Unauthorized Local API Access
- **Root Cause:**
  `application.yml` currently has hardcoded `server.port: 8080`. If another application (development server, proxy, container) on the user's Windows machine is already using port 8080, Typing Trainer fails to launch. Furthermore, port 8080 has no authentication, allowing other local software to call the API.
- **Consequence:**
  Application startup failure, or security breach where local malware queries the user's typing history.
- **Mitigation Strategy:**
  1. Configure Spring Boot to bind to an ephemeral port (`server.port: 0`) in production, or let Tauri find an available high-range port (e.g. 19500-19999) and pass it to Spring Boot via `-Dserver.port=PORT`.
  2. Generate a random cryptographic token (UUIDv4) in Rust at launch (`launch_token`). Pass this token as an environment variable or JVM property to Spring Boot.
  3. Pass the assigned port and token to the frontend via a secure Tauri IPC command (`get_backend_connection_details()`).
  4. Spring Boot registers a servlet filter that rejects all requests lacking the `X-Request-Token` header matching the launch token.

---

### TR-05: Keystroke Latency & React Re-render Churn in Typing Arena
- **Root Cause:**
  Typing tests and drills involve keystrokes occurring every 50–150ms. If keystroke state is held in a top-level React component, the entire component tree (Titlebar, Sidebar, HUD, Keyboard, Hand Guide) will re-render on every character, causing perceptible input stutter, dropped frames, and inaccurate WPM calculations.
- **Consequence:**
  Poor typing feel, failing the core product promise of a premium, gaming-grade typing experience.
- **Mitigation Strategy:**
  1. Process keystrokes entirely in an isolated in-memory Zustand store (`useTypingStore`).
  2. Decouple high-frequency input capture from UI presentation:
     - The active word/caret component subscribes only to the current word slice.
     - The virtual keyboard subscribes only to the active target keycap and active finger zone.
     - The WPM/Accuracy HUD updates on a throttled 100ms requestAnimationFrame loop rather than every keystroke.
  3. Never send HTTP requests during the typing session; persist only once when the session reaches terminal state (completed or aborted).

---

### TR-06: SQLite Single-Writer Lock Contention
- **Root Cause:**
  SQLite allows multiple concurrent readers, but only one writer at a time. If the backend attempts to log detailed keystroke analytics, update user settings, and write session stats concurrently, it can trigger `SQLiteBusyException` (`database is locked`).
- **Consequence:**
  Failed session submission and lost user progress.
- **Mitigation Strategy:**
  1. Enable Write-Ahead Logging in SQLite: `PRAGMA journal_mode = WAL;`.
  2. Set a busy timeout in Hikari / SQLite connection string: `PRAGMA busy_timeout = 5000;`.
  3. Limit the Hikari connection pool size to 1 writer for SQLite (already configured: `maximum-pool-size: 1`).
  4. Implement an offline client queue in IndexedDB (`typing_sessions_outbox`) on the frontend to buffer completed sessions if the backend is temporarily busy or rebooting.

---

### TR-07: Offline Dependency Caching Gaps
- **Root Cause:**
  Typing Trainer is designed to build and run in an offline-first environment. However, `mvnw test` failed during our audit because the Maven Surefire test plugin (`3.5.2`) had never been cached by Claude Code.
- **Consequence:**
  Tests cannot be executed offline without pre-warming the Maven local repository (`~/.m2`).
- **Mitigation Strategy:**
  1. Explicitly pin the Maven Surefire plugin in `backend/pom.xml` build plugins with a standard stable version.
  2. When network access is available during developer setup, execute a complete dependency download goal: `mvn dependency:go-offline` or `mvn test-compile surefire:test`.
  3. Maintain strict npm `package-lock.json` and Rust `Cargo.lock` files so all offline builds are deterministic.

---

### TR-08: Zero-Commit Git State & Version Control Failure
- **Root Cause:**
  The repository was initialized (`git init`), but no initial commit was made.
- **Consequence:**
  Any unintended file edit, script error, or rollback attempt would destroy uncommitted files without recovery history.
- **Mitigation Strategy:**
  1. Create the initial Git commit immediately as the first action of Phase 0 Remediation.
  2. Enforce strict commit discipline at the completion of every implementation phase.

---

### TR-09: API Contract Drift Between Frontend and Backend
- **Root Cause:**
  As seen in Phase 0, Claude Code returned Spring Data `Page<T>` directly from `TypingSessionController`, violating `API_CONTRACT.md`'s required pagination format.
- **Consequence:**
  Frontend API client expects `{ items: [], page: 0, ... }` but receives `{ content: [], totalElements: ... }`, leading to silent undefined property bugs and UI crash in tables and charts.
- **Mitigation Strategy:**
  1. Define explicit Java DTOs for all API responses (`PagedResponse<T>`). Never return Spring Data entities or raw Spring framework classes.
  2. Define matching TypeScript interface definitions in `desktop/src/types/api.ts` mirrored directly from `API_CONTRACT.md`.
  3. Cover all endpoints with MockMvc integration tests verifying JSON structure against contract definitions.
