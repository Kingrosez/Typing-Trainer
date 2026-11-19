# D7 DIFFICULTY & PROGRESSION SPECIFICATION
**Typing Trainer — Windows Desktop Application**
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 2 UX Architecture & Functional Specifications*
*Document Version: 1.0.0 | Date: 2026-11-18 | Status: COMPLETE & READY FOR REVIEW*

---

## 1. Executive Summary

This specification establishes the four-tier difficulty taxonomy, complexity scoring algorithms, and language mastery progression tracks for **Developer Mode**.

It provides concrete curricular specifications across all six core languages (**Java, TypeScript, JavaScript, Python, SQL, Rust**) and the **JSON** data track, guaranteeing smooth, frustration-free progression from foundational punctuation to production architecture.

---

## 2. Four-Tier Curricular Matrix Across Languages

| Language | Tier 1: Syntax Foundations ($CCS < 3.5$) | Tier 2: Idiomatic Constructs ($3.5 \le CCS < 6.0$) | Tier 3: Production Patterns ($6.0 \le CCS < 8.0$) | Tier 4: Architecture & Dense Syntax ($CCS \ge 8.0$) |
|---|---|---|---|---|
| **TypeScript** | Variable declarations, primitive types, basic returns (`const x: number = 42;`). | Object interfaces, function signatures, array map/filter, basic arrow functions. | Generics (`Promise<T | null>`), async/await pipelines, union types, optional chaining. | Deep conditional types, template literal types, complex decorators, higher-order reducers. |
| **Python** | Basic variable assignments, `if/else`, simple function definitions with `def`. | List comprehensions, dictionary literals, string formatting (`f"{var}"`), `for/while` loops. | Class declarations, context managers (`with open()`), try/except blocks, type hints. | Metaclasses, async generator pipelines, custom decorators (`@functools.wraps`), regex logic. |
| **Java** | Primitive types, simple method headers, basic arithmetic (`int sum = a + b;`). | Standard getters/setters, basic loops, constructor initialization, string concatenation. | Stream API pipelines (`.filter().map().toList()`), try-with-resources, generic collections. | Multi-threaded concurrency (`CompletableFuture`), reflection, nested annotations, builder patterns. |
| **SQL** | Simple `SELECT * FROM table WHERE id = 1;` queries, basic data types. | `INSERT INTO`, `UPDATE`, standard inner joins, basic `GROUP BY` and `ORDER BY`. | Multi-table `LEFT/RIGHT JOIN`, aggregate window functions (`ROW_NUMBER() OVER`), `HAVING`. | Common Table Expressions (`WITH cte AS`), recursive queries, dynamic pivot tables, JSON indexing. |
| **Rust** | Basic `let mut` bindings, primitive scalar types, simple functions with returns. | Struct definitions, `impl` blocks, basic `match` control flow, vector iterations. | Result/Option error propagation (`?`), lifetime bounds (`'a`), trait implementations. | Complex macro definitions (`macro_rules!`), unsafe pointer arithmetic, nested enums, atomics. |
| **JSON** | Simple key-value object (`{ "name": "Alice", "age": 30 }`). | Nested arrays and objects (`{ "items": [ { "id": 1 } ] }`). | Configuration schemas with mixed primitive types and arrays. | Deeply nested API payloads with UUID strings, ISO timestamps, and matrix arrays. |

---

## 3. Worked Language Snippet Blueprints

### 3.1 TypeScript Snippet Blueprints
- **Tier 1 (Foundations):**
  ```typescript
  export const calculateArea = (width: number, height: number): number => {
    return width * height;
  };
  ```
- **Tier 3 (Production):**
  ```typescript
  export async function fetchUserData<T>(url: string): Promise<T | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      return (await response.json()) as T;
    } catch (error) {
      return null;
    }
  }
  ```

### 3.2 Python Snippet Blueprints
- **Tier 2 (Idiomatic):**
  ```python
  def filter_active_records(records: list[dict]) -> list[str]:
      return [r["username"] for r in records if r.get("status") == "ACTIVE"]
  ```
- **Tier 4 (Architecture):**
  ```python
  class AsyncConnectionPool:
      async def acquire(self, timeout: float = 5.0) -> Connection:
          async with self._lock:
              if not self._available:
                  await asyncio.wait_for(self._has_conns.wait(), timeout=timeout)
              return self._available.popleft()
  ```

---

## 4. Four-Stage Language Mastery Certification Track

Each language catalog card on `SCR-601` tracks a typist's progression across four sequential certification stages:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     4-STAGE LANGUAGE CERTIFICATION TRACK                         │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   STAGE 1: SYNTAX NOVICE (★☆☆☆)                                                  │
│   • Criteria: Complete 5 Tier-1 snippets with ≥ 95.0% accuracy & ≥ 25 Net WPM.   │
│   • Reward: Unlocks Tier-2 Idiomatic Snippets.                                   │
│                                                                                  │
│   STAGE 2: IDIOMATIC TYPIST (★★☆☆)                                               │
│   • Criteria: Complete 5 Tier-2 snippets with ≥ 96.0% accuracy & ≥ 40 Net WPM.   │
│   • Reward: Unlocks Tier-3 Production Snippets.                                  │
│                                                                                  │
│   STAGE 3: SENIOR CODER (★★★☆)                                                   │
│   • Criteria: Complete 5 Tier-3 snippets with ≥ 97.0% accuracy & ≥ 55 Net WPM.   │
│   • Reward: Unlocks Tier-4 Architecture Snippets.                                │
│                                                                                  │
│   STAGE 4: LANGUAGE MASTER (★★★★)                                                │
│   • Criteria: Complete 5 Tier-4 snippets with ≥ 98.0% accuracy & ≥ 70 Net WPM.   │
│   • Reward: Golden Certification Badge & Title on Language Hub.                  │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

- **Mastery Qualification Rule:** A snippet completion qualifies toward certification only if it meets both the accuracy floor and the speed floor in a single completed attempt.
- **Zero Duplicate Milestone XP:** Completing stages updates the visual certification badge and records status in `developer_language_progress`; it awards **0** duplicate milestone XP (honoring D5/D6 governance).
