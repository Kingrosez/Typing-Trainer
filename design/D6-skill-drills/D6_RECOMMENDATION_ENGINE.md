# D6 RECOMMENDATION ENGINE & CONTENT GENERATOR SPECIFICATION
**Typing Trainer — Windows Desktop Application**
*Module: 04. Skill Drills & Remediation Studio | Screen Scope: SCR-401 to SCR-405*
*Document Version: 1.0.0 | Stage: D6 Stage 2 UX and Functional Specifications*
*Date: 2026-11-18 | Status: SPECIFICATION COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Engine Mission & Architectural Philosophy

The D6 Recommendation & Content Generation Engine transforms raw keystroke telemetry into actionable, targeted practice. In strict compliance with the project architecture:
- **Zero Cloud Dependencies:** Operates 100% offline without remote servers or external telemetry.
- **Zero Local LLM Runtime:** Operates without Ollama, PyTorch, llama.cpp, or neural weights.
- **Deterministic & Repeatable:** Given identical input parameters (target keys, stage, duration) and a seed hash, the generator produces **100% identical word streams**, ensuring test repeatability and reproducible benchmarks.

---

## 2. Weak-Key Recommendation & Prioritization Algorithm

### 2.1 The Multi-Factor Weakness Ranking
When the student enters `SCR-401` or clicks `"Drill Recommended Weak Keys"`, the engine ranks all 47 keys using the **Weak-Key Prioritization Index ($WPI$)**:

$$\mathbf{WPI_k = ErrRate_k \times \ln(O_k + 1)}$$

### 2.2 Recommendation Selection Rules:
1. **Eligibility Filter:** Only keys with $O_k \ge 20$ (Decision D6-01) and $ErrRate_k > 8.0\%$ are eligible.
2. **Top-3 Clustering:** The 3 keys with the highest $WPI$ values are automatically selected as the default remediation cluster (e.g. `P`, `B`, `;`).
3. **Finger Synergies:** If two weak keys belong to the same physical digit (e.g. `P` and `;` on the Right Pinky), the engine bundles them together into a unified finger-coordination drill.
4. **Fallback Handling (No Weak Keys Detected):**
   - If no keys exceed the $8.0\%$ error threshold, the engine evaluates the "Developing" tier ($5.0\% < ErrRate_k \le 8.0\%$).
   - If all keys are "Stable" or "Mastered" ($\le 5.0\%$), the engine recommends a **Fluency & High-Speed Bigram Drill** (`SCR-403 Mode 2`) to build raw cadence.

---

## 3. Deterministic Natural-Language Explainability Generator

To ensure diagnostics are explainable without using probabilistic LLMs, D6 uses a **deterministic rule-based template engine**. 

### 3.1 Explainability Template Engine Rules

```
+---------------------------------------------------------------------------------------------------+
| Diagnostic Condition                    | Template Output Pattern                                 |
+-----------------------------------------+---------------------------------------------------------+
| Adjacent Key Drift                      | "Target key '{Key}' error rate ({ErrRate}%) is          |
| (P(actual = adjacent) >= 50%)           |  elevated. {MiskeyPct}% of errors result from adjacent  |
|                                         |  drift into '{ActualKey}', indicating finger extension  |
|                                         |  hesitation from home anchor '{Anchor}'."               |
+-----------------------------------------+---------------------------------------------------------+
| Lateral Finger Slip                     | "Target key '{Key}' frequently slips into neighboring   |
| (P(actual = neighboring_finger) >= 40%) |  column key '{ActualKey}', indicating lateral reach     |
|                                         |  drift. Recommended: Focus on return-to-home spring."   |
+-----------------------------------------+---------------------------------------------------------+
| Hesitation Latency Elevated             | "Target key '{Key}' exhibits an average strike latency  |
| (LatencyDelta >= +60ms)                 |  of {Latency}ms (+{Delta}ms above baseline), indicating |
|                                         |  reach deceleration prior to keystroke execution."      |
+-----------------------------------------+---------------------------------------------------------+
| High Error on Low-Sample Key            | "Target key '{Key}' shows emerging friction ({ErrRate}%),|
| (20 <= Ok <= 35)                        |  observed across {Ok} strokes. Continue practice to     |
|                                         |  confirm whether reach pattern stabilizes."             |
+-----------------------------------------+---------------------------------------------------------+
```

