# D7 METRICS & ANALYTICS ANALYSIS: DEVELOPER MODE
**Typing Trainer — Windows Desktop Application**
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 1 Product Discovery & Requirements Analysis*
*Document Version: 1.0.0 | Date: 2026-11-18 | Status: COMPLETE & READY FOR REVIEW*

---

## 1. Executive Summary

Typing source code involves fundamentally different cognitive and motor patterns than typing continuous natural prose. Evaluating code typing solely through conventional Net WPM can be misleading, as dense symbol punctuation, capitalization shifting, and indentation naturally compress gross typing speed by 20% to 40%.

This analysis establishes the measurement formulas, telemetry extraction rules, and diagnostic analytics for **Developer Mode**. It reuses approved D4 calculation standards while introducing specialized developer telemetry to isolate and optimize technical typing bottlenecks.

---

## 2. Reconciling Developer WPM with D4 Standards

### 2.1 The Standard D4 Net WPM Formulation
Developer Mode adheres strictly to the approved D4 calculation baseline:
$$\mathbf{WPM_{gross} = \frac{\text{Total Attempted Keystrokes} / 5}{\text{Time (minutes)}}}$$
$$\mathbf{WPM_{net} = \max\left(0, \frac{\text{Correct Characters} / 5}{\text{Time (minutes)}} - \frac{\text{Uncorrected Errors}}{\text{Time (minutes)}}\right)}$$
$$\mathbf{\text{Overall Accuracy (\%)} = \frac{\text{Correct Character Attempts}}{\text{Total Attempted Keystrokes}} \times 100\%}$$

### 2.2 The "Code WPM Gap" (Expectation Calibration)
In standard English prose, an average word consists of 5 lowercase letters followed by a space. In source code:
- Tokens are fragmented by periods, brackets, and colons (`user.address[0].getCity()`).
- Operators require multi-stroke chords (`&&`, `===`, `->`).
- Capitalization requires frequent Shift key alternation (`calculateTotalTaxAmount`).

**Calibrated Speed Expectations Table:**
| Developer Skill Tier | Prose Net WPM (D4 Benchmark) | Expected Code Net WPM (D7) | Typical Symbol Accuracy |
|---|:---:|:---:|:---:|
| **Apprentice** | 30–45 WPM | 18–28 WPM | 88.0% – 92.0% |
| **Journeyman** | 45–65 WPM | 30–45 WPM | 93.0% – 96.0% |
| **Senior Typist** | 65–85 WPM | 45–65 WPM | 96.5% – 98.5% |
| **Grandmaster** | 85–110+ WPM | 65–90+ WPM | 98.5% – 99.8% |

---

## 3. Specialized Developer Performance Metrics

To provide actionable feedback that helps programmers eliminate friction, Developer Mode disaggregates typing performance into five diagnostic metrics:

### 3.1 Metric 1: Symbol-Specific Accuracy ($Acc_{sym}$)
Measures accuracy strictly across the 32 standard programming symbols (`{`, `}`, `[`, `]`, `(`, `)`, `<`, `>`, `;`, `:`, `,`, `.`, `=`, `+`, `-`, `*`, `/`, `\`, `%`, `&`, `|`, `!`, `?`, `^`, `~`, `$`, `#`, `@`, `"`, `'`, ``` ` ```, `_`):
$$Acc_{sym} = \frac{\text{Correct Symbol Attempts}}{\text{Total Symbol Opportunities}} \times 100\%$$
- **Actionability:** Identifies whether a developer's speed ceiling is caused by general motor coordination or specific hesitation on punctuation.

### 3.2 Metric 2: Syntax Error Rate by Category
Categorizes errors into distinct syntactic buckets to identify pattern stumbling blocks:
1. **Delimiter Errors:** Mismatched or miskeyed brackets (`{}`, `[]`, `()`).
2. **Operator Errors:** Miskeyed compound symbols (`===`, `=>`, `&&`, `||`, `!=`, `->`).
3. **Punctuation Errors:** Semicolon vs. colon confusion (`;` vs `:`), period vs. comma (`,`).
4. **Identifier Shifting Errors:** Missed capitalization shifts in `camelCase` or missed underscores in `snake_case`.

### 3.3 Metric 3: Keyword Velocity vs. Identifier Velocity
- **Keyword Velocity (WPM):** Speed when typing reserved programming words (`function`, `return`, `public`, `import`, `const`, `while`). These words become fast, subconscious burst sequences.
- **Identifier Velocity (WPM):** Speed when typing arbitrary variable, class, or method names. Identifiers require visual reading and case shifting.
- **Insight:** A high gap between keyword and identifier velocity indicates visual tracking bottlenecks rather than motor limitations.

### 3.4 Metric 4: Symbol Hesitation Latency ($\Delta t_{sym}$)
Calculates the delay in milliseconds between striking an alphanumeric character and striking a subsequent symbol character:
$$\Delta t_{sym} = \overline{IKI}_{sym} - \overline{IKI}_{global}$$
- Where $\overline{IKI}_{sym}$ is the average Inter-Keystroke Interval preceding a symbol, and $\overline{IKI}_{global}$ is the typist's overall average IKI.
- **Descriptive Standard:** Strictly labelled as a descriptive timing metric in milliseconds; zero claims of physical or neurological diagnosis.

---

## 4. Closed-Loop Telemetry Integration with D6

Every keystroke generated in Developer Mode streams directly into the local SQLite telemetry schema established in Phase D6:
1. **`key_telemetry_window` Feed:**
   - When a developer strikes `O` instead of `P` while typing `public`, an error record is logged for intended target `P`.
   - When a developer strikes `]` instead of `}` while closing a code block, an error record is logged for intended target `}`.
2. **`key_confusion_matrix` Update:**
   - Pairwise miskeys on symbols (e.g. `;` miskeyed as `'`, or `(` miskeyed as `9`) increment the confusion matrix.
3. **Automated Remediation Trigger:**
   - If a developer exhibits high friction on `{` or `_` during TypeScript exercises, the D6 Weak-Key Remediation engine automatically generates targeted remediation drills in `SCR-401` and `SCR-403`.

---

## 5. Metrics to Explicitly Prohibit

To protect data integrity and avoid misleading feedback:
- ❌ **Prohibit "Lines of Code per Hour":** LoC is an engineering anti-metric; it encourages verbose, bad code.
- ❌ **Prohibit Pre-Indentation Character Credit:** Automatically skipped indentation spaces must never be counted as typed characters to artificially inflate WPM.
- ❌ **Prohibit Auto-Completion Character Counting:** If an autocompletion or template expansion were ever active, expanding 20 characters via 1 tab stroke must never be counted as 20 typed characters.
