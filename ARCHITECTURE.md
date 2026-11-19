# Typing Trainer - System Architecture

**Status:** Proposed baseline architecture  
**Platform:** Windows desktop  
**Architecture style:** Offline-first modular monolith  
**Last updated:** 12 November 2026

## 1. Purpose

Typing Trainer is a Windows desktop application for improving typing speed, accuracy, consistency, and touch-typing technique. It combines timed typing tests, structured lessons, practice exercises, typing games, developer-focused exercises, and progress analytics.

The application is designed to work locally without requiring an account, cloud service, internet connection, or API key.

### Product goals

- Provide responsive, distraction-free typing practice.
- Measure typing performance consistently.
- Help users identify and improve weak keys and typing patterns.
- Store progress and preferences locally.
- Support beginner through advanced practice.
- Package the application for straightforward Windows installation.

### Out of scope for the initial release

- Ollama, local LLMs, and AI model integration.
- Cloud accounts, cloud synchronization, and hosted services.
- Microservices and distributed infrastructure.
- Mandatory internet connectivity.
- Multiplayer and online leaderboards.

Recommendations in the initial release will use deterministic rules and locally stored performance statistics, not AI.

## 2. Technology stack

| Layer | Technology | Responsibility |
|---|---|---|
| Desktop shell | Tauri 2 | Windows window, native packaging, lifecycle |
| Frontend | React + TypeScript | Screens and user interactions |
| Build tooling | Vite | Frontend development and bundling |
| UI styling | Tailwind CSS | Layout, styling, responsive states |
| UI components | shadcn/ui | Accessible reusable components |
| Frontend state | Zustand | Shared client-side state |
| Backend | Spring Boot 3, Java 21 | Business logic and application services |
| API | Spring MVC REST | Local frontend-to-backend communication |
| Persistence | SQLite | Local application data |
| Data access | Spring Data JPA | Persistence abstraction |
| Migrations | Flyway | Versioned database schema |
| Charts | Recharts | Progress and performance visualizations |
| Backend build | Maven | Dependency management and packaging |

Use compatible, supported patch versions when implementation begins. Pin dependency versions and document upgrades.

## 3. High-level architecture

```text
+-----------------------------------------------------------+
|                  Windows Desktop Application              |
|                                                           |
|  +-----------------------------------------------------+  |
|  |              Tauri 2 Desktop Shell                  |  |
|  |                                                     |  |
|  |  +-----------------------------------------------+  |  |
|  |  |             React + TypeScript                |  |  |
|  |  |                                               |  |  |
|  |  | Dashboard | Test | Lessons | Games | Reports  |  |  |
|  |  |                                               |  |  |
|  |  | Typing Session Engine | Zustand | Recharts    |  |  |
|  |  +-------------------------+---------------------+  |  |
|  |                            |                        |  |
|  |                     Local REST API                  |  |
|  +----------------------------|------------------------+  |
|                               |                           |
|  +----------------------------v------------------------+  |
|  |               Spring Boot Application               |  |
|  |                                                     |  |
|  | Profile | Lessons | Tests | Analytics | Settings   |  |
|  | Achievements | Recommendations | Statistics         |  |
|  |                                                     |  |
|  | Controllers -> Services -> Repositories             |  |
|  +----------------------------+------------------------+  |
|                               |                           |
|  +----------------------------v------------------------+  |
|  |                  SQLite Database                    |  |
|  |        Local user data, sessions, and settings      |  |
|  +-----------------------------------------------------+  |
+-----------------------------------------------------------+
```

### Main design rule

The typing interaction loop runs in the frontend. Keystrokes are processed locally in React and are not sent to Spring Boot one by one. The backend is used for persistence, lesson and test data, summaries, analytics queries, and application settings.

This separation keeps typing feedback responsive and avoids unnecessary API traffic.

## 4. Component responsibilities

### 4.1 Tauri desktop shell

Responsibilities:

- Create and manage the main Windows application window.
- Start and stop the packaged Spring Boot backend.
- Coordinate application startup and shutdown.
- Provide the frontend with the local backend endpoint.
- Keep backend process lifecycle under application control.
- Package the desktop application and its runtime dependencies.

The backend must bind only to the loopback interface (`127.0.0.1`) and use an available local port. The desktop shell should securely communicate the selected endpoint to the frontend. Do not expose the backend on the local network.

The Tauri layer should use a narrowly scoped command interface for process lifecycle operations. Do not expose arbitrary shell execution to the frontend.

### 4.2 React frontend

Responsibilities:

