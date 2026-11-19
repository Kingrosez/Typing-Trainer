# Security Policy and Design

## 1. Purpose

This document defines the security requirements for Typing Trainer, a single-user, offline-first Windows desktop application built with Tauri 2, React, TypeScript, Rust, Spring Boot 3, Java 21, and SQLite.

The application is designed to keep typing content, session history, settings, and progress on the user's device. Security controls must protect local data, prevent unintended access to the embedded backend, reduce the impact of malformed input, and keep the desktop application within its intended privilege boundary.

This document is the security baseline for implementation. It does not claim that localhost communication, offline operation, or desktop packaging makes an application automatically secure.

## 2. Security objectives

The application must:

- Keep user data in the local application data directory.
- Avoid transmitting typing content or analytics to external services.
- Restrict the Spring Boot API to the local machine.
- Prevent untrusted websites and unrelated local processes from freely invoking privileged application operations.
- Validate and constrain all data crossing frontend, Tauri, backend, and database boundaries.
- Avoid storing credentials or secrets because the initial product does not require user authentication.
- Package and update application components through controlled, verifiable release processes.
- Fail safely when the backend is unavailable, a database operation fails, or input is invalid.

## 3. Scope and assumptions

### In scope

- Tauri desktop shell and Rust commands.
- React frontend and browser webview.
- Spring Boot local REST API.
- SQLite database and Flyway migrations.
- Application configuration, logs, backups, exports, and packaged runtime.
- Build, dependency, signing, and release workflows.

### Initial assumptions

- Windows is the first supported desktop platform.
- The initial product is single-user on a local device.
- The application works offline after installation.
- No cloud account, remote backend, telemetry service, or LLM integration is required.
- The Spring Boot process is launched and supervised by the Tauri application.
- The installer bundles a compatible Java 21 runtime.
- The database is stored outside the installation directory, in the user's application data directory.

If multi-profile support, cloud synchronization, account login, plugins, or remote integrations are introduced, this policy must be reviewed and expanded before those features are implemented.

## 4. Threat model

| Threat | Example | Required mitigation |
|---|---|---|
| Untrusted web content | A navigated or injected page attempts to call local APIs | Restrict navigation, use a strict Content Security Policy, validate origins and requests |
| Local API abuse | Another local process sends requests to the Spring Boot port | Bind to loopback, use an unpredictable per-launch port where practical, require a per-launch request token |
| Cross-site request forgery | A website causes the webview or browser to submit requests to localhost | Origin checks, request-token validation, restrictive CORS, avoid cookie-based authentication |
| Frontend injection | Malicious lesson text is rendered as executable HTML | Render text as text, avoid unsafe HTML APIs, validate imported content |
| Path traversal | Export/import filename attempts to access arbitrary files | Use safe file dialogs and canonicalized paths, constrain operations to approved locations |
| Database manipulation | Malformed or hostile data reaches SQL queries | Parameterized queries, validation, constraints, migration controls |
| Sensitive data exposure | Logs or exports contain more user data than expected | Minimize logged content, explicit export, protect local files |
| Dependency compromise | Vulnerable or malicious package is included | Dependency review, lockfiles, vulnerability scanning, controlled upgrades |
| Process lifecycle abuse | Backend remains running after the desktop app closes | Supervise child process, terminate on shutdown, avoid detached processes |
| Unsafe updates | Tampered installer or update is installed | Signed release artifacts and verified update metadata |

### Out of scope for the initial release

- Protection against an attacker with administrator privileges or full control of the user's Windows account.
- Protection against malware already executing with the user's permissions.
- Enterprise endpoint-management policy enforcement.
- Remote multi-user access.
- Cloud identity and authorization.

These exclusions do not remove the requirement to use reasonable local security controls.

## 5. Security architecture

### 5.1 Trust boundaries

Treat each of the following as a separate trust boundary:

