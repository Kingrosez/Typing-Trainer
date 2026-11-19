# CLAUDE CODE MASTER DESIGN-TO-ENGINEERING HANDOFF
**Typing Trainer — Windows Desktop Application**  
*Document Version: 1.0.0 | Stage: Complete UI/UX Design Finalization*  
*Date: 2026-11-19 | Target Audience: Software Engineering Team (Claude Code)*  
*Status: READY FOR IMPLEMENTATION (STAGE 5 CLEARANCE)*

---

## 1. Executive Summary & Implementation Mission

This document delivers the comprehensive, implementation-ready engineering handoff blueprint for **Claude Code** to develop the Typing Trainer desktop application.

It bridges all approved visual designs, Auto-Layout geometries, mathematical typing formulas, WCAG 2.2 AA accessibility requirements, and desktop security controls into an unambiguous technical implementation architecture.

### Implementation Stack Baseline
- **Desktop Shell:** Tauri 2 (Rust privileged boundary)
- **Frontend:** React 18 + TypeScript (Strict Mode) + Vite
- **Styling & UI:** Tailwind CSS + shadcn/ui (Radix UI primitives)
- **State Management:** Zustand (partitioned stores)
- **Backend:** Spring Boot 3 + Java 21 (modular monolith bound to `127.0.0.1`)
- **Persistence:** SQLite + Flyway migrations (`V1` through `V7`)
- **Offline Client Queue:** IndexedDB (`typing_sessions_outbox`)

---

## 2. Master Screen Map & Route Directory

Every screen maps directly to a frontend React route, parent module, and Figma specification:

| Screen ID | Screen Name | Route Path | Parent Module | Figma Reference / Node ID |
|---|---|---|---|---|
| **SCR-001** | Onboarding Wizard | `/onboarding` | System | Documented Layout Spec |
| **SCR-002** | Command Palette | Overlay (`Ctrl+K`) | System | Documented Layout Spec |
| **SCR-003** | Pause & Session Menu | Overlay (`Esc`) | System | Documented Layout Spec |
| **SCR-101** | Dashboard Command Center | `/dashboard` | Dashboard | Verified Live Node `15:2` |
| **SCR-201** | Test Setup & Configuration | `/test` | Typing Test | Verified Live Node (Page 3)|
| **SCR-202** | Live Typing Test Arena | `/test/active` | Typing Test | Verified Live Node `2:2` |
| **SCR-203** | Test Results & Performance | `/test/results/:id` | Typing Test | Verified Live Node `4:2` |
| **SCR-301** | Curriculum Roadmap | `/learning` | Learning Mode | Verified Live Node `5:2` |
| **SCR-302** | Lesson Briefing & Hand Intro| `/learning/lesson/:id` | Learning Mode | Documented Layout Spec |
| **SCR-303** | Interactive Drill Stage | `/learning/lesson/:id/drill` | Learning Mode | Documented Layout Spec |
| **SCR-304** | Module Mastery Assessment | `/learning/module/:id/mastery`| Learning Mode | Documented Layout Spec |
| **SCR-401** | Skill Drills Studio Hub | `/drills` | Skill Drills | Documented Layout Spec |
| **SCR-402** | Weak-Key & Stat Inspector | `/drills/weak-keys` | Skill Drills | Documented Layout Spec |
| **SCR-403** | Drill Configuration & N-Grams| `/drills/setup` | Skill Drills | Documented Layout Spec |
| **SCR-404** | Interactive Drill Arena | `/drills/active` | Skill Drills | Documented Layout Spec |
| **SCR-405** | Mastery Verification Scorecard| `/drills/results/:id` | Skill Drills | Documented Layout Spec |
| **SCR-501** | Arcade Games Hub | `/games` | Typing Games | Documented Layout Spec |
| **SCR-502** | Falling Words Defense | `/games/falling-words` | Typing Games | Documented Layout Spec |
| **SCR-503** | Time Attack Sprint | `/games/time-attack` | Typing Games | Documented Layout Spec |
| **SCR-504** | Word Scramble Decryptor | `/games/word-scramble` | Typing Games | Documented Layout Spec |
| **SCR-505** | Game Over & High Scores | `/games/results/:id` | Typing Games | Documented Layout Spec |
| **SCR-601** | Developer Mode Language Hub | `/developer` | Developer Mode| Documented Layout Spec |
| **SCR-602** | Code Practice Configurator | `/developer/setup` | Developer Mode| Documented Layout Spec |
| **SCR-603** | The Code Typing Arena | `/developer/arena` | Developer Mode| Documented Layout Spec |
| **SCR-604** | Custom Snippet Importer | `/developer/import` | Developer Mode| Documented Layout Spec |
| **SCR-605** | Syntax Analytics Scorecard | `/developer/results` | Developer Mode| Documented Layout Spec |
| **SCR-701** | Telemetry Trends & Curves | `/analytics` | Analytics | Documented Layout Spec |
| **SCR-702** | Keyboard Heatmap & Matrix | `/analytics/heatmap` | Analytics | Documented Layout Spec |
| **SCR-703** | Historical Session Explorer| `/analytics/sessions` | Analytics | Documented Layout Spec |
| **SCR-704** | Consistency & Cadence Lab | `/analytics/cadence` | Analytics | Documented Layout Spec |
| **SCR-801** | Trophy Room & Badges | `/achievements` | Achievements | Documented Layout Spec |
| **SCR-802** | XP Level Ladder & Hall | `/achievements/levels` | Achievements | Documented Layout Spec |
| **SCR-803** | Daily Streak Calendar | `/achievements/streaks` | Achievements | Documented Layout Spec |
| **SCR-901** | General Preferences | `/settings` | Settings | Documented Layout Spec |
| **SCR-902** | Typing Engine & Caret | `/settings/engine` | Settings | Documented Layout Spec |
| **SCR-903** | Keyboard & Finger Settings | `/settings/keyboard` | Settings | Documented Layout Spec |
| **SCR-904** | Appearance & Themes | `/settings/appearance` | Settings | Documented Layout Spec |
| **SCR-905** | Mechanical Audio Studio | `/settings/audio` | Settings | Documented Layout Spec |
| **SCR-906** | Local Database & Backup | `/settings/data` | Settings | Documented Layout Spec |

