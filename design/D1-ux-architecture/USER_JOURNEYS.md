# USER JOURNEYS (D1)
**Typing Trainer — Windows Desktop Application**
*Document Version: 1.0.0 | Stage: D1 Architecture*

---

## 1. Overview of Core User Journeys

This document defines the 12 foundational end-to-end user journeys for Typing Trainer. Each journey maps the cognitive flow, decision nodes, edge cases, and post-conditions to ensure flawless desktop interaction.

---

## 2. Journey 1: First Application Launch

- **Trigger:** User installs the application and runs Typing Trainer for the very first time.
- **User Goal:** Launch the app, confirm it works offline, and land into a friendly initial setup without confusion.

```mermaid
flowchart TD
    Start([User Launches Application]) --> TauriInit[Tauri 2 Native Window Created]
    TauriInit --> CheckDB{Local SQLite DB Exists?}
    
    CheckDB -- No --> CreateDB[Initialize Local SQLite Schema via Flyway]
    CheckDB -- Yes --> CheckProfile{User Profile Exists?}
    
    CreateDB --> CheckProfile
    CheckProfile -- No --> RouteOnboard[Redirect to SCR-001: Onboarding Wizard]
    CheckProfile -- Yes --> RouteDash[Redirect to SCR-101: Dashboard]

    RouteOnboard --> EndOnboard([Begin Onboarding Flow])
    RouteDash --> EndDash([User Lands on Active Dashboard])
```

- **Key Decision Points:** Detecting whether the database exists in the local Windows AppData directory without requiring user admin privileges.
- **Edge Cases:** If SQLite database lock or file permission issue occurs, display friendly local troubleshooting card explaining folder permissions.
- **Post-Condition:** SQLite database initialized, window size maximized or restored to 1440x900.

---

## 3. Journey 2: Initial Onboarding

- **Trigger:** User enters `SCR-001` following first launch.
- **User Goal:** Set up primary preferences (keyboard layout, typing skill level, daily practice goal) and establish baseline WPM.

```mermaid
flowchart TD
    StartOnboard([SCR-001 Onboarding Opens]) --> Step1[Step 1: Detect Keyboard Layout\ne.g. QWERTY US]
    Step1 --> UserConfirmLayout{Layout Correct?}
    UserConfirmLayout -- No --> ChangeLayout[Select Layout from Dropdown]
    UserConfirmLayout -- Yes --> Step2[Step 2: Self-Assessed Skill Level]
    ChangeLayout --> Step2
    
    Step2 --> SelectLevel[Select: Novice / Intermediate / Advanced / Developer]
    SelectLevel --> Step3[Step 3: Daily Practice Target]
    Step3 --> SetGoal[Set Daily Goal Slider: e.g. 15 Minutes / Day]
    
    SetGoal --> OptionalTest{Take Quick 30s\nBenchmark Test?}
    OptionalTest -- Yes --> RunBenchmark[Launch 30s Benchmark Test]
    RunBenchmark --> CalculateBaseline[Compute Initial Baseline WPM & Accuracy]
    CalculateBaseline --> CreateProfile[Save Local Profile to SQLite]
    
    OptionalTest -- No / Skip --> SetDefaultBaseline[Assign Default Level 1 Baseline]
    SetDefaultBaseline --> CreateProfile
    
    CreateProfile --> WelcomeToast[Surface 'Profile Configured' Celebration]
    WelcomeToast --> RouteHome[Navigate to SCR-101: Dashboard]
```

- **Key Decision Points:** Allowing the user to skip the benchmark test immediately if they want to explore first.
- **Post-Condition:** Profile stored locally with initial baseline metrics; daily streak initialized to Day 1.

---

## 4. Journey 3: Starting a Typing Test

- **Trigger:** User clicks "Typing Test" on the sidebar or presses `Ctrl + 2`.
- **User Goal:** Configure and immediately start a timed or word-count typing test with zero friction.

