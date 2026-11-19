# AGENTS.md

## 1. Purpose

This file defines the working instructions for AI coding agents and human contributors working in the Typing Trainer repository.

The goal is to keep implementation consistent with the approved product scope, architecture, security baseline, and engineering standards. These instructions apply across the repository unless a more specific `AGENTS.md` in a subdirectory adds narrower instructions. A subdirectory instruction may clarify local conventions but must not override the project-wide architecture or security requirements.

Before making changes, inspect the relevant source files and documentation. Do not assume that a feature, endpoint, component, or database table exists merely because it appears in a proposed design.

## 2. Project context

Typing Trainer is an offline-first Windows desktop application for improving typing speed, accuracy, consistency, and touch-typing technique.

### Approved baseline stack

- Desktop shell: Tauri 2
- Native desktop layer: Rust
- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS
- UI components: shadcn/ui
- Frontend state: Zustand
- Backend: Spring Boot 3, Java 21
- API: Spring MVC REST, versioned under `/api/v1`
- Database: SQLite
- Persistence: Spring Data JPA / Hibernate
- Database migrations: Flyway
- Validation: Jakarta Bean Validation
- API documentation: Springdoc OpenAPI
- Charts: Recharts
- Frontend unit/component tests: Vitest and React Testing Library
- End-to-end tests: Playwright
- Backend tests: JUnit 5, Mockito, Spring Boot Test, and MockMvc
- Build: npm, Maven wrapper, and Tauri bundler

### Architectural baseline

- Use a modular monolith. Do not introduce microservices.
- Keep the application local-first and usable offline after installation.
- Tauri manages Spring Boot as a child process.
- Spring Boot binds only to `127.0.0.1`.
- The backend uses a controlled local port and a per-launch request-protection mechanism.
- The SQLite database lives in the user's application data directory, not in the repository or installation directory.
- Bundle a compatible Java 21 runtime in the installer so end users do not need to install Java separately.
- Keep the real-time typing interaction loop in the React frontend. Do not make a REST request for every keystroke.
- Use the backend for persistence, lesson and exercise delivery, settings, session submission, analytics, and other application business logic.

### Explicit exclusions

Do not add any of the following unless the user explicitly changes the product requirements:

- Ollama or other local LLM runtimes.
- Local or cloud AI model integration.
- Cloud backend or mandatory online account.
- Microservices.
- Remote telemetry or analytics transmission.
- System-wide keyboard monitoring or keylogging.
- Arbitrary shell execution or unrestricted filesystem access.

Recommendations and coaching should be deterministic and explainable using locally stored typing statistics unless the product scope is explicitly revised.

## 3. Required documentation

Read the relevant documentation before changing the corresponding area:

- `README.md`: product overview, scope, and feature modules.
- `ARCHITECTURE.md`: component responsibilities and system boundaries.
- `TECH_STACK.md`: approved technologies and dependency choices.
- `PROJECT_STRUCTURE.md`: repository layout and module boundaries.
- `API_CONTRACT.md`: REST endpoints, DTO expectations, and error format.
- `DATABASE.md`: database schema and persistence rules, when present.
- `CODING_STANDARDS.md`: language and implementation conventions.
- `SECURITY.md`: security requirements and threat model.
- `SETUP.md`: development environment and build instructions.
- `CONTRIBUTING.md`: branch, commit, review, and contribution workflow.

If a referenced document is not present, do not invent its contents. Work from the available source and flag the missing documentation if it blocks a decision.

When documentation conflicts, do not silently choose whichever instruction is easiest. Prefer explicit user decisions and the security baseline. Identify the conflict and ask for clarification if it changes architecture, data handling, security, or product behavior.

## 4. General agent workflow

For every task:

1. Identify the requested outcome and the affected application layer.
2. Inspect the existing implementation and relevant tests.
3. Read the relevant project documentation.
4. Check for existing reusable components, services, utilities, and patterns before creating new ones.
5. State any material assumptions. Do not invent missing requirements.
6. Make the smallest coherent change that satisfies the task.
7. Add or update tests for changed behavior.
8. Run the relevant checks and inspect their actual output.
9. Update documentation when behavior, contracts, configuration, or setup instructions change.
10. Summarize files changed, behavior delivered, checks run, and known limitations.

Do not claim that a command, test, build, migration, or manual verification succeeded unless it was actually run and its result was observed.

If a check cannot be run, state why and identify the remaining verification required.

## 5. Product behavior rules

- Preserve the distinction between Typing Test, Learning Mode, Exercises, Typing Games, Developer Mode, Analytics, Achievements, and Customization.
- Keep typing sessions responsive. The frontend typing engine must not wait for network or database operations for each keypress.
- WPM, accuracy, error counts, and related metrics must use documented and consistent definitions.
- Keep raw session data where needed to support reproducible analytics. Do not silently change historical metric definitions.
- Recommendations must be deterministic, explainable, and based on local application data.
- Do not fabricate lesson content, language support, keyboard layouts, achievements, or analytics capabilities that are not implemented.
- Make empty, loading, error, and success states explicit in the UI.
- Preserve user progress when changing lessons, exercises, settings, or database structures.
- Do not add product features outside the requested scope without explaining the proposed change first.

