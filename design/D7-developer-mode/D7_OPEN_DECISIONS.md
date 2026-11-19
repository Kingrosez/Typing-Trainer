# D7 OPEN DECISIONS & CONFIRMED GOVERNANCE REGISTER
**Typing Trainer — Windows Desktop Application**  
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 2 UX Architecture & Functional Specifications*  
*Document Version: 4.0.0 | Date: 2026-11-18 | Status: FORMALLY AUDITED & RECONCILED (STAGE 2 FINAL CLOSURE)*

---

## 1. Status of Architectural Baseline Decisions

All core architectural decisions for Phase D7 have received formal, explicit Product Owner approval and remain unchanged:

| Decision ID | Decision Title | Approved Policy Baseline | Governance Status |
|---|---|---|:---:|
| **D7-OD-01** | **Indentation Mechanics** | Smart Auto-Advance indentation on `Enter` is default; dotted guides (`┆`) rendered; manual mode toggle provided; auto-indentation excluded from user keystrokes, WPM, and accuracy calculations. No auto-closing delimiters. | **APPROVED BY PRODUCT OWNER** |
| **D7-OD-02** | **Language Catalog Scope** | Six core launch languages: Java, TypeScript, JavaScript, Python, SQL, Rust. JSON is an introductory data format track, not a certification track. C++, Go, and Bash are deferred. | **APPROVED BY PRODUCT OWNER** |
| **D7-OD-03** | **Multi-Line Backspacing** | Full multi-line backspacing across previous lines permitted; line boundary traversal dissolves auto-indentation and unlocks Line $N-1$; corrected errors excluded from Net WPM penalty; repeated backspacing does not inflate errors. | **APPROVED BY PRODUCT OWNER** |
| **D7-OD-04** | **Benchmark Metrics** | Reuses D4 Net WPM formula ($WPM_{net} = \max(0, \frac{(N_{total}/5) - E_{unc}}{t_{min}})$); displays Net WPM, Raw WPM, Overall Accuracy, Symbol Accuracy, Keyword Accuracy, Syntax Error breakdown. No separate Code WPM formula. | **APPROVED BY PRODUCT OWNER** |
| **D7-OD-05** | **Terminal Scope** | CLI and terminal simulation deferred to a dedicated future module. Developer Mode focuses exclusively on source-code typing. | **APPROVED BY PRODUCT OWNER** |
| **D7-OD-06** | **Telemetry Persistence** | Keystrokes captured in-memory in React frontend; single atomic batch POST to Spring Boot upon session completion; D6 rolling window and confusion matrix updated; zero writes per keypress. | **APPROVED BY PRODUCT OWNER** |
| **D7-NU-02** | **Custom File Pagination** | Option A Approved: Files 1–30 lines remain one exercise; files $> 30$ lines are divided into sequential exercises of approximately 15–20 lines (never exceeding 20 lines). Bounded deterministic algorithm. | **APPROVED BY PRODUCT OWNER** |

---

## 2. Review and Categorization of Technical Nuances & Engineering Constraints

