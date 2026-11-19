# D6 ENGINEERING READINESS & IMPLEMENTATION HANDOFF REPORT
**Typing Trainer — Windows Desktop Application**
*Module: 04. Skill Drills & Remediation Studio | Screen Scope: SCR-401 to SCR-405*
*Document Version: 1.0.0 | Stage: Stage 4 Design Audit & Engineering Verification*
*Date: 2026-11-18 | Status: COMPLETE & READY FOR CLAUDE CODE*

---

## 1. Executive Summary

This report establishes the engineering contract, runtime architecture, data schemas, calculation algorithms, and implementation guidelines for **Claude Code** to implement **Phase D6: Skill Drills & Weak-Key Remediation Studio**.

All specifications strictly honor the approved project governance:
- Modular desktop architecture (Tauri 2, React, TypeScript, Tailwind CSS, Zustand, Spring Boot 3, Java 21, SQLite).
- Strict local-first operation; zero cloud telemetry; zero external LLM or AI model runtimes.
- Real-time typing loop executed entirely in the React frontend; database persistence handled asynchronously upon session completion.

---

## 2. Technical Architecture & Layer Responsibilities

```
┌────────────────────────────────────────────────────────────────────────┐
│                        D6 RUNTIME ARCHITECTURE                         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. TAURI 2 (RUST DESKTOP PRIVILEGED LAYER):                           │
│    • Supervise Spring Boot 3 backend child process on 127.0.0.1.       │
│    • Disable WebView2 browser accelerators via                         │
│      ICoreWebView2Settings::put_AreBrowserAcceleratorKeysEnabled(FALSE) │
│    • Provide native file dialogs constrained to .txt and .md files.    │
│    • Enforce 500 KB file-size ceiling before reading buffers.          │
│                                                                        │
│ 2. REACT FRONTEND (REAL-TIME ENGINE & UI):                             │
│    • Monospace sliding text window with sub-millisecond key capture.   │
│    • Capture-phase keydown trap for F5 / Ctrl+R with >10s dialog.      │
│    • 4-layer error attribution (intended keycap, 1 evaluation/char).   │
│    • Forgiving multi-word backspacing engine.                          │
│    • Zustand state stores: useDrillSessionStore, useTelemetryStore.    │
│    • Deterministic PRNG drill generator (5,000-word offline corpus).   │
│                                                                        │
│ 3. SPRING BOOT 3 & SQLITE (LOCAL BACKEND & PERSISTENCE):               │
│    • REST endpoints under /api/v1/drills and /api/v1/telemetry.        │
│    • SQLite persistence in user app data directory (%APPDATA%).        │
│    • Rolling FIFO window trigger (latest 100 strokes, 14-day cutoff).  │
│    • Multi-session mastery graduation state machine.                   │
│    • Unique reward ledger constraints to guarantee XP idempotency.     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. SQLite Database Schema & Persistence Rules

All D6 persistence must be managed through Flyway migrations in Spring Boot.

### 3.1 Table: `key_telemetry_window` (Rolling Diagnostic Buffer)
Stores the rolling FIFO buffer of individual keystroke opportunities:
```sql
CREATE TABLE IF NOT EXISTS key_telemetry_window (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    target_key TEXT NOT NULL,          -- Evaluated intended key (uppercase 'A'-'Z', punctuation)
    actual_key TEXT NOT NULL,          -- Actual key struck by user
    is_correct INTEGER NOT NULL,       -- 1 = correct, 0 = miskey
    was_corrected INTEGER NOT NULL,    -- 1 = backspaced and fixed, 0 = left uncorrected
    hesitation_ms INTEGER NOT NULL,    -- Inter-keystroke interval in milliseconds
    session_id TEXT NOT NULL,          -- UUID of the practice session
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_telemetry_user_target ON key_telemetry_window(user_id, target_key, timestamp);
```

### 3.2 Rolling Window FIFO Eviction Trigger
Ensures that each key never retains more than the latest 100 eligible opportunities or records older than 14 days:
```sql
CREATE TRIGGER IF NOT EXISTS trg_fifo_evict_telemetry
AFTER INSERT ON key_telemetry_window
BEGIN
    -- 1. Purge records older than 14 calendar days
    DELETE FROM key_telemetry_window
    WHERE timestamp < datetime('now', '-14 days');

    -- 2. Retain only the latest 100 opportunities per user and target key
    DELETE FROM key_telemetry_window
    WHERE id NOT IN (
        SELECT id FROM key_telemetry_window
        WHERE user_id = NEW.user_id AND target_key = NEW.target_key
        ORDER BY timestamp DESC
        LIMIT 100
    ) AND user_id = NEW.user_id AND target_key = NEW.target_key;
END;
```

### 3.3 Table: `key_confusion_matrix` (Aggregated Miskey Pairs)
Stores aggregated counts of miskey vectors:
```sql
CREATE TABLE IF NOT EXISTS key_confusion_matrix (
    user_id TEXT NOT NULL,
    intended_key TEXT NOT NULL,
    actual_key TEXT NOT NULL,
    error_count INTEGER NOT NULL DEFAULT 1,
    last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, intended_key, actual_key),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3.4 Table: `key_mastery_tracker` (3-Session Graduation Lifecycle)
Tracks graduation progress toward the 3-session mastery threshold:
```sql
CREATE TABLE IF NOT EXISTS key_mastery_tracker (
    user_id TEXT NOT NULL,
    target_key TEXT NOT NULL,
    classification TEXT NOT NULL DEFAULT 'CALIBRATING', -- CALIBRATING, WEAK, DEVELOPING, STABLE, MASTERED
    consecutive_clean_sessions INTEGER NOT NULL DEFAULT 0, -- 0, 1, 2, or 3
    last_qualifying_session_id TEXT,
    last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, target_key),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 4. Algorithmic Specifications for Implementation

### 4.1 Error Attribution & Opportunity Counting
When typing in `SCR-404`:
1. Each character position in the target text is evaluated **exactly once**.
2. If the student strikes an incorrect key at position $i$:
   - An error is attributed to the **intended target character** $C_i$.
   - The miskey tuple $(C_i \to K_{actual})$ is incremented in `key_confusion_matrix`.
   - `is_correct = 0` is logged to `key_telemetry_window`.
3. If the student presses `Backspace` and retypes position $i$ correctly:
   - `was_corrected = 1` is updated in `key_telemetry_window`.
   - The word does **not** incur a Net WPM penalty (D4 consistency).
   - The error remains in diagnostic telemetry (no cheating the error rate).
4. Subsequent backspacing and re-typing of position $i$ does **not** generate additional errors or opportunities.

### 4.2 Weak-Key Prioritization Index ($WPI$)
$$WPI_k = \begin{cases} \text{ErrRate}_k \times \ln(O_k + 1) & \text{if } O_k \ge 20 \\ 0 & \text{if } O_k < 20 \text{ (Insufficient Data)} \end{cases}$$
- `ErrRate_k`: Error percentage from latest rolling window ($0.0$ to $100.0\%$).
- `O_k`: Count of eligible opportunities in rolling window ($\le 100$).
- Output: Float formatted to 2 decimal places.

### 4.3 Mastery State Machine Transitions
When a drill session completes in `SCR-404`:
1. Calculate target key opportunities $O_{session}$ and error rate $E_{session}$.
2. If $O_{session} < 30$:
   - Result: `NON_QUALIFYING_OPPORTUNITY_COUNT`.
   - Counter: `consecutive_clean_sessions` remains unchanged.
   - Session XP: Standard Base XP awarded; physical time credited to daily goal.
3. If $O_{session} \ge 30$ and $E_{session} \le 3.0\%$:
   - Result: `QUALIFYING_CLEAN_SESSION`.
   - Counter: `consecutive_clean_sessions = consecutive_clean_sessions + 1`.
   - If counter reaches `3`:
     - Transition `classification` to `'MASTERED'`.
     - Award neutral celebration in `SCR-405` (0 duplicate milestone XP).
     - Check `user_reward_ledger` for one-time achievement "Precision Repair" (first mastered key).
4. If $O_{session} \ge 30$ and $E_{session} > 3.0\%$:
   - Result: `FAILED_QUALIFICATION`.
   - Counter: `consecutive_clean_sessions = 0` (strict consecutive reset).

### 4.4 XP Calculation & Daily Diminishing Returns Order
$$\mathbf{XP_{base} = \text{round}(Words \times 0.2) + \text{round}(Minutes \times 5)}$$
$$\mathbf{XP_{adjusted\_base} = \text{round}(XP_{base} \times AccuracyMultiplier)}$$
$$\mathbf{XP_{session} = \text{round}(XP_{adjusted\_base} \times RetakeTier)}$$
- `AccuracyMultiplier`:
  - $\ge 98.0\%$: $1.50\times$
  - $95.0–97.9\%$: $1.20\times$
  - $90.0–94.9\%$: $1.00\times$
  - $85.0–89.9\%$: $0.75\times$
  - $< 85.0\%$: $0.50\times$
- `RetakeTier` (Option A):
  - Attempts 1–3: $1.00\times$ (100% Base XP; Attempt 1 is initial attempt).
  - Attempts 4–5: $0.50\times$ (50% Base XP).
  - Attempts 6+: $0.00\times$ (0% Base XP).
- **Practice Time:** 100% of physical active practice minutes accumulate toward daily goal regardless of tier.

---

## 5. File Import & Input Sanitization Pipeline

When handling custom text imports in `SCR-403`:
```typescript
export async function validateAndParseImportFile(file: File): Promise<string> {
  // 1. File size pre-check (500 KB limit)
  const MAX_BYTES = 500 * 1024;
  if (file.size > MAX_BYTES) {
    throw new Error("File exceeds 500 KB limit. Please select a shorter chapter or snippet.");
  }
  if (file.size === 0) {
    throw new Error("File is empty. Please select a text file with content.");
  }

  // 2. Format check
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext !== 'txt' && ext !== 'md') {
    throw new Error("Unsupported format. Only .txt and .md files are supported.");
  }

  // 3. Strict UTF-8 validation (reject invalid bytes without silent stripping)
  const buffer = await file.arrayBuffer();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let decodedText = "";
  try {
    decodedText = decoder.decode(buffer);
  } catch (e) {
    throw new Error("Encoding Error: File contains invalid UTF-8 byte sequences. Please re-save the file with UTF-8 encoding in your text editor and re-import.");
  }

  // 4. Reject whitespace-only content
  if (decodedText.trim().length === 0) {
    throw new Error("File contains only whitespace. Please select a valid document.");
  }

  // 5. Return exact decoded string (never executed)
  return decodedText;
}
```

---

## 6. Tauri Desktop Acceleration Interception

In `src-tauri/src/main.rs`:
```rust
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            #[cfg(target_os = "windows")]
            {
                use webview2_com::Microsoft::Web::WebView2::Win32::ICoreWebView2Settings;
                window.with_webview(|webview| {
                    unsafe {
                        let settings: ICoreWebView2Settings = webview.controller().CoreWebView2Settings()?;
                        settings.put_AreBrowserAcceleratorKeysEnabled(0)?; // FALSE
                    }
                    Ok(())
                })?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

---

## 7. Engineering Sign-Off Checklist for Claude Code

- [x] Database schemas and indexes defined.
- [x] Rolling window FIFO eviction trigger specified.
- [x] Error attribution and 4-layer accounting defined.
- [x] $WPI$ formula and minimum sample size floor ($N_{min} = 20$) verified.
- [x] 3-session mastery state machine codified.
- [x] Option A Daily Diminishing Returns XP formula aligned.
- [x] Custom import 500 KB pre-check and strict UTF-8 decoding pipeline specified.
- [x] Desktop accelerator suppression (`F5` / `Ctrl+R`) and $>10\text{s}$ confirmation guard defined.
- [x] Non-clinical observable terminology enforced across all API responses.
