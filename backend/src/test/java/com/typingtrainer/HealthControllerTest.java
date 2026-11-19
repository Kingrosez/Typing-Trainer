package com.typingtrainer;

import com.typingtrainer.common.response.HealthResponse;
import com.typingtrainer.common.response.SystemInfoResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class HealthControllerTest {

    private final HealthController controller = new HealthController();

    @Test
    @DisplayName("Health endpoint returns UP status and typing-trainer service name")
    void shouldReturnUpHealthStatus() {
        ResponseEntity<HealthResponse> response = controller.health();
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().status()).isEqualTo("UP");
        assertThat(response.getBody().application()).isEqualTo("typing-trainer");
        assertThat(response.getBody().apiVersion()).isEqualTo("v1");
    }

    @Test
    @DisplayName("System info endpoint returns online status and local SQLite database type")
    void shouldReturnSystemInfo() {
        ResponseEntity<SystemInfoResponse> response = controller.systemInfo();
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().application()).isEqualTo("Typing Trainer");
        assertThat(response.getBody().version()).isEqualTo("0.1.0");
        assertThat(response.getBody().status()).isEqualTo("ONLINE");
        assertThat(response.getBody().database()).isEqualTo("SQLite (Local)");
        assertThat(response.getBody().offlineReady()).isTrue();
    }
}