- Render the dashboard, navigation, settings, lessons, tests, games, and reports.
- Capture keyboard input during an active typing session.
- Display character-level correctness and current typing position.
- Run the live timer and update WPM and accuracy.
- Manage transient session state.
- Call the local REST API for data loading and persistence.
- Present accessible feedback for errors, completion, and progress.

Suggested frontend organization:

```text
desktop/
  src/
    app/
      router/
      providers/
    components/
      layout/
      common/
      charts/
    features/
      dashboard/
      typing-test/
      learning/
      games/
      developer-mode/
      analytics/
      achievements/
      settings/
    hooks/
    services/
      api/
    stores/
    types/
    utils/
    styles/
  src-tauri/
```

Feature modules should own their screens, components, hooks, and feature-specific types. Shared components should remain generic and reusable.

### 4.3 Spring Boot backend

Responsibilities:

- Expose versioned local REST endpoints.
- Validate requests and enforce business rules.
- Persist completed sessions and user preferences.
- Provide lesson and exercise content.
- Calculate authoritative session summaries where appropriate.
- Aggregate historical performance.
- Evaluate deterministic achievements and recommendations.
- Manage database migrations and application configuration.

Suggested backend organization:

```text
backend/
  src/main/java/com/typingtrainer/
    TypingTrainerApplication.java
    config/
    common/
      exception/
      response/
      validation/
    profile/
      controller/
      service/
      repository/
      entity/
      dto/
    typing/
      controller/
      service/
      repository/
      entity/
      dto/
    lessons/
      controller/
      service/
      repository/
      entity/
      dto/
    exercises/
      controller/
      service/
      repository/
      entity/
      dto/
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
  src/main/resources/
    application.yml
    db/migration/
  pom.xml
```

Use package-by-feature. Keep controllers thin, put business rules in services, and isolate persistence in repositories. Avoid creating interfaces and abstractions without a concrete need.

## 5. Application modules

| Module | Main responsibilities |
|---|---|
| Dashboard | Daily summary, recent activity, goals, quick actions |
| Typing Test | Timed tests, custom duration, results |
| Typing Engine | Input processing, timing, WPM, accuracy, error tracking |
| Learning | Lessons, finger placement guidance, progression |
| Exercises | Character, word, sentence, and paragraph drills |
| Typing Games | Time attack, word challenge, and other practice games |
| Developer Mode | Programming syntax and code-oriented typing passages |
| Analytics | Trends, session history, weak-key statistics |
| Achievements | Milestones, streaks, personal records |
| Recommendations | Rule-based practice suggestions |
| Settings | Theme, sound, keyboard layout, preferences |
| Profile | Local profile and learning preferences |

Modules should communicate through application services and well-defined DTOs. Avoid direct cross-module repository access.

## 6. Typing session engine

The typing engine is a frontend feature because it must react immediately to keyboard input.

### Session lifecycle

1. Load the selected passage or exercise.
2. Initialize the session state.
3. Wait for the first valid character to start the timer.
4. Process each keyboard input against the expected character.
5. Update the current position, correctness, errors, and live statistics.
6. Stop when the duration expires or the passage is completed, according to the selected mode.
7. Build a session summary.
8. Submit the completed session to the backend.
9. Display the result and update the dashboard.

### Input handling requirements

- Ignore non-printing keys unless the active exercise explicitly requires them.
- Handle Backspace according to the selected test mode.
- Support paste restrictions in standard typing tests.
- Handle modifier keys and keyboard layouts consistently.
- Avoid losing focus during an active test.
- Prevent duplicate completion submissions.
- Define how spaces, punctuation, capitalization, and corrected errors are counted.
- Keep the target text immutable during a session.

### Metric definitions

Use a documented and consistent metric policy across the application.

**Gross WPM**

```text
Gross WPM = (Total characters typed / 5) / elapsed minutes
```

**Net WPM**

A recommended initial definition is:

```text
Net WPM = Gross WPM - (Uncorrected errors / elapsed minutes)
```

**Character accuracy**

```text
Accuracy (%) =
  (Correct character attempts / Total character attempts) * 100
```

The product must define whether corrected mistakes remain part of the error count. Store sufficient raw session statistics to support future changes to display formulas without losing historical data.

Use a monotonic high-resolution clock for elapsed session timing. Do not rely only on interval callback counts, because UI scheduling can be delayed.

## 7. REST API design

Use a versioned base path:

```text
/api/v1
```

