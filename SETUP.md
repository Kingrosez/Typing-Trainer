# Typing Trainer - Development Setup Guide

**Status:** Initial development setup guide  
**Target platform:** Windows 10/11, subject to final minimum-version decision  
**Stack:** Tauri 2, React, TypeScript, Spring Boot 3, Java 21, SQLite  
**Last updated:** 12 November 2026

## 1. Purpose

This guide explains how to prepare a Windows development machine, run the frontend and backend independently, and launch the integrated desktop application.

The application is offline-first at runtime. Development requires tool installation and dependency downloads, but normal application use must not require internet connectivity.

> Version note: Install supported, mutually compatible releases. The commands below are a baseline. Verify the current Tauri, Rust, Node.js, Java, Maven, and Spring Boot requirements before pinning versions.

## 2. Required tools

| Tool | Purpose | Required |
|---|---|---|
| Git | Source control | Yes |
| Node.js LTS | Frontend tooling | Yes |
| npm | Frontend package management | Yes |
| Rust toolchain | Tauri native layer | Yes |
| Visual Studio C++ Build Tools | Windows native compilation | Yes |
| WebView2 Runtime | Windows webview | Yes, usually preinstalled |
| JDK 21 | Spring Boot development | Yes |
| Maven Wrapper | Backend build | Included in repository |
| IDE/editor | Development | Recommended |

### 2.1 Git

Install Git for Windows and verify:

```powershell
git --version
```

### 2.2 Node.js and npm

Install a supported Node.js LTS release.

Verify:

```powershell
node --version
npm --version
```

Use the Node version documented by the project. Keep `package-lock.json` committed and use `npm ci` for reproducible installs.

### 2.3 Rust

Install Rust using the official Rust toolchain installer and select the stable toolchain.

Verify:

```powershell
rustc --version
cargo --version
rustup show
```

Tauri's Windows build requirements include the Microsoft C++ build toolchain and Windows SDK components. Install the required components for the selected Tauri release.

### 2.4 Microsoft C++ Build Tools

Install Visual Studio Build Tools with the C++ desktop development workload and the Windows SDK required by Tauri.

Verify that the Visual Studio developer environment can locate the compiler:

```powershell
where.exe cl
```

If the compiler is not found in a normal PowerShell session, use the appropriate Developer PowerShell or ensure the toolchain is correctly installed.

### 2.5 WebView2

Tauri on Windows uses Microsoft Edge WebView2.

Check whether the Evergreen WebView2 Runtime is installed. Most supported Windows installations already include it. The installer should handle or clearly report a missing runtime according to the selected deployment strategy.

### 2.6 Java 21

Install a JDK 21 distribution suitable for development.

Set `JAVA_HOME` to the JDK installation directory and ensure `%JAVA_HOME%\bin` is on `PATH`.

Verify:

```powershell
java -version
javac -version
echo $env:JAVA_HOME
```

The packaged end-user application will include a compatible Java runtime, so users will not need a separately installed JDK.

## 3. Clone the repository

```powershell
git clone <repository-url>
cd typing-trainer
```

Replace `<repository-url>` with the actual repository URL.

Check the repository structure:

```powershell
Get-ChildItem
```

Expected top-level folders:

```text
typing-trainer/
  desktop/
  backend/
  database/
  docs/
  scripts/
  README.md
```

## 4. Frontend setup

Open a terminal in the desktop directory:

```powershell
cd desktop
```

Install dependencies:

```powershell
npm ci
```

If the project has not yet been scaffolded and there is no `package.json`, create the Tauri + React + TypeScript project using the approved Tauri scaffolding workflow, then place it in the agreed `desktop/` directory. Do not run `npm ci` before a lockfile exists.

Run the frontend development server:

```powershell
npm run dev
```

Use the Vite URL printed in the terminal to open the development frontend.

Build the frontend:

```powershell
npm run build
```

Run frontend tests when configured:

```powershell
npm test
```

The exact script names must match `desktop/package.json`.

## 5. Backend setup

Open a separate terminal:

```powershell
cd backend
```

Verify Java:

```powershell
java -version
```

On Windows, use the Maven Wrapper:

```powershell
.\mvnw.cmd --version
```

Resolve dependencies and compile:

```powershell
.\mvnw.cmd clean verify
```

Start Spring Boot:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend must bind to loopback only. During early development, use a configured local port. The integrated desktop application must later select an available port safely and pass it to the frontend through the Tauri process integration.

Check readiness using the actual configured port:

```powershell
Invoke-RestMethod http://127.0.0.1:<port>/internal/health
```

Replace `<port>` with the port printed or configured by the backend.

## 6. Database setup

SQLite is embedded. A separate database server is not required.

On application startup:

1. Resolve the per-user application data directory.
2. Create the application data directory if it does not exist.
3. Configure the SQLite JDBC URL for the database file in that directory.
4. Enable SQLite foreign-key enforcement.
5. Run Flyway migrations.
6. Verify that the application can read and write its schema.

Do not place the live user database in the repository, `desktop/`, or the installation directory.

For development, a temporary database path may be configured through a local, uncommitted configuration file or environment variable. Never commit personal database files.

## 7. Run the desktop application

Once the frontend and backend have been integrated through Tauri process management:

```powershell
cd desktop
npm run tauri dev
```

The exact command depends on the Tauri scripts configured in `package.json`.

The expected startup sequence is:

1. Tauri launches.
2. Tauri starts the Spring Boot child process.
3. Spring Boot initializes configuration and SQLite.
4. Flyway migrations complete.
5. The backend readiness endpoint reports `UP`.
6. Tauri provides the selected local endpoint to the frontend through a controlled mechanism.
7. React loads application data and displays the dashboard.

The frontend must not assume that the backend is ready immediately when the window opens.

## 8. Development environment configuration

Keep environment-specific settings outside committed source files.

Examples of settings that may need development configuration:

- Backend log level.
- Temporary development port, if fixed during isolated backend development.
- Development database path.
- Frontend development URL.
- Test-specific settings.

Do not commit:

- API keys or credentials.
- Personal absolute paths.
- Local database files.
- User-specific configuration.
- Production secrets.

The application does not require any cloud API key or Ollama configuration.

## 9. Recommended IDE setup

### Frontend and desktop

VS Code is suitable.

Recommended extensions:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- rust-analyzer
- Tauri support, if maintained for the installed Tauri version

### Backend

IntelliJ IDEA or VS Code with Java support.

Recommended capabilities:

- Java language support for Java 21.
- Spring Boot support.
- Maven integration.
- JUnit test runner.
- SQL and SQLite inspection support.

Extensions are development conveniences, not application runtime dependencies.

## 10. Quality checks

Run these checks before committing changes.

### Frontend

```powershell
cd desktop
npm run build
npm test
```

If configured:

```powershell
npm run lint
npm run typecheck
```

### Backend

```powershell
cd backend
.\mvnw.cmd clean verify
```

### Desktop

Build and test the Tauri application using the scripts configured in the repository.

Verify:

- Backend startup and readiness.
- Frontend-to-backend connectivity.
- Loopback-only binding.
- Graceful backend shutdown.
- Offline application operation.

Do not mark a feature complete if its relevant tests or build checks fail.

## 11. Troubleshooting

### `node` or `npm` is not recognized

- Confirm Node.js is installed.
- Reopen the terminal after installation.
- Check that the Node.js installation directory is on `PATH`.

### `rustc` or `cargo` is not recognized

- Confirm Rust is installed.
- Run `rustup show`.
- Restart the terminal.
- Confirm the Cargo bin directory is on `PATH`.

### Tauri native compilation fails

- Confirm the required Visual Studio C++ Build Tools workload is installed.
- Confirm a supported Windows SDK is installed.
- Check the Tauri version's current Windows prerequisites.
- Build from an appropriate developer environment if required.

### `JAVA_HOME` is missing or incorrect

- Point `JAVA_HOME` to the JDK 21 root directory, not its `bin` folder.
- Add `%JAVA_HOME%\bin` to `PATH`.
- Open a new terminal and verify `java -version`.

### Maven Wrapper fails

- Confirm the wrapper files are committed.
- Check that the project uses a supported Java version.
- Review Maven output for dependency or repository errors.
- Do not replace the wrapper with an arbitrary globally installed Maven version without documenting the reason.

### Frontend cannot connect to Spring Boot

- Confirm the backend process is running.
- Check the selected local port.
- Confirm the backend binds to `127.0.0.1`.
- Confirm the frontend receives the current endpoint through the Tauri integration.
- Check local request protection and CORS configuration.
- Do not hardcode a stale port as a workaround.

### SQLite database cannot be opened

- Confirm the per-user application data directory exists.
- Confirm the current user can write to it.
- Confirm the JDBC URL points to the intended file.
- Review Flyway migration errors.
- Do not delete a user's database to fix a migration failure. Back up and diagnose it first.

### Backend starts slowly

- Check Java runtime and Spring Boot startup logs.
- Avoid repeated frontend retries that create excess requests.
- Use a bounded readiness check with backoff.
- Measure startup before tuning JVM options.

## 12. Build and release preparation

Before creating a release installer:

- Run frontend production build.
- Run backend verification tests.
- Run database migration tests.
- Package a compatible Java runtime.
- Configure Tauri to manage the Spring Boot process.
- Verify the backend binds only to loopback.
- Test the installer on a clean Windows machine without a separate Java installation.
- Test offline startup.
- Test upgrade behavior and user-data preservation.
- Verify that uninstall behavior does not unexpectedly remove user data.
- Document the supported Windows versions and CPU architecture.

## 13. Definition of done for development setup

The development environment is ready when:

- Git, Node.js, Rust, Windows build tools, and JDK 21 are available.
- Frontend dependencies install reproducibly.
- The React frontend builds.
- The Spring Boot backend compiles and starts.
- SQLite initializes through Flyway.
- The backend readiness endpoint responds locally.
- Tauri launches the desktop window.
- Tauri starts and stops the backend correctly.
- The frontend connects to the backend without a hardcoded stale port.
- Core application functionality works without internet access.

---

**Setup baseline:** Windows development environment, Node.js LTS, Rust stable, Tauri prerequisites, JDK 21, Maven Wrapper, React frontend, Spring Boot backend, and local SQLite. Runtime use is offline-first and requires no Ollama or cloud AI services.