1. **Webview frontend:** User interface and typing interaction. Do not assume frontend validation is sufficient.
2. **Tauri/Rust layer:** Privileged desktop boundary. Expose only narrowly scoped commands.
3. **Spring Boot backend:** Local business logic and persistence API. Validate every request independently.
4. **SQLite database:** Persistent local data. Enforce constraints and use parameterized access.
5. **Operating system:** Owns process permissions, application data directories, file dialogs, and installer execution.

Data crossing any boundary must be validated and constrained by the receiving component.

### 5.2 Process model

- Tauri must start Spring Boot as a managed child process.
- The backend must not run as a Windows service or listen on a network interface.
- The backend must bind explicitly to `127.0.0.1`, not `0.0.0.0`, a LAN address, or an unspecified interface.
- Prefer selecting an available ephemeral local port at startup rather than hardcoding a predictable port.
- The chosen port and request credential must be delivered to the frontend through a controlled Tauri mechanism.
- The backend must stop when the desktop application exits, including normal shutdown and handled failure paths.
- Do not launch the backend with elevated administrator privileges.
- Do not expose a general-purpose shell, process execution, or filesystem command to the frontend.

### 5.3 Local API request protection

Loopback binding limits network exposure, but it does not authenticate the caller. A local process may still attempt to call the API.

Implement a per-launch request token:

- Generate a cryptographically secure random token when the desktop application starts.
- Supply it to the backend through a protected process environment or equivalent private startup channel.
- Make it available to the trusted frontend through a narrowly scoped Tauri command.
- Require it on every application API request using a dedicated header, for example `X-App-Request-Token`.
- Compare tokens in constant time where supported.
- Never place the token in URLs, query strings, logs, analytics, or error messages.
- Do not persist the token in SQLite or configuration files.
- Rotate it on every application launch.
- Reject requests without a valid token.

The token is a defense-in-depth measure, not protection against malware that can inspect the user's process memory or control the application account.

### 5.4 CORS and Origin

- Configure CORS with explicit allowed origins for the packaged Tauri frontend and the development origin required during local development.
- Do not use wildcard origins.
- Do not enable credentialed cross-origin requests unless a documented requirement exists.
- Validate the `Origin` header when present and reject unexpected browser origins.
- Do not treat CORS as authentication. Keep request-token validation independent.
- Keep development CORS settings separate from production settings.
- Do not enable permissive CORS globally as a troubleshooting shortcut.

## 6. Tauri and frontend security

### 6.1 Tauri capabilities

- Apply least privilege to Tauri capabilities.
- Grant only the filesystem, dialog, shell, and other permissions required by implemented features.
- Do not grant broad filesystem access when a scoped file or directory permission is sufficient.
- Do not expose arbitrary command execution to frontend code.
- Keep Rust commands small, typed, and purpose-specific.
- Validate command arguments in Rust even when the frontend already validates them.
- Review capability and permission changes as security-sensitive changes.

### 6.2 Navigation and external links

- Keep the application webview on the trusted application origin.
- Block untrusted top-level navigation.
- Open external links through the operating system browser only after validating the URL scheme and destination.
- Allow only expected schemes such as `https` for external web links.
- Reject `javascript:`, `data:`, `file:`, and other unexpected schemes for external navigation.
- Do not load remote scripts, remote stylesheets, or arbitrary remote pages into the privileged application webview.

### 6.3 Content Security Policy

Configure a restrictive Content Security Policy appropriate to the Tauri production build.

Baseline expectations:

- Avoid `unsafe-eval`.
- Avoid `unsafe-inline` where practical; use nonces or hashes if inline scripts are unavoidable.
- Restrict `default-src`, `script-src`, `style-src`, `img-src`, `font-src`, and `connect-src` to the minimum required sources.
- Permit API connections only to the configured local backend origin.
- Do not allow arbitrary remote connections.
- Review CSP changes whenever frontend dependencies or asset-loading behavior changes.

The exact policy must be tested against the packaged Tauri build. Development-server allowances must not leak into production.

### 6.4 Frontend coding rules

