# Typing Trainer - Technology Stack

**Status:** Approved project baseline  
**Target platform:** Windows desktop  
**Architecture:** Offline-first modular monolith  
**Last updated:** 12 November 2026

## 1. Purpose

This document records the selected technologies for Typing Trainer, their responsibilities, integration boundaries, and dependency guidelines.

The goal is to build a responsive Windows desktop application with a React frontend, a Spring Boot backend, and local SQLite persistence.

The application must work offline after installation. No cloud account, remote backend, API key, Ollama runtime, or LLM is required.

## 2. Approved stack at a glance

| Layer | Selected technology | Responsibility |
|---|---|---|
| Desktop shell | Tauri 2 | Windows application window, native integration, lifecycle, packaging |
| Desktop native layer | Rust | Tauri commands and backend process management |
| Frontend framework | React | Application UI and component model |
| Frontend language | TypeScript | Type safety and maintainable frontend code |
| Frontend build | Vite | Development server and production asset bundling |
| Styling | Tailwind CSS | Utility-based styling and design consistency |
| UI components | shadcn/ui | Accessible reusable interface components |
| Frontend state | Zustand | Shared client-side state |
| Backend framework | Spring Boot 3 | Backend application and business services |
| Backend language | Java 21 | Backend implementation |
| API | Spring MVC REST | Local frontend-to-backend communication |
| Database | SQLite | Local persistent storage |
| Persistence | Spring Data JPA | Object-relational persistence |
| Database migrations | Flyway | Version-controlled schema evolution |
| Validation | Jakarta Bean Validation | Request and configuration validation |
| API documentation | Springdoc OpenAPI | API documentation and contract visibility |
| Charts | Recharts | Analytics and progress visualizations |
| Backend build | Maven | Dependency management, compilation, testing, packaging |
| Frontend tests | Vitest + React Testing Library | Unit and component tests |
| Browser automation | Playwright | End-to-end UI tests |
| Backend tests | JUnit 5 + Mockito | Unit and service tests |
| Backend integration tests | Spring Boot Test | API and application integration tests |
| Database tests | SQLite integration tests | Persistence and migration verification |

Use compatible, maintained patch versions at implementation time. Pin versions and verify compatibility rather than assuming every latest release works with every other component.

## 3. Desktop application: Tauri 2

### Why Tauri

- Provides a native desktop application shell.
- Uses the system webview rather than bundling a full Chromium runtime.
- Supports Windows packaging.
- Provides controlled access to native functionality.
- Can manage the Spring Boot backend process.

### Responsibilities

- Create the application window.
- Start and stop the Spring Boot backend.
- Pass the selected local API endpoint to the frontend securely.
- Coordinate startup readiness and shutdown.
- Package frontend assets, backend files, and runtime dependencies.
- Restrict filesystem and process capabilities.

### Constraints

- Keep Tauri commands narrow and purpose-specific.
- Do not expose arbitrary shell execution.
- Use a restrictive capability configuration.
- Use a suitable Content Security Policy.
- Do not expose the backend outside loopback.
- Test the application on supported Windows versions.

## 4. Frontend: React + TypeScript

### React

Use React for:

- Dashboard and navigation.
- Typing test interface.
- Learning and lesson screens.
- Typing games.
- Developer typing mode.
- Analytics and reports.
- Settings and customization.

### TypeScript

Enable strict checking.

Standards:

- Avoid `any`.
- Define typed API contracts.
- Keep domain types explicit.
- Validate data at external boundaries.
- Keep feature-specific types close to their features.

### Vite

Use Vite for:

- Local frontend development.
- TypeScript and React integration.
- Production asset bundling.
- Development build feedback.

### Tailwind CSS

Use Tailwind for:

- Layout and spacing.
- Responsive design.
- Typography and color tokens.
- Consistent visual states.
- Theme implementation.

### shadcn/ui

Use for accessible, reusable components such as:

- Buttons and inputs.
- Dialogs and dropdowns.
- Tabs and tooltips.
- Cards and navigation elements.
- Toasts and notifications.

Customize components to fit the application's visual design. Do not add a component merely because it is available.

### Zustand

Use for shared client state:

- Current user preferences.
- Active typing session state where shared access is required.
- Navigation or application-level UI state.
- Temporary client-side state.

Do not use Zustand as a substitute for the backend database. Keep persisted data in SQLite and retrieve it through the API.

## 5. Backend: Spring Boot 3 + Java 21

### Spring Boot

Use Spring Boot as the local application backend.

Responsibilities:

- REST controllers.
- Application and domain services.
- Validation and error handling.
- Session persistence.
- Lesson and exercise management.
- Analytics aggregation.
- Achievement evaluation.
- Rule-based recommendations.
- Settings and profile management.

### Selected Spring components

| Component | Purpose |
|---|---|
| Spring Web | REST API |
| Spring Data JPA | Repository and persistence abstraction |
| Spring Boot Validation | Request validation integration |
| Spring Boot Test | Application and integration testing |
| Springdoc OpenAPI | API documentation |

Use constructor injection, package-by-feature organization, DTOs, and service-level business rules.

### Java 21

Use Java 21 as the baseline runtime and language version.

- Prefer clear, maintainable Java.
- Use records for suitable immutable DTOs.
- Avoid unnecessary frameworks and abstractions.
- Keep business logic independent of HTTP and persistence details where practical.

The application installer must provide a compatible Java runtime so the end user does not need to install Java separately.

## 6. Database: SQLite

### Why SQLite

- No separate database server is required.
- Data stays on the user's machine.
- Suitable for a single-user desktop application.
- Supports offline operation.
- Simplifies installation and backup.

### Persistence stack

- SQLite as the database engine.
- Spring Data JPA for repository access.
- Flyway for database migrations.
- Hibernate as the JPA provider through Spring Boot's managed dependency configuration.

### Database guidelines

- Store the database in the user's application data directory.
- Enable foreign-key enforcement.
- Use transactions for related writes.
- Add indexes for frequently filtered and ordered data.
- Never modify an already-applied migration.
- Back up user data before destructive schema or upgrade operations.

The initial application does not need PostgreSQL or a remote database.

## 7. API and communication

Use Spring MVC REST with JSON payloads.

Base path:

```text
/api/v1
```

Communication:

```text
React frontend
      |
      | Local HTTP requests
      v
Spring Boot on 127.0.0.1
      |
      v
SQLite
```

Rules:

- The backend binds only to `127.0.0.1`.
- The desktop shell selects an available local port.
- The frontend receives the endpoint through a controlled Tauri mechanism.
- Local requests must be protected against unintended cross-origin access.
- Use typed request and response DTOs.
- Validate request bodies.
- Use consistent error responses.
- Never send one API request per keystroke.

The frontend owns the real-time typing input loop. The backend receives completed sessions and application data requests.

## 8. Charts and analytics

Use Recharts for:

- WPM trends.
- Accuracy trends.
- Practice duration.
- Daily and weekly activity.
- Weak-key statistics.
- Progress summaries.

The backend should calculate or aggregate historical data. The frontend should focus on visualization and interaction.

Do not transfer large raw datasets when a compact summary is sufficient.

## 9. Testing stack

### Frontend

| Tool | Purpose |
|---|---|
| Vitest | Unit tests |
| React Testing Library | Component behavior |
| Playwright | End-to-end desktop webview journey coverage where supported |

Test typing calculations, keyboard handling, session lifecycle, loading and error states, and API behavior.

### Backend

| Tool | Purpose |
|---|---|
| JUnit 5 | Unit tests |
| Mockito | Dependency isolation |
| Spring Boot Test | Integration tests |
| MockMvc | REST controller tests |
| SQLite test database | Persistence and migration tests |