```mermaid
flowchart TD
    EnterTest([Navigate to SCR-201: Typing Test]) --> FocusCanvas[Focus Typing Canvas Automatically]
    FocusCanvas --> ShowPresets[Display Mode Bar: Time / Words / Quote / Zen]
    
    ShowPresets --> UserAction{User Action}
    UserAction -- Change Duration --> ClickDuration[Select 15s / 30s / 60s / 120s]
    UserAction -- Toggle Extras --> TogglePunctuation[Toggle Punctuation / Numbers]
    UserAction -- Start Immediately --> TypeKey[Type First Character]
    
    ClickDuration --> WaitFirstKey[Canvas Primed with New Passage]
    TogglePunctuation --> WaitFirstKey
    WaitFirstKey --> TypeKey
    
    TypeKey --> StartTimer[Timer Starts Instantly on First Stroke]
    StartTimer --> TransitionArena[Transition to SCR-202: Live Arena]
    TransitionArena --> SoftDim[Dim Peripheral Navigation to 20% Opacity]
```

- **Key Decision Points:** Timer **must not start** on page load; it starts strictly upon the first valid keypress.
- **Post-Condition:** Test status changes to `RUNNING`; peripheral UI softly dimmed.

---

## 5. Journey 4: Completing a Typing Test

- **Trigger:** Timer hits `0:00` or the final word of the passage is typed.
- **User Goal:** Experience clean, non-jarring session termination and instant score computation.

```mermaid
flowchart TD
    ActiveTyping([Active Typing in SCR-202]) --> TerminateEvent{Termination Condition}
    TerminateEvent -- Timer Expires --> StopTimer[Freeze Timer at 0:00]
    TerminateEvent -- Last Word Typed --> StopWord[Stop Timer on Final Keystroke]
    
    StopTimer --> LockCanvas[Lock Keystroke Input Canvas]
    StopWord --> LockCanvas
    
    LockCanvas --> ComputeMetrics[Compute Net WPM, Raw WPM, Accuracy, Consistency]
    ComputeMetrics --> CheckPB{Is Personal Best?}
    
    CheckPB -- Yes --> SetPBFlag[Set New PB Flag & Badge]
    CheckPB -- No --> CalcXP[Calculate XP Earned Based on Accuracy Multiplier]
    SetPBFlag --> CalcXP
    
    CalcXP --> AsyncPersist[Asynchronously Write Session Record to SQLite]
    AsyncPersist --> RestoreUI[Restore Peripheral UI Opacity to 100%]
    RestoreUI --> RouteResults[Navigate Instantly to SCR-203: Results Screen]
```

- **Key Decision Points:** Input lock prevents stray keystrokes from skewing accuracy after timer expires.
- **Post-Condition:** Session persisted to local SQLite; results rendered in $< 16\text{ ms}$.

---

## 6. Journey 5: Reviewing Test Results

- **Trigger:** User lands on `SCR-203` after completing a test.
- **User Goal:** Understand performance, inspect missed keys, and take the next recommended action.

```mermaid
flowchart TD
    EnterResults([SCR-203: Results Screen]) --> RenderHero[Render Hero Metrics: Net WPM & Accuracy %]
    RenderHero --> RenderChart[Render Second-by-Second Speed & Error Curve]
    RenderChart --> RenderWeakKeys[Render Weak-Key Reach Analysis Cards]
    
    RenderWeakKeys --> UserDecision{Next User Decision}
    UserDecision -- Tab + Enter --> InstantRestart[Generate Fresh Passage & Start New Test]
    UserDecision -- Drill Weak Keys --> RouteWeakDrill[Route to SCR-402 with Filtered Bad Keys]
    UserDecision -- Save / Share Card --> ExportPNG[Render PNG Certificate / Copy to Clipboard]
    UserDecision -- Return Home --> RouteDashboard[Navigate to SCR-101: Dashboard]

    InstantRestart --> SCR201([SCR-201: Typing Test])
    RouteWeakDrill --> SCR402([SCR-402: Weak-Key Drill])
    RouteDashboard --> SCR101([SCR-101: Dashboard])
```