- Use React's normal text rendering for user-provided and imported content.
- Do not use `dangerouslySetInnerHTML` for lesson text, custom passages, imported files, or API responses.
- If rich text is introduced, use a maintained sanitizer with a narrow allowlist.
- Validate data on both client and server.
- Avoid putting secrets, request tokens, or sensitive local paths in browser-visible logs.
- Do not store the per-launch request token in localStorage, sessionStorage, IndexedDB, or persistent browser storage.
- Keep dependencies current and remove unused packages.

## 7. Spring Boot backend security

### 7.1 Network configuration

Production configuration must explicitly bind the server to loopback:

```yaml
server:
  address: 127.0.0.1
```

The port should be selected by the desktop process at startup or through a controlled port-allocation mechanism. Avoid exposing a fixed port as a network service.

### 7.2 Request validation

- Use Jakarta Bean Validation on request DTOs.
- Apply length, range, format, and collection-size limits.
- Reject unknown or malformed values where appropriate.
- Do not bind HTTP request bodies directly to persistence entities.
- Validate imported passages, lesson definitions, settings, and session submissions.
- Apply reasonable limits to text length, number of keystrokes, session duration, and batch sizes.
- Return structured validation errors without stack traces or internal implementation details.

### 7.3 API design

- Keep the API local and versioned under `/api/v1`.
- Use explicit DTOs for requests and responses.
- Use idempotency controls for session submission to prevent duplicate records after retries.
- Avoid endpoints that expose arbitrary file access, SQL execution, process execution, or unrestricted configuration changes.
- Keep health endpoints minimal and do not disclose secrets, filesystem paths, environment variables, or detailed runtime configuration.
- Apply request size limits and sensible timeouts.

### 7.4 Error handling

- Return a consistent error response.
- Do not expose stack traces, SQL statements, token values, local absolute paths, or environment variables to the frontend.
- Log diagnostic details locally only when necessary and without sensitive content.
- Handle database and backend startup failures without corrupting user data.

### 7.5 Actuator and diagnostics

- Do not expose Spring Boot Actuator endpoints in production unless a specific endpoint is justified.
- If enabled, expose only the minimum required endpoint and keep it loopback-only and protected.
- Never expose environment, heap dump, shutdown, or configuration mutation endpoints to the frontend.

## 8. SQLite and data protection

### 8.1 Database location and access

- Store the database in the user's application data directory, not in the installation directory or repository.
- Resolve the directory through the operating system or Tauri application path APIs.
- Do not construct database paths from untrusted user input.
- Restrict file permissions to the current user where supported by Windows.
- Keep temporary database files and backups in controlled application data locations.
- Enable SQLite foreign-key enforcement for every connection.

### 8.2 SQL safety and integrity

- Use parameterized queries through Spring Data JPA or prepared statements.
- Never concatenate user-controlled values into SQL.
- Use database constraints for required fields, uniqueness, and valid relationships.
- Use Flyway for versioned schema changes.
- Do not modify the production schema manually.
- Run migrations transactionally where supported and design migrations to avoid partial data loss.
- Test migrations against a copy of a representative database before release.

### 8.3 SQLite operational settings

- Evaluate Write-Ahead Logging (WAL) for local read/write performance.
- If WAL is enabled, account for the `-wal` and `-shm` files in backup, restore, and shutdown procedures.
- Configure a bounded busy timeout to handle short-lived write contention.
- Keep write transactions short.
- Avoid concurrent writes from multiple application processes. Enforce a single running application instance unless multi-instance support is explicitly designed.
- Do not place the live database on a network share or synchronized folder as a supported configuration.

### 8.4 Sensitive data minimization

The initial product should store only data needed for typing practice and progress:

- Typing session metrics and timestamps.
- Optional passage or exercise identifiers.
- Per-key aggregate statistics.
- Lesson and exercise progress.
- User preferences and achievements.

Avoid collecting:

- Windows account passwords or credentials.
- Keystrokes outside the active Typing Trainer typing surface.
- Clipboard contents.
- General application activity or other application input.
- Personal information that is not required for the product.

