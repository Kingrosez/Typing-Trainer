# Typing Trainer

An offline-first Windows desktop application for improving typing speed, accuracy, and consistency through structured lessons, timed tests, coding practice, games, and performance analytics.

> **Status:** Planning / requirements discussion. Features and technology choices below are proposals, not completed functionality.

## Product goals

- Help users progress from beginner to advanced touch typing.
- Provide accurate, actionable feedback on typing speed, accuracy, and difficult keys.
- Make practice engaging with challenges, achievements, and configurable experiences.
- Work offline by default, keeping user progress locally.
- Offer specialized typing practice for developers.

## Target users

Beginners, students, professionals, developers, and anyone seeking to improve typing proficiency. The final target audience is to be confirmed.

## Proposed features

### 1. Dashboard

- Daily practice overview and goals
- Recent sessions, personal bests, and streaks
- Quick access to tests and lessons

### 2. Typing tests

- Preset durations: 15, 30, 60, and 120 seconds
- Custom duration and practice text
- Live WPM, accuracy, error count, and progress
- Highlight correct and incorrect characters
- Session summary and history

### 3. Learning mode

- Beginner-to-advanced lesson progression
- Home-row, finger-placement, and individual-key exercises
- Adaptive lessons based on commonly missed keys
- Optional visual keyboard and finger guidance

### 4. Typing games and challenges

- Word challenge, time attack, and falling words
- Accuracy-focused challenges
- Achievements, milestones, and personal records

### 5. Developer typing mode

- Practice Java, JavaScript/TypeScript, Python, SQL, JSON, and terminal commands
- Syntax-focused exercises with punctuation and symbols
- User-provided code snippets

### 6. Analytics

- WPM and accuracy trends over time
- Session history and personal bests
- Weak-key and error-frequency analysis
- Daily and weekly progress reports

### 7. Customization

- Light and dark themes
- Font, color, and sound preferences
- Keyboard layout options
- Custom text import (TXT)

### 8. Optional AI coach

- Personalized practice recommendations
- Adaptive difficulty and lesson suggestions
- Potential local Ollama integration
- Core typing functionality must not depend on AI

## Proposed technology stack

| Layer | Candidate technology |
| --- | --- |
| Desktop runtime | Tauri 2 |
| UI | React + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Frontend build | Vite |
| Local persistence | SQLite |
| Desktop commands | Rust / Tauri commands |
| Charts | Recharts |
| State management | Zustand |
| Optional AI | Local Ollama |

**Architecture principle:** Keep timing, scoring, and keystroke analysis deterministic. AI may recommend lessons but should not be responsible for calculating typing metrics.

## Proposed application navigation

1. Dashboard
2. Typing Test
3. Learning
4. Typing Games
5. Developer Mode
6. Analytics
7. Achievements
8. Settings

## Typing metrics (initial definitions)

- **Gross WPM:** Typed characters / 5 / elapsed minutes.
- **Accuracy:** Correctly typed characters / evaluated characters × 100.
- **Net WPM:** To be finalized along with error and correction handling.
- **Error tracking:** Record incorrect keystrokes and aggregate error frequency per key.

These definitions require validation for backspaces, corrected errors, incomplete words, and Unicode input before implementation.

## Suggested development roadmap

### Phase 1: Foundation and MVP

- Set up Tauri, React, TypeScript, and styling
- Build desktop navigation and basic settings
- Implement timed typing tests and reliable scoring
- Display test results and persist sessions in SQLite

### Phase 2: Learning and insights

- Structured lessons and progression
- Weak-key analysis
- Analytics dashboard and history

### Phase 3: Engagement

- Typing games and challenges
- Achievements and streaks
- Themes, sounds, and customization

### Phase 4: Developer mode and optional AI

- Code-oriented typing exercises
- Custom content import
- Optional local AI recommendations

### Phase 5: Quality and distribution

- Automated tests for scoring and timing
- Accessibility and keyboard-only navigation
- Performance profiling
- Windows installer and release packaging

## Non-functional requirements

- Offline-first and local data storage
- Responsive keystroke handling and accurate timers
- Low CPU and memory overhead
- Keyboard-accessible UI
- Graceful recovery from interrupted sessions
- No telemetry or cloud sync without explicit user consent

## Open product decisions

The following must be confirmed before the implementation plan is finalized:

- [ ] Personal-only or public distribution
- [ ] Target skill levels
- [ ] Structured lessons, free tests, or both
- [ ] Visual direction: premium, gaming, minimal, or robot/AI-themed
- [ ] AI: local, cloud, optional, or none
- [ ] Supported keyboard layouts and languages
- [ ] Exact scoring rules for mistakes and corrections
- [ ] Whether profiles, accounts, or cloud sync are required

## Current status

This README is the initial product specification. No application code or working features are included yet.

## License

To be determined before public distribution.
