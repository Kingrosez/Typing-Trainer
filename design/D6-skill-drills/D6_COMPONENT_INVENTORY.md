# D6 COMPONENT INVENTORY: SKILL DRILLS & REMEDIATION STUDIO
**Typing Trainer — Windows Desktop Application**
*Module: 04. Skill Drills & Remediation Studio | Screen Scope: SCR-401 to SCR-405*
*Document Version: 1.0.0 | Stage: Stage 3 Visual Design & Figma Frame Creation*
*Date: 2026-11-18 | Status: COMPLETE & VERIFIED*

---

## 1. Executive Summary

This document catalogues the comprehensive component inventory created for **Phase D6: Skill Drills & Weak-Key Remediation Studio**. All components strictly adhere to the approved D2 Design System, 4px layout grid, atomic design principles, and WCAG 2.2 AA accessibility requirements.

---

## 2. Component Taxonomy & Atomic Classification

```
┌────────────────────────────────────────────────────────────────────────┐
│                        D6 COMPONENT HIERARCHY                          │
├────────────────────────────────────────────────────────────────────────┤
│ ATOMS:                                                                 │
│  • KeyPerformanceCell (Keycap with classification border & error %)    │
│  • WPIIndicator (Numeric prioritization badge)                         │
│  • StatusBadge (Mastered, Stable, Developing, Weak, Calibrating)      │
│  • TargetKeyPill (Interactive toggleable character token)              │
│  • LatencyDeltaPill (Descriptive timing interval delta in ms)          │
│                                                                        │
│ MOLECULES:                                                             │
│  • WeakKeyRecommendationCard (Single key remediation tile with CTA)    │
│  • FingerZoneBar (Horizontal accuracy comparison meter)                │
│  • ConfusionMatrixRow (Intended -> Actual miskey vector)               │
│  • DurationOptionPill (Time/word duration button with mastery note)    │
│  • TargetKeyProgressHUD (Live count & progress bar)                    │
│  • MasterySessionCapsule (1 of 3 verification step indicator)          │
│  • FloatingFingerHint (Ergonomic digit guidance tooltip)               │
│                                                                        │
│ ORGANISMS:                                                             │
│  • KeyboardSkillHealthCard (Radial gauge + tier distribution summary)   │
│  • KeyPerformanceHeatmap (Interactive 65% ANSI keyboard grid)          │
│  • KeyInspectorDrawer (Detailed diagnostic breakdown & explainability) │
│  • DrillConfigurationPanel (Multi-mode setup suite with live preview)  │
│  • CustomTextImportDropzone (500 KB file upload & sanitization widget) │
│  • DrillArenaHUD (Live accuracy, WPM, and target opportunity counter)  │
│  • ActiveTypingCanvas (3-line monospace sliding window + caret)        │
│  • PastelKeyboardVisualizer (Mechanical keyboard + hand trajectory)    │
│  • TargetImprovementTable (Before-vs-after accuracy comparison)        │
│  • MultiSessionMasteryTracker (3-session graduation lifecycle gauge)   │
│  • InsufficientDataCard (Calibration guidance for <20 samples)        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Component Specifications

### 3.1 Atoms

#### 1. `KeyPerformanceCell`
- **Category:** Atom | **Component ID:** `D6-ATOM-01`
- **Description:** An interactive 40 × 40px keyboard keycap that visualizes the performance classification of an individual key.
- **Props:**
  - `keyChar: string` (e.g. `"P"`)
  - `errorRate: number | null` (e.g. `12.4`)
  - `opportunityCount: number` (e.g. `89`)
  - `classification: 'MASTERED' | 'STABLE' | 'DEVELOPING' | 'WEAK' | 'CALIBRATING'`
  - `isSelected: boolean`
- **Visual Styling:**
  - Border radius: 6px.
  - Dark Mode: Surface `#1E293B`, border tinted by classification:
    - Mastered: `#10B981` (1.5px)
    - Stable: `#06B6D4` (1.5px)
    - Developing: `#F59E0B` (1.5px)
    - Weak: `#EF4444` (2px)
    - Calibrating: `#64748B` (1px dashed)
  - Light Mode: Surface `#FFFFFF`, border `#E2E8F0`, classification colored top indicator strip.
- **States:** `Default`, `Hover` (scale 1.05 + 1px elevation shadow), `Selected` (Cobalt Blue ring `#2563EB` 2px), `Focused` (3px outline).

#### 2. `WPIIndicator`
- **Category:** Atom | **Component ID:** `D6-ATOM-02`
- **Description:** Formatted badge presenting the Weak-Key Prioritization Index ($WPI = ErrRate \times \ln(O + 1)$).
- **Props:**
  - `score: number` (e.g. `55.61`)
  - `size: 'sm' | 'md' | 'lg'`
