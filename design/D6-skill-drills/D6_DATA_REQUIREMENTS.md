# D6 DATA REQUIREMENTS & PERSISTENCE SPECIFICATIONS
**Typing Trainer — Windows Desktop Application**
*Module: 04. Skill Drills & Remediation Studio | Screen Scope: SCR-401 to SCR-405*
*Document Version: 1.0.0 | Stage: D6 Stage 2 UX and Functional Specifications*
*Date: 2026-11-18 | Status: SPECIFICATION COMPLETE (AWAITING PRODUCT OWNER REVIEW)*

---

## 1. Storage Architecture Overview

In strict alignment with the offline-first, local SQLite architecture of Typing Trainer, D6 stores all keystroke diagnostics, rolling recency windows, confusion matrices, and drill histories locally on the user's machine.

### Core Separation of Data Stores:
1. **The Rolling Diagnostic Telemetry Window (`key_telemetry_window`):**
   - High-frequency, volatile FIFO window holding the **latest 100 eligible opportunities per key** with a maximum age cutoff of **14 calendar days**.
   - Used exclusively to compute the live heatmap (`SCR-402`), weak-key watchlist (`SCR-401`), and real-time drill recommendations (`SCR-403`).
2. **The Permanent Historical Session Ledger (`drill_attempts` & `session_results`):**
   - Immutable historical record of every completed drill and typing test across the user's lifetime.
   - Retained permanently for long-term analytics (`Phase D9`), personal bests, and auditability.
3. **The Multi-Session Mastery Tracker (`key_mastery_tracker`):**
   - Tracks the student's qualification progress toward the 3-session mastery threshold for each key.
4. **The Central User Reward Ledger (`user_reward_ledger`):**
   - Inherited from D3 and D5, manages idempotent Base XP, daily goal completion bonuses, and achievement grants with unique SQLite constraints.

---

## 2. Relational SQLite Schema Specifications

```sql
-- =============================================================================
-- 1. ROLLING KEY TELEMETRY WINDOW (Diagnostic Recency Buffer)
-- Stores individual key opportunities up to 100 per key, expired after 14 days.
-- =============================================================================
CREATE TABLE key_telemetry_window (
    telemetry_id VARCHAR(36) PRIMARY KEY, -- UUID v4
    session_id VARCHAR(36) NOT NULL,       -- Relates to originating drill or test
    key_id VARCHAR(8) NOT NULL,            -- e.g. 'P', 'B', 'A', ';', 'Space'
    is_correct BOOLEAN NOT NULL,           -- 1 = Correct on first stroke; 0 = Miskeyed
    actual_key VARCHAR(8),                 -- Actual character entered if miskeyed
    hesitation_latency_ms INTEGER,         -- Delay in ms before striking target
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for rapid heatmap aggregation and rolling FIFO eviction
CREATE INDEX idx_telemetry_key_recorded 
ON key_telemetry_window (key_id, recorded_at DESC);

CREATE INDEX idx_telemetry_recorded_at 
ON key_telemetry_window (recorded_at);


-- =============================================================================
-- 2. PAIRWISE CONFUSION MATRIX
-- Aggregates miskey destinations (where did erroneous strokes land?)
-- =============================================================================
CREATE TABLE key_confusion_matrix (
    intended_key VARCHAR(8) NOT NULL,      -- Expected target keycap
    actual_key VARCHAR(8) NOT NULL,        -- Incorrect keycap entered
    occurrence_count INTEGER NOT NULL DEFAULT 1,
    last_observed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (intended_key, actual_key)
);

CREATE INDEX idx_confusion_intended 
ON key_confusion_matrix (intended_key, occurrence_count DESC);


-- =============================================================================
-- 3. MULTI-SESSION KEY MASTERY TRACKER
-- Governs the 3-session verification graduation lifecycle
-- =============================================================================
CREATE TABLE key_mastery_tracker (
    key_id VARCHAR(8) PRIMARY KEY,
    current_status VARCHAR(16) NOT NULL,   -- 'WEAK', 'DEVELOPING', 'STABLE', 'MASTERED'
    consecutive_clean_sessions INTEGER NOT NULL DEFAULT 0, -- Target: 3 to graduate
    total_remediation_sessions INTEGER NOT NULL DEFAULT 0,
    last_qualifying_session_id VARCHAR(36),
    last_evaluated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    mastered_at TIMESTAMP                  -- Populated when consecutive reaches 3
);


-- =============================================================================
-- 4. DRILL ATTEMPTS AUDIT LOG (Permanent Historical Record)
-- =============================================================================
CREATE TABLE drill_attempts (
    attempt_id VARCHAR(36) PRIMARY KEY,    -- Immutable UUID v4
    drill_mode VARCHAR(32) NOT NULL,       -- 'WEAK_KEYS', 'NGRAMS', 'VOCAB', 'CUSTOM'
    target_keys_json TEXT NOT NULL,        -- e.g. '["P","B",";"]'
    stage_level INTEGER NOT NULL,          -- 1 = Isolation, 2 = Words, 3 = Prose
    active_seconds REAL NOT NULL,          -- Physical practice time
    words_typed INTEGER NOT NULL,
    gross_wpm REAL NOT NULL,
    net_wpm REAL NOT NULL,
    accuracy REAL NOT NULL,
    base_xp_earned INTEGER NOT NULL,
    accuracy_multiplier REAL NOT NULL,
    daily_attempt_number INTEGER NOT NULL, -- Daily counter for Option A diminishing return
    completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_drill_attempts_completed 
ON drill_attempts (completed_at DESC);


-- =============================================================================
-- 5. SAVED DRILL PRESETS & CUSTOM PASSAGES
-- =============================================================================
CREATE TABLE custom_drill_materials (
    material_id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(64) NOT NULL,
    source_type VARCHAR(16) NOT NULL,      -- 'PASTED', 'FILE_TXT', 'FILE_MD'
    original_filename VARCHAR(128),
    character_count INTEGER NOT NULL,
    word_count INTEGER NOT NULL,
    sanitized_text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Data Lifecycle & Maintenance Algorithms

### 3.1 Rolling Window FIFO Eviction & Expiration
Every time new keystroke telemetry arrives from `SCR-404`, `SCR-202` (Typing Test), or `SCR-303` (Learning Mode):

```sql
-- Step 1: Evict entries older than 14 calendar days
DELETE FROM key_telemetry_window 
WHERE recorded_at < datetime('now', '-14 days');