Typing content entered during a session should be processed only for the active exercise and the metrics required by the product. Do not silently capture arbitrary system-wide keyboard input.

### 8.5 Encryption

- Do not invent or implement custom cryptography.
- The initial data model should avoid storing secrets.
- Document clearly that local SQLite data is not encrypted by default unless database encryption is deliberately selected and implemented.
- Consider Windows-provided device encryption and account-level file protections as additional operating-system safeguards, not as a substitute for application-level controls when stronger protection is required.
- If encryption at rest becomes a requirement, evaluate a maintained SQLite encryption solution and a secure key-management design before implementation.

## 9. File import, export, and backup

- Use native file dialogs for user-selected import and export operations.
- Restrict supported file types and enforce file-size limits.
- Treat imported files as untrusted input.
- Validate file structure, encoding, content length, and values before processing.
- Do not execute imported content.
- Prevent path traversal and arbitrary overwrite.
- Resolve and validate canonical paths before file operations.
- Require explicit user action before exporting data.
- Make the export format documented and versioned.
- Avoid including internal secrets, request tokens, machine identifiers, or unnecessary local paths in exports.
- Validate backups before restoring them.
- Never overwrite the active database during restore without a recoverable backup and a clear confirmation flow.
- Prefer writing a restored database to a temporary location, validating it, and then replacing the active database safely.

## 10. Logging and privacy

- Keep logs local.
- Do not log raw keystroke streams or full typed passages by default.
- Do not log request tokens, secrets, credentials, or full environment variables.
- Avoid logging personal file paths unless essential for troubleshooting.
- Use structured logs with appropriate severity levels.
- Apply log rotation and a reasonable retention limit.
- Provide a way to locate diagnostic logs for user support, with a warning that logs may contain technical metadata.
- Do not add telemetry or analytics transmission without an explicit product decision and clear user disclosure.

## 11. Dependency and supply-chain security

- Commit lockfiles for npm dependencies.
- Use the Maven wrapper and pin the Maven wrapper distribution.
- Pin or constrain Rust dependencies through `Cargo.lock` for application builds.
- Prefer maintained dependencies with active security support.
- Review new dependencies for maintenance status, license, permissions, transitive dependencies, and known vulnerabilities.
- Run dependency and vulnerability checks in CI.
- Update vulnerable dependencies promptly, with regression testing.
- Avoid downloading executable code or runtime components from arbitrary URLs during application startup.
- Bundle the approved Java runtime and required native components in the installer.
- Keep build scripts auditable and avoid executing untrusted repository content.

## 12. Build, signing, and release security

- Build release artifacts from a controlled CI environment or a documented trusted build machine.
- Protect release credentials and signing keys.
- Never commit signing keys, certificates with private keys, tokens, or secrets to source control.
- Sign Windows installers and executable artifacts where the release process supports it.
- Publish checksums for release artifacts.
- Keep release versions traceable to source commits.
- Test the installed application, not only the development build.
- Verify that production builds do not contain development servers, permissive CORS settings, debug endpoints, or development credentials.
- If an auto-update mechanism is introduced, verify signed update metadata and packages before installation.
- Provide a documented rollback or recovery approach for failed releases and database migrations.

## 13. Secrets management

The initial application should not require API keys, cloud credentials, or user passwords.

If future functionality introduces secrets:

- Store secrets using an operating-system-backed secure storage facility where appropriate.
- Do not store secrets in source code, `.env` files included in releases, frontend bundles, SQLite settings, or logs.
- Keep development secrets outside version control.
- Rotate any secret suspected of exposure.
- Document why each secret is needed and which component can access it.

## 14. Security testing requirements

### Frontend and Tauri

- Verify that untrusted navigation is blocked.
- Verify that external links are opened only through approved schemes.
- Verify that CSP blocks unexpected script execution and remote connections.
- Verify that Tauri capabilities grant only required permissions.
- Test malformed arguments passed to Rust commands.
- Confirm that no general shell or arbitrary filesystem command is exposed.

