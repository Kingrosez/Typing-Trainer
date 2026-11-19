# Typing Trainer - Coding Standards

**Status:** Project engineering standard  
**Applies to:** Frontend, backend, database, desktop integration, and tests  
**Baseline stack:** Tauri 2, React, TypeScript, Spring Boot 3, Java 21, SQLite  
**Last updated:** 12 November 2026

## 1. Purpose and enforcement

This document defines the minimum engineering standards for all code contributed to Typing Trainer.

The goals are to:

- Keep the codebase readable, consistent, and maintainable.
- Make typing interactions responsive and predictable.
- Protect user data stored locally.
- Keep frontend, backend, and desktop responsibilities clearly separated.
- Make behavior testable and failures diagnosable.
- Avoid unnecessary abstractions and premature complexity.

These standards apply to production code, tests, build scripts, database migrations, and documentation.

### 1.1 General rules

1. Prefer simple, explicit code over clever or overly generic code.
2. Do not duplicate business rules across modules.
3. Do not introduce a dependency without a clear need.
4. Do not commit commented-out code, dead code, secrets, or temporary debugging output.
5. Do not suppress compiler, linter, or test errors merely to make a build pass.
6. Do not use placeholder implementations in completed features.
7. Document non-obvious decisions and important constraints.
8. Keep changes focused and reviewable.
9. Preserve existing conventions unless a deliberate, documented change is approved.
10. Never claim a feature is complete without running its relevant tests.

## 2. Repository and naming conventions

Use descriptive names that communicate intent.

| Item | Convention | Example |
|---|---|---|
| React component | PascalCase | `TypingTestPanel.tsx` |
| React hook | camelCase with `use` | `useTypingSession.ts` |
| TypeScript utility | camelCase | `calculateWpm.ts` |
| TypeScript type/interface | PascalCase | `TypingSessionResult` |
| Java class | PascalCase | `TypingSessionService` |
| Java method | camelCase | `saveSession()` |
| Java constant | UPPER_SNAKE_CASE | `MAX_TEST_DURATION` |
| Java package | lowercase | `com.typingtrainer.typing` |
| Database table/column | snake_case | `typing_sessions` |
| Database migration | Flyway versioned | `V1__create_initial_schema.sql` |
| Environment variable | UPPER_SNAKE_CASE | `APP_LOG_LEVEL` |
| Test file | Name of subject plus test suffix | `TypingSessionServiceTest.java` |

Additional rules:

- Avoid unclear abbreviations.
- Use domain terminology consistently.
- Prefer names that describe behavior, not implementation details.
- Boolean names should read naturally, such as `isActive`, `hasErrors`, and `canSubmit`.

## 3. Frontend standards

### 3.1 TypeScript

- Enable strict TypeScript checking.
- Avoid `any`. Use a concrete type, `unknown`, or a discriminated union.
- Do not use non-null assertions (`!`) without a documented invariant.
- Define shared API and domain types in appropriate feature or shared type modules.
- Prefer `type` for unions and compositions; use `interface` where extension or declaration merging is useful.
- Use readonly types where data must not be mutated.
- Narrow `unknown` values before use.
- Validate data received from external boundaries at runtime where necessary.

Example:

```ts
export interface TypingSessionResult {
  sessionId: string;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  totalErrors: number;
  durationSeconds: number;
  completedAt: string;
}
```

### 3.2 React components

- Use functional components and hooks.
- Keep components focused on one clear responsibility.
- Separate complex business logic into hooks or pure functions.
- Avoid deeply nested conditional rendering.
- Use stable, meaningful keys when rendering lists.
- Avoid defining large components inside other components.
- Do not mutate props, state, or shared objects.
- Keep derived values derived rather than storing duplicate state.
- Use memoization only when profiling or clear render-cost evidence justifies it.
- Handle loading, empty, error, and success states explicitly.

Recommended component pattern:

```tsx
interface TypingStatsProps {
  wpm: number;
  accuracy: number;
}

export function TypingStats({
  wpm,
  accuracy,
}: TypingStatsProps) {
  return (
    <section aria-label="Typing statistics">
      <p>WPM: {wpm}</p>
      <p>Accuracy: {accuracy}%</p>
    </section>
  );
}
```

### 3.3 State management

Use Zustand for shared application state where appropriate.