In accordance with strict engineering governance ([`AGENTS.md`](file:///d:/Windows%20app/Typing%20Trainer/AGENTS.md)), all technical implementation nuances have been reviewed and classified into exact governance categories:

```
+-------------------------------------------------------------------------------------------------------------------------+
|                                    TECHNICAL NUANCES GOVERNANCE CLASSIFICATION MATRIX                                   |
+-----------+-----------------------------------+-----------------------------------+-------------------------------------+
| Nuance ID | Title & Summary                   | Governing Specification(s)        | Exact Governance Category           |
+-----------+-----------------------------------+-----------------------------------+-------------------------------------+
| D7-NU-01A | Original Source Preservation &    | D7_DATA_REQUIREMENTS.md (Sec 3, 6)| CATEGORY B: TECHNICAL DESIGN RULE   |
|           | Line-Ending Normalization (CRLF)  | D7_SCREEN_SPECIFICATIONS (Sec 3.4)| (Import & Content Preservation Spec)|
+-----------+-----------------------------------+-----------------------------------+-------------------------------------+
| D7-NU-01B | In-Memory Working Representation  | D7_DATA_REQUIREMENTS.md (Sec 4.1) | CATEGORY B: IMPLEMENTATION          |
|           | & Live Keystroke History Buffer   | D7_INTERACTION_SPECIFICATIONS (S3)| CONSTRAINT (Derived from D7-OD-06)  |
+-----------+-----------------------------------+-----------------------------------+-------------------------------------+
| D7-NU-02  | Deterministic Bounded Pagination  | D7_SCREEN_SPECIFICATIONS.md       | CATEGORY A: ALREADY APPROVED        |
|           | 1–30L single, >30L chunked (≤20L) | D7_INTERACTION_SPECIFICATIONS.md  | PRODUCT DECISION (Option A)         |
+-----------+-----------------------------------+-----------------------------------+-------------------------------------+
| D7-NU-03  | Inactivity Auto-Pause (15 Seconds)| D7_INTERACTION_SPECIFICATIONS.md  | CATEGORY C: UNRESOLVED / DEFERRED   |
|           | Automatic pause proposal          | D7_CALCULATION_SPECIFICATION.md   | DECISION (Requires Future PO Review)|
+-----------+-----------------------------------+-----------------------------------+-------------------------------------+
```

---

### Nuance D7-NU-01: Dual Content Representation & In-Memory Working Mechanics

To ensure exact decision traceability, the two distinct technical aspects of `D7-NU-01` are formally separated:

#### D7-NU-01A: Original Source Preservation & Line-Ending Normalization
- **Exact Governance Category:** **Category B: A technical design rule established by the approved import and content-preservation specification**.
- **Governing Specification & Sections:**
  - [`D7_DATA_REQUIREMENTS.md#L80-L100`](file:///d:/Windows%20app/Typing%20Trainer/design/D7-developer-mode/D7_DATA_REQUIREMENTS.md#L80-L100) (Section 3.1: SQLite DDL for `raw_source_bytes BLOB`, `raw_byte_size INTEGER`, and `source_code TEXT`)
  - [`D7_DATA_REQUIREMENTS.md#L235-L245`](file:///d:/Windows%20app/Typing%20Trainer/design/D7-developer-mode/D7_DATA_REQUIREMENTS.md#L235-L245) (Section 6: Dual Content Representation & Pre-Ingestion Validation Matrix)
  - [`D7_SCREEN_SPECIFICATIONS.md#L180-L215`](file:///d:/Windows%20app/Typing%20Trainer/design/D7-developer-mode/D7_SCREEN_SPECIFICATIONS.md#L180-L215) (Section 3.4: SCR-604 Custom Code Importer & Workspace Ingestion Specification)
  - [`D7_INTERACTION_SPECIFICATIONS.md#L170-L185`](file:///d:/Windows%20app/Typing%20Trainer/design/D7-developer-mode/D7_INTERACTION_SPECIFICATIONS.md#L170-L185) (Section 6: Custom File Import Flow)
  - [`SECURITY.md`](file:///d:/Windows%20app/Typing%20Trainer/SECURITY.md) (Inert plaintext storage, 500 KB raw byte ceiling, zero shell execution)
- **Technical Design Rule Content:**
  1. **Original Source Preservation:** The exact, unmodified UTF-8 byte stream is stored as `raw_source_bytes` in SQLite `developer_snippets` and preserved byte-for-byte for future export and inspection. The 500 KB limit is strictly enforced against original uploaded bytes before any decoding (`file.size <= 512,000 bytes`).
  2. **Line-Ending Normalization:** For internal typing canvas rendering, caret positioning, and deterministic pagination, all `\r\n` (CRLF) and `\r` (CR) sequences are normalized to `\n` (LF) in memory. Original visible characters, blank lines, indentation, punctuation, and comments are 100% preserved. Line numbering maintains a strict 1:1 mapping to original source lines.
- **Blocks Stage 3 Visual Design:** **NO**.

#### D7-NU-01B: In-Memory Working Representation & Live Keystroke History Buffer
- **Exact Governance Category:** **Category B: Technical implementation constraint explicitly derived from approved decision D7-OD-06 and AGENTS.md baseline**.
- **Governing Specification & Sections:**
  - [`D7_DATA_REQUIREMENTS.md#L165-L175`](file:///d:/Windows%20app/Typing%20Trainer/design/D7-developer-mode/D7_DATA_REQUIREMENTS.md#L165-L175) (Section 4.1: Client-Side In-Memory Collection Phase, `DevSessionEventBuffer`)
  - [`D7_INTERACTION_SPECIFICATIONS.md#L35-L88`](file:///d:/Windows%20app/Typing%20Trainer/design/D7-developer-mode/D7_INTERACTION_SPECIFICATIONS.md#L35-L88) (Section 3: High-Frequency Keystroke Event Loop)
  - [`D7_UX_ARCHITECTURE.md#L45-L65`](file:///d:/Windows%20app/Typing%20Trainer/design/D7-developer-mode/D7_UX_ARCHITECTURE.md#L45-L65) (Section 2.2: Live Typing State Machine)
  - [`AGENTS.md`](file:///d:/Windows%20app/Typing%20Trainer/AGENTS.md) (Section 2 & 6: Real-time typing loop in React frontend; zero REST requests, IPC calls, or SQLite writes per keystroke)
- **Technical Constraint Content:**
  - Real-time keystroke processing, inter-keystroke intervals (IKIs), error logging, and line traversal remain strictly in React client-side memory (`DevSessionEventBuffer`) during live typing.
  - Zero IPC calls or SQLite writes occur per keypress. Keystroke capture latency remains $< 1\text{ ms}$.
  - Session history is assembled and staged in IndexedDB outbox only upon completion of the final line.
- **Blocks Stage 3 Visual Design:** **NO**.
- **Blocks Engineering Implementation:** **YES (Must be implemented in React typing engine)**.

---

### Nuance D7-NU-02: Bounded Deterministic Custom-File Pagination (Option A Approved)
- **Nuance ID:** `D7-NU-02`
- **Exact Governance Category:** **Category A: Already Approved Product Decision**.
- **Status:** **FORMALLY APPROVED BY PRODUCT OWNER (OPTION A)**.
- **Deterministic Bounded Algorithm Specification:**
  1. **Files Containing 1–30 Lines:** Exactly one exercise is created (`Part 1 of 1`). No pagination occurs.
  2. **Files Containing More than 30 Lines:**
     - The number of parts $K$ is calculated as $K = \lceil N / 20 \rceil$, where $N$ is total source lines.
     - Lines are distributed evenly: base part size $q = \lfloor N / K \rfloor$, with $r = N \pmod K$ parts receiving $q + 1$ lines and $(K - r)$ parts receiving $q$ lines.
     - **Absolute Bounded Ceiling:** No exercise may **ever exceed 20 source lines** under any circumstance.
     - Where mathematical constraints make a 15-line minimum impossible (e.g. 31 lines $\rightarrow$ 16, 15; 41 lines $\rightarrow$ 14, 14, 13), smaller balanced parts are created rather than exceeding 20 lines.
     - **Prohibition on Over-Merging:** A short remainder is **never** merged into a preceding part if doing so would cause that part to exceed 20 lines.
  3. **Logical Boundary Heuristics:**
     - Partition boundaries may adjust within $\pm 2$ lines to align with logical boundaries: Priority 1 (Blank line), Priority 2 (Closing brace / depth 0), Priority 3 (Comment / decorator).
     - **Hard Boundary Constraint:** Adjustment is permitted **only if** neither affected part exceeds 20 lines. If adjustment would violate the 20-line ceiling, the deterministic line-based boundary is enforced.
  4. **Content Preservation:** Original line order, blank lines, indentation, punctuation, comments, and character sequences are 100% preserved. No omissions, no duplicates.
- **Blocks Stage 3 Visual Design:** **NO (Fully Resolved)**.
- **Blocks Engineering Implementation:** **YES (Chunking utility in Claude Code)**.
- **Approval Authority:** Product Owner (**Approved**).

---

### Nuance D7-NU-03: Inactivity Auto-Pause Proposal (15-Second Idle Threshold)
- **Nuance ID:** `D7-NU-03`
- **Exact Governance Category:** **Category C: Unresolved / Deferred Decision requiring future Product Owner approval**.
- **Governance Finding & Authority Check:**
  - An inspection of authoritative D4 specifications confirms that **D4 approved manual pause via `Esc`** (with pause duration strictly excluded from active elapsed time), but **contains NO approved 15-second inactivity auto-pause rule**.
  - Inactivity auto-pause was an implementation proposal introduced during D7 discovery and has **NOT** received explicit Product Owner approval.
  - **Resolution Policy:** To prevent silently converting an engineering proposal into approved product behavior, **auto-pause after 15 seconds is preserved as an UNRESOLVED proposal**.
  - **Baseline Product Behavior:** Developer Mode adheres strictly to the approved D4 baseline: typists pause manually via `Esc` (`SCR-603 State 04`). Paused time is subtracted from elapsed time.
  - Future Product Owner review will determine whether automatic inactivity pause should be added as a configurable setting or global default.
- **Blocks Stage 3 Visual Design:** **NO (SCR-603 uses the standard Pause Overlay Modal triggered by `Esc`)**.
- **Blocks Engineering Implementation:** **NO (Engine implements manual `Esc` pause per approved D4 contract)**.
- **Approval Authority:** Product Owner (Future Scope Review).

---

## 3. Register of Formally Deferred Scope Items

| Deferred ID | Feature Scope | Governing Rationale | Disposition |
|---|---|---|:---:|
| **D7-DEF-01** | **Terminal & CLI Shell Simulation** | Excluded from Developer Mode per `D7-OD-05`. Simulating interactive shell prompts, ANSI escape parsing, and CLI commands introduces OS-specific differences and security risks. | Formally deferred to a dedicated future module (**Module 09: Terminal & DevOps Studio**). |
| **D7-DEF-02** | **Extended Programming Languages Pack** | Six launch languages (Java, TS, JS, Python, SQL, Rust) and JSON data track approved per `D7-OD-02`. Adding C++, Go, Bash, Swift, or Kotlin expands snippet validation matrices. | Formally deferred to post-launch **Developer Mode Expansion Pack 1 (Systems Track)**. |
