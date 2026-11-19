# Contributing to Typing Trainer

Thank you for your interest in contributing to Typing Trainer.

This document explains how to propose changes, work with the codebase, test your changes, and submit contributions.

Typing Trainer is an offline-first Windows desktop application built with Tauri 2, React, TypeScript, Spring Boot 3, Java 21, and SQLite.

## 1. Before contributing

Before making changes:

1. Read the root `README.md`.
2. Review `docs/ARCHITECTURE.md`.
3. Follow `docs/CODING_STANDARDS.md`.
4. Review `docs/API_CONTRACT.md` when changing frontend/backend communication.
5. Review `docs/TECH_STACK.md` and `docs/PROJECT_STRUCTURE.md`.
6. Follow `docs/SETUP.md` to prepare your development environment.

If a required document is not yet present, check the project issue or ask for clarification rather than inventing an architectural decision.

## 2. Contribution principles

All contributions should:

- Solve a clearly described problem or implement an agreed requirement.
- Preserve the offline-first product experience.
- Respect the frontend, backend, desktop, and database boundaries.
- Keep the real-time typing loop responsive.
- Include tests for new behavior and bug fixes.
- Avoid unnecessary dependencies and abstractions.
- Maintain accessibility and keyboard usability.
- Update documentation when behavior or contracts change.
- Avoid introducing Ollama, LLMs, or cloud AI dependencies.

Do not introduce microservices, cloud accounts, remote services, or new infrastructure without explicit product approval.

## 3. Repository layout

The main source areas are:

```text
typing-trainer/
  desktop/       # Tauri, React, and TypeScript
  backend/       # Spring Boot and Java
  database/      # Seed content and database notes
  docs/          # Project documentation
  scripts/       # Development and build scripts
  README.md
```

Keep changes in the correct area. Avoid unrelated modifications across multiple layers.

## 4. Issues and proposals

Before implementing a significant change:

1. Search existing issues and discussions for duplicates.
2. Describe the problem and expected behavior.
3. Identify affected application modules.
4. Mention relevant API or database changes.
5. Identify compatibility, privacy, and offline implications.
6. Agree on the approach before large architectural changes.

For bug reports, include:

- Application version or commit.
- Windows version and architecture.
- Steps to reproduce.
- Expected behavior.
- Actual behavior.
- Relevant sanitized logs or screenshots.
- Whether the issue occurs offline.

Never attach secrets, personal database files, or private typed content.

## 5. Branching and commit conventions

Use focused branches.

Suggested branch names:

```text
feature/typing-test
feature/lesson-progression
feature/weak-key-analytics
fix/session-timer
fix/sqlite-migration
docs/setup-guide
refactor/typing-engine
```

Use clear commit messages. Conventional Commits are recommended:

```text
feat(typing): add timed typing sessions
fix(analytics): correct weekly average calculation
refactor(backend): isolate session validation
test(typing): cover corrected character handling
docs(api): document session idempotency
chore(build): update frontend tooling
```

Keep commits small enough to review and avoid mixing unrelated changes.

## 6. Development workflow

Recommended workflow:

1. Start from the current main branch.
2. Create a focused feature or fix branch.
3. Understand the existing module and contract.
4. Implement the smallest complete change.
5. Add or update automated tests.
6. Run the relevant checks.
7. Review the diff for unrelated changes, secrets, and generated files.
8. Update documentation where necessary.
9. Submit a pull request with a clear summary and test evidence.

Do not mark a task complete while relevant checks are failing.

## 7. Frontend contribution rules

Frontend changes belong in `desktop/`.

Requirements:

- Use TypeScript strict mode.
- Avoid `any`.
- Follow feature-oriented organization.
- Keep API calls in the API/service layer.
- Keep reusable components generic.
- Use Zustand only for shared client state.
- Keep derived state derived rather than duplicated.
- Handle loading, empty, error, and success states.
- Use semantic HTML and accessible labels.
- Support keyboard navigation.
- Avoid unnecessary component re-renders.
- Do not send REST requests for individual keystrokes.

For typing engine changes:

- Keep calculations pure and testable.
- Use a monotonic clock for elapsed time.
- Define Backspace and correction behavior.
- Keep target text immutable during a session.
- Prevent duplicate completion and submission.
- Test empty input, zero duration, timing boundaries, and keyboard edge cases.

## 8. Backend contribution rules

Backend changes belong in `backend/`.

Requirements:

- Use Java 21.
- Follow package-by-feature organization.
- Use constructor injection.
- Keep controllers thin.
- Put business rules in services.
- Keep persistence in repositories.
- Use DTOs rather than exposing JPA entities.
- Validate request payloads.
- Use consistent API error responses.
- Keep transactions at appropriate service boundaries.
- Make session submission idempotent.
- Avoid logging sensitive data or full typed passages.

Update `docs/API_CONTRACT.md` when changing endpoint paths, payloads, validation, status codes, or response behavior.

## 9. Database contribution rules

Database changes must:

- Include a new Flyway migration.
- Never modify an already-applied migration.
- Preserve existing user data.
- Define indexes, constraints, and foreign-key behavior deliberately.
- Be tested against SQLite.
- Include migration and rollback/recovery considerations in the pull request description.

Do not commit a live SQLite database or user data.

Update `docs/DATABASE.md` when schema or persistence behavior changes.

## 10. Tauri and Rust contribution rules

Desktop integration changes belong in `desktop/src-tauri/`.

Requirements:

- Keep commands narrow and purpose-specific.
- Do not expose arbitrary shell execution.
- Restrict filesystem access.
- Keep the Spring Boot process under desktop lifecycle management.
- Bind the backend to `127.0.0.1` only.
- Handle readiness, startup failure, and shutdown.
- Do not hardcode a local port that may already be occupied.
- Review Tauri capabilities and Content Security Policy changes carefully.

Include Windows verification for changes that affect process management, permissions, or packaging.

## 11. Testing requirements

Tests should be added or updated for every meaningful behavior change.

### Frontend

Run the configured commands from `desktop/`:

```powershell
npm run build
npm test
```

Also run, when configured:

```powershell
npm run lint
npm run typecheck
```

### Backend

Run from `backend/`:

```powershell
.\mvnw.cmd clean verify
```

### Desktop integration

For relevant changes, verify:

- Tauri starts the backend.
- The backend readiness check succeeds.
- The frontend receives the current local endpoint.
- The backend remains loopback-only.
- The backend shuts down cleanly.
- The application works without internet access.

Use the actual script names in `package.json` if they differ from these examples.

### Test quality

- Tests must be deterministic.
- Cover boundary conditions and failure paths.
- Avoid arbitrary sleeps when controllable clocks or synchronization are available.
- Do not depend on external services for core test suites.
- Do not disable or weaken tests merely to make a change pass.

## 12. Pull request requirements

A pull request should include:

- A concise title.
- The problem being solved.
- A summary of the implementation.
- Affected modules.
- Relevant issue reference, if available.
- Tests added or updated.
- Commands run and their results.
- Screenshots or short recordings for visible UI changes.
- API or database migration details, if applicable.
- Risks and known limitations.

Before requesting review, verify:

- [ ] The change follows `CODING_STANDARDS.md`.
- [ ] The change respects `ARCHITECTURE.md`.
- [ ] The API contract is updated if needed.
- [ ] Database migrations are included if needed.
- [ ] Relevant tests pass.
- [ ] The production build succeeds.
- [ ] No secrets or local user data are included.
- [ ] No generated build output is committed.
- [ ] Offline operation is preserved.
- [ ] Accessibility and keyboard navigation are considered.
- [ ] Documentation is updated where necessary.

## 13. Documentation contributions

Documentation should be:

- Accurate and consistent with the implemented application.
- Written in clear Markdown.
- Updated alongside the code change it describes.
- Free from unverified claims and stale commands.
- Linked from the root `README.md` where relevant.

When an architectural decision changes, update all affected documents rather than allowing conflicting guidance to remain.

## 14. Security and privacy reporting

Do not publish credentials, private user data, exploitable details, or sensitive logs in public issues.

For security concerns, use the repository's private security reporting process if one is configured. If no private reporting channel is available, contact the project maintainer privately before publishing details.

Do not include real user typing passages or personal database files in test fixtures.

## 15. Scope exclusions

Unless the product scope is explicitly changed, contributions must not add:

- Ollama or local LLM integration.
- Cloud LLM APIs or AI inference runtimes.
- Mandatory cloud accounts.
- Mandatory internet connectivity.
- Microservices.
- Remote database infrastructure.

Recommendations should remain deterministic and based on local typing statistics.

## 16. Definition of an accepted contribution

A contribution is ready to merge when:

1. It meets the agreed requirement.
2. It follows the project's architecture and coding standards.
3. Relevant tests pass.
4. API and database contracts are updated when needed.
5. It preserves offline-first behavior.
6. It does not introduce unapproved dependencies or services.
7. It has been reviewed and any requested changes are addressed.
8. Documentation is accurate.

Thank you for helping improve Typing Trainer.
