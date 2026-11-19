-- Initial schema for Typing Trainer
-- Creates tables for session persistence

CREATE TABLE typing_sessions (
    id TEXT PRIMARY KEY NOT NULL,
    gross_wpm REAL NOT NULL,
    net_wpm REAL NOT NULL,
    accuracy REAL NOT NULL,
    total_errors INTEGER NOT NULL,
    raw_characters INTEGER NOT NULL,
    correct_characters INTEGER NOT NULL,
    duration_seconds REAL NOT NULL,
    passage TEXT NOT NULL,
    completed_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
);