---

## 3. Frontend Architecture & Directory Layout

Claude Code should organize the React frontend under `desktop/src/` as follows:

```
desktop/src/
├── components/
│   ├── ui/                   # shadcn/ui primitives (button, input, dialog, card, tabs)
│   ├── shell/                # Desktop titlebar, sidebar, statusbar, command palette
│   ├── typing/               # Reusable typing stream, liquid caret, HUD indicators
│   ├── keyboard/             # 65% virtual pastel keyboard, keycaps, finger zones
│   ├── hand-guide/           # 3D anatomical hand rig, trajectory reach arcs
│   ├── charts/               # Recharts wrappers (WPM curves, error spikes, histograms)
│   └── modals/               # Pause menu, guarded restart, shortcut help
├── features/
│   ├── dashboard/            # SCR-101 widgets, goal rings, streak cards
│   ├── test/                 # SCR-201, SCR-202, SCR-203
│   ├── learning/             # SCR-301 to SCR-304
│   ├── drills/               # SCR-401 to SCR-405
│   ├── games/                # SCR-501 to SCR-505
│   ├── developer/            # SCR-601 to SCR-605 (5-line code stage, importer)
│   ├── analytics/            # SCR-701 to SCR-704 (heatmaps, session log)
│   ├── achievements/         # SCR-801 to SCR-803
│   └── settings/             # SCR-901 to SCR-906
├── stores/                   # Zustand state stores
│   ├── useShellStore.ts      # Sidebar state, active theme, audio settings
│   ├── useTypingStore.ts     # In-memory high-frequency typing engine loop
│   ├── useUserStore.ts       # XP, level, daily goal progress, streak shields
│   └── useOutboxStore.ts     # IndexedDB session sync manager
├── services/                 # API client layer (Axios/fetch to 127.0.0.1)
├── hooks/                    # Keyboard event hooks, window accelerators
├── types/                    # TypeScript interfaces & DTO contracts
└── styles/                   # globals.css, theme CSS variables
```

---

## 4. Design Tokens & Tailwind CSS Configuration