## 6. Frontend instructions

### React and TypeScript

- Use TypeScript strict mode.
- Avoid `any`. Prefer explicit types, discriminated unions, and `unknown` with safe narrowing.
- Keep components focused and composable.
- Separate presentation from business logic where practical.
- Use Zustand for shared application state. Avoid duplicating the same state across multiple stores or components.
- Keep short-lived input and interaction state local to the component when it does not need to be shared.
- Use stable keys when rendering lists.
- Avoid unnecessary effects. Derive values from state when possible.
- Clean up event listeners, subscriptions, and resources created by effects.
- Keep API access in a dedicated client/service layer rather than scattering raw `fetch` calls throughout UI components.
- Handle API loading, validation, and failure states explicitly.
- Do not put secrets, request tokens, or sensitive local paths in persistent browser storage.

### Typing engine

- Keep keystroke processing local to the frontend.
- Do not send an HTTP request for every keypress.
- Separate input capture, text comparison, metric calculation, timer behavior, and UI rendering.
- Make timing and metric calculations deterministic and testable.
- Handle paste, focus loss, keyboard layout differences, and session completion deliberately.
- Do not capture keyboard input outside the active Typing Trainer typing surface.
- Test boundary conditions such as empty passages, repeated characters, backspace, punctuation, timer expiry, and completion at the same time as a key event.
- Avoid rerendering the entire application for every keystroke. Keep high-frequency state as localized as practical.

### UI and accessibility

- Use the existing design system and shadcn/ui components where appropriate.
- Use semantic HTML and accessible labels.
- Support keyboard navigation and visible focus states.
- Do not communicate correctness or errors through color alone.
- Keep layouts usable at supported Windows window sizes and display scaling settings.
- Avoid introducing a second component library without approval.
- Do not use unsafe HTML rendering for lesson text, passages, imported content, or API responses.

## 7. Backend instructions

### Java and Spring Boot

- Use Java 21 and the existing Spring Boot project conventions.
- Organize code by feature or domain as documented in `PROJECT_STRUCTURE.md`.
- Keep controllers thin. Put business rules in services or domain components.
- Use request and response DTOs. Do not expose JPA entities directly through REST endpoints.
- Validate incoming requests with Jakarta Bean Validation.
- Use constructor injection.
- Keep transactions at appropriate service boundaries.
- Use explicit exception handling and the documented API error structure.
- Do not return stack traces, secrets, environment variables, or internal filesystem paths to the frontend.
- Avoid adding dependencies when the JDK or current stack already provides a suitable solution.
- Keep API behavior aligned with `API_CONTRACT.md`.

### Local API

- Keep endpoints under `/api/v1`.
- Bind only to `127.0.0.1` in production.
- Follow `SECURITY.md` for local port selection, per-launch request token, Origin checks, and CORS.
- Do not treat loopback binding or CORS as authentication.
- Do not expose arbitrary SQL, filesystem, process, or shell operations.
- Keep health and diagnostics endpoints minimal.
- Apply sensible request-size limits and timeouts.

## 8. Database instructions

- Use SQLite and Flyway for schema management.
- Do not change the schema through manual production SQL or ORM auto-DDL.
- Add a new Flyway migration for every schema change.
- Never edit an already released migration unless the task explicitly concerns an unreleased development migration and the team confirms it is safe.
- Use parameterized database access.
- Enforce relationships and uniqueness with database constraints where appropriate.
- Keep transactions short.
- Preserve existing user data during migrations.
- Consider SQLite foreign-key enforcement and write contention.
- Test both fresh database creation and upgrades from the previous supported schema.
- Update `DATABASE.md` when schema, indexes, constraints, retention, or backup behavior changes.

## 9. Tauri and Rust instructions

- Treat Tauri and Rust as the privileged desktop boundary.
- Grant only the capabilities required by implemented features.
- Keep commands narrow, typed, and purpose-specific.
- Validate command arguments in Rust, even if the frontend validates them.
- Do not expose arbitrary command execution or unrestricted filesystem operations.
- Use native file dialogs for user-selected import/export paths.
- Validate file types, sizes, and canonical paths before operating on files.
- Restrict external navigation to approved schemes and destinations.
- Follow the production Content Security Policy and capability configuration in `SECURITY.md`.
- Ensure the Spring Boot child process is supervised and terminated during application shutdown.
- Do not run the application or backend with administrator privileges unless a documented requirement is approved.

## 10. Security and privacy rules

`SECURITY.md` is mandatory for all implementation work.

At minimum:

