# D7 INFORMATION ARCHITECTURE: DEVELOPER MODE
**Typing Trainer — Windows Desktop Application**
*Module: 06. Developer Mode (The Code Studio) | Stage: Stage 2 UX Architecture & Functional Specifications*
*Document Version: 1.0.0 | Date: 2026-11-18 | Status: COMPLETE & READY FOR REVIEW*

---

## 1. Executive Summary

This document defines the information architecture, route hierarchy, screen relationships, component trees, and global state management models for **Developer Mode (Module 06)**.

All navigation integrates seamlessly into the approved desktop shell, supporting full keyboard-first traversal via `Ctrl + 5` and standard tab sequences.

---

## 2. Route Hierarchy & Site Map

```
Desktop Application Shell (Windows 11 Titlebar 36px | Collapsible Sidebar 240px | Status Bar 32px)
 └── /developer (SCR-601: Developer Mode Overview & Language Hub) [Ctrl + 5]
      ├── /developer/catalog/:lang (SCR-602: Exercise Catalog & Configurator)
      │    ├── Tab: Curated Snippets (Tiers 1–4)
      │    ├── Tab: Delimiters & Brackets
      │    ├── Tab: Operator Sequences
      │    └── Tab: Procedural Generator
      │
      ├── /developer/import (SCR-604: Custom Code Importer & Workspace)
      │    ├── Dropzone / File Picker (up to 500 KB, strict UTF-8)
      │    └── Direct Code Paste Workspace
      │
      ├── /developer/arena (SCR-603: Multi-Line Code Syntax Typing Arena)
      │    ├── 5-Line Monospace Sliding Window
      │    ├── Focus Telemetry HUD
      │    ├── Pause Overlay Modal [Esc]
      │    └── Guarded Restart Modal [F5 / Ctrl+R]
      │
      └── /developer/results (SCR-605: Developer Results & Syntax Analytics Scorecard)
           ├── Performance Overview (Net WPM, Raw WPM, Symbol Accuracy)
           ├── Syntax Category Error Breakdown Table
           ├── Multi-Line Code Mistake Diff
           ├── 4-Stage Language Mastery Gauge
           └── Direct Link to D6 Weak-Symbol Remediation Studio
```

---

## 3. Screen-by-Screen Component Hierarchy

### 3.1 SCR-601: Developer Mode Overview & Language Hub (`/developer`)
```
SCR-601: Developer Language Hub
 ├── ShellHeader (Breadcrumbs: Home / Developer Mode, Profile Pill, Daily Goal Ring)
 ├── DeveloperOverviewHero (Aggregate Code Velocity, Overall Symbol Accuracy, Total Code Lines Typed)
 ├── SixLanguageGridContainer (6 Core Cards + 1 Data Track Card)
 │    ├── LanguageCard: TypeScript (WPM, Accuracy, Lines Typed, Tier Badge 1–4, Action: "Open Studio")
 │    ├── LanguageCard: Python (WPM, Accuracy, Lines Typed, Tier Badge 1–4, Action: "Open Studio")
 │    ├── LanguageCard: Java (WPM, Accuracy, Lines Typed, Tier Badge 1–4, Action: "Open Studio")
 │    ├── LanguageCard: SQL (WPM, Accuracy, Lines Typed, Tier Badge 1–4, Action: "Open Studio")
 │    ├── LanguageCard: Rust (WPM, Accuracy, Lines Typed, Tier Badge 1–4, Action: "Open Studio")
 │    ├── LanguageCard: JavaScript (WPM, Accuracy, Lines Typed, Tier Badge 1–4, Action: "Open Studio")
 │    └── DataTrackCard: JSON (Syntax Bridge, 100% Bracket & Quote Conditioning)
 ├── QuickPracticeLaunchpad (4 Cards: Micro-Syntax Sprints, Operator Studio, Custom Import, 60s Dev Benchmark)
 └── RecentDeveloperActivityTable (Last 5 completed sessions with language, net WPM, symbol accuracy, and date)
```