Suggested initial endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/profile` | Retrieve local profile |
| PUT | `/profile` | Update local profile |
| GET | `/lessons` | List lessons |
| GET | `/lessons/{id}` | Retrieve lesson details |
| GET | `/exercises` | List practice exercises |
| GET | `/tests/config` | Retrieve supported test options |
| POST | `/sessions` | Save a completed session |
| GET | `/sessions` | Retrieve session history |
| GET | `/sessions/{id}` | Retrieve a session |
| GET | `/analytics/overview` | Retrieve summary metrics |
| GET | `/analytics/trends` | Retrieve historical trends |
| GET | `/analytics/weak-keys` | Retrieve weak-key statistics |
| GET | `/achievements` | Retrieve achievements |
| GET | `/recommendations` | Retrieve rule-based practice suggestions |
| GET | `/settings` | Retrieve preferences |
| PUT | `/settings` | Update preferences |

API conventions:

- Use request and response DTOs, not JPA entities.
- Validate request payloads.
- Return consistent error response structures.
- Use appropriate HTTP status codes.
- Add pagination to potentially large history endpoints.
- Make session submission idempotent, for example with a client-generated session UUID.
- Document the API using OpenAPI.
- Keep API calls local and do not require an external network connection.

## 8. SQLite database design

SQLite is the initial database because the application is single-user, local-first, and desktop-oriented.

Suggested tables:

| Table | Purpose |
|---|---|
| `profiles` | Local profile and learning preferences |
| `lessons` | Lesson metadata and content references |
| `exercises` | Reusable practice passages |
| `typing_sessions` | Completed session summaries |
| `session_key_stats` | Per-key attempts and error counts |
| `achievements` | Achievement definitions |
| `user_achievements` | Earned achievements |
| `user_settings` | Application preferences |
| `schema_history` | Managed by Flyway |

### Database guidelines

- Use Flyway for every schema change.
- Use foreign keys and appropriate indexes.
- Store timestamps in a consistent UTC representation.
- Use transactions for related writes.
- Store a client-generated session identifier to prevent duplicate records.
- Keep the database in the application's per-user data directory, not in the installation directory.
- Define a backup and restore approach before release.
- Avoid storing unnecessary personal information.

The initial application does not need PostgreSQL or a remote database server.

## 9. Rule-based recommendations

The Recommendations module uses deterministic logic and local statistics.

Examples:

- Recommend home-row practice when home-row accuracy is below a configured threshold.
- Recommend punctuation drills when punctuation errors are consistently high.
- Recommend slower practice when accuracy falls below the user's target.
- Recommend longer passages when short tests are consistently completed accurately.
- Highlight keys with elevated error rates over a meaningful number of attempts.

Recommendations should explain the reason behind each suggestion. Use minimum sample sizes to avoid drawing conclusions from a few keystrokes.

## 10. Offline-first operation

The application must work without internet access after installation.

Offline requirements:

- All core lessons and practice passages are bundled with the application.
- Session processing runs locally.
- Results are stored in SQLite.
- Analytics are calculated from local records.
- Settings and achievements remain available offline.
- No remote service is required for startup or normal operation.

If future releases add optional online functionality, it must not break the offline core.

## 11. Security and privacy

Although the backend is local, it must still follow security-conscious defaults.

- Bind Spring Boot to `127.0.0.1` only.
- Use an ephemeral port where practical.
- Restrict CORS to the exact desktop frontend origin.
- Protect state-changing local API operations against cross-origin abuse.
- Do not enable unrestricted Spring Boot Actuator endpoints in production.
- Do not expose arbitrary filesystem or shell operations.
- Validate and constrain all API inputs.
- Keep database and configuration files in the user's application data directory.
- Avoid logging typed passage content or other unnecessary user activity.
- Do not include secrets or API keys in the application package.
- Use a restrictive Tauri capability configuration and a suitable Content Security Policy.

The desktop shell should own backend startup and shutdown. The backend should not be independently exposed as a network service.

## 12. Performance and reliability

- Keep per-keystroke processing in the frontend.
- Avoid unnecessary React re-renders during typing.
- Use efficient character comparison and rendering for long passages.
- Persist completed sessions rather than every keystroke.
- Use database indexes for history and analytics queries.
- Load large histories in pages.
- Handle backend startup failures with a clear retry or recovery message.
- Handle database errors without silently losing a completed session.
- Ensure graceful shutdown and safe database access.
- Test behavior when the application is closed during an active session.

Set measurable performance targets during implementation and verify them on the minimum supported Windows hardware.

## 13. Testing strategy

### Frontend

- Unit tests for WPM, accuracy, error, and timing calculations.
- Tests for keyboard input edge cases.
- Component tests for typing feedback and session lifecycle.
- Integration tests for API interactions.
- End-to-end tests for complete typing sessions.

### Backend

- Unit tests for services and business rules.
- Repository tests against SQLite.
- Controller tests for validation and HTTP behavior.
- Migration tests from a clean database and a prior schema version.
- Integration tests for session persistence and analytics.

### Desktop integration

- Test backend startup and shutdown.
- Test local port selection and frontend connection.
- Test packaging and installation on supported Windows versions.
- Test application data directory permissions.
- Test offline startup and operation.
- Test upgrade behavior while preserving user data.

## 14. Packaging and deployment

The target is a Windows desktop installer.

The packaged application should include:

- Tauri desktop executable and frontend assets.
- Spring Boot backend application.
- A compatible Java 21 runtime, so the user does not need a separate Java installation.
- Required native dependencies.
- Initial lesson and exercise content.

Recommended packaging flow:

1. Build and test the React frontend.
2. Build and test the Spring Boot backend.
3. Prepare the backend runtime and application package.
4. Configure Tauri to launch the backend as a managed child process.
5. Build the Windows installer.
6. Test installation, first launch, upgrade, and uninstall.
7. Verify that uninstall and upgrade behavior do not unintentionally delete user data.

The installer should be tested for clean machines without Java or development tools installed.

## 15. Development phases

### Phase 1 - Foundation

- Create the repository structure.
- Set up Tauri, React, TypeScript, and Vite.
- Set up Spring Boot and Java 21.
- Configure SQLite and Flyway.
- Establish local backend lifecycle and API connectivity.
- Create the initial application shell and navigation.

### Phase 2 - Typing engine

- Implement session state and keyboard handling.
- Implement duration and passage-based tests.
- Implement WPM, accuracy, and error calculations.
- Build the results screen.
- Persist completed sessions.

### Phase 3 - Learning experience

- Add lessons and progression.
- Add character, word, and sentence exercises.
- Add finger placement guidance.
- Add typing games.
- Add developer typing mode.

### Phase 4 - Progress and personalization

- Add dashboard metrics and charts.
- Add session history and weak-key analysis.
- Add achievements and streaks.
- Add deterministic recommendations.
- Add settings and customization.

### Phase 5 - Hardening and release

- Complete automated tests.
- Improve performance and error handling.
- Add backup and restore.
- Package the Java runtime and backend.
- Build and test the Windows installer.
- Validate offline behavior and upgrade safety.

## 16. Architecture decisions

| Decision | Selected approach | Reason |
|---|---|---|
| Desktop framework | Tauri 2 | Native Windows desktop shell |
| Frontend | React + TypeScript | Component-based UI and type safety |
| Backend | Spring Boot 3 + Java 21 | Structured Java business layer |
| Architecture | Modular monolith | Simpler development and deployment |
| Database | SQLite | Local persistence without a database server |
| Data access | Spring Data JPA | Standardized persistence |
| Migrations | Flyway | Version-controlled schema |
| Communication | Local REST API | Clear frontend/backend boundary |
| Typing input loop | Frontend | Low-latency keyboard response |
| Recommendations | Deterministic rules | Explainable, offline functionality |
| AI / LLM | Not included | Explicitly excluded from project scope |
| Deployment | Windows installer | Simple end-user installation |

## 17. Open implementation decisions

These details should be finalized during implementation rather than assumed:

- Minimum supported Windows version and CPU architecture.
- Exact WPM and accuracy policy, including treatment of corrected mistakes.
- Whether Backspace is enabled in each test mode.
- Whether a local profile is needed for the first release or a single default profile is sufficient.
- Whether users can import their own practice passages.
- Backup, restore, and data export formats.
- Installer signing and update strategy.
- Exact Java runtime packaging and Tauri process supervision approach.

## 18. Definition of done for the architecture foundation

The foundation is ready when:

- The Windows desktop shell launches successfully.
- The desktop shell starts the Spring Boot backend and detects startup failure.
- The frontend can communicate with the backend through a loopback-only API.
- SQLite is initialized and Flyway migrations run successfully.
- The application works without internet access.
- A completed typing session can be saved and retrieved.
- The backend shuts down cleanly when the desktop application exits.
- A Windows installer can be built and tested on a machine without Java installed.

---

**Architecture baseline:** Tauri 2 + React + TypeScript + Spring Boot 3 + Java 21 + SQLite.  
**Product principle:** Offline-first, responsive typing practice, local data ownership, and modular implementation.
