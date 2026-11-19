# TEST CONFIGURATION SPECIFICATION (SCR-201)
**Typing Trainer — Windows Desktop Application**
*Screen ID: SCR-201 | Route: /test | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D4 Typing Test Arena Design*
*Date: 2026-11-17 | Status: D4 DESIGN COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Screen Overview & Purpose

**`SCR-201: Typing Test Configuration`** allows the user to configure and validate all benchmark parameters before initiating an active typing test. It serves as a calm, structured setup stage that prepares the typist psychologically while ensuring that the generated test text aligns with their specific practice goals.

The interface emphasizes clarity, rapid configuration via keyboard or mouse, explicit explanations of all difficulty parameters, and an immediate visual summary of the active configuration.

---

## 2. Information Architecture & Layout (1440 × 900)

The configuration screen resides within the standard desktop shell (36px custom titlebar, 240px sidebar, 32px status bar) and uses a centered **`920px` card container** within the 1100px main stage.

```
+-------------------------------------------------------------------------------+
| TITLEBAR: Windows Chrome • [⌨] Typing Trainer • Offline-Ready [●] • [Ctrl+K]  |
+-------------------+-----------------------------------------------------------+
| SIDEBAR (240px)   | MAIN STAGE: Centered Configuration Container (920px)      |
|                   |                                                           |
| [📊] Dashboard    | [ ← Return to Dashboard (Ctrl+1) ]                        |
| [⚡] Typing Test  |                                                           |
|      (ACTIVE)     | # Configure Your Typing Test                              |
| [🎓] Learning     | Customize duration, vocabulary, and difficulty parameters |
| [🎯] Drills       |                                                           |
| [💻] Developer    | --------------------------------------------------------- |
| [🎮] Games        | 01. TEST DURATION                                         |
|                   | [ 15s Sprint ] [ 30s Short ] [● 60s Benchmark] [ 120s ]   |
|                   | [ Custom Duration: [  60  ] Seconds (10 - 300s) ]         |
|                   |                                                           |
|                   | 02. TEXT CORPUS SOURCE                                    |
|                   | [● Common Words] [ Sentences ] [ Random ] [ Code/Dev ]    |
|                   | [ Custom Text Import (.txt / Paste) ]                     |
|                   |                                                           |
|                   | 03. DIFFICULTY TIER                                       |
|                   | [ Beginner ] [● Intermediate ] [ Advanced ] [ Expert ]    |
|                   | > Active: 3-8 char lemmas, capitalized sentences, commas  |
|                   |                                                           |
|                   | 04. ADDITIONAL MODIFIERS                                  |
|                   | [X] Include Punctuation  [ ] Include Numbers              |
|                   | [X] Include Capitalization  Language: [ English (US) ▾ ]  |
|                   |                                                           |
|                   | --------------------------------------------------------- |
|                   | ACTIVE SELECTION: 60s Standard • Common Words • Inter     |
|                   |                                                           |
|                   | [ CANCEL ]             [ START TYPING TEST (Enter) → ]    |
+-------------------+-----------------------------------------------------------+
| STATUS BAR: [Enter] Start Test | [Tab] Navigate | [Ctrl+1] Dashboard          |
+-------------------------------------------------------------------------------+
```

---

## 3. Configuration Parameter Specifications

### 3.1 Test Duration (Time Domain)

The user selects from 4 standardized duration presets or defines a custom duration:

| Duration Option | Duration (Seconds) | Benchmark Status | Intended Training Purpose |
|---|---|---|---|
| **15s Sprint** | 15.0s | Unofficial Sprint | High-burst speed warm-up; rapid finger activation. |
| **30s Short** | 30.0s | Standard Short | Quick skill check; rhythm and cadence drill. |
| **60s Standard** | 60.0s | **Official PB Benchmark** | The universal international touch-typing standard; eligible for official Personal Best records. |
| **120s Endurance**| 120.0s | Endurance Benchmark | Stamina building; finger fatigue resistance and error drift evaluation. |
| **Custom Duration**| 10s to 300s | Custom Practice | Specialized practice sessions; configured via numeric input stepper. |

- **Default Selection:** **60s Standard** (highlighted with an illuminated blue border and badge).
- **Official PB Eligibility Notice:** When 60s is selected, an amber trophy icon appears: `"🏆 Eligible for official All-Time Personal Best records (requires ≥ 95% accuracy)"`.

---

### 3.2 Text Corpus Source

Typing Trainer provides 5 distinct text sources derived strictly from local corpora:

1. **Common English Words (Default):**
   - Derived from the 1,000 most frequent English language lemmas.
   - Generates natural, fluid touch-typing rhythm without archaic or obscure words.
2. **Sentences & Paragraphs:**
   - Cohesive multi-sentence prose passages extracted from classic literature and historical speeches.
   - Emphasizes contextual reading, punctuation flow, and phrase chunking.