- **Key Decision Points:** `Tab + Enter` shortcut prominent for power typists who want continuous drills.
- **Post-Condition:** User either loops back into a fresh test or transitions to targeted practice.

---

## 7. Journey 6: Starting a Learning Lesson

- **Trigger:** User selects "Learning Mode" (`Ctrl + 3`) from the sidebar.
- **User Goal:** Advance through the structured touch-typing curriculum step-by-step.

```mermaid
flowchart TD
    EnterLearn([Navigate to SCR-301: Curriculum]) --> ShowRoadmap[Render 4 Modules & 32 Lessons]
    ShowRoadmap --> HighlightActive[Highlight Next Unlocked Lesson Card]
    
    HighlightActive --> ClickLesson[Select Lesson: e.g. Lesson 06 'R & U Reaches']
    ClickLesson --> OpenBriefing[Open SCR-302: Lesson Briefing & Finger Intro]
    
    OpenBriefing --> ShowErgonomics[Display Assigned Fingers & Tactile Guide]
    ShowErgonomics --> PressSpace[User Presses Space to Begin Drill]
    
    PressSpace --> OpenStage[Open SCR-303: Interactive Drill Stage]
    OpenStage --> ShowKbdGuide[Render Visual Keyboard with Finger Zones]
    ShowKbdGuide --> UserTypes[User Types Lesson Character Sequence]
```

- **Key Decision Points:** Lessons enforce linear progression; future modules remain locked until prerequisite module mastery test is passed.
- **Post-Condition:** Lesson active state initialized; visual keyboard finger guide locked to target keys.

---

## 8. Journey 7: Practising Weak Keys

- **Trigger:** User clicks "Drill Weak Keys" from Results (`SCR-203`) or selects "Weak-Key Remediation" in Skill Drills (`SCR-402`).
- **User Goal:** Eliminate muscle memory friction on high-error characters.

```mermaid
flowchart TD
    EnterDrill([Navigate to SCR-402: Weak-Key Remediation]) --> QueryErrors[Query Local SQLite Keystroke Error Matrix]
    QueryErrors --> IdentifyKeys[Identify Top 3-5 Problem Keys: e.g. P, B, Q]
    
    IdentifyKeys --> GenerateText[Algorithmic Generator Produces N-Gram Drill Text\ne.g. 'pop bob pub pop bob pub']
    GenerateText --> DisplayPreview[Display Targeted Keys & Practice Preview]
    
    DisplayPreview --> StartDrill[User Types Exercise]
    StartDrill --> RealtimeCheck[Real-time Keystroke Error Evaluation]
    RealtimeCheck --> CompleteDrill[Drill Finished]
    
    CompleteDrill --> CompareStats[Compute Error Reduction: e.g. 'P errors down by 60%']
    CompareStats --> UpdateMatrix[Update Local SQLite Error Matrix]
    UpdateMatrix --> ShowFeedback[Display Remediation Success Card]
```

- **Key Decision Points:** Dynamic drill text generation is 100% deterministic, running purely client-side without internet.
- **Post-Condition:** User's keystroke error matrix updated; error severity on target keys reduced.

---

## 9. Journey 8: Playing a Typing Game

- **Trigger:** User selects "Typing Games" (`Ctrl + 5`) from sidebar.
- **User Goal:** Test burst speed, reactive reflexes, and peripheral word reading in a gaming format.