### 3.2 Concrete Output Example:
- **Input Parameters:** Key `P`, $ErrRate = 12.4\%$, $O_P = 89$, Top Miskey = `O` (63.6%), Latency Delta = $+85\text{ms}$.
- **Generated Explainability Text:**
  > *"Target key 'P' error frequency (12.4%) is significantly higher than your 3.1% keyboard baseline. 63.6% of errors result from adjacent drift into 'O', indicating right pinky extension hesitation from home anchor 'L'. Recommended: Focus on upward reach angle without shifting the right hand off the home row."*

---

## 4. Local Deterministic Content Generation Engine

### 4.1 Local Vocabulary Corpus & Provenance
The application bundles a static, curated offline dictionary stored in the desktop application package (`assets/dictionaries/`):
- **Curated 5,000 Common English Words:** High-frequency, clean, spellchecked vocabulary.
- **Bigram & Trigram Frequency Matrix:** Top 200 common English letter pairs and triplets.
- **Corpus Provenance & Licensing:** Sourced from public-domain and permissive MIT/Creative Commons corpora (e.g. Peter Norvig's Google Web Trillion Word frequency lists and Wiktionary frequency tables), ensuring zero licensing encumbrances for commercial offline desktop distribution.
- **Zero Offensive Content:** Pre-filtered against standard profanity and offensive word blacklists.

### 4.2 Multi-Key Density Filter Algorithm
When target keys $K = \{k_1, k_2, \dots, k_m\}$ are selected (e.g. $K = \{P, B\}$):
1. **Word Index Filtering:** The engine scans the 5,000-word corpus for words containing at least one target key:
   $$WordPool = \{w \in Corpus \mid \exists k \in K \text{ such that } k \in w\}$$
2. **Density Scoring:** Words are ranked by target key density:
   $$Density(w) = \frac{\sum_{k \in K} \text{Occurrences}(k, w)}{\text{Length}(w)}$$
   - *Example:* Word `"paper"` (Length 5, two `P`s) has a density of $2/5 = 0.40$ for key `P`.
   - Word `"bubble"` (Length 6, three `B`s) has a density of $3/6 = 0.50$ for key `B`.
3. **Deterministic Pseudo-Random Shuffling (PRNG):**
   - The generator uses a linear congruential generator (LCG) or Mulberry32 PRNG initialized with a deterministic seed hash:
     $$Seed = \text{Hash}(K, \text{Stage}, \text{SessionIndex}, \text{Date})$$
   - This ensures that if a student retries the exact same drill configuration, the passage is identical, allowing controlled before-and-after comparison.

---

## 5. Curricular Progression Staging

Drills generated in `SCR-403` and executed in `SCR-404` support three progressive training stages:

```
+---------------------------------------------------------------------------------------------------+
|                                  THREE-STAGE REMEDIATION PROGRESSION                              |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [STAGE 1: Character Isolation & Cadence Pairs]                                                   |
|    - Target: Build muscle reflex and eliminate hesitation latency.                                |
|    - Pattern: High-density bigram repetitions, alternating home-anchor strokes.                   |
|    - Sample: "pop pop pool loop drop drop apply pool drop drop paper pop"                         |
|                                                                                                   |
|  [STAGE 2: Targeted Word Families (Default Stage)]                                                |
|    - Target: Integrate weak reaches into authentic vocabulary words.                              |
|    - Pattern: Words with >= 30% target key density.                                               |
|    - Sample: "paper apply public brave bubble problem probe peak subtle habit"                     |
|                                                                                                   |
|  [STAGE 3: Contextual Natural Prose]                                                              |
|    - Target: Sustain high accuracy during full sentence transcription with punctuation.           |
|    - Pattern: Syntactically valid sentences weighted heavily with target-key words.               |
|    - Sample: "The public problem became a brave probe to peak human performance."                 |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 6. Seed Hash & Verification Traceability

Every generated drill is tagged with a transparent seed identifier:
- **Format:** `#WK-{SeedNumber}-{TargetKeys}-{Stage}` (e.g. `#WK-7842-PB-S2`)
- **Display:** Rendered in `SCR-403` preview and `SCR-405` results scorecard.
- **Traceability:** Allows the student to revisit the exact same exercise to verify speed and accuracy improvement under identical text conditions.
