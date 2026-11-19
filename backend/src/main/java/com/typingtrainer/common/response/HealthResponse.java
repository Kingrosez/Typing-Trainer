package com.typingtrainer.common.response;

public record HealthResponse(
        String status,
        String application,
        String apiVersion
) {}
