## Description

<!-- Provide a concise summary of the purpose, scope, and changes included in this PR. -->

## Related Issues / Roadmap Stages

- Stage: <!-- e.g., Phase 3 Stage 2.5 -->
- Fixes: <!-- e.g., #123 -->

## Affected Components

- [ ] Frontend (`desktop/src/`)
- [ ] Backend Service & API (`backend/src/`)
- [ ] Native Desktop Layer (`desktop/src-tauri/`)
- [ ] Database & Migrations (`backend/src/main/resources/db/migration/`)
- [ ] Documentation / Specifications (`docs/`, `design/`)
- [ ] CI/CD & Build Infrastructure (`.github/`, scripts)

## Type of Change

- [ ] `feat`: New feature or user-visible functionality
- [ ] `fix`: Bug fix
- [ ] `refactor`: Code change that neither fixes a bug nor adds a feature
- [ ] `test`: Adding or correcting tests
- [ ] `docs`: Documentation updates only
- [ ] `chore`: Tooling, configuration, or dependency updates
- [ ] `ci`: CI/CD workflow changes

## Verification & Testing Performed

<!-- Summarize the tests executed and their observed results. -->

- [ ] Backend tests passed (`./mvnw test` in `backend/`)
- [ ] Frontend tests passed (`npm test` in `desktop/`)
- [ ] TypeScript strict validation passed (`npm run typecheck` in `desktop/`)
- [ ] ESLint clean (`npm run lint` in `desktop/`)
- [ ] Cargo checks and tests passed (`cargo check && cargo test` in `desktop/src-tauri/`)
- [ ] Native Windows desktop manual verification performed (if applicable)

## Architectural & Security Compliance

- [ ] **Offline-First:** No remote network dependencies, telemetry, or mandatory cloud logins introduced.
- [ ] **AI-Free Baseline:** Strictly zero Ollama, local LLM, or cloud AI runtime dependencies.
- [ ] **Zero Secrets:** No credentials, API tokens, sensitive paths, or personal data committed.
- [ ] **Data Safety:** No local databases (`*.db`, `*.sqlite`) or generated build artifacts (`dist/`, `target/`) included.
- [ ] **Bounded Monolith:** Respects established layer boundaries (React frontend $\rightarrow$ REST loopback $\rightarrow$ Spring Boot $\rightarrow$ SQLite).
- [ ] **Conventional Commits:** Branch and commit history adhere to `CONTRIBUTING.md`.
