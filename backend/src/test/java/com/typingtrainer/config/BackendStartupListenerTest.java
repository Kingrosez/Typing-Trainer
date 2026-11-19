package com.typingtrainer.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.web.context.WebServerInitializedEvent;
import org.springframework.boot.web.server.WebServer;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class BackendStartupListenerTest {

    @Test
    @DisplayName("Outputs assigned port handshake line to stdout on WebServerInitializedEvent")
    void shouldLogHandshakeOutputOnServerInitialized() {
        BackendStartupListener listener = new BackendStartupListener();

        WebServerInitializedEvent mockEvent = mock(WebServerInitializedEvent.class);
        WebServer mockWebServer = mock(WebServer.class);
        when(mockEvent.getWebServer()).thenReturn(mockWebServer);
        when(mockWebServer.getPort()).thenReturn(54321);

        PrintStream originalOut = System.out;
        ByteArrayOutputStream capturedOut = new ByteArrayOutputStream();
        try {
            System.setOut(new PrintStream(capturedOut));
            listener.onApplicationEvent(mockEvent);
        } finally {
            System.setOut(originalOut);
        }

        String output = capturedOut.toString();
        assertThat(output).contains("[TYPING_TRAINER_BACKEND_PORT] port=54321");
        assertThat(listener.getAssignedPort()).isEqualTo(54321);
    }

    @Test
    @DisplayName("Writes port to handshake file when configured via system property")
    void shouldWriteHandshakeFileWhenSystemPropertyPresent() throws Exception {
        Path tempFile = Files.createTempFile("typing-trainer-handshake-test", ".port");
        try {
            BackendStartupListener listener = new BackendStartupListener();
            listener.setHandshakeFilePath(tempFile.toAbsolutePath().toString());

            WebServerInitializedEvent mockEvent = mock(WebServerInitializedEvent.class);
            WebServer mockWebServer = mock(WebServer.class);
            when(mockEvent.getWebServer()).thenReturn(mockWebServer);
            when(mockWebServer.getPort()).thenReturn(61234);

            listener.onApplicationEvent(mockEvent);

            String writtenContent = Files.readString(tempFile).trim();
            assertThat(writtenContent).contains("\"port\":61234");
            assertThat(writtenContent).contains("\"status\":\"READY\"");
        } finally {
            System.clearProperty("typingtrainer.handshake.file");
            Files.deleteIfExists(tempFile);
        }
    }
}