Test validation, session idempotency, transaction behavior, analytics, and database migrations.

### Desktop

Test:

- Backend startup and shutdown.
- Local port selection.
- Readiness detection.
- Offline startup.
- Installer behavior.
- Runtime packaging.
- User data preservation across upgrades.

## 10. Build and packaging

### Development

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
./mvnw spring-boot:run
```

Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

### Production build

Frontend:

```bash
npm run build
```

Backend:

```bash
./mvnw clean package
```

The Tauri packaging pipeline must:

1. Build the frontend assets.
2. Package the Spring Boot application.
3. Include a compatible Java runtime.
4. Configure the backend as a managed child process.
5. Build the Windows installer.
6. Verify clean installation and upgrade behavior.

These commands are baseline examples. The final scripts and Maven profiles should be standardized in the repository.

## 11. Dependency management rules

- Pin direct dependency versions.
- Commit `package-lock.json`.
- Use Maven dependency management and avoid unnecessary version overrides.
- Review licenses, security advisories, maintenance, and bundle size before adding dependencies.
- Remove unused dependencies.
- Keep development-only dependencies out of production artifacts.
- Upgrade in controlled changes with tests.
- Document dependencies that have important licensing or native runtime implications.

Prefer Spring Boot's managed dependency versions for compatible Spring ecosystem libraries.

## 12. Technologies explicitly excluded

The following are not part of the current approved stack:

| Technology or capability | Decision |
|---|---|
| Ollama | Excluded |
| Local LLMs | Excluded |
| Cloud LLM APIs | Excluded |
| AI inference runtimes | Excluded |
| Cloud backend | Not required |
| PostgreSQL server | Not required |
| Microservices | Not required |
| Mandatory user accounts | Not required |
| Cloud synchronization | Not included in initial scope |

Recommendations will be generated using deterministic rules and local typing statistics.

## 13. Runtime and resource considerations

The application runs a desktop webview and a Java backend. Tauri may reduce packaging and runtime overhead compared with bundling a full Chromium runtime, but the Java process still has a memory cost.

Therefore:

- Keep Spring Boot dependencies minimal.
- Avoid unnecessary background threads.
- Keep database connection settings appropriate for a local desktop workload.
- Avoid excessive polling.
- Keep the typing loop in the frontend.
- Measure startup time, idle memory, active typing responsiveness, and analytics query performance.
- Set and verify resource targets on the minimum supported hardware before release.

Do not claim a specific memory footprint until it has been measured in a packaged build.

## 14. Approved stack summary

```text
Typing Trainer
|
+-- Desktop
|   +-- Tauri 2
|   +-- Rust
|
+-- Frontend
|   +-- React
|   +-- TypeScript
|   +-- Vite
|   +-- Tailwind CSS
|   +-- shadcn/ui
|   +-- Zustand
|   +-- Recharts
|
+-- Backend
|   +-- Spring Boot 3
|   +-- Java 21
|   +-- Spring MVC
|   +-- Spring Data JPA
|   +-- Jakarta Validation
|   +-- Springdoc OpenAPI
|
+-- Database
|   +-- SQLite
|   +-- Hibernate
|   +-- Flyway
|
+-- Testing
|   +-- Vitest
|   +-- React Testing Library
|   +-- Playwright
|   +-- JUnit 5
|   +-- Mockito
|   +-- Spring Boot Test
|
+-- Build
    +-- npm
    +-- Maven
    +-- Tauri bundler
```

## 15. Final technology decision

**Approved baseline:** Tauri 2 + React + TypeScript + Vite + Tailwind CSS + shadcn/ui + Zustand + Spring Boot 3 + Java 21 + SQLite + Spring Data JPA + Flyway.

**Product constraints:** Windows desktop, offline-first, local data ownership, frontend-owned real-time typing engine, Spring Boot modular monolith, and no Ollama or LLM integration.

Any change to this stack should be documented with its reason, trade-offs, migration impact, and testing requirements.
