-- V2__create_dashboard_schema.sql
-- Phase 3: Dashboard Integration Schema Extension
-- Preserves existing V1 schema and introduces tables for Gamification, Profiles, Reward Ledger, and Key Telemetry.

-- 1. User Profile Table
CREATE TABLE IF NOT EXISTS user_profile (
    id TEXT PRIMARY KEY NOT NULL,
    display_name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- 2. User Gamification Table
CREATE TABLE IF NOT EXISTS user_gamification (
    user_id TEXT PRIMARY KEY NOT NULL,
    total_xp INTEGER NOT NULL DEFAULT 0,
    current_level INTEGER NOT NULL DEFAULT 1,
    current_tier TEXT NOT NULL DEFAULT 'Novice',
    current_streak_days INTEGER NOT NULL DEFAULT 0,
    longest_streak_days INTEGER NOT NULL DEFAULT 0,
    freeze_shields_available INTEGER NOT NULL DEFAULT 0,
    last_practice_date TEXT,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_profile(id) ON DELETE CASCADE
);

-- 3. User Reward Ledger (Immutable ledger ensuring idempotent XP awards)
CREATE TABLE IF NOT EXISTS user_reward_ledger (
    reward_event_id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT,
    reward_type TEXT NOT NULL,
    xp_amount INTEGER NOT NULL,
    awarded_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reward_ledger_session ON user_reward_ledger(session_id);
CREATE INDEX IF NOT EXISTS idx_reward_ledger_type ON user_reward_ledger(reward_type);

-- 4. Key Telemetry Table (Per-key diagnostic sample data for D6 Weak-Key Engine)
CREATE TABLE IF NOT EXISTS key_telemetry (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL,
    key_char TEXT NOT NULL,
    opportunities INTEGER NOT NULL,
    errors INTEGER NOT NULL,
    total_latency_ms INTEGER NOT NULL DEFAULT 0,
    recorded_at TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES typing_sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_key_telemetry_key_date ON key_telemetry(key_char, recorded_at);
CREATE INDEX IF NOT EXISTS idx_key_telemetry_session ON key_telemetry(session_id);

-- 5. Extend typing_sessions table with mode, duration target, official status, and XP
ALTER TABLE typing_sessions ADD COLUMN session_mode TEXT NOT NULL DEFAULT 'TYPING_TEST';
ALTER TABLE typing_sessions ADD COLUMN test_duration_target INTEGER NOT NULL DEFAULT 60;
ALTER TABLE typing_sessions ADD COLUMN is_official_benchmark BOOLEAN NOT NULL DEFAULT 1;
ALTER TABLE typing_sessions ADD COLUMN xp_earned INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_typing_sessions_completed ON typing_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_typing_sessions_mode ON typing_sessions(session_mode);
