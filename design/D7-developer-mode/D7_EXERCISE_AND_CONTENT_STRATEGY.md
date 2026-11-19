# D7 EXERCISE & CONTENT STRATEGY
**Typing Trainer — Windows Desktop Application**
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 1 Product Discovery & Requirements Analysis*
*Document Version: 1.0.0 | Date: 2026-11-18 | Status: COMPLETE & READY FOR REVIEW*

---

## 1. Executive Summary

This strategy establishes how programming exercises are structured, curated, deterministically generated, and ingested within **Developer Mode**.

In strict accordance with project governance (`AGENTS.md`), all exercise content is **100% offline-first and local**, completely free of external AI/LLM model runtimes, and designed to balance pedagogical progression with real-world software authenticity.

---

## 2. The Three Content Sourcing Pillars

Developer Mode delivers programming content through three distinct, complementary pipelines:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         D7 CONTENT SOURCING PIPELINES                            │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   PILLAR 1: CURATED CANONICAL SNIPPET REPOSITORY                                │
│   • 150+ hand-crafted, production-grade snippets across 6 core languages.        │
│   • Permissively licensed (MIT / Apache 2.0 / BSD) open-source codebases.       │
│   • Bundled in offline SQLite seed tables (zero network dependency).             │
│   • Curated for clarity, modern idioms, and balanced symbol distribution.        │
│                                                                                  │
│   PILLAR 2: DETERMINISTIC PROCEDURAL TEMPLATE GENERATOR                          │
│   • Algorithmic template engine combining language keywords, operators,          │
│     and realistic identifier tokens.                                             │
│   • Seeded via PRNG: Hash(Language, DifficultyTier, SessionID, CalendarDate).   │
│   • Produces infinite, syntactically valid code fragments without AI.            │
│   • Guarantees reproducible, deterministic exercise reproduction.                │
│                                                                                  │
│   PILLAR 3: USER CUSTOM CODE & FILE IMPORT                                       │
│   • Direct drag-and-drop or file picker for local developer files.               │
│   • Supported formats: .java, .ts, .js, .py, .sql, .rs, .json, .txt, .md.       │
│   • Enforces 500 KB file-size ceiling before processing.                         │
│   • Strict UTF-8 validation (rejects invalid byte sequences; zero silent loss).   │
│   • Content parsed strictly as inert plaintext; zero execution or evaluation.    │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Exercise Formats & Structural Typology

Developer Mode organizes code exercises into four distinct structural formats:

### 3.1 Format A: Micro-Syntax Sprints (1–3 Lines)
- **Objective:** Rapidly isolate and drill high-friction symbol clusters without narrative context.
- **Duration:** 15 to 30 seconds.
- **Target Typist:** All levels needing targeted delimiter or operator conditioning.
- **Example (TypeScript Operators):**
  ```typescript
  const isValid = (user?.age ?? 0) >= 18 && status !== "SUSPENDED";
  ```
- **Example (Rust Pattern Matching):**
  ```rust
  let result: Result<Option<u32>, &'static str> = Ok(Some(42));
  ```

### 3.2 Format B: Idiomatic Methods & Functions (5–12 Lines)
- **Objective:** Build sustained cadence through authentic programming control flow, parameter signatures, and variable scoping.
- **Duration:** 1 to 2 minutes.
- **Target Typist:** Intermediate to Advanced developers.
- **Example (Java Stream Pipeline):**
  ```java
  public List<String> extractActiveUserEmails(List<User> users) {
      return users.stream()
          .filter(User::isActive)
          .map(User::getEmail)
          .sorted()
          .toList();
  }
  ```

### 3.3 Format C: Declarative Schemas & Queries (4–10 Lines)
- **Objective:** Train structured indentation, repetitive quotes, colons, and uppercase keywords.
- **Duration:** 1 to 2 minutes.
- **Target Typist:** Data engineers, web developers, configuration typists.
- **Example (SQL Multi-Table Aggregate Query):**
  ```sql
  SELECT u.id, u.username, COUNT(o.id) AS total_orders
  FROM users u
  LEFT JOIN orders o ON u.id = o.user_id
  WHERE o.status = 'COMPLETED'
  GROUP BY u.id, u.username
  HAVING COUNT(o.id) >= 5;
  ```

### 3.4 Format D: Production Algorithms & Classes (15–25 Lines)
- **Objective:** Train endurance, vertical multi-line visual tracking, and deep indentation structures.
- **Duration:** 3 to 5 minutes.
- **Target Typist:** Advanced and Expert developers preparing for technical benchmark certifications.
- **Example (Python Async Context Manager):**
  ```python
  class AsyncDatabaseConnection:
      def __init__(self, dsn: str, pool_size: int = 10) -> None:
          self.dsn = dsn
          self.pool_size = pool_size
          self._pool = None

      async def __aenter__(self):
          self._pool = await create_pool(self.dsn, min_size=self.pool_size)
          return self._pool

      async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
          if self._pool:
              await self._pool.close()
  ```

---

## 4. Syntax & Whitespace Preservation Strategy

Unlike plain text typing where spaces simply separate words, whitespace in source code carries syntactic meaning and strict visual rhythm.

### 4.1 Indentation Standardization Rules
1. **Spaces are Canonical:** The typing engine standardizes all exercise indentation on **spaces**.
   - **2 Spaces:** TypeScript, JavaScript, HTML, CSS, JSON.
   - **4 Spaces:** Java, Python, Rust, SQL.
2. **Tab Ingestion:** If a user imports a file containing tab characters (`\t`), the importer automatically expands tabs into the language's standard space count (2 or 4 spaces) upon initial decoding, preserving visual alignment without altering code logic.
3. **Trailing Whitespace:** All exercise snippets are stripped of invisible trailing whitespace at the ends of lines to prevent confusing phantom character requirements.

### 4.2 Code Comments Policy
- **Beginner & Intermediate Tiers:** Exclude comments from code snippets. Exercises focus exclusively on executable tokens, operators, and identifiers to maximize syntax density.
- **Advanced & Expert Tiers:** Selectively include authentic Javadoc / TSDoc / docstrings (`/** ... */`, `/// ...`) to train the transition between prose typing and syntax typing within the same multi-line session.

### 4.3 Line Length Discipline
- **Maximum Line Width:** All curated snippets are constrained to a strict maximum of **80 characters** (soft limit) and **100 characters** (hard limit).
- **No Horizontal Code Overflow:** Lines never exceed the 1100px reading stage at `JetBrains Mono 20px`, completely eliminating the need for horizontal scrollbars during typing.
