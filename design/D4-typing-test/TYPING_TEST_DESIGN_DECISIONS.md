# TYPING TEST DESIGN DECISIONS & TRADE-OFFS (D4)
**Typing Trainer — Windows Desktop Application**
*Screen IDs: SCR-201, SCR-202, SCR-203 | Target Resolution: 1440 × 900*
*Document Version: 1.0.0 | Stage: D4 Typing Test Arena Design*
*Date: 2026-11-17 | Status: D4 DESIGN COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Governance & Standard Alignment

### Decision 01: Standardized 5-Character Word Equivalency
- **Context:** Deciding how "words per minute" should be counted (literal word tokens vs. fixed character intervals).
- **Decision:** Adopt the universal scientific standard: **$1\text{ Word} \equiv 5\text{ Keystrokes}$** (including letters, spaces, numbers, and punctuation).
- **Rationale:** Literal English words fluctuate wildly in length (e.g. `is` vs `synchronization`). Measuring by literal words produces erratic, non-reproducible speed spikes. The 5-keystroke standard guarantees cross-test comparability and fairness.

---

### Decision 02: Net WPM Error Penalty & Zero-Floor Rule
- **Context:** Deciding how mistakes penalize the user's official speed benchmark.
- **Decision:** Each uncorrected error left at test completion subtracts **1 standardized word** ($5\text{ keystrokes}$) from the total gross word count:
  $$NetWPM = \max\left(0, \frac{(TotalKeystrokes / 5) - UncorrectedErrors}{ElapsedMinutes}\right)$$
- **Rationale:** Prevents reckless key mashing. Typing 120 WPM with 20 errors is unusable in real life. Penalizing uncorrected errors enforces deliberate touch-typing accuracy. The zero-floor rule guarantees Net WPM can never be negative.

---

### Decision 03: Peripheral Dimming During Active Typing
- **Context:** Deciding whether the navigation sidebar, titlebar, and status bar remain fully visible during active typing.
- **Decision:** Peripheral chrome automatically softens to **20% opacity** when active typing commences (`SCR-202`), returning to 100% on pause, test completion, or mouse hover.
- **Rationale:** High-speed typing requires intense visual concentration. Dimming peripheral elements eliminates peripheral optical distraction while maintaining seamless context without abrupt full-screen modal switches.

---

### Decision 04: 3-Line Vertical Smooth-Scroll vs. Single-Line Conveyor
- **Context:** Choosing the text stream viewing window geometry.
- **Decision:** Implement a **3-line vertical window** where active typing occurs on Line 2 (center), with a 180ms smooth translateY scroll when advancing to Line 3.
- **Rationale:** Single-line horizontal conveyor belts create motion sickness and prevent natural reading ahead (parafoveal lookahead). Multi-page blocks cause jarring full-page reflows when reaching the bottom. The 3-line centered window keeps the typist's vertical eye position completely stationary.

---

### Decision 05: Throttled HUD Refresh Cadence (500ms)
- **Context:** Deciding how often live WPM and Accuracy numerals update during an active test.
- **Decision:** Internal engine computes metrics on every stroke, but the visual HUD numerals update strictly at **500ms intervals** with smooth interpolation.
- **Rationale:** Updating digits 10 to 15 times a second creates rapid visual strobing that draws the user's foveal gaze away from the text stream. A 500ms cadence provides reassuring feedback without distraction.

---

### Decision 06: Pure Frontend Keystroke Loop & In-Flight Memory Isolation
- **Context:** Establishing the boundary between the React typing engine and the Spring Boot/SQLite backend.
- **Decision:** All active keystroke capture, character evaluation, and real-time metric calculations run strictly in-memory (React / Zustand local store). The local Spring Boot backend receives only the completed, immutable session payload via REST (`POST /api/v1/sessions`).
- **Rationale:** Guarantees 0 ms input latency. Sending HTTP REST requests for individual keystrokes would introduce network jitter, OS thread contention, and risk severe UI freezing.

---

