# D7 RECOMMENDATION ENGINE: DEVELOPER MODE
**Typing Trainer — Windows Desktop Application**
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 2 UX Architecture & Functional Specifications*
*Document Version: 1.0.0 | Date: 2026-11-18 | Status: COMPLETE & READY FOR REVIEW*

---

## 1. Executive Summary

The Developer Mode Recommendation Engine provides **deterministic, explainable, and local** practice recommendations based on actual keystroke telemetry recorded in SQLite.

In strict adherence to `AGENTS.md` and project governance:
- **Zero AI / LLM Models:** Zero Ollama, cloud, or neural network runtimes.
- **Rule-Based Explainability:** Every recommendation is backed by a visible mathematical trigger and plain-language explanation derived from actual session telemetry.
- **Closed-Loop Integration:** High-friction programming symbols seamlessly trigger targeted remediation drills in the **D6 Skill Drills Studio**.

---

## 2. Recommendation Trigger Matrix

The engine evaluates student performance against four deterministic rule sets:

| Trigger Rule ID | Diagnostic Pattern | Mathematical Threshold | Plain-Language Explanation Template | Recommended Action |
|---|---|---|---|---|
| **D7-REC-01** | **Delimiter Pairing Confusion** | Error rate on `{}` or `[]` $> 8.0\%$ with $\ge 20$ opportunities | *"Observable confusion detected between curly braces and square brackets (error rate: {err}%). Common reach drift observed on right pinky perimeter."* | Auto-generate **D6 Micro-Syntax Delimiter Drill** targeting `{}` and `[]`. |
| **D7-REC-02** | **Compound Operator Stumble** | Error rate on compound operators (`=>`, `===`, `&&`) $> 10.0\%$ | *"Compound operator sequence '{op}' exhibits an error rate of {err}%. Multi-stroke Shift coordination is interrupting typing cadence."* | Auto-generate **Operator Sequence Sprint** in `SCR-602`. |
| **D7-REC-03** | **Symbol Hesitation Lag** | $\Delta t_{sym} > 120\text{ ms}$ compared to global IKI baseline | *"Inter-keystroke interval preceding symbol '{sym}' is delayed by +{ms}ms compared to your alpha baseline, indicating visual keyboard hunting."* | Highlight symbol reach arc in **Pastel Visualizer (`F2`)**. |
| **D7-REC-04** | **Identifier Shift Asymmetry** | $WPM_{id} < 0.60 \times WPM_{kw}$ with $\ge 95\%$ accuracy | *"Typing speed on camelCase identifiers ({id_wpm} WPM) is significantly lower than keyword velocity ({kw_wpm} WPM), indicating Shift-key alternation friction."* | Recommend **CamelCase Identifier Sprints** in `SCR-602`. |
| **D7-REC-05** | **Language Syntax Imbalance** | Language track $Acc_{sym} < 92.0\%$ while prose benchmark $\ge 96.0\%$ | *"Your general typing accuracy is strong ({prose_acc}%), but {lang} syntax accuracy drops to {sym_acc}%. Targeted language syntax practice recommended."* | Recommend **Tier 1 Syntax Foundations** in that language track. |

---

### 2.1 D6 Telemetry-Window Integration Rules & Classification Gates (Correction A)

To prevent spurious recommendations on sparse data, Developer Mode enforces all 10 core D6 rolling-window telemetry rules:

1. **Intended-Key Attribution:** Every stroke is mapped to the expected character.
2. **Confusion Matrix Logging:** Incorrect strokes are upserted into `key_confusion_matrix(intended_key, actual_key, count)`.
3. **Corrected Mistakes Retained:** Mistakes corrected via `Backspace` remain permanent diagnostic events.
4. **Repeated Backspacing Invariance:** Backspacing over a character repeatedly does not multiply opportunities or errors.
5. **Auto-Indentation Zero Impact:** Auto-inserted indentation spaces emit 0 telemetry events.
6. **Manual Indentation Streaming:** In manual mode, physical spacebar strokes stream under `' '`.
7. **Cross-Session Accumulation:** Keystrokes accumulate across completed sessions in SQLite.
8. **Rolling-Window Definition:** For each target key independently, D6 evaluates the **most recent 100 eligible opportunities per key, subject to the maximum 14-calendar-day age limit**. Opportunities older than 14 days are evicted from weak-key calculations.
9. **Minimum Statistical Sample Threshold ($O_k \ge 20$):** A key must have $O_k \ge 20$ valid opportunities in its key-level rolling window before it can be assigned a diagnostic classification. Any key with $< 20$ opportunities is strictly classified as **`INSUFFICIENT_DATA`** and cannot trigger remediation drills. Sample size alone never determines classification.
10. **General Session Metric Independence:** General session WPM and accuracy metrics are fully calculated and stored for all completed sessions, completely independent of the per-key diagnostic sample gate.