### 4.1 CSS Variables (`desktop/src/styles/globals.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Daylight Studio (Light Theme) */
    --bg-app: #F8FAFC;
    --bg-surface: #FFFFFF;
    --bg-surface-elevated: #F1F5F9;
    --bg-surface-sunken: #E2E8F0;
    --border-subtle: #E2E8F0;
    --border-medium: #CBD5E1;
    --border-strong: #94A3B8;
    --text-primary: #0F172A;
    --text-secondary: #475569;
    --text-muted: #64748B; /* 4.59:1 on #FFFFFF (WCAG AA Pass for normal text) */
    --text-muted-large: #64748B;
    --primary: #2563EB;
    --primary-hover: #1D4ED8;
    --primary-foreground: #FFFFFF;
    --accent: #0284C7;
    --success: #047857;
    --warning: #B45309;
    --destructive: #DC2626;
    --focus-ring: #0284C7;
  }

  .dark {
    /* Midnight Slate (Dark Theme) */
    --bg-app: #0B0F19;
    --bg-surface: #131B2E;
    --bg-surface-elevated: #1E293B;
    --bg-surface-sunken: #070A11;
    --border-subtle: #1E293B;
    --border-medium: #334155;
    --border-strong: #475569;
    --text-primary: #F8FAFC;
    --text-secondary: #94A3B8;
    --text-muted: #94A3B8; /* Accessible token for normal text: 6.40:1 (WCAG AA Pass) */
    --text-muted-large: #64748B; /* Restricted to large text (>= 24px) or non-text UI: 3.51:1 (WCAG AA Large Pass) */
    --primary: #2563EB;
    --primary-hover: #1D4ED8;
    --primary-foreground: #FFFFFF;
    --accent: #38BDF8;
    --success: #10B981;
    --warning: #F59E0B;
    --destructive: #EF4444;
    --focus-ring: #38BDF8;
  }
}

/*
 * WCAG 2.2 Level AA Typography Contrast Rules:
 * - Normal-Sized Text (< 24 CSS pixels regular, or < 18.67 CSS pixels bold):
 *     Requires contrast ratio >= 4.5:1.
 *     In dark mode, always use var(--text-muted) which is #94A3B8 (6.40:1, WCAG AA Pass).
 *     #64748B is STRICTLY PROHIBITED for normal-sized text on dark surfaces.
 * - Qualifying Large Text:
 *     - Regular text: at least 24 CSS pixels.
 *     - Bold text: at least approximately 18.67 CSS pixels.
 *     Requires contrast ratio >= 3.0:1.
 *     In dark mode, var(--text-muted-large) which is #64748B (3.51:1, WCAG AA Large Pass)
 *     is permitted exclusively for qualifying large text (e.g. 24px prose typing stream)
 *     and separately validated non-text UI elements (WCAG 1.4.11 >= 3.0:1).
 *     Note for CMP-28 in SCR-603: 20px regular code font is NOT large text (< 24px),
 *     so pending characters in SCR-603 must use #94A3B8 (6.40:1).
 */
```

---

## 5. Implementation Interaction Contracts

### 5.1 Real-Time Typing Engine Loop (In-Memory React State)
- **Zero Network per Stroke:** Keystrokes are captured by a hidden `<input>` element inside `useTypingStore.ts`.
- **Typing Calculation Contract:**
  $$NetWPM = \max\left(0, \frac{(N_{total} / 5) - E_{uncorrected}}{T_{minutes}}\right)$$
  - Each uncorrected error deducts $\frac{1}{T_{minutes}}\text{ WPM}$ (NOT a static 1.0 WPM).
  - Corrected mistakes incur **zero Net WPM deduction** ($E_{uncorrected} = 0$).
  - Auto-advance spaces in Developer Mode are synthetic ($N_{total}$ unmodified).
- **HUD Throttling:** Internal math updates on every stroke; visual HUD numbers update every 500ms.

### 5.2 Contextual `Tab` Key & Focus Management
```typescript
// Hook: useKeyboardTrapping.ts
export const handleTypingKeyDown = (e: KeyboardEvent, isTypingActive: boolean, isCodeStage: boolean) => {
  if (e.key === 'Tab') {
    if (isTypingActive) {
      e.preventDefault(); // Never allow Tab to escape canvas during active typing
      if (isCodeStage) handleCodeIndent();
    }
    // Outside typing stage, standard browser focus traversal occurs naturally
  }
  if (e.key === 'F5' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
    if (isTypingActive) {
      e.preventDefault();
      triggerGuardedRestart(); // Modal if t > 10s; instant if t <= 10s
    }
  }
};
```

### 5.3 Inactivity Auto-Pause & Window-Blur Guard
- **Approved Baseline:** Manual `Esc` pause is the sole approved baseline for pausing active drills.
- **Deferred Proposal:** The 15-second inactivity auto-pause proposal (`D7-NU-03`) remains **formally deferred** and must NOT be implemented in the initial launch build.
- **Window-blur auto-pause is strictly prohibited**: do NOT attach `blur` listeners that pause the session. Shifting OS focus does not pause active tests.

### 5.4 Developer Mode Launch Languages & Custom File Ingestion
- **Approved Launch Languages (6):** Java, TypeScript, JavaScript, Python, SQL, Rust. JSON is supported as a separate structured data format category. All other languages are deferred to Expansion Pack 1.
- Check file size before parsing: reject if $> 500\text{ KB}$ (`512,000 bytes`).
- Check encoding: reject non-UTF-8 binary bytes. **Do not silently strip or replace bytes.**
- Option A pagination:
  - If lines $\le 30$: create 1 part (`Part 1 of 1`).
  - If lines $> 30$: partition into sequential parts of $\le 20$ lines targeting AST boundary breaks (empty lines, function ends).

---

## 6. Local Backend API & SQLite Dependencies

### 6.1 REST Endpoints (`http://127.0.0.1:54321/api/v1`)
- `POST /sessions`: Submit completed test session (idempotent RFC 4122 v4 UUID).
- `GET /curriculum/modules`: Fetch Learning Mode roadmap and star ratings.
- `GET /drills/weak-keys`: Fetch rolling 100-stroke weak-key watchlist ($WPI$).
- `POST /developer/custom-files`: Ingest custom code file and return paginated parts.
- `GET /analytics/sessions`: Fetch paginated session history with filter parameters.

