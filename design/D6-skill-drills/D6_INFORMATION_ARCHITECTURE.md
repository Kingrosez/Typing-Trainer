# D6 INFORMATION ARCHITECTURE: SKILL DRILLS & REMEDIATION STUDIO
**Typing Trainer — Windows Desktop Application**
*Module: 04. Skill Drills & Remediation Studio | Screen Scope: SCR-401 to SCR-405*
*Document Version: 1.0.0 | Stage: D6 Stage 2 UX and Functional Specifications*
*Date: 2026-11-18 | Status: SPECIFICATION COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Studio Site Map & Route Hierarchy

The Skill Drills & Remediation Studio is nested as primary module **`04. Skill Drills`** within the Typing Trainer desktop application. It exposes five dedicated routes anchored under the `/drills` route namespace:

```
AppRoot (/)
  ├── 01. Dashboard (/dashboard) ────────────────────────── [SCR-101]
  ├── 02. Typing Test (/test) ───────────────────────────── [SCR-201, SCR-202, SCR-203]
  ├── 03. Learning Mode (/learning) ─────────────────────── [SCR-301, SCR-302, SCR-303, SCR-304]
  ├── 04. Skill Drills (/drills) ◄───────────────────────── [PHASE D6 SCOPE]
  │     ├── /drills (Overview Hub) ──────────────────────── [SCR-401]
  │     ├── /drills/analysis (Weak-Key Deep Lab) ────────── [SCR-402]
  │     ├── /drills/configure (Drill Personalization) ───── [SCR-403]
  │     ├── /drills/arena (Active Practice Canvas) ──────── [SCR-404]
  │     └── /drills/results (Improvement Scorecard) ─────── [SCR-405]
  ├── 05. Typing Games (/games) ─────────────────────────── [Phase D7 Scope]
  ├── 06. Developer Mode (/developer) ───────────────────── [Phase D8 Scope]
  └── 07. Analytics & History (/analytics) ──────────────── [Phase D9 Scope]
```

---

## 2. Component Hierarchy by Screen

```
====================================================================================================
SCR-401: Skill Drills Studio Overview
====================================================================================================
└── StudioOverviewPage (/drills)
    ├── StudioHeader (Title, subtitle, calibration status badge)
    ├── PrimaryStage (Width: 1100px)
    │   ├── Row 1: SkillHealthHero (Height: 140px)
    │   │   ├── MetricGauge: Overall Keyboard Skill Health % (Radial progress + precision score)
    │   │   ├── StatusBreakdown: Mastered (count), Stable (count), Developing (count), Weak (count)
    │   │   └── QuickAction: "Drill Recommended Weak Keys (Enter)" Primary CTA button
    │   ├── Row 2: DiagnosticSplitGrid (Height: 280px, 2 Columns: 540px + 540px)
    │   │   ├── Column Left: WeakKeyWatchlistCard
    │   │   │   ├── WatchlistHeader (Top 3-5 high-friction keys sorted by Weak-Key Priority Index)
    │   │   │   ├── KeyList (Key badge, error rate %, stroke count, primary confusion arrow)
    │   │   │   └── CardFooter: "Deep Key Analysis →" link to SCR-402
    │   │   └── Column Right: FingerZoneBalanceCard
    │   │       ├── BalanceHeader (Left Hand vs Right Hand summary)
    │   │       ├── DigitBarChart (L-Pinky, L-Ring, L-Mid, L-Index | R-Index, R-Mid, R-Ring, R-Pinky)
    │   │       └── DiagnosticObservationNote (Observable performance statement)
    │   ├── Row 3: RemediationTrendlineStrip (Height: 80px)
    │   │   └── SparklineGrid: 7-day rolling error rate delta for active weak keys
    │   └── Row 4: PracticeModeLaunchpad (Height: 180px, 4 Columns: 260px each)
    │       ├── ModeCard 1: Algorithmic Weak-Key Remediation (Pre-selected priority keys)
    │       ├── ModeCard 2: N-Gram & Bigram Fluency (High-frequency letter pairs)
    │       ├── ModeCard 3: Vocabulary Frequency Tiers (Top 100, 300, 1000 common words)
    │       └── ModeCard 4: Custom Text & File Import Studio (.txt, .md upload/paste)
```

