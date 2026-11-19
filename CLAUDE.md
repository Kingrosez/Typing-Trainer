# CLAUDE.md

## 1. Purpose

This file contains the project instructions for Claude Code when working in the Typing Trainer repository.

These instructions apply regardless of which model or custom provider is configured in Claude Code. Provider configuration may affect model availability and behavior, but it does not change the project architecture, coding standards, security requirements, or task workflow defined here.

## 2. Mandatory first step

Before planning or changing code:

1. Read the repository-root `AGENTS.md` in full.
2. Read `README.md` to understand the product scope.
3. Read the relevant technical documents for the requested work:
   - `ARCHITECTURE.md`
   - `TECH_STACK.md`
   - `PROJECT_STRUCTURE.md`
   - `API_CONTRACT.md`
   - `DATABASE.md`, when present and relevant
   - `CODING_STANDARDS.md`
   - `SECURITY.md`
   - `SETUP.md`
   - `CONTRIBUTING.md`
4. Inspect the existing implementation and tests in the affected area.
5. Identify conflicts, missing requirements, and assumptions before implementation.

Do not assume that mentioning a document means it has been read. Open and inspect the relevant files.

If `AGENTS.md` or a required document is missing, report that fact. Do not silently invent its contents.

## 3. Instruction priority

Use the following order when instructions appear to conflict:

1. Explicit, current user instructions and decisions.
2. Security requirements in `SECURITY.md`.
3. Project-wide engineering rules in `AGENTS.md`.
4. Architecture, API, database, and coding documentation relevant to the task.
5. Existing implementation patterns, provided they do not conflict with the rules above.
6. Claude Code defaults.

Do not silently resolve a conflict that changes product behavior, architecture, security, data compatibility, or public API contracts. Explain the conflict and ask for clarification when needed.

## 4. Project overview

Typing Trainer is an offline-first Windows desktop application designed to improve typing speed, accuracy, consistency, and touch-typing technique.

### Approved technology stack

- Desktop shell: Tauri 2
- Native desktop layer: Rust
- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS
- UI components: shadcn/ui
- Frontend state: Zustand
- Backend: Spring Boot 3 with Java 21
- API: Spring MVC REST under `/api/v1`
- Database: SQLite
- Persistence: Spring Data JPA / Hibernate
- Migrations: Flyway
- Validation: Jakarta Bean Validation
- API documentation: Springdoc OpenAPI
- Charts: Recharts
- Frontend tests: Vitest and React Testing Library
- End-to-end tests: Playwright
- Backend tests: JUnit 5, Mockito, Spring Boot Test, and MockMvc
- Build: npm, Maven wrapper, and Tauri bundler

### Architecture baseline

- Use a modular monolith. Do not introduce microservices.
- Keep the application local-first and usable offline after installation.
- Tauri starts and supervises Spring Boot as a child process.
- Spring Boot must bind only to `127.0.0.1` in production.
- Use a controlled local port and the per-launch request-protection mechanism defined in `SECURITY.md`.
- Store SQLite data in the user's application data directory, not in the repository or installation directory.
- Bundle a compatible Java 21 runtime in the Windows installer.
- Keep the real-time typing interaction loop in React. Do not send REST requests for every keystroke.
- Use the backend for persistence, lesson and exercise delivery, session submission, settings, and analytics.

### Explicit exclusions

Do not introduce these unless the user explicitly changes the requirements:

- Ollama or any other local LLM runtime.
- Local or cloud AI model integration.
- A cloud backend or mandatory online account.
- Microservices.
- Remote telemetry or analytics transmission.
- System-wide keyboard monitoring or keylogging.
- Arbitrary shell execution or unrestricted filesystem access.

Typing recommendations and coaching must remain deterministic and explainable using local typing statistics unless the product scope is explicitly revised.

## 5. Model and provider neutrality

The repository must remain independent of the model provider used by Claude Code.

- Do not assume that the configured model supports a particular proprietary feature.
- Do not add provider-specific SDKs, API keys, model endpoints, or runtime dependencies to the application unless explicitly requested as a product feature.
- Do not put provider credentials in repository files, prompts committed to source control, frontend code, or application configuration.
- Do not infer that a task has been completed because a model or provider says it has. Inspect the changed files and run the relevant checks.
- Use the same project standards for planning, implementation, testing, and review regardless of the configured custom provider.
- If the configured model cannot reliably complete a task, explain the limitation and propose a smaller verifiable step rather than fabricating results.

Claude Code may use its configured provider to perform coding tasks. That provider configuration is separate from the runtime architecture of Typing Trainer.

## 6. Required working method

For every task:

1. Restate the requested outcome briefly when the task is complex or ambiguous.
2. Identify the affected feature, layer, and files.
3. Inspect the existing implementation before editing.
4. Check existing components, services, types, utilities, and tests for reusable patterns.
5. Confirm API and database contracts before changing cross-layer behavior.
6. Make the smallest coherent change that satisfies the request.
7. Add or update tests for the changed behavior.
8. Run relevant tests, linting, type checks, and builds.
9. Review the final diff for regressions and unrelated edits.
10. Update documentation when contracts, behavior, setup, architecture, or security changes.
11. Report what changed, what checks were run, their actual outcomes, and any remaining limitations.

Do not claim that a test, build, migration, command, or manual verification succeeded unless it was actually executed and its result was observed.

Do not stop after generating code if the task requires integration, tests, or verification.

## 7. Implementation rules

### Frontend

