# Backend Routes Deep Dive

Scope: `backend/routes/*.js`

Base path for all routes is `/api/v1` as configured in `backend/index.js`.

## auth.js

### `POST /api/v1/auth/signup`

Purpose: Register a new user.

Flow:
1. Express matches `/auth/signup`.
2. `authController.signup` handles validation, creation, and token issuance.

Request body shape:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "location": "string"
}
```

Response: JWT and user profile object.

### `POST /api/v1/auth/login`

Purpose: Authenticate a user.

Flow:
1. Express matches `/auth/login`.
2. `authController.login` validates credentials and issues a token.

Request body shape:
```json
{
  "email": "string",
  "password": "string"
}
```

Response: JWT and user profile object.

### `GET /api/v1/auth/me`

Purpose: Return current authenticated user.

Flow:
1. `authMiddleware` verifies `Authorization` header and sets `req.user`.
2. `authController.getMe` loads user by `userId` and returns it.

Headers:
```
Authorization: Bearer <token>
```

Response: full user object without `password`.

### `PUT /api/v1/auth/profile`

Purpose: Update authenticated user profile and optional avatar upload.

Flow:
1. `authMiddleware` verifies `Authorization` header.
2. `upload.single('avatar')` handles file upload and validation.
3. `authController.updateProfile` updates user fields and persists.

Headers:
```
Authorization: Bearer <token>
```

Request body shape (JSON or multipart fields):
```json
{
  "name": "string",
  "location": "string",
  "avatar": "string"
}
```

Response: `{ success: true, user }`.

## shiksha.js

### `POST /api/v1/shiksha/generate-path`

Purpose: Return a learning path. Current implementation returns all courses.

Flow:
1. Express matches `/shiksha/generate-path`.
2. `shikshaController.generatePath` returns a stub learning path.

Request body shape:
```json
{
  "interests": ["string"],
  "currentLevel": "beginner",
  "timeAvailable": 5
}
```

Response: `{ learningPath, totalEstimatedTime }`.

### `POST /api/v1/shiksha/update-progress`

Purpose: Update user progress and emit `skill_completed` event.

Flow:
1. Express matches `/shiksha/update-progress`.
2. `shikshaController.updateProgress` updates user and emits orchestration event.

Request body shape:
```json
{
  "userId": "string",
  "courseId": "string",
  "action": "complete",
  "quizScore": 0
}
```

Response: `{ pointsEarned, totalPoints, levelUp, orchestrationTriggered }`.

### `GET /api/v1/shiksha/courses`

Purpose: List all courses.

Flow:
1. Express matches `/shiksha/courses`.
2. `shikshaController.getCourses` returns course list.

Response: `{ courses }`.

### `GET /api/v1/shiksha/course/:courseId`

Purpose: Fetch a single course by ID.

Flow:
1. Express matches `/shiksha/course/:courseId`.
2. `shikshaController.getCourse` loads the course and returns it.

Response: `{ course }` or `404` if missing.

## samruddhih.js

### `POST /api/v1/samruddhih/match-opportunities`

Purpose: Match opportunities by skill overlap.

Flow:
1. Express matches `/samruddhih/match-opportunities`.
2. `samruddhihController.matchOpportunities` computes Jaccard similarity.

Request body shape:
```json
{
  "userId": "string"
}
```

Response: `{ matches, totalMatches, showing, userSkills }`.

### `POST /api/v1/samruddhih/save-opportunity`

Purpose: Save an opportunity for a user and emit `opportunity_saved`.

Flow:
1. Express matches `/samruddhih/save-opportunity`.
2. `samruddhihController.saveOpportunity` saves and emits event.

Request body shape:
```json
{
  "userId": "string",
  "opportunityId": "string",
  "status": "interested"
}
```

Response: `{ saved, totalSaved, orchestrationTriggered }`.

## shaktih.js

### `POST /api/v1/shaktih/legal-query`

Purpose: Query the legal/safety knowledge base with intent and severity detection.

Flow:
1. Express matches `/shaktih/legal-query`.
2. `shaktihController.handleLegalQuery` analyzes query and returns KB response.

Request body shape:
```json
{
  "query": "string"
}
```

Response: `{ response, relatedTopics, severity, helpline }`.

### `GET /api/v1/shaktih/lesson/:lessonId`

Purpose: Fetch a safety lesson stub.

Flow:
1. Express matches `/shaktih/lesson/:lessonId`.
2. `shaktihController.getLesson` returns a placeholder lesson.

Response: `{ lesson, userProgress }`.

## orchestration.js

### `GET /api/v1/orchestration/dashboard`

Purpose: Return empowerment score and dashboard aggregates.

Flow:
1. Express matches `/orchestration/dashboard`.
2. Loads user by `userId` query parameter or defaults to `demo_user`.
3. Computes empowerment score and returns breakdown and raw counts.

Query string:
```
?userId=<string>
```

Response shape:
```json
{
  "userId": "string",
  "empowermentScore": 0,
  "breakdown": {
    "skill": 33.33,
    "livelihood": 33.33,
    "safety": 33.34
  },
  "rawCounts": {
    "completedSkills": 0,
    "savedOpportunities": 0,
    "safetyLessons": 0
  },
  "recommendations": [],
  "recentActivity": [],
  "nextSteps": []
}
```