### Decision 07: Realistic Error Recovery & IndexedDB Offline Queueing
- **Context:** Defining data recovery behavior during database write contention (`SQLITE_BUSY`) or child process restarts.
- **Decision:**
  - *In-Flight Sessions:* Held in volatile memory; if an unrecoverable hard crash occurs *during* a test, in-flight strokes are safely discarded to prevent corrupted records.
  - *Completed Sessions:* Finalized payloads are buffered in the webview's **IndexedDB offline queue** if the backend is temporarily unreachable, retrying with exponential backoff and automatically flushing on next app launch.
- **Rationale:** Provides an honest, robust recovery mechanism without making technically inaccurate claims of 100% crash survival for uncommitted in-memory strokes.

---

### Decision 08: Acceptance of Figma Starter Plan 3-Page Architecture
- **Context:** The authenticated Figma workspace operates under Starter plan constraints (3 pages, rate-limited tool calls).
- **Decision:** Screen templates for `SCR-201`, `SCR-202`, and `SCR-203` are organized within Page 3 (`🖥 03. Desktop Flows & Screen Templates`), referencing foundational master components on Page 1 and Page 2.
- **Rationale:** Fully respects platform boundaries while delivering complete visual and spatial source-of-truth master frames for engineering.

---

### Decision 09: Backspace Accounting in WPM and Accuracy
- **Context:** Clarifying whether pressing Backspace adds keystrokes to WPM or alters total attempted character inputs ($N_{total}$).
- **Decision:** Backspace is strictly an editing/buffer manipulation key. It **does not increment $N_{total}$** and **does not count towards Gross WPM or Net WPM**. It allows the typist to convert an Uncorrected Error into a Corrected Mistake, avoiding the 5-stroke word penalty. However, the initial mistake remains logged in $N_{incorrect}$ and in key diagnostics, reducing overall Accuracy %.
- **Rationale:** Aligns with standard touch-typing ergonomics and eliminates artificial WPM inflation from backspace spam.

---

### Decision 10: Robust Consistency Metric (Filtered Coefficient of Variation)
- **Context:** Ensuring consistency scores are not distorted by natural pauses, hesitations, or short tests.
- **Decision:** Calculated via $100 - (CV \times 100)$ with strict constraints: requires minimum 10 valid IKI samples ($N_{IKI} \ge 10$); strictly excludes intervals spanning pause events; filters out outliers where $IKI > 2,000\text{ ms}$ or $IKI > 3 \times \text{median}(IKI)$; clamped within $[0, 100]$ and rounded to the nearest integer.
- **Rationale:** Produces an honest, stable measure of metronomic rhythm without penalizing users for sneezing or brief pauses.

---

### Decision 11: Explicit Modifier Precedence over Difficulty Presets
- **Context:** Resolving conflicts when users select a difficulty preset and then toggle optional modifiers.
- **Decision:** Difficulty presets establish baseline word length and default toggle states. Any subsequent manual toggle of an optional modifier (Punctuation, Numbers, Capitalization) takes explicit precedence. The UI displays the effective configuration dynamically (e.g. `Beginner • Custom Modifiers`).
- **Rationale:** Eliminates ambiguity and gives users total control over test parameters.

---

### Decision 12: Keyboard Shortcut Collision Resolution (F8 and F5)
- **Context:** `Shift + H` conflicted with typing capital 'H'; `Tab + Enter` interfered with standard accessibility focus navigation.
- **Decision:** Zen Mode HUD toggle moved to **`F8`** or **`Ctrl + Shift + H`**; Quick Restart moved to **`F5`** or **`Ctrl + R`** (with confirmation if $> 10\text{s}$ elapsed); `Tab` remains dedicated to accessibility focus traversal.
- **Rationale:** Prevents keystroke capture collisions during active typing while preserving WCAG keyboard accessibility.

---

### Decision 13: 3-Second Unpause Buffer & PB Pause Integrity
- **Context:** Preventing lost reaction time upon resuming a paused test, and preventing memorization exploits on official benchmarks.
- **Decision:** Resuming from pause initiates a 3-second countdown (`3... 2... 1... GO!`) with the timer frozen; timer resumes on "GO!"; official 60s benchmark runs permit a maximum of 2 pauses and $\le 60\text{s}$ total pause duration before losing PB eligibility.
- **Rationale:** Eliminates startle latency upon unpausing while ensuring the integrity of official Personal Best records.
