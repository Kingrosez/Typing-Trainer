package com.typingtrainer.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class RequestTokenFilterTest {

    private RequestTokenFilter filter;
    private FilterChain filterChain;

    @BeforeEach
    void setUp() {
        filter = new RequestTokenFilter();
        filterChain = mock(FilterChain.class);
    }

    @Test
    @DisplayName("Allows all requests when no expected token is configured")
    void shouldAllowWhenNoTokenConfigured() throws ServletException, IOException {
        filter.setExpectedToken("");
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/sessions");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, filterChain);

        verify(filterChain, times(1)).doFilter(request, response);
        assertThat(response.getStatus()).isEqualTo(200);
    }

    @Test
    @DisplayName("Allows CORS OPTIONS preflight requests unconditionally")
    void shouldAllowCorsOptionsPreflight() throws ServletException, IOException {
        filter.setExpectedToken("secret-token-1234");
        MockHttpServletRequest request = new MockHttpServletRequest("OPTIONS", "/api/v1/sessions");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, filterChain);

        verify(filterChain, times(1)).doFilter(request, response);
        assertThat(response.getStatus()).isEqualTo(200);
    }

    @Test
    @DisplayName("Whitelists /internal/health and /api/v1/health without token")
    void shouldWhitelistHealthEndpoints() throws ServletException, IOException {
        filter.setExpectedToken("secret-token-1234");

        MockHttpServletRequest healthReq1 = new MockHttpServletRequest("GET", "/internal/health");
        MockHttpServletResponse healthRes1 = new MockHttpServletResponse();
        filter.doFilter(healthReq1, healthRes1, filterChain);
        verify(filterChain, times(1)).doFilter(healthReq1, healthRes1);

        MockHttpServletRequest healthReq2 = new MockHttpServletRequest("GET", "/api/v1/health");
        MockHttpServletResponse healthRes2 = new MockHttpServletResponse();
        filter.doFilter(healthReq2, healthRes2, filterChain);
        verify(filterChain, times(1)).doFilter(healthReq2, healthRes2);
    }

    @Test
    @DisplayName("Whitelists OpenAPI documentation endpoints")
    void shouldWhitelistOpenApiDocs() throws ServletException, IOException {
        filter.setExpectedToken("secret-token-1234");

        MockHttpServletRequest docReq = new MockHttpServletRequest("GET", "/v3/api-docs/swagger-config");
        MockHttpServletResponse docRes = new MockHttpServletResponse();
        filter.doFilter(docReq, docRes, filterChain);
        verify(filterChain, times(1)).doFilter(docReq, docRes);
    }

    @Test
    @DisplayName("Rejects protected API request with 401 when token header is missing")
    void shouldRejectWhenTokenMissing() throws ServletException, IOException {
        filter.setExpectedToken("secret-token-1234");
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/sessions");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, filterChain);

        verify(filterChain, never()).doFilter(request, response);
        assertThat(response.getStatus()).isEqualTo(401);
        assertThat(response.getContentAsString()).contains("UNAUTHORIZED");
        assertThat(response.getContentAsString()).contains("Valid X-Request-Token header is required");
    }

    @Test
    @DisplayName("Rejects protected API request with 401 when token header is invalid")
    void shouldRejectWhenTokenInvalid() throws ServletException, IOException {
        filter.setExpectedToken("secret-token-1234");
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/sessions");
        request.addHeader("X-Request-Token", "wrong-token-value");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, filterChain);

        verify(filterChain, never()).doFilter(request, response);
        assertThat(response.getStatus()).isEqualTo(401);
        assertThat(response.getContentAsString()).contains("UNAUTHORIZED");
    }

    @Test
    @DisplayName("Allows protected API request when valid token header is supplied")
    void shouldAllowWhenValidTokenProvided() throws ServletException, IOException {
        filter.setExpectedToken("secret-token-1234");
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/sessions");
        request.addHeader("X-Request-Token", "secret-token-1234");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, filterChain);

        verify(filterChain, times(1)).doFilter(request, response);
        assertThat(response.getStatus()).isEqualTo(200);
    }
}