- Keep state as close as possible to the feature that owns it.
- Separate transient typing-session state from persisted application data.
- Do not copy server data into multiple stores without a clear synchronization strategy.
- Keep state updates immutable.
- Avoid storing values that can be calculated from existing state.
- Reset session-specific state when a session ends or is abandoned.
- Prevent stale asynchronous responses from overwriting newer state.

### 3.4 Frontend architecture

Organize code by feature rather than creating large global folders for every implementation detail.

- Feature components should remain within their feature.
- Shared components must be genuinely reusable.
- API clients belong in the service layer.
- Do not call `fetch` directly throughout UI components.
- Keep API DTOs separate from view-specific models when their responsibilities differ.
- Avoid importing private implementation details from another feature.

### 3.5 Styling and accessibility

- Use Tailwind utility classes consistently.
- Extract repeated patterns into reusable components or style helpers.
- Avoid arbitrary values when a design token already exists.
- Maintain readable contrast and visible focus indicators.
- Use semantic HTML elements.
- Associate labels with inputs.
- Provide accessible names for icon-only buttons.
- Support keyboard navigation throughout the application.
- Do not communicate correctness or errors through color alone.
- Respect reduced-motion preferences where applicable.

## 4. Typing engine standards

The typing engine is a performance-sensitive feature and must follow stricter rules.

### 4.1 Input processing

- Process keyboard input locally in the frontend.
- Never send one REST request per keystroke.
- Keep the target passage immutable during an active session.
- Use a clearly defined input-normalization policy.
- Handle Backspace according to the selected test mode.
- Ignore unrelated non-printing keys.
- Prevent accidental paste where the selected mode disallows it.
- Maintain focus during an active test without blocking normal application navigation.
- Prevent duplicate session completion and duplicate persistence.

### 4.2 Timing

- Use a monotonic clock for elapsed-time measurement.
- Do not calculate elapsed time by counting timer interval callbacks.
- Treat UI intervals as display updates, not the source of truth.
- Define when the timer starts and stops for every test mode.
- Handle delayed callbacks and application suspension.
- Store the final measured duration with the session result.

### 4.3 Metric consistency

Keep metric calculations in pure, independently tested functions.

Use one documented formula policy throughout the application.

```ts
export function calculateGrossWpm(
  totalCharacters: number,
  elapsedSeconds: number,
): number {
  if (elapsedSeconds <= 0) return 0;

  return (totalCharacters / 5) / (elapsedSeconds / 60);
}
```

Standards:

- Define what counts as a character.
- Define whether corrected mistakes count as errors.
- Define whether accuracy uses character attempts or final character positions.
- Define how uncorrected errors affect net WPM.
- Handle zero-duration and empty-input cases.
- Avoid inconsistent rounding between screens.
- Store raw statistics needed to recalculate derived metrics later.

Do not silently change historical metric semantics. If formulas change, version or document the calculation policy.

## 5. Backend standards

### 5.1 Java conventions

- Use Java 21 language features where they improve clarity.
- Follow standard Java naming conventions.
- Keep classes and methods focused.
- Prefer immutable DTOs; Java records are suitable for simple request and response models.
- Use constructor injection.
- Avoid field injection.
- Avoid static mutable state.
- Use `final` for fields that should not be reassigned.
- Use `BigDecimal` for values requiring decimal precision; do not use it unnecessarily for ordinary typing metrics.
- Use `Optional` for return values where absence is a meaningful result, not as a universal field or parameter wrapper.
- Do not catch and ignore exceptions.
- Avoid broad `catch (Exception)` unless the boundary has a deliberate recovery strategy.

### 5.2 Spring Boot layering

Follow this request flow:

```text
Controller
   |
   v
Application Service
   |
   v
Repository
   |
   v
SQLite
```

Responsibilities:

**Controller**
- Define HTTP routes.
- Validate request DTOs.
- Return suitable response DTOs and status codes.
- Delegate business operations to services.
- Contain no database or complex business logic.

**Service**
- Enforce business rules.
- Coordinate transactions.
- Coordinate repositories and module-level operations.
- Return domain results or application DTOs.

**Repository**
- Handle persistence.
- Keep custom queries focused.
- Avoid exposing persistence entities outside the persistence boundary.

**Entity**
- Represent persisted state.
- Avoid embedding HTTP or presentation logic.