### 6.2 Database Migrations (Flyway)
- `V1__init_schema.sql`: Core users, settings, and base session tables.
- `V2__typing_test_schema.sql`: Detailed keystroke logs and benchmark records.
- `V3__dashboard_habit_schema.sql`: Streaks, streak freeze shields, daily goals.
- `V4__learning_mode_schema.sql`: 32 lessons, modules, and star certification gates.
- `V5__skill_drills_schema.sql`: Weak-key rolling buffers (14 days / 100 strokes).
- `V6__arcade_games_schema.sql`: Game scores and local leaderboards.
- `V7__developer_mode_schema.sql`: Language catalog, exercises, multi-part custom code files.

---

## 7. Verification & Testing Checklist for Claude Code

### 7.1 Frontend Unit Tests (Vitest)
- [ ] Verify dynamic uncorrected error penalty scaling across $t = 30\text{s}$, $60\text{s}$, $68\text{s}$, $120\text{s}$.
- [ ] Verify backspaced mistakes yield zero Net WPM deduction.
- [ ] Verify `Tab` key does not shift focus during active typing in `SCR-202` and `SCR-603`.
- [ ] Verify Guarded Restart confirmation modal displays if $t > 10.0\text{s}$, and resets instantly if $t \le 10.0\text{s}$.
- [ ] Verify 3-second countdown buffer resumes frozen timer on `"GO!"`.
- [ ] Verify Option A pagination bounds all parts to $\le 20$ lines for files $> 30$ lines.

### 7.2 Backend Integration Tests (JUnit 5 + MockMvc)
- [ ] Verify idempotent session submission: identical UUID + payload returns `HTTP 200 OK` without creating duplicate records.
- [ ] Verify conflicting payload for existing UUID returns `HTTP 409 Conflict`.
- [ ] Verify weak-key analysis updates the D6 rolling FIFO 100-stroke buffer upon session submission.
- [ ] Verify SQLite WAL mode and 5000ms busy timeout under simulated concurrent write load.

### 7.3 End-to-End Tests (Playwright)
- [ ] Full user journey: Onboarding $\rightarrow$ Dashboard $\rightarrow$ 60s Typing Test $\rightarrow$ Results $\rightarrow$ Dashboard (verify streak and XP increment).
- [ ] Custom code import journey: Ingest 65-line file $\rightarrow$ verify 4 parts of $\le 20$ lines $\rightarrow$ type Part 1 $\rightarrow$ verify Part 1 persisted and Part 2 unlocked.
- [ ] Offline recovery: Disconnect local backend process $\rightarrow$ complete test $\rightarrow$ verify stored in IndexedDB outbox $\rightarrow$ restart backend $\rightarrow$ verify outbox flushed to SQLite.

---

## 8. Engineering Handoff Sign-Off

- **Handoff Status:** **100% COMPLETE & APPROVED FOR STAGE 5 (CLAUDE CODE)**.
- **Architectural Boundary:** Strictly monolithic, local-first, offline desktop application.
- **Next Action:** Claude Code may commence frontend component implementation and Spring Boot service integration upon Product Owner authorization.
