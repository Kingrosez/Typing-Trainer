# Typing Trainer - API Contract

**Status:** Initial API contract  
**API version:** `v1`  
**Base path:** `/api/v1`  
**Backend:** Spring Boot 3, Java 21  
**Persistence:** SQLite  
**Transport:** HTTP over loopback only  
**Last updated:** 12 November 2026

## 1. Purpose

This document defines the HTTP API contract between the Typing Trainer desktop frontend and its local Spring Boot backend.

The frontend owns the real-time typing interaction loop. It processes individual keystrokes locally and sends a request to the backend only when it needs application data or needs to persist a completed session.

The API is local-only. It is not a public or remote service.

## 2. API principles

- Use `/api/v1` as the versioned API base path.
- Use JSON for request and response bodies unless an endpoint explicitly states otherwise.
- Use ISO-8601 UTC timestamps, for example `2026-11-12T12:00:00Z`.
- Use UUID strings for client-generated session identifiers.
- Use request and response DTOs. Never expose JPA entities.
- Validate all request payloads.
- Use consistent error responses.
- Use pagination for potentially large collections.
- Keep all endpoints local and available offline.
- Do not send individual keystrokes to the backend.
- Do not include Ollama, LLM, or cloud AI endpoints.

## 3. Local service lifecycle and connectivity

The Tauri desktop shell starts the Spring Boot backend and owns its lifecycle.

### Requirements

- Spring Boot must bind only to `127.0.0.1`.
- The backend should use an available local port rather than assuming a fixed port is free.
- The selected port and a per-launch access credential or equivalent request protection mechanism must be communicated to the frontend through a controlled Tauri mechanism.
- Do not expose the credential to URLs, logs, analytics, or persistent frontend storage.
- The desktop shell must stop the backend during application shutdown.
- The frontend must show a recoverable error if the backend cannot start or becomes unavailable.

The precise bootstrap handshake is a desktop integration concern and must be finalized with the Tauri implementation. It is not a public API endpoint.

## 4. Common conventions

### 4.1 Content type

Requests with JSON bodies must send:

```http
Content-Type: application/json
Accept: application/json
```

### 4.2 Identifier format

IDs are UUID strings unless stated otherwise.

Example:

```json
{
  "sessionId": "c8b40bb5-8b79-4c85-b2a4-7ec7cda9f21c"
}
```

### 4.3 Pagination

Collection endpoints that support pagination use:

| Parameter | Type | Default | Description |
|---|---|---:|---|
| `page` | integer | `0` | Zero-based page index |
| `size` | integer | `20` | Page size, with a server-enforced maximum |
| `sort` | string | endpoint-specific | Supported sort field and direction |

Example:

```http
GET /api/v1/sessions?page=0&size=20&sort=completedAt,desc
```

Response:

```json
{
  "items": [],
  "page": 0,
  "size": 20,
  "totalItems": 0,
  "totalPages": 0
}
```

Do not accept arbitrary entity property names as sort fields. Each endpoint must whitelist supported sort fields.

### 4.4 Error response

Use a consistent error shape:

```json
{
  "timestamp": "2026-11-12T12:00:00Z",
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "The request contains invalid fields.",
  "path": "/api/v1/sessions",
  "fieldErrors": [
    {
      "field": "durationSeconds",
      "message": "must be greater than zero"
    }
  ],
  "traceId": "a2c5a60e-4e26-46f5-b4d1-37a38e7192d7"
}
```

Rules:

- `fieldErrors` may be omitted when there are no field-specific errors.
- `traceId` should be a request correlation identifier, not a stack trace.
- Never return stack traces, SQL statements, filesystem paths, or secrets.
- Messages should be safe for display or mapping to user-friendly frontend text.
- Use stable error `code` values for frontend handling.

Recommended error codes:

| HTTP status | Code | Meaning |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | Request validation failed |
| 401 | `UNAUTHORIZED` | Local request authentication failed |
| 403 | `FORBIDDEN` | Request is not permitted |
| 404 | `RESOURCE_NOT_FOUND` | Requested resource does not exist |
| 409 | `RESOURCE_CONFLICT` | Duplicate or conflicting operation |
| 413 | `PAYLOAD_TOO_LARGE` | Request exceeds allowed size |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | Unsupported request content type |
| 429 | `RATE_LIMITED` | Request limit exceeded, if configured |
| 500 | `INTERNAL_ERROR` | Unexpected server failure |
| 503 | `SERVICE_UNAVAILABLE` | Backend is not ready or is shutting down |

## 5. Domain models

These are API-level representations. They are not database entity definitions.

### 5.1 Profile

```json
{
  "id": "2e03a2dd-6ac7-45bd-99e2-0b5bc8c0ac52",
  "displayName": "Local User",
  "createdAt": "2026-11-12T12:00:00Z",
  "updatedAt": "2026-11-12T12:00:00Z"
}
```