### 5.3 Dependency injection and configuration

- Prefer constructor injection.
- Keep configuration externalized.
- Use typed configuration properties for related settings.
- Validate required configuration at startup.
- Do not hardcode machine-specific paths, ports, or secrets.
- Keep production and test configuration separate.
- Do not expose development-only settings in production builds.

### 5.4 API and DTO rules

- Use `/api/v1` as the API base path.
- Use request and response DTOs, not JPA entities.
- Validate inputs using Jakarta Bean Validation.
- Return consistent error response bodies.
- Use appropriate HTTP methods and status codes.
- Use pagination for large collections.
- Make completed-session submission idempotent.
- Use ISO-8601 timestamps with an explicit timezone convention.
- Do not expose internal stack traces or database details to the frontend.

### 5.5 Transactions

- Use `@Transactional` at appropriate service boundaries.
- Keep transactions short.
- Do not hold database transactions open during slow non-database work.
- Use read-only transactions for read operations where useful.
- Ensure related session and key-stat writes are atomic.

## 6. Database standards

### 6.1 SQLite and schema management

- Use Flyway for schema creation and evolution.
- Never modify an already-applied migration in a released database history.
- Add a new migration for each schema change.
- Use explicit column types and constraints.
- Add foreign keys and indexes where appropriate.
- Enable and verify SQLite foreign-key enforcement.
- Use transactions for related writes.
- Avoid unnecessary tables and over-normalization.

### 6.2 Naming and data integrity

- Use `snake_case` for tables and columns.
- Use stable primary keys.
- Add uniqueness constraints for identifiers that must be unique.
- Use `NOT NULL` for required values.
- Define deletion behavior explicitly for related records.
- Store timestamps consistently.
- Do not store redundant derived values unless there is a measured need and a consistency strategy.

### 6.3 Query performance

- Index fields commonly used for filtering and ordering, such as session completion time.
- Avoid loading all session history into memory.
- Use pagination or bounded date ranges.
- Inspect expensive queries before adding complex caching.
- Avoid N+1 query patterns.
- Do not use raw SQL concatenation with user-controlled values.

### 6.4 User data

- Store the database in the user's application data directory.
- Do not store user data in the installation directory.
- Provide a documented backup and restore approach.
- Do not log typed passage contents unnecessarily.
- Treat imported practice content as untrusted input.

## 7. Tauri desktop integration standards

- Keep Tauri commands narrow and purpose-specific.
- Do not expose arbitrary shell execution.
- Restrict filesystem access to explicitly required locations.
- Use a restrictive capability configuration.
- Apply a suitable Content Security Policy.
- Manage Spring Boot as a child process owned by the desktop lifecycle.
- Start the backend before the frontend depends on it.
- Detect startup failures and present actionable error messages.
- Shut down the backend gracefully when the desktop application exits.
- Bind the backend to loopback only.
- Select an available local port safely and communicate it to the frontend through a controlled mechanism.
- Do not assume a fixed port is available.
- Do not expose the backend to the local network.
- Test packaging on a clean Windows environment.

Never pass untrusted frontend input directly to shell commands or process arguments.

## 8. Error handling and logging

### 8.1 Frontend

- Show useful, user-readable error messages.
- Preserve recoverable input and results where possible.
- Distinguish validation errors, connection errors, and unexpected failures.
- Avoid swallowing rejected promises.
- Provide retry behavior only when retrying is safe.
- Do not display raw stack traces to users.

### 8.2 Backend

- Use centralized exception handling with `@RestControllerAdvice`.
- Define consistent error codes and response structures.
- Log unexpected failures with enough context to diagnose them.
- Avoid logging sensitive data or full typed passages.
- Use appropriate log levels.
- Do not use exceptions for normal control flow.

### 8.3 Logging

- Use structured, useful log messages.
- Include correlation or request identifiers where helpful.
- Do not log secrets, tokens, or unnecessary personal data.
- Avoid excessive logs inside the per-keystroke input loop.
- Keep production logging at an appropriate level.

## 9. Security and privacy standards

