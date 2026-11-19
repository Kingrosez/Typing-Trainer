# OPEN DECISIONS & PRODUCT TRADE-OFFS (D1)
**Typing Trainer — Windows Desktop Application**
*Document Version: 1.0.0 | Stage: D1 Architecture*

---

## 1. Overview

This document catalogs critical product, UX, and technical trade-offs identified during the D1 UX Architecture phase. Rather than making unilateral assumptions on subjective product boundaries, these decisions are documented with clear options, pros, cons, and recommendations for formal product owner alignment.

---

## 2. Decision Log & Strategic Trade-Offs

### Decision 01: Harmonization of "Learning Mode" vs. "Exercises"
- **Context:** The initial proposal listed both *3. Learning Mode* and *4. Exercises* as top-level navigation items. In user testing and competitive analysis, having two separate tabs with similar names ("Learning" vs "Exercises") often causes cognitive confusion.
- **Options Considered:**
  - *Option A (Keep Separate):* Keep "Learning Mode" as structured sequential touch-typing curriculum and "Exercises" (renamed to "Skill Drills") as non-linear functional practice (Weak Keys, N-Grams, Vocabulary, Custom text).
  - *Option B (Consolidate into Single Module):* Combine both under a single top-level item called "Practice & Academy" with sub-tabs for "Curriculum" and "Targeted Drills".
- **Evaluation:**
  - *Option A Pros:* Gives prominence to structured pedagogical instruction for complete beginners while keeping rapid drills accessible in 1 click for experienced typists.
  - *Option B Pros:* Reduces sidebar item count from 9 to 8; consolidates all practice under one roof.
- **Architect Recommendation:** **Option A (with "Exercises" labeled as "Skill Drills")**. Beginners and experienced typists have very different intents. Beginners need an unhurried, linear curriculum; speed typists want rapid 2-minute weak-key drills without wading into lesson 1 home-row tutorials.

---

### Decision 02: Multi-Profile Support on a Single Windows Installation
- **Context:** Typing Trainer is installed on a local Windows PC. In household, classroom, or shared workstation scenarios, multiple people (e.g. siblings, parent/child) may share the same Windows login.
- **Options Considered:**
  - *Option A (Single Local Profile):* One profile per Windows user account. All local SQLite data belongs to that user. Zero account switcher UI.
  - *Option B (Local Multi-Profile Switcher):* Allow creating multiple local avatar profiles (e.g., "Alex", "Jordan") stored within the same local SQLite database with an avatar switcher in the sidebar.
- **Evaluation:**
  - *Option A Pros:* Maximum simplicity, zero profile-selection friction on launch, no profile switching logic.
  - *Option B Pros:* Crucial for families and classroom environments sharing a single computer; avoids skewing personal stats and streaks when someone else tries the app.
- **Architect Recommendation:** **Option B in Phase 2 (Design for it in D1, implement single profile first)**. The database schema should include `profile_id` on all session tables from Day 1 to avoid painful future database migrations, while defaulting to a single profile in the MVP UI.

---

### Decision 03: Mechanical Switch Audio Emulation Architecture
- **Context:** Acoustic feedback is a beloved feature for keyboard enthusiasts (simulating Cherry MX Blue clicky, Brown tactile, Red linear, or vintage IBM Model M typewriter sounds).
- **Options Considered:**
  - *Option A (Bundled High-Fidelity WAV Samples):* Pre-record authentic key actuation and release samples, triggered via Web Audio API with pitch micro-randomization ($\pm 3\%$) to eliminate machine-gun repetition effect.
  - *Option B (Pure Synthesized Oscillator Clicks):* Synthesize clean clicks mathematically using Web Audio oscillators.
  - *Option C (Silent by Default, Off):* Do not prioritize sound effects; keep app silent.
- **Evaluation:**
  - *Option A Pros:* Extremely satisfying, gaming-inspired physical tactile feel that typists love. Pitch randomization prevents auditory fatigue.
  - *Option B Pros:* Tiny file size, but sounds synthetic and hollow.
