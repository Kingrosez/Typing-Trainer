# Java Runtime Packaging & Bundling Strategy

**Project:** Typing Trainer  
**Document:** Java Runtime Packaging Strategy  
**Revision:** Phase 2 Infrastructure Baseline  
**Date:** November 19, 2026  

---

## 1. Executive Summary & Objective

Typing Trainer is designed as an offline-first Windows desktop application. End users must never be expected to manually download, install, or configure a Java Development Kit (JDK) or Java Runtime Environment (JRE).

To deliver a turnkey desktop experience, the application bundles:
1. A stripped, minimal Java 21 runtime image built using the official OpenJDK `jlink` tool.
2. The packaged Spring Boot fat executable JAR (`typing-trainer-backend.jar`).
3. Native Tauri desktop binaries that supervise and execute the embedded Java runtime.

---

## 2. Java Runtime Architecture & Jlink Modularization

### 2.1 Required Java Modules

Spring Boot 3, Tomcat 10 (Jakarta Servlet 6), Hibernate 6, Flyway 10, and SQLite JDBC require specific Java platform modules to function without external dependencies. The stripped runtime is assembled from the JDK `jmods` using:

```bash
jlink \
  --add-modules java.base,java.desktop,java.instrument,java.management,java.naming,java.net.http,java.prefs,java.rmi,java.scripting,java.security.jgss,java.security.sasl,java.sql,java.sql.rowset,java.transaction.xa,java.xml,jdk.crypto.ec,jdk.management,jdk.unsupported \
  --strip-debug \
  --no-man-pages \
  --no-header-files \
  --compress zip-6 \
  --output target/dist/jre
```

### 2.2 Module Breakdown Justifications

| Java Module | Required By | Purpose |
| :--- | :--- | :--- |
| `java.base` | Core Java runtime | Core language, reflection, concurrency, IO. |
| `java.sql` / `java.sql.rowset` | SQLite JDBC & Spring Data JPA | JDBC connection management, statements, result sets. |
| `java.naming` | Tomcat & Spring Context | JNDI service lookup abstractions. |
| `java.management` / `jdk.management` | Spring Boot & HikariCP | JVM telemetry, memory pool metrics, Hikari MBeans. |
| `java.instrument` | Byte Buddy / Mockito / Spring instrumentation | Class transformation and bytecode enhancement. |
| `java.desktop` | AWT/Java Beans dependencies | Property editors and beans introspection in Spring. |
| `java.xml` | Spring XML configurations & Flyway | Schema parsing and XML entity resolution. |
| `jdk.unsupported` | Unsafe / Performance libraries | Low-level memory operations in Netty/ByteBuddy/Tomcat. |
| `jdk.crypto.ec` | Java Cryptography Extension | Elliptic curve cryptography algorithms for TLS / security tokens. |

### 2.3 Size Optimization

- **Standard JDK 21 installation size:** ~350 MB to 450 MB.
- **Stripped Jlink runtime size (with `zip-6` and stripped headers/manpages):** ~45 MB to 60 MB.
- **Combined payload size (Stripped JRE + Executable JAR):** ~115 MB to 130 MB.

---

## 3. Tauri Resource Configuration & Packaging Layout

### 3.1 Distribution Layout

The packaged Windows application installs into `%ProgramFiles%\Typing Trainer\` (or per-user AppData when installed without elevated privileges) with the following structure:

```
Typing Trainer/
├── Typing Trainer.exe           # Native Tauri desktop executable
├── app_lib.dll                  # Native Rust library
├── resources/
│   ├── backend/
│   │   ├── jre/                 # Jlink bundled Java 21 runtime
│   │   │   ├── bin/
│   │   │   │   ├── java.exe
│   │   │   │   └── ...
│   │   │   └── lib/
│   │   │       ├── modules
│   │   │       └── ...
│   │   └── typing-trainer-backend.jar  # Packaged Spring Boot 3 executable archive
│   └── ...
└── ...
```

### 3.2 Tauri Configuration (`tauri.conf.json`)

To include the bundled runtime and JAR in the installer payload, Tauri bundle resources are mapped as follows:

```json
{
  "bundle": {
    "resources": [
      "resources/backend/**"
    ]
  }
}
```

---

## 4. Runtime Process Launch Command

During application startup, `desktop/src-tauri/src/backend/manager.rs` locates the bundled Java binary using the desktop process executable path:

1. **Production Mode:**
   - Detects `<EXE_DIR>/resources/backend/jre/bin/java.exe`.
   - Locates JAR at `<EXE_DIR>/resources/backend/typing-trainer-backend.jar`.
   - Executes:
     ```cmd
     resources\backend\jre\bin\java.exe -jar resources\backend\typing-trainer-backend.jar \
       --server.address=127.0.0.1 \
       --server.port=0 \
       --TYPING_TRAINER_AUTH_TOKEN=<PER_LAUNCH_SECURE_TOKEN> \
       --TYPING_TRAINER_DB_PATH=%LOCALAPPDATA%\TypingTrainer\data\typing-trainer.db
     ```
2. **Development Mode Fallback:**
   - Detects if running from IDE / `cargo dev`.
   - Checks `../backend/target/typing-trainer-backend-0.1.0-SNAPSHOT.jar` and system `java`.
   - Automatically supports `mvnw.cmd spring-boot:run` when jar is not yet packaged.

---

## 5. Persistence & Database Preservation Across Upgrades

- **Database Path:** `%LOCALAPPDATA%\TypingTrainer\data\typing-trainer.db`.
- **Upgrade Invariant:** The SQLite database is strictly segregated from the program installation files (`%ProgramFiles%\Typing Trainer`).
- **Installer Safety:** When the Windows installer (`.msi` or `.exe` generated via WiX / NSIS) performs updates or patches, it modifies only the application binaries in `%ProgramFiles%`. The user's progress, lessons, and metrics stored in `%LOCALAPPDATA%` remain untouched.
- **Migration Execution:** On each launch of the updated backend JAR, Flyway verifies schema checksums against `flyway_schema_history` and applies newly added incremental SQL migrations forward.

---

## 6. Threat Model & Process Isolation Limits

1. **Loopback Only (`127.0.0.1`):** The backend binds exclusively to `127.0.0.1`. Remote network callers cannot reach the Spring Boot port.
2. **Dynamic Ephemeral Port (`server.port=0`):** Prevents port collision and denies predictable probing by port-scanning malware.
3. **Cryptographic Request Token (`X-Request-Token`):** Generated per-launch in Rust (`Uuid::new_v4()`) and validated via `MessageDigest.isEqual`.
4. **Boundary Limit:** Because the desktop application and backend execute under the current Windows user profile, another process executing under the same user profile with debugger privileges or memory inspection capabilities could inspect process arguments or memory. This is standard for local desktop applications. Cross-user isolation and loopback network shielding are fully maintained.
5. **Windows Job Object Supervision:** Configured with `JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE` so that child Java processes are immediately cleaned up by the Windows kernel upon desktop app shutdown or sudden crash.