- Bind the backend to `127.0.0.1`, never `0.0.0.0`.
- Restrict CORS to the exact desktop frontend origin.
- Protect state-changing local API operations against cross-origin abuse.
- Do not enable unrestricted management or diagnostic endpoints in production.
- Validate all input received through APIs and imported files.
- Keep filesystem access scoped.
- Do not package credentials or API keys.
- Avoid unnecessary collection of personal information.
- Keep user data local by default.
- Make data export and deletion behavior explicit.
- Keep dependencies updated and review security advisories.

Localhost is not automatically trusted. The desktop shell and backend must still validate requests and restrict access.

## 10. Testing standards

### 10.1 Frontend

Test:

- WPM and accuracy calculations.
- Input comparison and correction behavior.
- Timer start, pause, resume, and completion behavior where supported.
- Keyboard edge cases.
- Session reset and duplicate completion prevention.
- Loading, empty, success, and error states.
- API request and response handling.
- Important user journeys through end-to-end tests.

### 10.2 Backend

Test:

- Service business rules.
- Request validation.
- Controller status codes and response structures.
- Repository behavior against SQLite.
- Flyway migrations from a clean database.
- Session persistence and idempotency.
- Analytics aggregation and date boundaries.
- Error handling and transaction rollback.

### 10.3 Desktop

Test:

- Backend startup and shutdown.
- Backend startup failure and recovery.
- Local port selection and frontend connectivity.
- Offline operation.
- Application data directory behavior.
- Installer installation, upgrade, and uninstall.
- Data preservation across application upgrades.
- Operation on a machine without a separately installed Java runtime.

### 10.4 Test quality

- Tests must be deterministic.
- Avoid arbitrary sleeps when a controllable clock or synchronization mechanism is available.
- Do not depend on external services for core test suites.
- Use realistic test data.
- Test boundary conditions, not only happy paths.
- Fix flaky tests rather than repeatedly rerunning them.

## 11. Performance standards

- Keep per-keystroke processing in the frontend.
- Avoid unnecessary component renders.
- Do not make network calls from the typing input loop.
- Keep database writes bounded and transactional.
- Paginate historical data.
- Avoid loading large datasets when summaries are sufficient.
- Use profiling before optimizing speculative bottlenecks.
- Measure startup time, typing responsiveness, memory usage, and analytics query time.
- Define minimum hardware and measurable targets before release.

## 12. Dependencies and build standards

- Pin direct dependency versions.
- Commit lockfiles where applicable.
- Review new dependencies for maintenance, license, security, and bundle impact.
- Avoid multiple libraries solving the same problem.
- Remove unused dependencies.
- Use reproducible build commands.
- Keep development-only tools out of production artifacts.
- Do not commit generated build directories or local database files.
- Do not commit personal IDE settings unless the team explicitly standardizes them.

## 13. Code review checklist

Before a change is merged, verify:

- [ ] The change meets the stated requirement.
- [ ] Responsibilities remain in the correct module.
- [ ] Names are clear and consistent.
- [ ] No unnecessary duplication or abstraction was added.
- [ ] TypeScript strict checks and Java compilation pass.
- [ ] Relevant automated tests pass.
- [ ] Database migrations are safe and versioned.
- [ ] API contracts and error handling are consistent.
- [ ] No secrets or sensitive user data are exposed.
- [ ] No unnecessary network calls occur during typing.
- [ ] Accessibility and keyboard navigation are considered.
- [ ] Documentation is updated where needed.
- [ ] The application still works offline.

## 14. Definition of done

A feature is complete only when:

1. Its behavior matches the agreed requirement.
2. Its implementation follows these standards.
3. Relevant unit, integration, and UI tests pass.
4. Validation and failure states are handled.
5. It does not break offline operation.
6. It does not introduce avoidable performance regressions.
7. Any required database migration is included.
8. Relevant documentation is updated.
9. The feature has been manually verified in the desktop application where appropriate.

## 15. Explicit exclusions

The following are not part of the current architecture or coding requirements:

- Ollama or local LLM integration.
- AI model downloads or inference runtimes.
- Mandatory cloud APIs or hosted AI services.
- Microservices.
- Mandatory user accounts or cloud synchronization.

Practice recommendations must use transparent, deterministic rules unless the product scope is deliberately revised.

---

**Engineering baseline:** TypeScript strict mode, React feature-oriented structure, Java 21, Spring Boot modular monolith, SQLite with Flyway, controlled Tauri process lifecycle, offline-first behavior, and automated tests.
