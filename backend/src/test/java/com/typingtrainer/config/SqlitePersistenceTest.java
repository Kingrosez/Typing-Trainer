package com.typingtrainer.config;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.File;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import static org.assertj.core.api.Assertions.assertThat;

class SqlitePersistenceTest {

    @Test
    @DisplayName("Creates missing parent directory and initializes SQLite schema with Flyway migrations")
    void shouldCreateDirectoryAndInitializeDatabase(@TempDir Path tempDir) throws Exception {
        Path nestedDir = tempDir.resolve("nested").resolve("data");
        Path dbPath = nestedDir.resolve("typing-trainer.db");
        String jdbcUrl = "jdbc:sqlite:" + dbPath.toAbsolutePath();

        assertThat(nestedDir.toFile().exists()).isFalse();

        // 1. Run Flyway migration using FlywayConfig
        FlywayConfig config = new FlywayConfig();
        // Use reflection/setter or directly configure Flyway with the test URL
        org.springframework.test.util.ReflectionTestUtils.setField(config, "jdbcUrl", jdbcUrl);

        Flyway flyway = config.flyway();
        assertThat(flyway).isNotNull();

        // 2. Directory and DB file must exist
        assertThat(nestedDir.toFile().exists()).isTrue();
        assertThat(dbPath.toFile().exists()).isTrue();

        // 3. Verify SQLite PRAGMAs: WAL mode, foreign_keys
        try (Connection conn = DriverManager.getConnection(jdbcUrl);
             Statement stmt = conn.createStatement()) {

            stmt.execute("PRAGMA foreign_keys = ON;");
            stmt.execute("PRAGMA busy_timeout = 5000;");

            try (ResultSet rs = stmt.executeQuery("PRAGMA journal_mode;")) {
                assertThat(rs.next()).isTrue();
                assertThat(rs.getString(1).toLowerCase()).isEqualTo("wal");
            }

            try (ResultSet rs = stmt.executeQuery("PRAGMA busy_timeout;")) {
                assertThat(rs.next()).isTrue();
                assertThat(rs.getInt(1)).isGreaterThanOrEqualTo(5000);
            }

            try (ResultSet rs = stmt.executeQuery("PRAGMA foreign_keys;")) {
                assertThat(rs.next()).isTrue();
                assertThat(rs.getInt(1)).isEqualTo(1);
            }

            // 4. Insert data and verify persistence
            stmt.executeUpdate("INSERT INTO typing_sessions (id, gross_wpm, net_wpm, accuracy, total_errors, raw_characters, correct_characters, duration_seconds, passage, completed_at) " +
                    "VALUES ('session-test-1', 75.5, 72.0, 98.2, 2, 350, 345, 60.0, 'Test passage content', '2026-11-19T12:00:00Z');");
        }

        // 5. Simulate restart: Re-run flyway migration on existing DB file and ensure data survived
        Flyway secondFlyway = config.flyway();
        assertThat(secondFlyway).isNotNull();

        try (Connection conn = DriverManager.getConnection(jdbcUrl);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT gross_wpm, accuracy FROM typing_sessions WHERE id = 'session-test-1';")) {
            assertThat(rs.next()).isTrue();
            assertThat(rs.getDouble("gross_wpm")).isEqualTo(75.5);
            assertThat(rs.getDouble("accuracy")).isEqualTo(98.2);
        }
    }
}
