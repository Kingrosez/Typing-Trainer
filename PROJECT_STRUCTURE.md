# Typing Trainer - Project Structure

**Status:** Proposed repository layout  
**Target platform:** Windows desktop  
**Architecture:** Tauri 2 + React + TypeScript + Spring Boot modular monolith  
**Last updated:** 12 November 2026

## 1. Purpose

This document defines the repository and source-code organization for Typing Trainer.

The structure separates desktop integration, frontend features, backend business modules, database migrations, automated tests, documentation, and build scripts.

The structure is intentionally modular without introducing microservices or unnecessary deployment complexity.

## 2. Repository overview

```text
typing-trainer/
|
+-- desktop/                         # Tauri + React desktop application
|   +-- src/                          # React frontend source
|   +-- src-tauri/                    # Tauri and Rust source
|   +-- package.json
|   +-- package-lock.json
|   +-- vite.config.ts
|   +-- tsconfig.json
|   +-- tailwind.config.ts
|   +-- components.json
|
+-- backend/                          # Spring Boot application
|   +-- src/
|   |   +-- main/
|   |   |   +-- java/com/typingtrainer/
|   |   |   +-- resources/
|   |   +-- test/
|   |       +-- java/com/typingtrainer/
|   |       +-- resources/
|   +-- pom.xml
|   +-- mvnw
|   +-- mvnw.cmd
|
+-- database/                         # Database documentation and optional tools
|   +-- README.md
|   +-- seed/
|
+-- docs/                             # Product and engineering documentation
|   +-- README.md
|   +-- ARCHITECTURE.md
|   +-- CODING_STANDARDS.md
|   +-- API_CONTRACT.md
|   +-- TECH_STACK.md
|   +-- PROJECT_STRUCTURE.md
|   +-- DATABASE.md
|   +-- DEVELOPMENT_ROADMAP.md
|
+-- scripts/                          # Cross-platform build and developer scripts
|   +-- windows/
|   +-- development/
|
+-- .gitignore
+-- README.md
+-- LICENSE
```

The root `README.md` is the project entry point. The detailed documents live in `docs/`. Keep one canonical copy of each document to avoid version drift.

## 3. Desktop frontend structure

```text
desktop/
  src/
    app/
      App.tsx
      main.tsx
      router/
        routes.tsx
      providers/
        AppProviders.tsx
      config/
        appConfig.ts

    assets/
      fonts/
      images/
      sounds/

    components/
      layout/
        AppShell.tsx
        Sidebar.tsx
        TopBar.tsx
        MainContent.tsx
      common/
        LoadingState.tsx
        EmptyState.tsx
        ErrorState.tsx
        ConfirmDialog.tsx
      ui/
        # shadcn/ui generated and customized components

    features/
      dashboard/
        components/
        hooks/
        services/
        types/
        DashboardPage.tsx

      typing-test/
        components/
        hooks/
        services/
        types/
        utils/
        TypingTestPage.tsx

      learning/
        components/
        hooks/
        services/
        types/
        LearningPage.tsx

      exercises/
        components/
        hooks/
        services/
        types/
        ExercisesPage.tsx

      games/
        components/
        hooks/
        types/
        GamesPage.tsx

      developer-mode/
        components/
        hooks/
        types/
        DeveloperModePage.tsx

      analytics/
        components/
        hooks/
        services/
        types/
        AnalyticsPage.tsx

      achievements/
        components/
        hooks/
        services/
        types/
        AchievementsPage.tsx

      recommendations/
        components/
        hooks/
        services/
        types/

      settings/
        components/
        hooks/
        services/
        types/
        SettingsPage.tsx

      profile/
        components/
        hooks/
        services/
        types/

    hooks/
      useDebounce.ts
      useDocumentTitle.ts

    services/
      api/
        apiClient.ts
        apiConfig.ts
        apiErrors.ts
        endpoints.ts

    stores/
      appStore.ts
      settingsStore.ts

    lib/
      formatters/
      validators/
      constants/

    styles/
      globals.css
      themes.css

    types/
      common.ts
      api.ts

  src-tauri/
    src/
      main.rs
      lib.rs
      commands/
        backend.rs
        app.rs
      process/
        backend_manager.rs
        readiness.rs
    capabilities/
      default.json
    icons/
    tauri.conf.json
    Cargo.toml
    Cargo.lock

  tests/
    e2e/
    fixtures/

  package.json
  package-lock.json
  vite.config.ts
  tsconfig.json
```

### Frontend organization rules