The initial release may support a single local profile. Do not build multi-user authentication unless product scope changes.

### 5.2 Typing session

```json
{
  "sessionId": "c8b40bb5-8b79-4c85-b2a4-7ec7cda9f21c",
  "mode": "TIMED",
  "sourceType": "BUILT_IN",
  "sourceId": "passage-001",
  "durationSeconds": 60,
  "elapsedSeconds": 58.4,
  "totalCharacters": 245,
  "correctCharacters": 239,
  "incorrectAttempts": 6,
  "uncorrectedErrors": 2,
  "grossWpm": 50.43,
  "netWpm": 48.36,
  "accuracy": 97.55,
  "completedAt": "2026-11-12T12:00:00Z",
  "keyStats": [
    {
      "key": "e",
      "attempts": 24,
      "errors": 1
    }
  ]
}
```

The metric fields are supplied by the frontend for session persistence, but the backend must validate their ranges and consistency. Where practical, the backend should recompute derived values from submitted raw statistics using the same documented calculation policy. It must not blindly trust arbitrary client-supplied metrics.

`sourceType` values:

- `BUILT_IN`
- `CUSTOM`
- `LESSON`
- `DEVELOPER`

`mode` values:

- `TIMED`
- `PASSAGE`
- `PRACTICE`

The final enum set must match the implemented product modes.

### 5.3 Lesson

```json
{
  "id": "home-row-01",
  "title": "Home Row Basics",
  "description": "Practice the home row keys.",
  "level": "BEGINNER",
  "order": 1,
  "estimatedMinutes": 5,
  "isUnlocked": true,
  "exerciseIds": ["exercise-home-row-01"]
}
```

### 5.4 Exercise

```json
{
  "id": "exercise-home-row-01",
  "title": "Home Row Words",
  "category": "HOME_ROW",
  "level": "BEGINNER",
  "content": "asdf jkl; sad flask",
  "language": "en",
  "tags": ["home-row", "accuracy"]
}
```

### 5.5 Application settings

```json
{
  "theme": "SYSTEM",
  "soundEnabled": false,
  "showKeyboard": true,
  "showLiveWpm": true,
  "defaultTestDurationSeconds": 60,
  "keyboardLayout": "US_QWERTY",
  "reducedMotion": false
}
```

## 6. Profile endpoints

### GET `/profile`

Retrieve the current local profile.

**Success:** `200 OK`

### PUT `/profile`

Update the current local profile.

Request:

```json
{
  "displayName": "Local User"
}
```

**Success:** `200 OK`

Validation:

- Trim leading and trailing whitespace.
- Display name must not be blank.
- Define and enforce a reasonable maximum length.
- Do not accept a client-supplied profile ID.

## 7. Lesson endpoints

### GET `/lessons`

List lessons.

Optional query parameters:

- `level`: `BEGINNER`, `INTERMEDIATE`, or `ADVANCED`
- `category`: lesson category
- `page`, `size`: pagination

**Success:** `200 OK`

### GET `/lessons/{lessonId}`

Retrieve lesson details, including ordered exercise references.

**Success:** `200 OK`  
**Not found:** `404 RESOURCE_NOT_FOUND`

### GET `/lessons/{lessonId}/progress`

Retrieve the local user's progress for a lesson.

**Success:** `200 OK`

Example:

```json
{
  "lessonId": "home-row-01",
  "status": "IN_PROGRESS",
  "completedExercises": 2,
  "totalExercises": 5,
  "bestAccuracy": 98.2,
  "lastPracticedAt": "2026-11-12T12:00:00Z"
}
```

### PUT `/lessons/{lessonId}/progress`

Update progress after an exercise is completed.

Request:

```json
{
  "exerciseId": "exercise-home-row-01",
  "completed": true,
  "bestAccuracy": 98.2
}
```

**Success:** `200 OK`

The backend must verify that the lesson and exercise relationship is valid.

## 8. Exercise endpoints

### GET `/exercises`

List practice exercises.

Optional filters:

- `category`
- `level`
- `tag`
- `page`
- `size`

**Success:** `200 OK`

### GET `/exercises/{exerciseId}`

Retrieve one exercise.

**Success:** `200 OK`  
**Not found:** `404 RESOURCE_NOT_FOUND`

### POST `/exercises`

Create a user-defined exercise.

Request:

```json
{
  "title": "My Practice Passage",
  "category": "CUSTOM",
  "level": "INTERMEDIATE",
  "content": "Practice text goes here.",
  "language": "en",
  "tags": ["custom"]
}
```

**Success:** `201 Created`

The backend must enforce content length and allowed field values. Imported or user-authored content must be treated as untrusted data.

### DELETE `/exercises/{exerciseId}`

Delete a user-created exercise only.

