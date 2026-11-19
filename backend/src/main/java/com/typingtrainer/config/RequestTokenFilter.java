package com.typingtrainer.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.typingtrainer.common.response.ApiErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.UUID;

/**
 * Enforces per-launch cryptographic request-token authentication on all protected
 * API endpoints to guarantee only the local desktop frontend can invoke the backend.
 */
@Component
public class RequestTokenFilter extends OncePerRequestFilter {

    public static final String TOKEN_HEADER = "X-Request-Token";

    @Value("${typingtrainer.security.request-token:}")
    private String expectedToken;

    private final ObjectMapper objectMapper;

    public RequestTokenFilter() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.findAndRegisterModules();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        // If no token is configured (e.g. running unit tests without security enabled), allow request
        if (expectedToken == null || expectedToken.trim().isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        // Always allow CORS preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();

        // Whitelist public readiness & documentation endpoints
        if (isWhitelisted(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String providedToken = request.getHeader(TOKEN_HEADER);

        if (providedToken == null || !constantTimeEquals(expectedToken.trim(), providedToken.trim())) {
            sendUnauthorizedResponse(request, response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isWhitelisted(String path) {
        return path.equals("/internal/health") ||
                path.equals("/api/v1/health") ||
                path.startsWith("/v3/api-docs") ||
                path.startsWith("/swagger-ui");
    }

    private boolean constantTimeEquals(String expected, String actual) {
        byte[] expectedBytes = expected.getBytes(StandardCharsets.UTF_8);
        byte[] actualBytes = actual.getBytes(StandardCharsets.UTF_8);
        return MessageDigest.isEqual(expectedBytes, actualBytes);
    }

    private void sendUnauthorizedResponse(HttpServletRequest request,
                                          HttpServletResponse response) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiErrorResponse error = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.UNAUTHORIZED.value(),
                "UNAUTHORIZED",
                "Unauthorized local request. Valid X-Request-Token header is required.",
                request.getRequestURI()
        );

        response.getWriter().write(objectMapper.writeValueAsString(error));
    }

    public void setExpectedToken(String token) {
        this.expectedToken = token;
    }
}