- Follow TypeScript strict mode and the rules in `CODING_STANDARDS.md`.
- Avoid `any`; use explicit types and safe narrowing.
- Keep components focused and reusable.
- Use Zustand for shared application state and local component state for isolated interactions.
- Keep API calls in a dedicated client/service layer.
- Handle loading, empty, success, and error states.
- Keep high-frequency typing state localized to avoid unnecessary application-wide rerenders.
- Keep keystroke processing in the frontend. Do not call the backend for each keypress.
- Render user-provided text as text. Do not use unsafe HTML rendering for passages, lesson content, imported data, or API responses.
- Follow the existing design system and accessibility requirements.

### Backend

- Use Java 21 and the existing Spring Boot conventions.
- Organize code by feature as defined in `PROJECT_STRUCTURE.md`.
- Keep controllers thin and business rules in services or domain components.
- Use request and response DTOs. Do not expose JPA entities directly.
- Validate input with Jakarta Bean Validation.
- Use constructor injection and appropriate transaction boundaries.
- Keep API responses aligned with `API_CONTRACT.md`.
- Do not expose stack traces, secrets, environment variables, or internal filesystem paths.

### Database

- Use SQLite and Flyway.
- Add a migration for each schema change.
- Do not use ORM schema auto-update as a substitute for migrations.
- Preserve existing user data.
- Use parameterized queries and database constraints.
- Test fresh database creation and upgrades from the previous supported schema.
- Update `DATABASE.md` when schema, indexes, constraints, or data lifecycle behavior changes.

### Tauri and Rust

- Treat Rust and Tauri as the privileged desktop boundary.
- Use least-privilege capabilities.
- Keep commands narrow, typed, and purpose-specific.
- Validate arguments in Rust as well as in the frontend.
- Do not expose arbitrary shell commands or unrestricted filesystem access.
- Use native file dialogs and validate selected paths, file types, and file sizes.
- Restrict external navigation to approved destinations and schemes.
- Supervise the Spring Boot child process and terminate it on application shutdown.

## 8. Security requirements

`SECURITY.md` is mandatory. Read it before changing Tauri permissions, local API behavior, process startup, file operations, import/export, database access, logging, packaging, or dependencies.

At minimum:

- Bind the production backend only to `127.0.0.1`.
- Require the per-launch request token for local API calls.
- Validate Origin and configure explicit CORS rules.
- Use a restrictive production Content Security Policy.
- Do not grant unnecessary Tauri capabilities.
- Validate data at every trust boundary.
- Use parameterized SQL.
- Never commit or log secrets and request tokens.
- Do not log raw keystroke streams or full typed passages by default.
- Do not collect keyboard input outside the active typing surface.
- Do not add external data transmission without explicit approval.
- Do not weaken a security control as a shortcut. Explain the risk and propose a safer approach.

## 9. Testing and verification

Use the project's approved tools:

- Frontend unit and component tests: Vitest and React Testing Library.
- End-to-end tests: Playwright.
- Backend unit tests: JUnit 5 and Mockito.
- Backend integration and API tests: Spring Boot Test and MockMvc.

Test the behavior at the layer where it belongs.

For typing functionality, cover relevant cases such as:

- Correct and incorrect characters.
- Repeated characters and punctuation.
- Backspace and correction behavior.
- Timer expiry and session completion.
- Empty or invalid passages.
- WPM, accuracy, and error calculations.
- Focus loss and session interruption.

For backend and persistence changes, cover validation, error responses, idempotency, transaction behavior, and migrations as applicable.

For desktop integration changes, verify startup, shutdown, child-process handling, local API protection, and production configuration.

If a test cannot be run, state exactly which check remains outstanding and why.

## 10. Parallel work and subagents

When using Claude Code subagents or other parallel agents:

- Give each agent a bounded task and clear file ownership.
- Read and communicate the relevant project instructions to each agent. Do not assume a subagent has inherited every repository instruction.
- Agree on shared API contracts, DTOs, and types before parallel implementation.
- Avoid concurrent edits to the same files, migrations, central configuration, or shared interfaces.
- Do not treat an agent's completion message as proof. Inspect its changes and test results.
- Have one integration owner review cross-layer compatibility and run the integrated checks.
- Surface blockers with the affected files, expected behavior, and evidence.

## 11. Change safety

- Do not overwrite unrelated user changes.
- Do not perform destructive operations such as broad deletion, hard reset, database reset, or history rewriting unless explicitly authorized and necessary.
- Do not remove or weaken tests just to make a build pass.
- Do not add dependencies without explaining why they are needed and checking whether the current stack already provides the capability.
- Do not add generated binaries, local databases, secrets, or temporary debug artifacts to source control.
- Do not make speculative refactors outside the requested scope.

## 12. Documentation maintenance

Update the appropriate documentation whenever implementation changes affect:

- Product scope or user-visible behavior.
- Architecture or module boundaries.
- REST endpoints, DTOs, or error contracts.
- Database schema, migrations, or backup behavior.
- Security controls or data handling.
- Setup, build, packaging, or release procedures.
- Typing metric definitions or analytics interpretation.

Documentation must describe the actual implementation. Clearly label planned or unresolved behavior; do not present it as completed.

## 13. Definition of done

A task is complete only when:

- [ ] The requested behavior is implemented.
- [ ] The approved product scope and architecture are respected.
- [ ] Security and validation requirements are satisfied.
- [ ] Relevant tests have been added or updated.
- [ ] Relevant tests and build checks have been run, or outstanding checks are identified.
- [ ] Frontend, backend, API, and database contracts remain consistent.
- [ ] Required documentation is updated.
- [ ] The final diff contains no unrelated changes, secrets, or debug artifacts.
- [ ] The final response accurately summarizes changes, verification, and remaining limitations.

## 14. Final instruction

Prioritize correctness, data integrity, security, and maintainability over speed. Do not guess missing requirements, silently change approved architecture, or claim unverified success.

If an unresolved decision materially affects product behavior, security, architecture, or data compatibility, stop and ask the user for clarification before implementing that decision.
