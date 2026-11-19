package com.typingtrainer.common.response;

public record SystemInfoResponse(
        String application,
        String version,
        String status,
        String database,
        boolean offlineReady
) {}