### Backend

- Test that the server binds only to `127.0.0.1`.
- Test missing, invalid, and expired per-launch request tokens.
- Test unexpected origins and CORS behavior.
- Test validation limits and malformed JSON.
- Test oversized requests and invalid session submissions.
- Test idempotent session submission.
- Confirm production errors do not disclose stack traces or secrets.
- Confirm unnecessary Actuator endpoints are disabled.

### Database and files

- Test foreign-key enforcement and database constraints.
- Test SQL injection payloads against all user-controlled fields.
- Test migration from each supported prior schema version.
- Test backup and restore, including WAL handling if enabled.
- Test invalid, oversized, malformed, and path-traversal import/export inputs.
- Confirm database files are stored outside the installation directory.

### Release

- Inspect the packaged application for development settings and secrets.
- Verify installer signature and release checksums where applicable.
- Test startup and shutdown of the managed Spring Boot process.
- Test recovery after forced application termination.
- Test that a failed migration does not silently destroy the previous database.

## 15. Security incident handling

If a security issue is discovered:

1. Record the affected version, component, reproduction steps, and potential impact.
2. Avoid publishing exploit details before a fix is available.
3. Determine whether user data, application integrity, or system security is affected.
4. Prioritize issues involving arbitrary code execution, local API exposure, data loss, or unauthorized file access.
5. Prepare and test a fix.
6. Release a patched version with clear user-facing notes.
7. Review whether the threat model, tests, or development standards need updating.

Do not include sensitive user data, request tokens, or private signing material in issue reports.

## 16. Developer security checklist

Before merging a change, confirm:

- [ ] No new external data transmission has been introduced without an approved product decision.
- [ ] All incoming data is validated at the receiving boundary.
- [ ] SQL access is parameterized.
- [ ] No secrets or request tokens are committed or logged.
- [ ] Tauri permissions follow least privilege.
- [ ] External navigation and URL schemes are validated.
- [ ] User content is rendered safely as text.
- [ ] File operations use constrained, validated paths.
- [ ] API endpoints do not expose arbitrary filesystem, process, or database operations.
- [ ] Errors do not disclose secrets, stack traces, or sensitive local paths.
- [ ] Relevant security tests have been added or updated.
- [ ] Production configuration is not weakened by development settings.

## 17. Open security decisions

The following decisions must be resolved during implementation:

1. **Single-instance enforcement:** Confirm how Tauri prevents multiple application instances from opening the same SQLite database.
2. **Request-token transport:** Finalize the secure startup channel between Tauri, Spring Boot, and the frontend.
3. **Tauri origin and CSP:** Confirm exact production origins and the strictest CSP compatible with the packaged app.
4. **SQLite encryption:** Decide whether OS-level device protection is sufficient for the first release or whether database encryption is required.
5. **Import/export formats:** Define supported formats, maximum sizes, and whether typed passage content is included.
6. **Diagnostic log retention:** Set a default retention period and maximum disk usage.
7. **Update mechanism:** Decide whether updates are manual downloads or a signed auto-update flow.
8. **Installer signing:** Confirm the Windows code-signing approach for public distribution.

Do not silently treat these open decisions as completed security controls.

## 18. Security baseline summary

The minimum release baseline is:

- Loopback-only Spring Boot binding.
- Per-launch request token for local API calls.
- Explicit CORS and Origin validation.
- Restrictive production CSP and Tauri capabilities.
- No arbitrary shell or filesystem access from the frontend.
- Backend-side request validation and parameterized SQL.
- SQLite stored in the user's application data directory with foreign keys enabled.
- Safe import/export and recoverable database backup/restore.
- Local, privacy-conscious logs.
- Locked and reviewed dependencies.
- Signed release artifacts where supported.
- Security tests included in the release checklist.

Security must be maintained throughout development, testing, packaging, and future feature changes. Offline-first design reduces external exposure, but it does not replace secure boundaries between the webview, desktop layer, backend, database, and operating system.