- **Visual Styling:**
  - Font: `JetBrains Mono`, tabular figures, bold.
  - Background: `rgba(239, 68, 68, 0.12)`, text `#EF4444` (Dark) / `#DC2626` (Light).
  - ARIA: `aria-label="Weak-Key Prioritization Index: 55.61"`.

#### 3. `LatencyDeltaPill`
- **Category:** Atom | **Component ID:** `D6-ATOM-03`
- **Description:** Descriptive timing indicator showing observed hesitation delta in milliseconds compared to keyboard baseline.
- **Props:**
  - `deltaMs: number` (e.g. `+118`)
- **Visual Styling:**
  - Font: `JetBrains Mono 12px`.
  - Icon: Clock symbol (`⏱`).
  - Label: `"+118 ms (Descriptive Timing)"`.
  - Non-Clinical Note: Tooltip clarifies: *"Observed delay in keypress interval; descriptive measurement only."*

---

### 3.2 Molecules

#### 4. `WeakKeyRecommendationCard`
- **Category:** Molecule | **Component ID:** `D6-MOL-01`
- **Description:** Priority remediation card in `SCR-401` recommending a specific weak key with performance stats and a 1-click drill launcher.
- **Props:**
  - `targetKey: string`
  - `errorRate: number`
  - `opportunityCount: number`
  - `wpi: number`
  - `primaryMiskey: { key: string, percent: number }`
  - `onLaunchDrill: () => void`
- **Visual Styling:**
  - Dimensions: 344px width × 140px height, auto-layout vertical, padding 16px.
  - Surface: `#131B2E` (Dark) / `#FFFFFF` (Light), border `#1E293B`.
  - Content: Header with large key badge (`[P]`), error rate (`12.4%`), miskey summary (`"Common miskey: O (62%)"`).
  - Action Button: Secondary button `"Drill Key P"`, auto-focused on keyboard navigation.

#### 5. `ConfusionMatrixRow`
- **Category:** Molecule | **Component ID:** `D6-MOL-02`
- **Description:** Single row in the pairwise confusion matrix showing intended key vs actual key entered.
- **Props:**
  - `intendedKey: string`
  - `actualKey: string`
  - `frequency: number`
  - `percentage: number`
  - `reachDirection: string` (e.g. `"Lateral Outward Drift"`)
- **Visual Styling:**
  - Columns: Keycap token `P` $\rightarrow$ Keycap token `O`, progress bar showing percentage, count pill, reach direction label.

#### 6. `FloatingFingerHint`
- **Category:** Molecule | **Component ID:** `D6-MOL-03`
- **Description:** Floating ergonomic guidance pill rendered 12px directly above the active character in `SCR-404`.
- **Props:**
  - `fingerName: string` (e.g. `"Right Pinky"`)
  - `keyChar: string` (e.g. `"P"`)
  - `homeKey: string` (e.g. `";"`)
- **Visual Styling:**
  - Pill container: Dark `#1E293B` with `#38BDF8` cyan border.
  - Text: `[ R-Pinky: Key P ]` with arrow pointing downward toward caret.
  - Shortcut toggle: `F1` toggles visibility.

---

### 3.3 Organisms

#### 7. `KeyboardSkillHealthCard`
- **Category:** Organism | **Component ID:** `D6-ORG-01`
- **Description:** Hero card in `SCR-401` integrating an SVG radial accuracy gauge, classification tier distribution breakdown, and direct 1-click weak-key drill CTA.
- **Props:**
  - `overallAccuracy: number`
  - `tierCounts: { mastered: number, stable: number, developing: number, weak: number, calibrating: number }`
  - `recommendedKeys: string[]`
- **Accessibility:**
  - Container `role="region"` with `aria-label="Keyboard Skill Health Summary"`.
  - Radial gauge provides descriptive text alternative: *"Overall keyboard accuracy is 94.8% across 47 active keys."*

#### 8. `KeyPerformanceHeatmap`
- **Category:** Organism | **Component ID:** `D6-ORG-02`
- **Description:** Complete interactive 65% ANSI physical keyboard layout mapping all 68 keys to their performance classification.
- **Props:**
  - `keyDataMap: Record<string, KeyMetrics>`
  - `selectedKey: string | null`
  - `onSelectKey: (key: string) => void`
- **Keyboard Navigation:**
  - Full arrow-key grid navigation across rows and columns.
  - `Enter` or `Space` selects key for deep inspection in drawer.
  - Visible focus ring: 3px solid `#2563EB`.