#### Approved D6 Classification Thresholds
- **`MASTERED`:** $ErrRate_k \le 3.0\%$ (with $O_k \ge 20$)
- **`STABLE`:** $3.0\% < ErrRate_k \le 5.0\%$ (with $O_k \ge 20$)
- **`DEVELOPING`:** $5.0\% < ErrRate_k \le 8.0\%$ (with $O_k \ge 20$)
- **`WEAK_KEY`:** $ErrRate_k > 8.0\%$ (with $O_k \ge 20$)
- **`INSUFFICIENT_DATA`:** $O_k < 20$ (Error rate not evaluated)

#### Master Worked Classification Examples
- **EX-01 (Under Threshold):** Key `[` has 12 eligible opportunities, 3 errors $\rightarrow$ **`Insufficient Data`** (sample gate fails; error rate not evaluated).
- **EX-02 (Mastered):** Key `{` has 20 eligible opportunities, 0 errors, $0.0\%$ error rate $\rightarrow$ **`Mastered`**.
- **EX-03 (Stable):** Key `;` has 20 eligible opportunities, 1 error, $5.0\%$ error rate $\rightarrow$ **`Stable`**.
- **EX-04 (Weak Key):** Key `(` has 20 eligible opportunities, 2 errors, $10.0\%$ error rate $\rightarrow$ **`Weak`** (triggers `D7-REC-01` remediation).
- **EX-05 (Developing):** Key `&` has 100 eligible opportunities, 6 errors, $6.0\%$ error rate $\rightarrow$ **`Developing`**.
- **EX-06 (Age Expiration):** Key `>` has 5 active opportunities (45 expired past 14 days) $\rightarrow$ **`Insufficient Data`**.

---

## 3. Closed-Loop Remediation Bridge to D6

When a developer exhibits high friction on specific programming symbols, Developer Mode bridges directly into **Phase D6: Skill Drills & Remediation Studio**:

```
[Developer Mode Session Finishes (SCR-603)]
                    │
                    ▼
[Spring Boot Telemetry Batch Evaluation]
  • Identifies symbols with Error Rate > 8% & Opps >= 20.
  • Calculates Weak-Key Prioritization Index: WPI_k = ErrRate_k * ln(O_k + 1)
                    │
                    ▼
[SCR-605 Results Scorecard Displays Action Banner]
  "Weak Symbol Alert: Key '{' has WPI of 52.4. Click below to remediate."
                    │
                    ▼ [User Clicks "Remediate in D6 Studio"]
[Seamless Route to SCR-403: Drill Configuration Studio]
  • Auto-populates Target Keys: ['{', '}']
  • Auto-selects Stage 1: Isolation & Delimiters
  • Configures standard 2-minute drill
                    │
                    ▼
[User Completes Remediation in SCR-404]
  • Keystrokes stream back to key_telemetry_window.
  • WPI drops; symbol graduates to Mastered.
```

---

## 4. Deterministic Procedural PRNG Code Generator

To provide infinite, repeatable practice without relying on static snippets or AI models, Developer Mode includes an offline procedural code generator:

### 4.1 Seed Hash Derivation
$$\mathbf{Seed = \text{MurmurHash3}\left(\text{Language} \parallel \text{DifficultyTier} \parallel \text{FocusCategory} \parallel \text{Date}\right)}$$
- The 64-bit integer seed guarantees that two typists configuring the same parameters on the same date receive the **exact same code passage**, enabling competitive community challenges without cloud sync.

### 4.2 Template Expansion Grammar
The generator expands parameterized grammar templates:
```json
{
  "template": "export const {identifier} = ({param}: {type}): {returnType} => {\n  return {param}.{method}() {operator} {value};\n};",
  "dictionaries": {
    "identifier": ["filterActiveUsers", "parseConfigData", "formatCurrencyValue"],
    "param": ["item", "record", "payload", "entity"],
    "type": ["string", "number", "UserRecord", "ConfigPayload"],
    "returnType": ["boolean", "number", "string"],
    "method": ["trim", "toLowerCase", "toString", "valueOf"],
    "operator": ["===", "!==", ">=", "<="],
    "value": ["null", "0", "\"ACTIVE\"", "true"]
  }
}
```
- Operates in $< 5\text{ms}$ entirely client-side.
- Output is verified to be 100% syntactically valid in the target language.