- Validate data at every trust boundary.
- Never commit secrets, signing keys, passwords, or request tokens.
- Never log secrets or raw keystroke streams.
- Use parameterized SQL.
- Render user-provided text safely.
- Constrain import/export operations to validated user-selected paths.
- Keep production CORS restrictive.
- Do not weaken CSP or Tauri permissions to make a feature work without documenting and reviewing the security impact.
- Do not add telemetry or external data transmission without explicit approval.
- Do not collect system-wide keyboard input, clipboard contents, or unrelated application activity.
- Do not add authentication or credential storage unless the product requirements call for it.
- Avoid exposing internal exception details to the UI.

If a requested implementation conflicts with the security baseline, explain the conflict and propose a safer design before proceeding.

## 11. Testing requirements

Add tests at the layer where the behavior lives.

### Frontend

- Use Vitest and React Testing Library.
- Test user-visible behavior rather than implementation details.
- Test typing-engine calculations independently from React components.
- Cover input edge cases, timing, accuracy, WPM, and session completion.
- Use Playwright for important end-to-end workflows.

### Backend

- Use JUnit 5 and Mockito for unit tests.
- Use Spring Boot Test and MockMvc for API and integration tests.
- Test validation failures, error responses, and idempotency.
- Test service behavior and persistence boundaries.
- Test database migrations against a fresh database and an upgrade scenario.

### Tauri and integration

- Test application startup and shutdown.
- Test backend process failure and recovery behavior.
- Verify production configuration does not expose the backend beyond loopback.
- Test the local request-protection flow.
- Test import/export validation and failure handling.

Do not remove or weaken an existing test merely to make a build pass. If a test is obsolete, explain why and replace its coverage.

## 12. Performance and reliability

- Keep typing input processing responsive and predictable.
- Avoid synchronous persistence work in the keypress path.
- Batch or defer persistence where appropriate without risking loss of completed session data.
- Avoid unbounded in-memory session histories.
- Paginate or limit analytics queries that can grow with user history.
- Avoid expensive recalculation on every UI render.
- Handle backend startup delays and unavailable states gracefully.
- Make session submission idempotent so retries do not create duplicate sessions.
- Handle database busy/locked conditions with bounded retry or clear failure behavior.
- Do not silently discard user progress after an error.

## 13. Dependency and configuration rules

- Prefer existing approved dependencies.
- Explain the purpose and maintenance implications of a new dependency.
- Commit and maintain package lockfiles, `Cargo.lock`, and Maven wrapper configuration.
- Do not use floating or unpinned executable downloads in release scripts.
- Keep development and production configuration separate.
- Do not commit local database files, generated secrets, build outputs, or machine-specific configuration.
- Update setup documentation when a new prerequisite or build step is introduced.
- Do not introduce an online dependency into normal application use without explicit approval.

## 14. Documentation requirements

Update documentation when a change affects:

- Product scope or navigation.
- Architecture or module boundaries.
- REST endpoints or request/response contracts.
- Database schema or migration behavior.
- Security controls or data handling.
- Environment setup, build, packaging, or release.
- User-visible behavior or metric definitions.

Keep examples accurate and consistent with the implementation. Do not document planned functionality as if it were already implemented.

## 15. Git and change management

- Follow `CONTRIBUTING.md` for branch and commit conventions.
- Keep changes focused and reviewable.
- Do not overwrite unrelated user changes.
- Do not run destructive commands such as broad file deletion, database reset, or hard reset unless explicitly authorized and necessary.
- Do not commit generated binaries, local databases, secrets, or temporary debug files.
- Review the final diff for accidental changes.
- Mention any migration or manual setup step required by the change.

## 16. Agent coordination

When multiple agents work on the repository:

- Assign clear file and module ownership to avoid conflicting edits.
- Agree on API contracts and shared types before parallel implementation.
- Do not let frontend and backend agents independently invent incompatible DTOs or endpoint behavior.
- Keep shared interfaces in the documented contract locations.
- The integration owner must review cross-module compatibility and run the relevant integrated tests.
- Do not assume another agent's work is complete until its files and test results have been inspected.
- Report blockers early, with the affected files, expected contract, and evidence.
- Avoid multiple agents editing the same migration, shared configuration, or central routing file at the same time.

## 17. Definition of done

A task is complete only when:

- [ ] The requested behavior is implemented within the approved scope.
- [ ] Existing architecture and module boundaries are respected.
- [ ] Relevant input validation and security controls are present.
- [ ] Tests cover the changed behavior and important edge cases.
- [ ] Relevant tests and build checks have been run, or unrun checks are clearly identified.
- [ ] API and database contracts remain consistent across layers.
- [ ] Documentation is updated where required.
- [ ] No unrelated changes, secrets, debug code, or generated artifacts remain.
- [ ] The final summary states what changed, what was tested, and what remains open.

## 18. Final instruction

Prioritize correctness, data integrity, security, and maintainability over implementation speed. Do not guess missing requirements, silently change approved architecture, or claim unverified success. When a decision materially affects product behavior, security, data compatibility, or architecture and cannot be derived from the existing documentation, stop and ask for clarification.