#### 9. `KeyInspectorDrawer`
- **Category:** Organism | **Component ID:** `D6-ORG-03`
- **Description:** Right-side detailed inspection panel in `SCR-402` presenting comprehensive diagnostic metrics, confusion analysis, and plain-language explainability synthesis.
- **Props:**
  - `keyDetails: KeyDiagnosticDetail`
  - `onStartDrill: (key: string) => void`
- **Sections:**
  1. Selected Keycap Hero
  2. Telemetry Statistics (Opportunities, Errors, Corrected %, Uncorrected %)
  3. Pairwise Confusion Top 3
  4. Descriptive Hesitation Delta
  5. Explainability Synthesis Box
  6. Primary Action CTA (`#2563EB`)

#### 10. `CustomTextImportDropzone`
- **Category:** Organism | **Component ID:** `D6-ORG-04`
- **Description:** Dedicated file upload and text import widget in `SCR-403` supporting drag-and-drop, local file browsing, and raw text pasting up to 500 KB.
- **Props:**
  - `onFileLoaded: (text: string, filename: string) => void`
  - `onError: (errorMsg: string) => void`
- **Constraints & Error Handling:**
  - File ceiling: 500 KB (enforced prior to buffer parsing).
  - Supported extensions: `.txt`, `.md`.
  - Strict UTF-8 validation: invalid UTF-8 files rejected with actionable error; invalid bytes never silently stripped.
  - Empty files rejected with alert.

#### 11. `ActiveTypingCanvas`
- **Category:** Organism | **Component ID:** `D6-ORG-05`
- **Description:** High-performance 3-line monospace sliding typing canvas in `SCR-404` with liquid caret gliding and color-coded character feedback.
- **Props:**
  - `passageText: string`
  - `userInput: string`
  - `targetKeys: string[]`
  - `caretPosition: number`
- **Features:**
  - Smooth auto-scrolling line transitions.
  - Strict position-evaluated error attribution.
  - Multi-word backspace support.

#### 12. `MultiSessionMasteryTracker`
- **Category:** Organism | **Component ID:** `D6-ORG-06`
- **Description:** Progress scorecard in `SCR-405` tracking graduation toward the 3-session mastery threshold ($\ge 30$ target opportunities and $\le 3.0\%$ error rate).
- **Props:**
  - `targetKey: string`
  - `qualifiedSessionCount: number` (0, 1, 2, or 3)
  - `sessionHistory: QualifyingSession[]`
- **Visual States:**
  - `Progress`: Shows 1/3 or 2/3 completed steps with pending step indicator.
  - `Mastered`: Displays gold celebration trophy with neutral mastery graduation presentation (no duplicate milestone XP).
  - `Non-Qualifying`: Clearly explains why a session did not qualify (e.g. `< 30 strokes` or `> 3% error`).

---

## 4. Reusable Component States Matrix

| Component | Default | Hover | Focus | Active | Disabled | Error / Empty |
|---|---|---|---|---|---|---|
| `KeyPerformanceCell` | Border colored by tier | Subtle elevation scale | 3px `#2563EB` ring | Depressed state | Muted opacity | Dashed border (Calibrating) |
| `WeakKeyRecommendationCard` | Surface container | `#1E293B` background | Focus outline | Inset shadow | N/A | Educational zero state |
| `DurationOptionPill` | Slate outline | Blue tint fill | 2px focus ring | Cobalt Blue solid fill | 50% opacity | Warning icon if < 30 strokes |
| `CustomTextImportDropzone` | Dashed border | Highlighted blue border | Focus outline | Dragging overlay | Dimmed | Red error banner (> 500 KB) |
| `ActiveTypingCanvas` | 3-line monospace | N/A | Focus ring hidden | Liquid caret moving | Locked on pause | Red wavy underline on errors |
| `MasterySessionCapsule` | Grey outline | N/A | N/A | Emerald fill (`✓`) | N/A | Orange reset alert if streak broke |

---

## 5. Token Bindings Summary

All components are strictly bound to Figma Semantic Tokens:
- **Surfaces:** `color/semantic/bg-surface` (`#131B2E` / `#FFFFFF`)
- **Borders:** `color/semantic/border-subtle` (`#1E293B` / `#E2E8F0`)
- **Primary Buttons:** `color/semantic/brand-primary` (`#2563EB`)
- **Typography:** `typography/font-ui` (`Inter`) and `typography/font-mono` (`JetBrains Mono`)
- **Corner Radii:** `radius-sm` (4px), `radius-md` (6px), `radius-lg` (8px), `radius-xl` (12px)