```mermaid
flowchart TD
    EnterGames([Navigate to SCR-501: Arcade Hub]) --> SelectGame[Choose Game: Falling Words]
    SelectGame --> SelectDifficulty[Select Difficulty: Normal / Hard / Insane]
    SelectDifficulty --> LaunchArena[Open SCR-502: Falling Words Arena]
    
    LaunchArena --> Countdown[3... 2... 1... START!]
    Countdown --> SpawnWords[Words Descend from Top of Canvas]
    
    SpawnWords --> UserTypeWord[User Types Target Word + Space]
    UserTypeWord --> CheckHit{Word Matched Before Floor?}
    
    CheckHit -- Yes --> DetonateWord[Explode Word + Increment Combo Multiplier]
    DetonateWord --> AddScore[Add XP & Points]
    
    CheckHit -- No --> ShieldDamage[Deduct Shield Integrity by 20%]
    ShieldDamage --> CheckShield{Shield > 0%?}
    
    CheckShield -- Yes --> SpawnWords
    CheckShield -- No --> GameOver[Trigger Game Over State]
    
    GameOver --> RouteOver[Navigate to SCR-505: Game Over & High Scores]
    RouteOver --> CheckHighScore{New Local High Score?}
    CheckHighScore -- Yes --> RecordBadge[Save to Local High Score Table]
    CheckHighScore -- No --> PlayAgain[Offer 'Play Again' / 'Arcade Hub']
```

- **Key Decision Points:** Games reward combo accuracy; frantically typing wrong words breaks combos and incurs penalty.
- **Post-Condition:** Game score saved to local leaderboards; arcade XP awarded.

---

## 10. Journey 9: Practising Programming Syntax

- **Trigger:** User selects "Developer Mode" (`Ctrl + 6`) from sidebar.
- **User Goal:** Build muscle memory for programming language tokens, brackets, indentation, and symbols.

```mermaid
flowchart TD
    EnterDev([Navigate to SCR-601: Developer Hub]) --> SelectLang[Select Language: TypeScript]
    SelectLang --> SelectSnippetLevel[Select: Standard Idiomatic Snippets]
    SelectSnippetLevel --> OpenStage[Open SCR-602: Code Syntax Stage]
    
    OpenStage --> RenderCode[Render Monospace Code Block with Syntax Colors]
    RenderCode --> SetCaret[Place Caret at Line 1, Column 1]
    
    SetCaret --> UserTypesCode[User Types Code Token: e.g. 'interface User {']
    UserTypesCode --> CheckEnter{User Hits Enter on Line End?}
    
    CheckEnter -- Yes --> AutoIndent[Auto-Advance Indentation to Next Line Depth]
    CheckEnter -- No --> AdvanceCol[Advance Column by 1]
    
    AutoIndent --> NextToken[Wait for Next Character]
    AdvanceCol --> NextToken
    
    NextToken --> FinishBlock[Code Block Fully Typed]
    FinishBlock --> CalcDevStats[Compute Symbol Accuracy & Syntax WPM]
    CalcDevStats --> ShowDevSummary[Display Dev Mode Performance Card]
```

- **Key Decision Points:** Indentation auto-advance: Users should not have to manually press spacebar 4 times for indentation; the engine auto-aligns indentation when `Enter` is struck, matching real IDE ergonomics.
- **Post-Condition:** Developer typing telemetry logged; symbol accuracy profile updated.

---

## 11. Journey 10: Reviewing Typing Analytics

- **Trigger:** User selects "Analytics" (`Ctrl + 7`) from sidebar.
- **User Goal:** Inspect historical progression, identify plateau causes, and review the keyboard error heatmap.

```mermaid
flowchart TD
    EnterAnalytics([Navigate to SCR-701: Analytics]) --> LoadData[Query Historical Sessions from SQLite]
    LoadData --> RenderTrend[Render 30-Day WPM & Accuracy Trend Curve]
    
    RenderTrend --> UserClickTab{User Selects Sub-Tab}
    UserClickTab -- Heatmap --> OpenHeatmap[Open SCR-702: Interactive Keyboard Heatmap]
    UserClickTab -- Session Log --> OpenLog[Open SCR-703: Session Log Table]
    UserClickTab -- Cadence --> OpenCadence[Open SCR-704: Consistency Analysis]
    
    OpenHeatmap --> ClickKey[User Clicks Specific Keycap: e.g. 'Q']
    ClickKey --> ShowDrawer[Open Detail Drawer: Total Hits, Error Rate, Slowest Reach]
    
    OpenLog --> FilterRows[Filter Sessions by Date Range or Mode]
    FilterRows --> ClickSession[Click Row to Inspect Historical Scorecard]
```

