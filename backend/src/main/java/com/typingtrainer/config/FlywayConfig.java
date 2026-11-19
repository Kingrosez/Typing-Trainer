package com.typingtrainer.config;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {

    @Value("${spring.datasource.url:jdbc:sqlite:file:typing-trainer.db}")
    private String jdbcUrl;

    @Bean
    public Flyway flyway() {
        Flyway flyway = Flyway.configure()
                .dataSource(jdbcUrl, null, null)
                .load();
        flyway.migrate();
        return flyway;
    }
}