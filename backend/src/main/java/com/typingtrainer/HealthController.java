package com.typingtrainer;

import com.typingtrainer.common.response.HealthResponse;
import com.typingtrainer.common.response.SystemInfoResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping({"/internal/health", "/api/v1/health"})
    public ResponseEntity<HealthResponse> health() {
        return ResponseEntity.ok(new HealthResponse("UP", "typing-trainer", "v1"));
    }

    @GetMapping("/api/v1/system/info")
    public ResponseEntity<SystemInfoResponse> systemInfo() {
        return ResponseEntity.ok(new SystemInfoResponse(
                "Typing Trainer",
                "0.1.0",
                "ONLINE",
                "SQLite (Local)",
                true
        ));
    }
}