3. **Random Practice Text:**
   - Statistically balanced, pseudo-random character and word sequences engineered to exercise all 8 finger reach zones evenly.
4. **Programming & Technical Syntax:**
   - Real-world multi-line code snippets in TypeScript, Java, Python, and Rust.
   - Exercises curly braces `{ }`, brackets `[ ]`, arrows `=>`, semicolons `;`, camelCase, and snake_case.
5. **Custom Text Import:**
   - Allows users to paste their own text or import a local `.txt` file via a secure native file dialog.
   - Text is validated and stripped of non-printable or unsupported unicode characters.

---

### 3.3 Rigorous Difficulty Tier Definitions

To avoid arbitrary labels, each difficulty tier modifies concrete linguistic and mechanical variables:

```
+---------------------------------------------------------------------------------------------+
|                                DIFFICULTY MATRIX SPECIFICATION                              |
+--------------+------------------+-----------------------+------------------+----------------+
| Parameter    | Beginner         | Intermediate (Default)| Advanced         | Expert         |
+--------------+------------------+-----------------------+------------------+----------------+
| Word Length  | 2 to 5 chars     | 3 to 8 chars          | 4 to 12 chars    | 4 to 16 chars  |
| Casing       | 100% lowercase   | Sentence capitalization| Mixed proper nouns| Inverted/Camel |
| Punctuation  | None (pure alpha)| Periods & commas      | ; : " ' - — ( )  | All + Brackets |
| Numbers      | None             | None (unless toggled) | Years, stats     | Mixed Alphanum |
| Vocabulary   | Top 200 lemmas   | Top 1,000 lemmas      | Top 5,000 lemmas | Technical & Code|
| Ergonomics   | Home & near rows | Diagonal reaches      | Full keyboard    | Symbol reaches |
+--------------+------------------+-----------------------+------------------+----------------+
```

- **Beginner Tier:**
  - *Linguistic Model:* Words like `the`, `and`, `for`, `hat`, `desk`, `flag`.
  - *Ergonomic Purpose:* Builds confident home-row tactile anchoring and simple single-row reaches without finger contortion.
- **Intermediate Tier (Default):**
  - *Linguistic Model:* Words like `standard`, `progress`, `computer`, `practice`. Capital letters at the start of sentences; commas and periods.
  - *Ergonomic Purpose:* Natural English typing cadence, exercising standard Shift-key coordination.
- **Advanced Tier:**
  - *Linguistic Model:* Words like `architecture`, `synchronous`, `furthermore`. Rich punctuation including semicolons, hyphens, and quotation marks; occasional numbers (`1984`, `42%`).
  - *Ergonomic Purpose:* Demands precise pinky extension to the upper number row and right-side symbol keys.
- **Expert Tier:**
  - *Linguistic Model:* Highly technical prose and pseudo-code: `JSON.parse()`, `async/await`, `i <= buffer.length - 1;`.
  - *Ergonomic Purpose:* Maximum mechanical challenge; tests rapid alternation between alphanumeric keys and complex symbol clusters.

---

### 3.4 Additional Configuration Toggles & Precedence Hierarchy

#### 3.4.1 Conflict Resolution & Precedence Rule
To eliminate ambiguity when users adjust both difficulty presets and modifier toggles:
1. **Difficulty Presets as Baseline Templates:** Selecting a difficulty preset (Beginner, Intermediate, Advanced, Expert) establishes the foundational word length and vocabulary pool, and sets default values for all modifier toggles:
   - *Beginner:* Sets Punctuation = `OFF`, Numbers = `OFF`, Capitalization = `OFF`.
   - *Intermediate (Default):* Sets Punctuation = `ON`, Numbers = `OFF`, Capitalization = `ON`.
   - *Advanced:* Sets Punctuation = `ON`, Numbers = `ON`, Capitalization = `ON`.
   - *Expert:* Sets Punctuation = `ON`, Numbers = `ON`, Capitalization = `ON` (+ syntax brackets).
2. **Explicit Modifier Precedence:** User interaction with any modifier toggle **explicitly overrides the preset's default state**.
   - *Example:* If a user selects **Beginner** (short words, lowercase) and subsequently checks **"Include Punctuation"**, the engine preserves Beginner vocabulary (short 2–5 letter words) but injects punctuation marks into the generated text stream.
3. **Transparent UI State Communication:**
   - The preset pill reflects the override by displaying a subtle badge: `[ Beginner • Custom ]`.
   - The **Active Selection Summary Pill** immediately updates to state the exact effective test configuration:
     > *"EFFECTIVE CONFIGURATION: Beginner Words (2-5 chars) • Punctuation Enabled • Lowercase"*
   - The user has complete visual confirmation of the effective corpus parameters before launching the test.

#### 3.4.2 Modifier Toggle Matrix