**Success:** `204 No Content`  
**Conflict:** `409 RESOURCE_CONFLICT` if the exercise is protected or cannot be deleted under the retention policy.

Bundled exercises must not be deletable through this endpoint.

## 9. Typing test configuration

### GET `/tests/config`

Retrieve supported typing test configuration options.

Example response:

```json
{
  "durationsSeconds": [15, 30, 60, 120],
  "customDuration": {
    "enabled": true,
    "minimumSeconds": 15,
    "maximumSeconds": 600
  },
  "modes": ["TIMED", "PASSAGE", "PRACTICE"],
  "allowBackspace": true,
  "allowPaste": false
}
```

The values are product configuration, not assumptions that the frontend should hardcode.

**Success:** `200 OK`

## 10. Typing session endpoints

### POST `/sessions`

Save a completed typing session.

Request:

```json
{
  "sessionId": "c8b40bb5-8b79-4c85-b2a4-7ec7cda9f21c",
  "mode": "TIMED",
  "sourceType": "BUILT_IN",
  "sourceId": "passage-001",
  "durationSeconds": 60,
  "elapsedSeconds": 58.4,
  "totalCharacters": 245,
  "correctCharacters": 239,
  "incorrectAttempts": 6,
  "uncorrectedErrors": 2,
  "keyStats": [
    {
      "key": "e",
      "attempts": 24,
      "errors": 1
    }
  ],
  "completedAt": "2026-11-12T12:00:00Z"
}
```

**Success:** `201 Created`

Response:

```json
{
  "sessionId": "c8b40bb5-8b79-4c85-b2a4-7ec7cda9f21c",
  "grossWpm": 50.43,
  "netWpm": 48.36,
  "accuracy": 97.55,
  "saved": true
}
```

Idempotency requirements:

- `sessionId` is generated by the frontend before submission.
- A repeated submission with the same ID and same logical payload must not create another session.
- A repeated submission with the same ID but conflicting payload must return `409 RESOURCE_CONFLICT`.
- The database must enforce uniqueness on the session ID.
- The frontend should retain a completed result temporarily if the backend is unavailable and retry safely.

Validation requirements:

- Duration must be positive and within supported bounds.
- Elapsed time must be positive and must not exceed an allowed tolerance for the selected test mode.
- Counts must be non-negative and internally consistent.
- Key-stat values must be bounded and valid.
- WPM and accuracy must be recomputed or checked by the backend.
- The backend must reject malformed timestamps and unsupported enum values.

Do not include the full passage or every keystroke in the request unless a separately approved feature requires it.

### GET `/sessions`

Retrieve session history.

Optional query parameters:

- `from`: inclusive UTC timestamp
- `to`: exclusive UTC timestamp
- `mode`
- `sourceType`
- `page`
- `size`
- `sort`, restricted to supported fields

**Success:** `200 OK`

### GET `/sessions/{sessionId}`

Retrieve one saved session and its summary statistics.

**Success:** `200 OK`  
**Not found:** `404 RESOURCE_NOT_FOUND`

### DELETE `/sessions/{sessionId}`

Delete one locally stored session, if session deletion is enabled in product settings.

**Success:** `204 No Content`  
**Not found:** `404 RESOURCE_NOT_FOUND`

Deletion policy must account for dependent key statistics and analytics. Use a transaction and explicit foreign-key behavior.

## 11. Analytics endpoints

### GET `/analytics/overview`

Retrieve dashboard summary metrics.

Optional query parameter:

- `period`: `TODAY`, `LAST_7_DAYS`, `LAST_30_DAYS`, `ALL_TIME`

Example response:

```json
{
  "period": "LAST_7_DAYS",
  "totalSessions": 12,
  "totalPracticeMinutes": 45.5,
  "averageWpm": 48.2,
  "bestWpm": 62.1,
  "averageAccuracy": 96.8,
  "currentStreakDays": 3
}
```

**Success:** `200 OK`

### GET `/analytics/trends`

Retrieve time-series performance data.

Query parameters:

- `from`
- `to`
- `groupBy`: `DAY` or `WEEK`

Example response:

```json
{
  "items": [
    {
      "date": "2026-11-12",
      "sessionCount": 3,
      "averageWpm": 48.2,
      "averageAccuracy": 96.8
    }
  ]
}
```

**Success:** `200 OK`

### GET `/analytics/weak-keys`

Retrieve key-level performance statistics.

Optional query parameters:

- `from`
- `to`
- `minimumAttempts`, defaulted by backend

Example response:

```json
{
  "items": [
    {
      "key": "e",
      "attempts": 120,
      "errors": 9,
      "errorRate": 7.5
    }
  ]
}
```

**Success:** `200 OK`

The backend must use a meaningful minimum sample size before identifying a weak key. Sort by error rate or another documented metric, and avoid implying statistical certainty from very small samples.

