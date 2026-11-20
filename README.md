# Typing Trainer

An offline-first Windows desktop application for improving typing speed, accuracy, and consistency through structured lessons, timed tests, coding practice, games, and deterministic performance analytics.

> **Status:** Active Implementation — Phase 3 (Dashboard Integration Complete). Desktop shell, Spring Boot backend process supervision, SQLite persistence, and Dashboard widgets W-01 through W-10 are fully implemented and verified.

## Product goals

- Help users progress from beginner to advanced touch typing through structured practice.
- Provide deterministic, explainable feedback on typing speed, accuracy, and difficult keys.
- Make practice engaging with achievements, streaks, and gamification rewards without cloud dependency.
- Work offline by default, keeping all user telemetry and progress locally on the workstation.
- Offer specialized typing practice for software developers.

## Target users

Beginners, students, touch-typing learners, professionals, and developers seeking to improve motor cadence, speed, and accuracy.

## Implemented Features (Phase 3 Dashboard)

### 1. Dashboard Overview (Widgets W-01 through W-10)
- **W-01 Welcome and User Status:** Personalized greeting, current level, tier rank pill, streak flame counter, and new/returning user context.
- **W-02 Daily Practice Goal:** Interactive SVG progress ring, target vs. completed practice duration, 1–120 minute target modal, and ledger-verified +150 XP bonus indicator.
- **W-03 Primary Metrics:** Best 60s WPM, trailing 30-session average WPM, overall accuracy percentage, and total practice duration.
- **W-04 Weekly Activity Chart:** 7-day practice duration bar chart with daily goal threshold indicators and today highlight.
- **W-05 WPM Trend Chart:** Trailing session Net vs. Gross WPM progression curve with error spike badges.
- **W-06 Algorithmic Weak-Key Remediation:** Deterministic D6 error analysis across 6 distinct states (`INSUFFICIENT_DATA`, `WEAK`, `DEVELOPING`, `STABLE`, `MASTERED`, `NO_RECOMMENDATIONS`).
- **W-07 Quick Practice Navigation:** Direct routing to Typing Test Arena (`Ctrl+2`), Learning Mode (`Ctrl+3`), Skill Drills (`Ctrl+4`), Developer Mode (`Ctrl+5`), and Typing Games (`Ctrl+6`).
- **W-08 Gamification Progression Hub:** Dual-gradient level crest (`#2563EB` to `#06B6D4`), level XP progress bar, remaining XP to next tier, daily streak counter, and streak freeze shield inventory (2-shield max).
- **W-09 Personal Best Showcase:** 4-card verified benchmark grid (15s Speed Sprint, featured gold 60s Official Benchmark, Dev Studio, Longest Session) displaying verified winning session accuracy and timestamps.
- **W-10 Recent Practice Sessions Table:** Semantic accessible table rendering practice mode badges, duration, net/gross speed, tiered accuracy, XP credit, and authoritative benchmark status with zero-redundancy initial mounting and on-demand pagination.

### 2. Practice Arenas
- **Typing Test Arena:** Standard benchmarks (15s, 30s, 60s, custom text) with live accuracy and WPM graphs.
- **Learning Mode:** Finger-by-finger curriculum advancing from home-row upwards.
- **Skill Drills:** Targeted bigram, pinky isolation, and punctuation drills.
- **Developer Mode:** Programming syntax practice across TypeScript, Rust, Java, and Bash snippets.
- **Typing Games:** Arcade gamified practice arenas (Meteor Descent, Ghost Typist).

## Approved Technology Stack

| Layer | Selected Technology | Responsibility |
|---|---|---|
| Desktop shell | Tauri 2 | Windows application window, native integration, lifecycle, packaging |
| Desktop native layer | Rust | Tauri commands and backend process supervision via Windows Job Objects |
| UI Framework | React + TypeScript | Reactive component model with strict TypeScript typing |
| Styling | Tailwind CSS | Modern styling system conforming to D2 design tokens |
| UI components | shadcn/ui + Lucide Icons | Accessible, keyboard-navigable component foundation |
| Frontend state | Zustand | Centralized state management for app shell, navigation, and audio |
| Backend | Spring Boot 3, Java 21 | Business services, level progression curves, analytics, and session logic |
| Persistence | SQLite 3 | Offline single-user local database stored in `%LOCALAPPDATA%\TypingTrainer` |
| Migrations | Flyway | Versioned database schema evolution |
| Charts | Recharts | SVG telemetry and trend visualizations |
| Build Tooling | Vite + Maven Wrapper | Fast frontend asset bundling and deterministic backend builds |

**Architecture principle:** The real-time typing interaction loop executes exclusively in the React frontend. Individual keystrokes are processed locally in memory. The local Spring Boot backend manages persistence, session delivery, analytics, and gamification progression. No local LLMs, Ollama, or remote telemetry transmission are utilized.

## Application Navigation

1. **Dashboard** (`Ctrl+1`)
2. **Typing Test** (`Ctrl+2`)
3. **Learning Mode** (`Ctrl+3`)
4. **Skill Drills** (`Ctrl+4`)
5. **Developer Mode** (`Ctrl+5`)
6. **Typing Games** (`Ctrl+6`)
7. **Analytics** (`Ctrl+7`)
8. **Achievements** (`Ctrl+8`)
9. **Settings** (`Ctrl+,`)

## Typing Metrics Definitions

- **Gross WPM:** $(\text{Total Typed Characters} / 5) / \text{Elapsed Minutes}$.
- **Accuracy:** $(\text{Correct Characters} / \text{Evaluated Characters}) \times 100\%$.
- **Net WPM:** $\text{Gross WPM} - (\text{Uncorrected Errors} / \text{Elapsed Minutes})$.
- **XP Progression:** Base effort XP calculated with half-up rounding, multiplied by accuracy scaling, with level progression curve $\text{round}(120 \times L^{1.35})$.

## Non-Functional Requirements

- **Offline-First:** All data stored locally in SQLite; zero cloud network dependencies.
- **Local Process Supervision:** Tauri spawns and manages Spring Boot over loopback `127.0.0.1` with per-launch `X-TypingTrainer-Request-Token`.
- **Low Overhead:** Low CPU and memory footprint with single Hikari write connection.
- **Accessibility:** Full keyboard accelerator support and high contrast dark/light themes.

## License

To be determined before public distribution.