### 3.2 SCR-602: Exercise Catalog & Configurator (`/developer/catalog/:lang`)
```
SCR-602: Exercise Catalog & Configurator
 ├── CatalogHeader (Active Language Indicator, Current Certification Stage, Back Button to Hub)
 ├── CategoryTabBar ([Curated Snippets] | [Delimiter Sprints] | [Operators] | [Procedural Generator])
 ├── ConfigurationSplitStage (Left Controls 540px + Right Live Preview 540px)
 │    ├── Left Controls Column:
 │    │    ├── DifficultyTierSelector (Tier 1: Foundations, Tier 2: Idiomatic, Tier 3: Production, Tier 4: Architecture)
 │    │    ├── SnippetListContainer (Scrollable list of curated snippets with complexity scores and line counts)
 │    │    ├── IndentationModeToggle ([•] Smart Auto-Advance (Default) | [ ] Full Manual Spacebar)
 │    │    └── PracticeScopeSelector (Full Snippet | 1-Min Sprint | 2-Min Benchmark)
 │    └── Right Live Preview Column:
 │         ├── SnippetMetadataCard (Title, Source License [MIT/Apache], Complexity Score, Symbol Density %)
 │         ├── SyntaxHighlightedPreviewBox (Monospace JetBrains Mono 14px preview with line numbers)
 │         └── StartDrillButton (Primary Cobalt Blue #2563EB, 48px, Auto-focused)
```

### 3.3 SCR-603: Multi-Line Code Syntax Arena (`/developer/arena`)
```
SCR-603: Multi-Line Code Syntax Arena
 ├── DeveloperFocusHUD (Active Language Tag, Net WPM, Symbol Accuracy, Line Progress: Line 3 of 12, Timer)
 ├── FiveLineMonospaceCanvasContainer (Viewport: 1100 × 320px)
 │    ├── Line 1: Previous Line Context (Dimmed 60% opacity)
 │    ├── Line 2: Immediate Line Context (Dimmed 80% opacity)
 │    ├── Line 3: Active Working Line Container (Highlighted surface, liquid caret, character feedback)
 │    │    ├── DottedIndentationGuides (┆) (Pre-advanced whitespace)
 │    │    └── SyntaxTokens (Keywords, identifiers, strings, numbers, delimiters)
 │    ├── Line 4: Upcoming Line Context (Full syntax colors, 80% opacity)
 │    └── Line 5: Subsequent Line Context (Full syntax colors, 50% opacity)
 ├── FloatingSymbolHintTooltip (Optional, toggleable via F1: [ R-Pinky: Key { ])
 ├── AuxiliaryPastelVisualizer (Optional, toggleable via F2: 65% ANSI mechanical keyboard with trajectory arcs)
 └── ArenaFooterBar ([Esc] Pause | [F1] Hints | [F2] Visualizer | [F11] Zen Mode | [F5] Restart)
```

### 3.4 SCR-604: Custom Code Importer & Workspace (`/developer/import`)
```
SCR-604: Custom Code Importer & Workspace
 ├── ImporterHeader (Title, 500 KB Constraint Badge, Strict UTF-8 Encoding Pill)
 ├── DragAndDropDropzone (Dashed Cobalt border, supported extensions: .java, .ts, .js, .py, .sql, .rs, .json, .txt, .md)
 ├── DirectPasteWorkspace (Monospace textarea for manual code pasting with line counter)
 ├── ValidationSummaryBanner (File size check, UTF-8 byte verification, empty-file check, detected language tag)
 └── ImportActionToolbar ([ Clear ] [ Open in Typing Arena (Enter) -> ])
```