```
====================================================================================================
SCR-402: Weak-Key Analysis
====================================================================================================
└── WeakKeyAnalysisPage (/drills/analysis)
    ├── AnalysisHeader (Breadcrumb "← Skill Drills", Title, Rolling Window Tag: "Last 100 Strokes/14d")
    ├── PrimaryStage (Width: 1100px)
    │   ├── TopSection: HeatmapControlsBar (Height: 48px)
    │   │   ├── MetricFilter: [ Error Rate % | Accuracy % | Hesitation Latency (ms) ]
    │   │   └── HeatmapLegend: Mastered (≤3%), Stable (3-5%), Developing (5-8%), Weak (>8%), No Data (<20)
    │   ├── MidSection: InteractiveKeyboardHeatmap (Height: 320px)
    │   │   └── ANSI65PercentKeyboard (47 active keys, real-time color fill, hover inspect tooltip)
    │   └── BottomSection: DiagnosticDetailGrid (Height: 340px, 2 Columns: 540px + 540px)
    │       ├── Column Left: KeyDiagnosticInspectorCard (Inspects currently selected/hovered key)
    │       │   ├── KeyHeader (Key glyph, responsible finger, classification tag)
    │       │   ├── TelemetryStats (Error Rate %, Total Opportunities, Corrected vs Uncorrected errors)
    │       │   ├── ConfusionMatrixTable (Top miskeys: e.g. 'P' miskeyed as 'O' (62%), ';' (25%))
    │       │   └── HesitationLatencyMetric (Target strike delay vs user baseline in ms)
    │       └── Column Right: DiagnosticExplainabilityCard
    │           ├── ObservationStatement (Observable descriptive synthesis)
    │           ├── HistoricalTrendGraph (Last 10 sessions accuracy progression)
    │           └── ActionFooter: "Configure Drill for this Key →" button routing to SCR-403
```

```
====================================================================================================
SCR-403: Drill Configuration & Personalization
====================================================================================================
└── DrillConfigurationPage (/drills/configure)
    ├── ConfigHeader (Breadcrumb "← Skill Drills", Title: "Configure Targeted Practice")
    ├── PrimaryStage (Width: 1100px)
    │   ├── TopSection: ModeTabSelector (Height: 44px)
    │   │   └── Tabs: [ Weak-Key Remediation | N-Grams & Bigrams | Vocabulary Tiers | Custom Import ]
    │   ├── SplitWorkspace (Height: 520px, 2 Columns: 540px + 540px)
    │   │   ├── Column Left: ParameterSelectionPanel
    │   │   │   ├── TargetKeyPicker (Multi-select keycaps, quick-presets: "All Weak", "Pinky Keys")
    │   │   │   ├── ExerciseProgressionStage (Stage 1: Isolation/N-Grams, Stage 2: Words, Stage 3: Prose)
    │   │   │   ├── DrillScopeControl (Duration: 1, 2, 3, 5 min OR Words: 25, 50, 100 words)
    │   │   │   ├── SyntaxToggles (Include Punctuation [ON/OFF], Include Capitalization [ON/OFF])
    │   │   │   └── CustomImportDropzone (Enabled when Custom tab active: paste area + file picker)
    │   │   └── Column Right: LivePreviewAndImpactCard
    │   │       ├── GeneratedPassagePreviewBox (Scrollable monospace preview of deterministic text)
    │   │       ├── GenerationTelemetry (Target key density %, total word count, seed hash)
    │   │       └── ProjectedMasteryImpactBadge ("Contributes toward Session 2 of 3 for Key 'P'")
    │   └── BottomActionBar (Height: 64px)
    │       ├── ResetDefaultsButton ("Reset")
    │       └── StartDrillButton ("Begin Drill Practice (Enter) →" Primary CTA #2563EB)
```

```
====================================================================================================
SCR-404: Interactive Skill Drill Arena
====================================================================================================
└── SkillDrillArenaPage (/drills/arena)
    ├── FocusHUDHeader (Height: 52px)
    │   ├── TargetBadges: [ Active Targets: P, B, ; ]
    │   ├── TargetFingerTag: [ Primary Focus: Right Pinky / Left Index ]
    │   ├── LiveMetricsStrip: [ Accuracy: 96.8% | Net WPM: 42 | Progress: 38/100 words ]
    │   └── ActionControls: [ F1 Hints | F2 Keyboard | F11 Zen | Esc Pause ]
    ├── PrimaryTypingStage (Width: 1100px, Height: 340px)
    │   ├── MonospaceTextCanvas (3-Line sliding window, JetBrains Mono 28px)
    │   │   ├── FloatingFingerHintOverlay (Glides above active caret position, toggleable)
    │   │   └── MonospaceCharacters (Sky Blue = correct, Coral Red wavy = incorrect, Slate = untyped)
    │   └── StumbleWarningIndicator (Subtle inline cue on repeated target-key misstrokes)
    ├── AuxiliaryGuidanceStage (Height: 240px, Toggleable via F2)
    │   └── MiniMechanicalKeyboard (Pastel 65% ANSI layout showing reach trajectory vectors)
    └── ArenaStatusBar (Height: 32px)
        └── HotkeyLegend (Esc = Pause, F5 = Restart, F1 = Hints, F2 = Visualizer, F11 = Zen)
```