## 12. Achievements endpoints

### GET `/achievements`

List achievement definitions and the user's earned state.

Example response:

```json
{
  "items": [
    {
      "id": "first-test",
      "title": "First Steps",
      "description": "Complete your first typing test.",
      "unlocked": true,
      "unlockedAt": "2026-11-12T12:00:00Z"
    }
  ]
}
```

**Success:** `200 OK`

Achievements are evaluated by backend business rules when a session or lesson progress update is saved. The frontend must not independently award achievements.

## 13. Recommendation endpoints

### GET `/recommendations`

Retrieve rule-based practice recommendations.

Example response:

```json
{
  "items": [
    {
      "id": "practice-punctuation",
      "type": "PRACTICE_EXERCISE",
      "title": "Practice punctuation",
      "reason": "Your recent punctuation error rate is above your target.",
      "targetExerciseId": "punctuation-01",
      "priority": "MEDIUM"
    }
  ]
}
```

**Success:** `200 OK`

Rules:

- Recommendations must be deterministic and explainable.
- Use sufficient historical samples before generating a recommendation.
- Do not use LLMs, Ollama, cloud AI, or remote inference.
- Do not return recommendations that refer to unavailable exercises.
- Keep recommendation thresholds configurable and documented.

## 14. Settings endpoints

### GET `/settings`

Retrieve application settings.

**Success:** `200 OK`

### PUT `/settings`

Replace or update supported settings. The implementation must choose and document whether this endpoint uses full replacement or partial update semantics. The initial contract uses full replacement.

Request:

```json
{
  "theme": "SYSTEM",
  "soundEnabled": false,
  "showKeyboard": true,
  "showLiveWpm": true,
  "defaultTestDurationSeconds": 60,
  "keyboardLayout": "US_QWERTY",
  "reducedMotion": false
}
```

**Success:** `200 OK`

Validation:

- Reject unknown enum values.
- Validate duration against supported configuration.
- Apply safe defaults when optional settings are absent only if the documented update semantics permit it.
- Do not accept arbitrary file paths or executable commands as settings.

## 15. Health and readiness

The desktop shell needs a way to determine whether Spring Boot has completed startup.

### GET `/internal/health`

Return minimal local readiness information.

Example response:

```json
{
  "status": "UP",
  "application": "typing-trainer",
  "apiVersion": "v1"
}
```

**Success:** `200 OK`

Requirements:

- Bind to loopback only.
- Do not expose environment variables, database paths, system details, or dependency diagnostics.
- Do not enable unrestricted public Actuator endpoints.
- The desktop shell should use a bounded startup timeout and retry policy.

## 16. Validation and limits

The backend must define and enforce explicit limits for:

- Display-name length.
- Custom exercise title and content length.
- Number of tags per exercise.
- Maximum request body size.
- Maximum page size.
- Maximum test duration.
- Number of key-stat entries per session.
- Date-range size for analytics queries.

Exact limits should be centralized in configuration or validation constants and covered by tests. Avoid accepting unbounded input.

## 17. API versioning and compatibility

- All initial endpoints are under `/api/v1`.
- Do not silently change the meaning of an existing field.
- Add optional response fields where backward compatibility permits.
- Treat enum additions as a frontend compatibility consideration.
- Update this document whenever a request, response, status code, validation rule, or metric policy changes.
- Keep frontend API types aligned with the backend DTOs.
- Consider generating or validating frontend types from the OpenAPI specification to reduce contract drift.

## 18. Open contract decisions

Finalize these during implementation:

1. Whether the first release supports one local profile or multiple local profiles.
2. Exact WPM and accuracy definitions, including corrected mistakes.
3. Whether session deletion is enabled.
4. Whether custom exercise import/export is supported and which file formats are accepted.
5. Exact limits for test duration, content length, and pagination.
6. The Tauri-to-backend startup handshake and local request protection mechanism.
7. Whether lesson progress is updated per exercise or per completed lesson.
8. The exact response structure for lesson and exercise pagination.

Do not invent behavior for unresolved decisions. Record the selected behavior here and in the relevant implementation tests before shipping it.

## 19. Definition of done

The API contract is implemented when:

- Every implemented endpoint matches its documented method, path, payload, and status codes.
- Request validation is covered by tests.
- Error responses follow the common structure.
- Session submissions are idempotent.
- Session and analytics data persist correctly in SQLite.
- No per-keystroke API calls are made.
- The backend is loopback-only and protected against unintended local cross-origin access.
- The desktop shell can detect readiness and handle backend failure.
- The API works without internet connectivity.
- OpenAPI documentation is available for the implemented endpoints.

---

**Contract baseline:** Local REST API, `/api/v1`, Spring Boot 3 + Java 21, SQLite persistence, frontend-owned typing loop, offline-first behavior, and no AI/LLM integration.
