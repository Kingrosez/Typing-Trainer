package com.typingtrainer.config;

import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

@Configuration
public class FlywayConfig {

    private static final Logger log = LoggerFactory.getLogger(FlywayConfig.class);

    @Value("${spring.datasource.url:jdbc:sqlite:typing-trainer.db}")
    private String jdbcUrl;

    @Bean
    public Flyway flyway() {
        ensureDatabaseDirectoryExists(jdbcUrl);

        log.info("Configuring Flyway migration against SQLite database");
        Flyway flyway = Flyway.configure()
                .dataSource(jdbcUrl, null, null)
                .baselineOnMigrate(true)
                .baselineVersion("0")
                .load();
        flyway.migrate();

        configureSqlitePragmas(jdbcUrl);

        return flyway;
    }

    private void ensureDatabaseDirectoryExists(String url) {
        if (url == null || !url.startsWith("jdbc:sqlite:")) {
            return;
        }

        String path = url.substring("jdbc:sqlite:".length()).trim();
        if (path.startsWith("file:")) {
            path = path.substring("file:".length()).trim();
        }

        // Memory and temporary database paths do not need filesystem directory creation
        if (":memory:".equals(path) || path.isEmpty()) {
            return;
        }

        try {
            File dbFile = new File(path).getAbsoluteFile();
            File parentDir = dbFile.getParentFile();
            if (parentDir != null && !parentDir.exists()) {
                boolean created = parentDir.mkdirs();
                log.info("Ensuring SQLite parent directory exists: {} (created={})", parentDir.getAbsolutePath(), created);
            }
        } catch (Exception e) {
            log.warn("Could not ensure SQLite directory exists: {}", e.getMessage(), e);
        }
    }

    private void configureSqlitePragmas(String url) {
        if (url == null || !url.startsWith("jdbc:sqlite:")) {
            return;
        }
        try (Connection conn = DriverManager.getConnection(url);
             Statement stmt = conn.createStatement()) {
            stmt.execute("PRAGMA journal_mode = WAL;");
            stmt.execute("PRAGMA busy_timeout = 5000;");
            stmt.execute("PRAGMA foreign_keys = ON;");
            log.info("Configured SQLite PRAGMAs: WAL mode, busy_timeout=5000, foreign_keys=ON");
        } catch (Exception e) {
            log.warn("Failed to set SQLite PRAGMAs on connection: {}", e.getMessage());
        }
    }
}