```
====================================================================================================
SCR-405: Drill Results & Improvement Analysis
====================================================================================================
└── DrillResultsPage (/drills/results)
    ├── ResultsHeader (Status badge: "Remediation Session Complete", Celebration Shimmer)
    ├── PrimaryStage (Width: 1100px)
    │   ├── Row 1: SessionSummaryCards (Height: 110px, 4 Stat Cards)
    │   │   ├── Card 1: Net WPM (with Gross WPM subtitle)
    │   │   ├── Card 2: Session Accuracy % (Target: ≥95.0%)
    │   │   ├── Card 3: Target Key Precision % (Aggregate accuracy on drilled weak keys)
    │   │   └── Card 4: XP Earned (D3 base XP + accuracy multiplier + Option A retake tier)
    │   ├── Row 2: TargetKeyImprovementTable (Height: 260px)
    │   │   └── TableColumns: [ Key | Historical Error % | Session Error % | Delta Change | Status ]
    │   │       └── Rows: Detailed per-key before-and-after comparison with positive green deltas
    │   ├── Row 3: MultiSessionMasteryTracker (Height: 120px)
    │   │   └── KeyMasteryCards: [ Key 'P': Session 2 of 3 Clean Logged (Progress: 66%) ]
    │   └── Row 4: ResultsActionBar (Height: 64px)
    │       ├── SecondaryAction: "View Updated Heatmap (`SCR-402`)"
    │       ├── TertiaryAction: "Return to Studio (`SCR-401`)"
    │       └── PrimaryAction: "Continue Remediation Drill (Enter) →" (#2563EB)
```

---

## 3. Data Flow & Entity Interactions

```
+---------------------------------------------------------------------------------------------------+
|                                 D6 DATA LIFECYCLE & STORAGE FLOW                                  |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [D4 Typing Test] ──┐                                                                             |
|  [D5 Lessons]     ──┼──► Keystroke Event Stream                                                   |
|  [D6 Drills]      ──┘       │                                                                     |
|                             ▼                                                                     |
|                  [Error Attribution Parser]                                                       |
|                     - Compares Intended vs Actual Key                                             |
|                     - Identifies Corrected vs Uncorrected Errors                                  |
|                     - Filters Control Keys (Shift, Caps, Backspace)                               |
|                             │                                                                     |
|                             ├──► SQLite: key_telemetry_window (Rolling FIFO, max 100/key, 14d)    |
|                             ├──► SQLite: key_confusion_matrix (Pairwise miskey frequencies)       |
|                             ├──► SQLite: drill_attempts (Permanent historical session audit)      |
|                             └──► SQLite: key_mastery_tracker (3-session validation progress)       |
|                                     │                                                             |
|                                     ▼                                                             |
|                          [D6 Diagnostic Engine]                                                   |
|                             - Evaluates Key Classification (Mastered, Stable, Developing, Weak)   |
|                             - Computes Weak-Key Prioritization Index (WPI)                        |
|                             - Generates Explainability Summaries                                  |
|                             │                                                                     |
|                             ▼                                                                     |
|                   Surfaced in SCR-401, SCR-402, SCR-403                                           |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 4. State Management (Zustand Store Architecture)

D6 adheres strictly to Zustand single-store patterns for shared client-side application state:

1. **`useSkillDrillsStore` (Global D6 Store):**
   - `skillHealth`: Overall Keyboard Skill Health percentage ($0–100\%$).
   - `keyTelemetryMap`: Map of all 47 keys with classification, error rate, total opportunities, and latency.
   - `selectedKey`: Currently inspected keycap in `SCR-402`.
   - `activeConfig`: Active drill configuration (target keys, mode, duration, stage, punctuation).
   - `activePassage`: Deterministically generated text passage and seed hash.
   - `isCalibrating`: Boolean flag indicating whether $< 20$ opportunities exist for key evaluations.
2. **`useDrillSessionStore` (Ephemeral Arena Store - Local to `SCR-404`):**
   - `activeAttemptId`: UUID for the current drill run.
   - `inputBuffer`: Active characters typed in current word.
   - `caretIndex`: Zero-based character index in the drill text.
   - `sessionTimer`: Elapsed active practice milliseconds.
   - `stumbleCounter`: Map tracking consecutive misses per target key.
   - `isPaused`: Boolean toggle for pause overlay.