- Organize primary code by feature.
- Keep feature-specific components, hooks, types, and API functions inside their feature where practical.
- Put genuinely reusable components in `components/`.
- Keep API transport and shared request behavior in `services/api/`.
- Keep shared application state in `stores/` only when multiple features need it.
- Keep typing algorithms in pure utility functions or dedicated hooks, not in page components.
- Do not let one feature import another feature's private implementation details.
- Avoid creating empty directories until code needs them.

## 4. Typing engine module

The typing engine is part of the `typing-test` feature and should be isolated from screen presentation.

Recommended structure:

```text
features/typing-test/
  components/
    TypingPassage.tsx
    TypingInputCapture.tsx
    TypingProgress.tsx
    TypingStats.tsx
    TypingTimer.tsx
    TypingResults.tsx

  hooks/
    useTypingSession.ts
    useTypingTimer.ts
    useTypingInput.ts

  services/
    typingSessionService.ts

  types/
    typingSession.ts
    typingMetrics.ts
    typingMode.ts

  utils/
    calculateGrossWpm.ts
    calculateNetWpm.ts
    calculateAccuracy.ts
    compareCharacters.ts
    normalizeInput.ts
    sessionClock.ts
```

Rules:

- Keep calculations pure and independently testable.
- Keep target passage data immutable during a session.
- Use a monotonic clock for elapsed time.
- Do not make REST calls per keystroke.
- Prevent duplicate session completion and submission.
- Keep UI rendering separate from input comparison and metric calculation.

## 5. Tauri and Rust structure

The Tauri layer is responsible for desktop integration, not application business rules.

```text
src-tauri/
  src/
    main.rs
    lib.rs

    commands/
      backend.rs
      app.rs

    process/
      backend_manager.rs
      readiness.rs

    config/
      runtime_config.rs
```

Responsibilities:

| Area | Responsibility |
|---|---|
| `commands/` | Narrow commands callable by the frontend |
| `process/` | Spring Boot process startup and shutdown |
| `readiness.rs` | Bounded backend readiness checks |
| `config/` | Runtime paths and process configuration |

Rules:

- Do not expose arbitrary shell execution.
- Do not accept arbitrary executable paths from the frontend.
- Use an available local port.
- Bind Spring Boot to `127.0.0.1`.
- Pass endpoint information through a controlled mechanism.
- Keep the backend process owned by the desktop lifecycle.
- Handle startup failures and shutdown timeouts.
- Restrict Tauri capabilities and filesystem access.

## 6. Spring Boot backend structure

Use package-by-feature within one Spring Boot application.

```text
backend/src/main/java/com/typingtrainer/
  TypingTrainerApplication.java

  config/
    ApiConfig.java
    CorsConfig.java
    JacksonConfig.java
    PersistenceConfig.java

  common/
    exception/
      GlobalExceptionHandler.java
      ResourceNotFoundException.java
      ResourceConflictException.java
    response/
      ApiErrorResponse.java
      PageResponse.java
    validation/
    util/

  profile/
    controller/
      ProfileController.java
    service/
      ProfileService.java
    repository/
      ProfileRepository.java
    entity/
      ProfileEntity.java
    dto/
      ProfileResponse.java
      UpdateProfileRequest.java
    mapper/

  lessons/
    controller/
    service/
    repository/
    entity/
    dto/
    mapper/

  exercises/
    controller/
    service/
    repository/
    entity/
    dto/
    mapper/

  typing/
    controller/
    service/
    repository/
    entity/
    dto/
    mapper/

  analytics/
    controller/
    service/
    repository/
    dto/

  achievements/
    controller/
    service/
    repository/
    entity/
    dto/

  recommendations/
    controller/
    service/
    dto/

  settings/
    controller/
    service/
    repository/
    entity/
    dto/
```

Not every package needs every subdirectory. Add packages when there is actual code to organize.

### Backend module rules

- Controllers handle HTTP concerns and delegate.
- Services enforce application and business rules.
- Repositories handle persistence.
- Entities remain inside persistence boundaries.
- DTOs define API contracts.
- Mappers convert between entities and DTOs.
- Cross-feature operations should use application services, not direct repository access from another feature.
- Use transactions at service boundaries where related data must be atomic.

## 7. Backend resources

```text
backend/src/main/resources/
  application.yml
  application-dev.yml
  application-test.yml

  db/
    migration/
      V1__create_profiles.sql
      V2__create_lessons_and_exercises.sql
      V3__create_typing_sessions.sql
      V4__create_session_key_stats.sql
      V5__create_achievements.sql
      V6__create_user_settings.sql
```

Migration names above are illustrative. The actual migration sequence must be based on the approved `DATABASE.md` schema.

Rules:

- Never modify an applied migration.
- Use new Flyway migrations for schema changes.
- Do not place a production database file in the repository.
- Keep bundled lesson and exercise content separate from user-generated data.
- Do not put machine-specific paths in committed configuration.

## 8. Backend test structure

Mirror the production package structure:

```text
backend/src/test/
  java/com/typingtrainer/
    profile/
      controller/
      service/
      repository/

    lessons/
    exercises/
    typing/
    analytics/
    achievements/
    recommendations/
    settings/

    integration/
    support/

  resources/
    application-test.yml
    fixtures/
```

Test conventions:

- Name unit tests after the class under test, ending in `Test`.
- Name integration tests clearly, ending in `IntegrationTest`.
- Use SQLite-compatible tests for persistence and migration behavior.
- Use isolated test data.
- Test failure and boundary cases.
- Do not rely on an external network service for core tests.

## 9. Database directory

```text
database/
  README.md
  seed/
    lessons/
    exercises/
```

The SQLite database itself is created in the user's application data directory at runtime. It must not be committed to Git.

If initial content is bundled as JSON, CSV, or SQL, document the format and versioning policy. Prefer migrations for schema and a clear seed-loading mechanism for reference content.

## 10. Documentation directory

```text
docs/
  README.md
  ARCHITECTURE.md
  CODING_STANDARDS.md
  API_CONTRACT.md
  TECH_STACK.md
  PROJECT_STRUCTURE.md
  DATABASE.md
  DEVELOPMENT_ROADMAP.md
```

Each document should have one canonical location. The root `README.md` should link to these documents.

Update documentation when architecture, API behavior, database schema, or development workflows change.

## 11. Build and development scripts

```text
scripts/
  windows/
    dev.ps1
    build.ps1
    test.ps1
    package.ps1
    clean.ps1

  development/
    check-prerequisites.ps1
    verify-api.ps1
```

Scripts should:

- Fail clearly when a required command exits unsuccessfully.
- Check prerequisites and report missing tools.
- Avoid hardcoded user-specific directories.
- Avoid destructive operations unless explicitly requested and confirmed.
- Support repeatable local development and CI usage.

The exact script set should be added as the corresponding workflow is implemented.

## 12. Root-level files

| File | Purpose |
|---|---|
| `README.md` | Project overview and setup |
| `.gitignore` | Exclude build output, local data, IDE files, and secrets |
| `LICENSE` | Project license, once selected |
| `desktop/package.json` | Frontend dependencies and scripts |
| `backend/pom.xml` | Backend dependencies and build |
| `docs/` | Engineering documentation |

Do not commit:

- `node_modules/`
- `dist/`
- `target/`
- Rust `target/`
- Local SQLite database files
- Logs and crash dumps
- Environment files containing secrets
- Machine-specific IDE configuration unless intentionally shared

## 13. Import and dependency boundaries

### Frontend

```text
app -> features -> shared components and services
```

- Shared infrastructure must not depend on feature internals.
- Feature modules should not depend on private internals of other features.
- API transport must remain separate from UI components.
- Pure typing logic should not depend on React or the DOM.

### Backend

```text
controller -> service -> repository
```

- A controller must not call a repository directly.
- A repository must not depend on a controller.
- Entities must not be returned directly from REST endpoints.
- Cross-module dependencies should use public application services or explicit contracts.
- Avoid circular dependencies.

### Desktop

- Tauri owns process lifecycle and native integration.
- Spring Boot owns backend business logic.
- React owns presentation and real-time typing interaction.
- SQLite owns persistent local records.

## 14. Recommended implementation order

1. Create the repository and root documentation.
2. Scaffold the Tauri and React frontend.
3. Scaffold the Spring Boot backend.
4. Configure SQLite and Flyway.
5. Implement backend process startup and readiness.
6. Establish the local API client and error handling.
7. Implement the typing engine independently.
8. Persist completed sessions.
9. Add lessons and exercises.
10. Add analytics, achievements, and recommendations.
11. Add desktop packaging and installer verification.

Do not create all possible files and empty modules upfront. Add implementation files incrementally as each phase requires them.

## 15. Definition of done

The project structure is established when:

- Frontend, backend, and desktop integration have clear boundaries.
- Feature-oriented frontend organization is in place.
- Backend packages follow package-by-feature organization.
- Database migrations have a single canonical location.
- Tests mirror production module organization.
- Documentation has one canonical location.
- Build and generated artifacts are excluded from source control.
- No local database, secret, or machine-specific path is committed.
- The repository can be built and tested using documented commands.

---

**Structure baseline:** One Windows desktop repository, Tauri-managed Spring Boot process, React feature modules, Spring Boot package-by-feature modules, SQLite migrations, and colocated automated tests.
