package com.typingtrainer.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.context.WebServerInitializedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

/**
 * Listens for local embedded web server initialization, extracts the assigned
 * ephemeral port, and publishes the controlled startup handshake to stdout
 * and optional handshake file for Tauri process management.
 */
@Component
public class BackendStartupListener implements ApplicationListener<WebServerInitializedEvent> {

    private static final Logger log = LoggerFactory.getLogger(BackendStartupListener.class);

    @Value("${typingtrainer.handshake.file:}")
    private String handshakeFilePath;

    private int assignedPort = -1;

    @Override
    public void onApplicationEvent(WebServerInitializedEvent event) {
        this.assignedPort = event.getWebServer().getPort();

        // 1. Controlled standard output handshake line for Tauri stream parser
        System.out.println("[TYPING_TRAINER_BACKEND_PORT] port=" + assignedPort);
        System.out.flush();

        log.info("Typing Trainer local backend started on 127.0.0.1:{}", assignedPort);

        // 2. Handshake file output if configured by Tauri parent process
        if (handshakeFilePath != null && !handshakeFilePath.trim().isEmpty()) {
            writeHandshakeFile(assignedPort, handshakeFilePath.trim());
        }
    }

    public int getAssignedPort() {
        return assignedPort;
    }

    public void setHandshakeFilePath(String handshakeFilePath) {
        this.handshakeFilePath = handshakeFilePath;
    }

    private void writeHandshakeFile(int port, String path) {
        try {
            File file = new File(path);
            File parent = file.getParentFile();
            if (parent != null && !parent.exists()) {
                parent.mkdirs();
            }

            try (FileWriter writer = new FileWriter(file)) {
                writer.write("{\"port\":" + port + ",\"status\":\"READY\"}\n");
                writer.flush();
            }
            log.info("Wrote startup handshake file: {}", file.getAbsolutePath());
        } catch (IOException e) {
            log.warn("Failed to write startup handshake file {}: {}", path, e.getMessage());
        }
    }
}