### 3.5 SCR-605: Developer Results & Analytics Scorecard (`/developer/results`)
```
SCR-605: Developer Results Scorecard
 ├── ResultsHeader (Completion Status Banner, Language Tag, Performance Tier Badge)
 ├── PrimaryMetricQuartet (Net WPM, Raw WPM, Overall Accuracy %, Symbol Accuracy %)
 ├── SyntaxCategoryErrorTable (Delimiters, Operators, Punctuation, Identifiers, Keywords with error counts)
 ├── MultiLineCodeDiffCard (Full snippet rendered with red strikethrough on mistyped symbols and green on corrected)
 ├── LanguageMasteryProgressionCard (4-Stage Certification Bar with criteria checklist)
 ├── WeakSymbolRemediationBanner (Direct link: "Drill Stumbling Symbols '{' and '_' in D6 Skill Drills ->")
 └── ResultsFooterToolbar ([ View Catalog (Esc) ] [ Retake Snippet (R) ] [ Next Snippet (Enter) -> ])
```

---

## 4. Zustand Store Architecture

Developer Mode manages runtime state across three dedicated, non-overlapping Zustand stores:

### 4.1 Store 1: `useDevSessionStore` (Active Typing Engine)
```typescript
interface DevSessionState {
  // Session Configuration
  language: 'typescript' | 'python' | 'java' | 'sql' | 'rust' | 'javascript' | 'json';
  snippetId: string;
  sourceText: string;
  lines: string[];
  totalLines: number;
  indentationMode: 'AUTO_ADVANCE' | 'MANUAL';
  
  // Real-time Keystroke Tracking
  currentLineIndex: number;
  currentColIndex: number;
  userInputLines: string[];
  isSessionActive: boolean;
  isPaused: boolean;
  startTime: number | null;
  elapsedSeconds: number;
  
  // High-Frequency Performance State
  attemptedKeystrokes: number;
  correctCharacters: number;
  uncorrectedErrors: number;
  symbolOpportunities: number;
  symbolErrors: number;
  correctedMistakes: number;
  
  // Actions
  processKeyPress: (char: string) => void;
  processBackspace: () => void;
  processEnter: () => void;
  togglePause: () => void;
  resetSession: () => void;
}
```

### 4.2 Store 2: `useDevCatalogStore` (Exercise Curation & Import)
```typescript
interface DevCatalogState {
  activeLanguage: string;
  selectedCategory: 'SNIPPETS' | 'DELIMITERS' | 'OPERATORS' | 'PROCEDURAL';
  selectedTier: 1 | 2 | 3 | 4;
  customFileBuffer: string | null;
  customFileName: string | null;
  importError: string | null;
  
  setLanguage: (lang: string) => void;
  setCategory: (cat: 'SNIPPETS' | 'DELIMITERS' | 'OPERATORS' | 'PROCEDURAL') => void;
  setTier: (tier: 1 | 2 | 3 | 4) => void;
  loadCustomFile: (file: File) => Promise<void>;
  clearCustomFile: () => void;
}
```

### 4.3 Store 3: `useDevTelemetryStore` (Analytics & Progression)
```typescript
interface DevTelemetryState {
  languageProgress: Record<string, LanguageProgressRecord>;
  symbolAccuracyWindow: Record<string, { correct: number; total: number }>;
  recentDevSessions: DevSessionSummary[];
  
  commitSessionResults: (summary: DevSessionSummary) => Promise<void>;
  fetchLanguageStats: () => Promise<void>;
}
```

---

## 5. Desktop Shell Integration

- **Sidebar Anchor:** Developer Mode is permanently pinned in the main application sidebar between `Skill Drills` (Module 04) and `Typing Games` (Module 05).
- **Navigation Accelerator:** Dedicated global keyboard shortcut **`Ctrl + 5`** instantaneously routes to `/developer` (aligned with D1 sidebar order and D3 approved global navigation accelerators; `Ctrl + 6` routes to Typing Games).
- **Titlebar Integration:** Displays active language mode (e.g. `Typing Trainer — Developer Mode [TypeScript]`).
- **Status Bar Integration:** Displays current SQLite connection status, offline mode indicator, and active language line count.