- **Architect Recommendation:** **Option A (Bundled WAV samples with pitch randomization), set to MUTED by default**. Users in office or quiet environments must not be startled by loud clicky switches on initial launch. A prominent audio toggle in the top bar allows one-click activation.

---

### Decision 04: Anti-Cheat & Accuracy Gating Strictness
- **Context:** How strictly should the system enforce accuracy when logging personal records (PBs) and achievements?
- **Options Considered:**
  - *Option A (Strict Gate: $\ge 95\%$ Accuracy Required):* Any run with $< 95\%$ accuracy is flagged as "Disqualified from Records & Leaderboards" (still logged in history, but cannot award speed trophies).
  - *Option B (Permissive: Log Raw WPM Regardless):* Allow 150 WPM with 70% accuracy to be recorded as a personal record.
- **Evaluation:**
  - *Option A Pros:* Upholds the core product philosophy of "Skill Mastery over Meaningless Grind". Prevents users from mashing random keys to unlock high WPM badges.
  - *Option B Pros:* Never disallows a user's score, but degrades the integrity of the achievement system.
- **Architect Recommendation:** **Option A (Strict Gate: $\ge 95\%$ for PBs and Trophies)**. Net WPM mathematically deducts uncorrected errors, but setting a hard accuracy gate for leaderboard badges reinforces authentic touch typing.

---

### Decision 05: Windows 11 Native Visual Material (Mica / Acrylic)
- **Context:** Windows 11 supports Mica and Acrylic material effects (subtle desktop wallpaper bleed-through in window chrome).
- **Options Considered:**
  - *Option A (Solid Obsidian/Slate Background):* `#0B0F19` solid canvas with CSS gradient accents.
  - *Option B (Tauri 2 Native Mica Translucency):* Enable native Windows 11 Mica background on the sidebar and titlebar, keeping the central typing canvas opaque solid dark.
- **Evaluation:**
  - *Option A Pros:* 100% consistent across Windows 10 and 11; zero GPU compositing overhead.
  - *Option B Pros:* Feels exquisitely native to Windows 11; elevates the app into commercial tier.
- **Architect Recommendation:** **Option B with automatic fallback to Option A**. Enable Tauri's window transparency / Mica plugin for Windows 11 systems, falling back seamlessly to solid `#0B0F19` on Windows 10 or low-power hardware.

---

### Decision 06: Automated SQLite Backup Strategy
- **Context:** If a user uninstalls the app or experiences OS disk corruption, their months of typing progress and streaks could be lost.
- **Options Considered:**
  - *Option A (Manual Export Only):* User must manually click "Export History to JSON".
  - *Option B (Automated Weekly Snapshot in AppData):* App automatically creates a rotating 4-week snapshot archive (`typing_trainer_backup_YYYY-MM-DD.sqlite`) in `AppData/Local/TypingTrainer/backups/`.
- **Evaluation:**
  - *Option A Pros:* Zero background filesystem operations.
  - *Option B Pros:* Painless disaster recovery; users can restore all progress after re-installing Windows.
- **Architect Recommendation:** **Option B (Automated rotating weekly snapshot + manual JSON export)**. Silent, lightweight, and protects user progress without external cloud reliance.

---

## 3. Product Owner Review & Sign-Off Block

The recommendations below were formally approved on 2026-11-17 (Ref: `D1_REVIEW_RESOLUTION.md`):

| Decision # | Area | Architect Recommendation | Product Owner Status |
|---|---|---|---|
| **01** | Module Organization | Keep "Learning Mode" & "Skill Drills" as separate tabs | `APPROVED` |
| **02** | Multi-Profile Support | Single profile MVP UI; multi-profile ready DB schema | `APPROVED` |
| **03** | Audio Feedback | Pre-sampled mechanical switches, muted by default | `APPROVED` |
| **04** | Record Accuracy Gate | Require $\ge 95\%$ accuracy for Personal Records & Badges | `APPROVED` |
| **05** | Windows 11 Mica | Enable Mica on Windows 11 with solid fallback on Win 10 | `APPROVED` |
| **06** | Local Backup | Automated weekly snapshot archive + manual export | `APPROVED` |