- **Key Decision Points:** Heatmap clearly distinguishes between *slow keys* (latency) and *missed keys* (accuracy).
- **Post-Condition:** User gains diagnostic insight into typing habits.

---

## 12. Journey 11: Unlocking Achievements

- **Trigger:** User achieves a milestone (e.g., completes 100th test or breaks 100 WPM with $\ge 98\%$ accuracy).
- **User Goal:** Receive gratifying, non-disruptive feedback and inspect unlocked badge in the trophy cabinet.

```mermaid
flowchart TD
    MidTest([User Types During Test or Lesson]) --> ThresholdCrossed[User Hits Milestone: 'Centurion 100 Tests']
    ThresholdCrossed --> QueueEvent[Silently Queue Event in App State]
    
    QueueEvent --> CompleteSession[Session Naturally Completes]
    CompleteSession --> LoadResults[SCR-203 Results Screen Loads]
    
    LoadResults --> UnfurlToast[Unfurl Achievement Toast Banner with Sound Effect]
    UnfurlToast --> ClickToast{User Clicks Toast?}
    
    ClickToast -- Yes --> RouteTrophy[Navigate to SCR-801: Trophy Room]
    ClickToast -- No / Dismiss --> KeepResults[Stay on Results Screen]
    
    RouteTrophy --> HighlightBadge[Highlight Glowing Unlocked Trophy]
    HighlightBadge --> ClaimXP[Add Trophy Bonus XP to User Level]
```

- **Key Decision Points:** Achievement alerts are strictly **queued** and unfurled after session completion to avoid breaking flow.
- **Post-Condition:** Achievement marked `UNLOCKED` in SQLite; bonus XP credited.

---

## 13. Journey 12: Changing Settings and Themes

- **Trigger:** User clicks "Settings" (`Ctrl + 9`) or uses shortcut `Ctrl + Shift + T` / `Ctrl + Shift + M`.
- **User Goal:** Personalize themes, caret styling, sound effects, and verify local data backup.

```mermaid
flowchart TD
    EnterSettings([Navigate to SCR-901: Settings]) --> SelectCategory{Select Settings Tab}
    
    SelectCategory -- Appearance --> OpenThemes[SCR-904: Visual Themes & Fonts]
    SelectCategory -- Audio --> OpenAudio[SCR-905: Mechanical Sound Studio]
    SelectCategory -- Engine --> OpenEngine[SCR-902: Caret & Typing Engine]
    SelectCategory -- Data --> OpenData[SCR-906: Local Database & Backup]
    
    OpenThemes --> ChangeTheme[Switch to Warm Studio Light or Dark Slate]
    ChangeTheme --> InstantDOMUpdate[Tailwind Theme Class Toggled Instantly]
    
    OpenAudio --> SelectSwitch[Select Switch Sound: Cherry MX Blue Clicky]
    SelectSwitch --> TestAudio[Click 'Test Keystroke Audio' Button]
    
    OpenData --> ClickExport[Click 'Export Full History as JSON']
    ClickExport --> TauriNativeDialog[Tauri Native Windows Save File Dialog]
    TauriNativeDialog --> SaveJSON[Write Encrypted / Plain JSON to User Disk]
    
    InstantDOMUpdate --> PersistPref[Save Preferences to Local SQLite Settings Store]
    TestAudio --> PersistPref
    SaveJSON --> PersistPref
```

- **Key Decision Points:** Theme transitions occur instantly without requiring an application reload.
- **Post-Condition:** Local preference table updated; all desktop views immediately reflect new styling.