-- Step 2: Evict oldest entries exceeding 100 observations per key
DELETE FROM key_telemetry_window 
WHERE telemetry_id IN (
    SELECT telemetry_id 
    FROM (
        SELECT telemetry_id,
               ROW_NUMBER() OVER (PARTITION BY key_id ORDER BY recorded_at DESC) as row_num
        FROM key_telemetry_window
    )
    WHERE row_num > 100
);
```

### 3.2 Atomic Session Persistence Transaction
When a student completes a drill in `SCR-404`, all updates execute within a single atomic SQLite transaction:
```sql
BEGIN IMMEDIATE TRANSACTION;

-- 1. Insert permanent session attempt
INSERT INTO drill_attempts (...) VALUES (...);

-- 2. Insert new keystroke observations into rolling telemetry window
INSERT INTO key_telemetry_window (...) VALUES (...);

-- 3. Update pairwise confusion matrix
INSERT INTO key_confusion_matrix (intended_key, actual_key, occurrence_count, last_observed_at)
VALUES (?, ?, 1, CURRENT_TIMESTAMP)
ON CONFLICT (intended_key, actual_key) 
DO UPDATE SET occurrence_count = occurrence_count + 1, last_observed_at = CURRENT_TIMESTAMP;

-- 4. Evaluate multi-session mastery qualification
UPDATE key_mastery_tracker 
SET consecutive_clean_sessions = CASE 
    WHEN ? <= 3.0 AND ? >= 30 THEN consecutive_clean_sessions + 1
    ELSE 0 
END,
current_status = CASE
    WHEN consecutive_clean_sessions + 1 >= 3 THEN 'MASTERED'
    WHEN ? <= 3.0 THEN 'STABLE'
    WHEN ? <= 8.0 THEN 'DEVELOPING'
    ELSE 'WEAK'
END,
last_evaluated_at = CURRENT_TIMESTAMP
WHERE key_id = ?;

-- 5. Record XP ledger transaction (Option A Daily Diminishing Returns)
INSERT OR IGNORE INTO user_reward_ledger (...) VALUES (...);

-- 6. Update user daily practice duration
UPDATE user_daily_streak 
SET accumulated_practice_seconds = accumulated_practice_seconds + ? 
WHERE record_date = CURRENT_DATE;

COMMIT;
```

---

## 4. Local File Import & Validation Specifications

When a user imports a `.txt` or `.md` file in `SCR-403`:
1. **File Size Limit (Pre-Check):** Maximum allowable file size is **500 KB** (approximately 80,000 words). Enforced before file parsing occurs. If file $> 500\text{ KB}$, reject immediately with: `"File exceeds 500 KB limit. Please select a shorter chapter or snippet."`
2. **Empty-File Rejection:** Reject files with 0 bytes or whitespace-only content with: `"File is empty. Please select a text file with content."`
3. **Strict UTF-8 Encoding Validation:** 
   - Accept valid UTF-8 files.
   - Reject invalid UTF-8 files immediately with a clear and actionable error: `"Encoding Error: The selected file contains invalid UTF-8 byte sequences. Please re-save your file with UTF-8 encoding in your text editor and re-import."`
   - **Never silently strip, replace, or modify invalid bytes.**
4. **Exact Text Preservation:** Preserve imported text exactly after successful UTF-8 decoding. Do not alter words, syntax, or formatting.
5. **Format Restriction:** Support approved `.txt` and `.md` formats only.
6. **Plain Non-Executable Text:** Treat imported content strictly as inert string data. Never execute, evaluate, or interpret as active HTML or code.
