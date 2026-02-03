# Backend Controllers Deep Dive

Scope: `backend/controllers/*.js`

This document explains each controller function with deep flow detail, edge cases, and the request or response shapes it expects.

## authController.js

### `signup(req, res)`

Purpose: Create a new user account, hash the password, and return a JWT.

Request body shape:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "location": "string"
}
```

Flow:
1. Read `name`, `email`, `password`, `location` from `req.body`.
2. Validate that `email` and `password` exist. If missing, respond `400`.
3. Normalize `email` by trimming and lowercasing.
4. Look up existing user by `email`. If found, respond `400`.
5. Generate bcrypt salt and hash the password.
6. Create a `userId` using current time and a random suffix.
7. Insert a new `User` document with profile and progress defaults.
8. Sign a JWT with `{ userId, id: _id }`, expiry `30d`.
9. Respond `201` with `token` and a limited `user` object.

Successful response shape:
```json
{
  "token": "string",
  "user": {
    "userId": "string",
    "email": "string",
    "profile": {
      "name": "string",
      "location": "string",
      "avatar": "string"
    },
    "progress": {
      "level": 1,
      "points": 0,
      "completed_skills": [],
      "badges": []
    }
  }
}
```

Edge cases:
1. Missing `email` or `password` returns `400` with an error.
2. Existing email returns `400` to prevent duplicate accounts.
3. Any database or hashing error returns `500`.
4. `name` is optional, `location` defaults to `India` when missing.

### `login(req, res)`

Purpose: Authenticate a user and return a JWT.

Request body shape:
```json
{
  "email": "string",
  "password": "string"
}
```

Flow:
1. Validate `email` and `password` presence. If missing, respond `400`.
2. Normalize `email` by trimming and lowercasing.
3. Find the `User` by email. If not found, respond `404`.
4. Compare plaintext password to stored hash. If mismatch, respond `400`.
5. Sign a JWT with `{ userId, id: _id }`, expiry `30d`.
6. Respond with token and selected user fields.

Successful response shape:
```json
{
  "token": "string",
  "user": {
    "userId": "string",
    "email": "string",
    "profile": {
      "name": "string",
      "location": "string",
      "avatar": "string"
    },
    "progress": {
      "level": 1,
      "points": 0,
      "completed_skills": [],
      "badges": [],
      "completed_safety_lessons": 0
    },
    "saved_opportunities": ["string"]
  }
}
```

Edge cases:
1. Missing credentials returns `400`.
2. Nonexistent user returns `404`.
3. Wrong password returns `400`.
4. Any database or JWT error returns `500`.

### `getMe(req, res)`

Purpose: Return the current user profile from the JWT.

Auth requirements:
- `Authorization: Bearer <token>` header.
- Must pass `authMiddleware` before this controller runs.

Flow:
1. Read `req.user.userId` from the JWT payload set by middleware.
2. Find user by `userId` and exclude `password`.
3. Respond with the user document.

Response shape:
```json
{
  "userId": "string",
  "email": "string",
  "profile": {
    "name": "string",
    "location": "string",
    "avatar": "string"
  },
  "preferences": {},
  "progress": {
    "level": 1,
    "points": 0,
    "completed_skills": [],
    "badges": [],
    "completed_safety_lessons": 0
  },
  "saved_opportunities": ["string"],
  "applications": [],
  "createdAt": "date",
  "lastActive": "date"
}
```

Edge cases:
1. If token is valid but user not found, the response will be `null`.
2. Any database error returns `500`.

### `updateProfile(req, res)`

Purpose: Update the authenticated user's profile fields and optional avatar.

Auth requirements:
- `Authorization: Bearer <token>` header.
- Must pass `authMiddleware` and `upload.single('avatar')`.

Request body shape (JSON or multipart with fields):
```json
{
  "name": "string",
  "location": "string",
  "avatar": "string"
}
```

Flow:
1. Extract `name`, `location`, `avatar` from `req.body`.
2. Load user by `req.user.userId`. If not found, respond `404`.
3. Update `profile.name` and `profile.location` if provided.
4. If `req.file` exists, set `profile.avatar` to `/uploads/<filename>`.
5. Else if `avatar` string is provided, set `profile.avatar` to that value.
6. Save user and respond with `{ success: true, user }`.

Response shape:
```json
{
  "success": true,
  "user": {
    "userId": "string",
    "profile": {
      "name": "string",
      "location": "string",
      "avatar": "string"
    }
  }
}
```

Edge cases:
1. Upload middleware rejects non-image files before the controller runs.
2. If both file upload and `avatar` string are provided, the file path wins.
3. If user is missing, responds `404`.
4. Any database error returns `500`.

## shikshaController.js

### `getCourses(req, res)`

Purpose: List all courses.

Flow:
1. Query `Course.find({})`.
2. Respond with `{ courses }`.

Response shape:
```json
{
  "courses": [
    {
      "courseId": "string",
      "title": "string",
      "skill": "string",
      "level": "string",
      "provider": "string",
      "duration": 0,
      "url": "string",
      "syllabus": ["string"],
      "quiz": {},
      "estimatedCompletion": "string"
    }
  ]
}
```

Edge cases:
1. Any database error returns `500`.

### `getCourse(req, res)`

Purpose: Fetch a single course by `courseId`.

Flow:
1. Read `req.params.courseId`.
2. Query `Course.findOne({ courseId })`.
3. If missing, respond `404`.
4. Respond with `{ course }`.

Edge cases:
1. Nonexistent course returns `404`.
2. Database errors return `500`.

### `generatePath(req, res)`

Purpose: Return a learning path. Currently a stub that returns all courses.

Request body shape:
```json
{
  "interests": ["string"],
  "currentLevel": "beginner",
  "timeAvailable": 5
}
```

Flow:
1. Read `interests`, `currentLevel`, `timeAvailable` from `req.body`.
2. Query all courses.
3. Return `{ learningPath: courses, totalEstimatedTime: '0 weeks' }`.

Response shape:
```json
{
  "learningPath": ["Course"],
  "totalEstimatedTime": "0 weeks"
}
```

Edge cases:
1. Input fields are currently unused; they do not influence output.
2. Database errors return `500`.

### `updateProgress(req, res)`

Purpose: Update user progress after course completion and trigger orchestration.

Request body shape:
```json
{
  "userId": "string",
  "courseId": "string",
  "action": "complete",
  "quizScore": 0
}
```

Flow:
1. Read `userId`, `courseId`, `action`, `quizScore` from body.
2. Find `User` by `userId` or fallback to `demo_user`.
3. If user missing, respond `404`.
4. Compute `pointsEarned`: 50 for `quizScore >= 80`, 30 for `>= 60`, else 0.
5. Initialize `progress` if missing.
6. Add `pointsEarned` to `progress.points`.
7. Add `courseId` to `progress.completed_skills` with uniqueness enforced.
8. Save user.
9. Emit `skill_completed` event via orchestrator.
10. Respond with points and status flags.

Response shape:
```json
{
  "pointsEarned": 50,
  "totalPoints": 100,
  "levelUp": false,
  "orchestrationTriggered": true
}
```

Edge cases:
1. Missing or non-numeric `quizScore` results in `pointsEarned = 0`.
2. Missing `courseId` can be added to `completed_skills` as `undefined`.
3. `action` is read but not used.
4. Any database error returns `500`.

## samruddhihController.js

### `matchOpportunities(req, res)`

Purpose: Match opportunities based on user skill overlap (Jaccard similarity).

Request body shape:
```json
{
  "userId": "string"
}
```

Flow:
1. Read `userId` from body and load user.
2. If missing, respond `404`.
3. Extract `userSkills` from `user.progress.completed_skills`.
4. If empty, return an empty match list and a guidance message.
5. Query all active opportunities.
6. For each opportunity, compute Jaccard similarity with `userSkills`.
7. Build match objects with `matchedSkills` and `missingSkills` lists.
8. Filter out zero-score matches and sort descending by score.
9. Respond with match list and user skills.

Response shape:
```json
{
  "matches": [
    {
      "opportunityId": "string",
      "title": "string",
      "organization": "string",
      "location": "string",
      "workType": "string",
      "requiredSkills": ["string"],
      "experienceLevel": "string",
      "salary": {},
      "matchScore": 0.75,
      "matchedSkills": ["string"],
      "missingSkills": ["string"]
    }
  ],
  "totalMatches": 1,
  "showing": 1,
  "userSkills": ["string"]
}
```

Edge cases:
1. Empty `userSkills` returns zero matches with a message.
2. If an opportunity has no `requiredSkills`, its match score is zero.
3. Any database error returns `500`.

### `saveOpportunity(req, res)`

Purpose: Save an opportunity to the user's profile and emit an event.

Request body shape:
```json
{
  "userId": "string",
  "opportunityId": "string",
  "status": "interested"
}
```

Flow:
1. Find `User` by `userId` or fallback to `demo_user`.
2. If missing, respond `404`.
3. Initialize `saved_opportunities` if missing.
4. Add `opportunityId` if not already saved.
5. Save user.
6. Emit `opportunity_saved` event via orchestrator.
7. Respond with `saved: true` and count.

Response shape:
```json
{
  "saved": true,
  "totalSaved": 1,
  "orchestrationTriggered": true
}
```

Edge cases:
1. Missing `opportunityId` can be added as `undefined`.
2. Any database error returns `500`.

## shaktihController.js

### `handleLegalQuery(req, res)`

Purpose: Answer legal or safety questions using a knowledge base with urgency checks.

Request body shape:
```json
{
  "query": "string"
}
```

Flow:
1. Read `query` and run `analyzeQuery(query)` to get `{ intent, severity }`.
2. Split query into search terms longer than 3 characters.
3. Create regex patterns for each term.
4. Query `KnowledgeBase` for a match in `keywords` or `content`.
5. If not found and intent is not `general`, try `KnowledgeBase.findOne({ intent })`.
6. If a match is found, respond with `content` and `relatedTopics`.
7. If severity is `urgent`, include helpline details.
8. If no match, return a fallback message and a short related topic list.

Response shape (match found):
```json
{
  "response": "string",
  "relatedTopics": ["string"],
  "severity": "informational",
  "helpline": null
}
```

Response shape (urgent):
```json
{
  "response": "string",
  "relatedTopics": ["string"],
  "severity": "urgent",
  "helpline": "181 (Women Helpline) or 100 (Police)"
}
```

Edge cases:
1. Missing or non-string `query` can cause a runtime error in `toLowerCase()`.
2. Knowledge base fallback by `intent` may fail if `intent` is not persisted in the schema.
3. Database errors return `500`.

### `analyzeQuery(query)`

Purpose: Classify intent and detect urgent safety situations.

Flow:
1. Lowercase the query string.
2. Scan for urgent keywords to set `severity`.
3. Scan intent patterns in priority order and return the first match.
4. Default to `{ intent: 'general', severity }` if no patterns match.

Edge cases:
1. If `query` is undefined, `toLowerCase()` will throw.

### `getLesson(req, res)`

Purpose: Placeholder lesson API.

Flow:
1. Read `lessonId` from route params.
2. Return a static lesson object and progress stub.

Response shape:
```json
{
  "lesson": {
    "id": "string",
    "title": "Sample Lesson",
    "screens": [],
    "quiz": []
  },
  "userProgress": {
    "completed": false,
    "currentScreen": 0
  }
}
```

Edge cases:
1. No database integration yet; response is always static.