| Toggle Control | Default State (Intermediate) | Visual Affordance | Behavioral Impact When Toggled |
|---|---|---|---|
| **Include Punctuation** | `ON` | Checkbox toggle pill | Injects commas, periods, quotation marks, and question marks into corpus regardless of baseline difficulty. |
| **Include Numbers** | `OFF` | Checkbox toggle pill | Weaves cardinal numbers, dates, and percentages into the passage stream. |
| **Include Capitalization**| `ON` | Checkbox toggle pill | Enforces strict Shift-key capitalization on sentence starters and proper nouns. |
| **Language Selection** | `English (US)` | Custom dropdown menu | Selects localized word lemma dictionary: `English (US)` or `English (UK)`. |

---

## 4. Component States & Styling Rules

### 4.1 Preset Selection Pills (Segmented Controls)
- **Container:** Flex container with 8px gap, padded 4px, background `#0F172A` (Dark) / `#F1F5F9` (Light).
- **Unselected State:**
  - Background: Transparent; Border: 1px solid transparent; Text: `#94A3B8` (Dark) / `#64748B` (Light).
  - Hover: Background `rgba(255, 255, 255, 0.05)` (Dark) / `rgba(0, 0, 0, 0.04)` (Light); Text: `#F8FAFC` / `#0F172A`.
- **Selected State:**
  - Background: `#1E293B` (Dark) / `#FFFFFF` (Light); Border: 1.5px solid `#2563EB`; Shadow: `0 2px 8px rgba(37, 99, 235, 0.25)`.
  - Text: Bold `#FFFFFF` (Dark) / `#0F172A` (Light).
- **Focus State:**
  - Standard accessible outline: **2px solid `#2563EB`** with **2px offset**.

### 4.2 Primary Call to Action: "Start Typing Test"
- **Dimensions:** Width `260px`, Height `48px`, `rounded-lg` (8px).
- **Styling:**
  - Background: Standardized **`#2563EB` (Cobalt Blue)**.
  - Text: **`#FFFFFF` (Bold 15px)** $\rightarrow$ Verified **5.17:1** contrast ratio.
  - Icon: Rightward arrow glyph (`→`) with 6px left margin.
  - Keyboard Accelerator Tag: Subtle badge reading `[ Enter ]` on the right edge.
- **Hover:** Background shifts to `#1D4ED8` (Dark Cobalt); slight upward translation (`translateY(-1px)`).
- **Active Press:** Background `#1E40AF`; `translateY(1px)`.
- **Disabled State:** If custom text is selected but empty, background `#334155` with `#64748B` text (`cursor: not-allowed`).

---

## 5. First-Time User Guidance & Onboarding

For users opening the Typing Test for the first time ($N = 0$):
1. **Recommended Benchmark Banner:** A subtle informational card at the top states:
   > *"💡 Recommended for your first test: Standard 60-Second Benchmark on Common Words. This establishes your verified starting baseline Net WPM and accuracy."*
2. **Pre-Configured Defaults:** 60s Duration, Common Words, Intermediate Difficulty, Punctuation ON, Numbers OFF.
3. **One-Key Launch:** Typing `Enter` immediately launches the test without requiring any mouse clicks.

---

## 6. Configuration Validation & Error Handling

| Scenario | Validation Trigger | Visual & Assistive Feedback | Recovery Action |
|---|---|---|---|
| **Custom Duration Too Short** | Value entered $< 10\text{ seconds}$ | Input border turns Coral Red (`#EF4444`); helper text: *"Minimum test duration is 10 seconds."* | Auto-clamps to 10s on blur. |
| **Custom Duration Too Long** | Value entered $> 300\text{ seconds}$ | Input border turns Coral Red (`#EF4444`); helper text: *"Maximum test duration is 300 seconds (5 minutes)."* | Auto-clamps to 300s on blur. |
| **Empty Custom Text** | User clicks "Start Test" with empty text area | Red error toast: *"Please paste text or import a file before starting."* | Focus auto-moves to text area. |
| **Unsupported Characters** | Text contains non-ASCII or obscure emoji | Yellow notice: *"8 unsupported characters were automatically replaced with standard spaces."* | Cleaned preview displayed. |

---

## 7. Keyboard Navigation Sequence (SCR-201)

- `Tab`: Cycles sequentially: Return Link $\rightarrow$ Duration Pills $\rightarrow$ Corpus Tabs $\rightarrow$ Difficulty Pills $\rightarrow$ Toggles $\rightarrow$ Start Button.
- `Arrow Left / Right`: Navigates between pills within the focused group (e.g. switching from 30s to 60s).
- `Space`: Toggles active checkbox modifiers (Punctuation, Numbers, Capitalization).
- `Enter`: When focused on "Start Typing Test", immediately launches `SCR-202`.
- `Ctrl + 1`: Cancels setup and returns cleanly to Dashboard (`SCR-101`).
