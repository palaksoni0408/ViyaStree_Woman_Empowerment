# Backend Models Deep Dive

Scope: `backend/models/*.js`

This document describes the schema fields, types, defaults, and noteworthy constraints.

## User (`backend/models/User.js`)

Schema purpose: Store authentication data, profile details, and empowerment progress.

Fields:

| Field | Type | Required or Default | Notes |
| --- | --- | --- | --- |
| `userId` | String | unique | App-level identifier (not Mongo `_id`). |
| `email` | String | required, unique | Login identifier. |
| `password` | String | required | Stored as bcrypt hash. |
| `profile.name` | String | optional | Display name. |
| `profile.location` | String | optional | Defaults handled in controller. |
| `profile.avatar` | String | optional | Relative path like `/uploads/<file>`. |
| `preferences` | Mixed | optional | Flexible user preferences. |
| `progress.level` | Number | default `1` | User level. |
| `progress.points` | Number | default `0` | Aggregate points. |
| `progress.completed_skills` | [String] | optional | Array of completed course IDs. |
| `progress.badges` | [String] | optional | Earned badges. |
| `progress.completed_safety_lessons` | Number | default `0` | Count of safety lessons. |
| `saved_opportunities` | [String] | optional | Saved opportunity IDs. |
| `applications` | [Mixed] | optional | Flexible application data. |
| `createdAt` | Date | default `Date.now` | Creation timestamp. |
| `lastActive` | Date | default `Date.now` | Last activity timestamp. |

Data shape example:
```json
{
  "userId": "user_1700000000000",
  "email": "user@example.com",
  "password": "<bcrypt-hash>",
  "profile": {
    "name": "User",
    "location": "India",
    "avatar": "/uploads/avatar-123.jpg"
  },
  "preferences": {},
  "progress": {
    "level": 1,
    "points": 0,
    "completed_skills": [],
    "badges": [],
    "completed_safety_lessons": 0
  },
  "saved_opportunities": [],
  "applications": [],
  "createdAt": "2026-02-03T00:00:00.000Z",
  "lastActive": "2026-02-03T00:00:00.000Z"
}
```

## Course (`backend/models/Course.js`)

Schema purpose: Represent a learning course or module.

Fields:

| Field | Type | Required or Default | Notes |
| --- | --- | --- | --- |
| `courseId` | String | unique | App-level identifier. |
| `title` | String | optional | Course name. |
| `skill` | String | optional | Skill category. |
| `level` | String | optional | Level label like `Beginner`. |
| `provider` | String | optional | Organization providing course. |
| `duration` | Number | optional | Duration in hours or sessions (not enforced). |
| `url` | String | optional | External course URL. |
| `syllabus` | [String] | optional | Topics list. |
| `quiz` | Mixed | optional | Flexible quiz structure. |
| `estimatedCompletion` | String | optional | e.g., `2 weeks`. |

Data shape example:
```json
{
  "courseId": "digital_marketing_basic",
  "title": "Digital Marketing Basics",
  "skill": "Digital Marketing",
  "level": "Beginner",
  "provider": "ViyaStree Academy",
  "duration": 5,
  "url": "https://example.com/course/dm-basic",
  "syllabus": ["Topic 1", "Topic 2"],
  "quiz": {},
  "estimatedCompletion": "2 weeks"
}
```

## Opportunity (`backend/models/Opportunity.js`)

Schema purpose: Represent a job or livelihood opportunity.

Fields:

| Field | Type | Required or Default | Notes |
| --- | --- | --- | --- |
| `opportunityId` | String | unique | App-level identifier. |
| `title` | String | optional | Opportunity title. |
| `organization` | String | optional | Company or organization. |
| `location` | String | optional | Location label. |
| `workType` | String | optional | Remote, on-site, hybrid. |
| `requiredSkills` | [String] | optional | Skills required for matching. |
| `experienceLevel` | String | optional | Required experience. |
| `salary` | Mixed | optional | Flexible salary structure. |
| `description` | String | optional | Opportunity description. |
| `contactInfo` | Mixed | optional | Flexible contact data. |
| `postedDate` | Date | optional | When posted. |
| `isActive` | Boolean | default `true` | Active/inactive flag. |

Data shape example:
```json
{
  "opportunityId": "opp_123",
  "title": "Marketing Assistant",
  "organization": "Example Org",
  "location": "Remote",
  "workType": "Remote",
  "requiredSkills": ["Digital Marketing", "Excel"],
  "experienceLevel": "Entry",
  "salary": { "min": 20000, "max": 30000 },
  "description": "...",
  "contactInfo": { "email": "hr@example.com" },
  "postedDate": "2026-02-03T00:00:00.000Z",
  "isActive": true
}
```

## KnowledgeBase (`backend/models/KnowledgeBase.js`)

Schema purpose: Store legal and safety content used by Shaktih.

Fields:

| Field | Type | Required or Default | Notes |
| --- | --- | --- | --- |
| `category` | String | optional | High-level grouping. |
| `topic` | String | optional | Topic label. |
| `keywords` | [String] | optional | Search keywords. |
| `content` | Mixed | optional | Flexible content structure. |
| `relatedTopics` | [String] | optional | Related content IDs or tags. |
| `lastUpdated` | Date | default `Date.now` | Last update timestamp. |

Data shape example:
```json
{
  "category": "workplace",
  "topic": "posh_workplace_harassment",
  "keywords": ["harassment", "workplace"],
  "content": "The POSH Act ...",
  "relatedTopics": ["filing_complaint"],
  "lastUpdated": "2026-02-03T00:00:00.000Z"
}
```

Edge case to be aware of:
- The controller queries by `intent`, but `intent` is not defined in this schema. If Mongoose strict mode is enabled (default), the `intent` field in seeded data will be dropped and intent-based lookup will not match.

## Event (`backend/models/Event.js`)

Schema purpose: Record orchestration events and explainability metadata.

Fields:

| Field | Type | Required or Default | Notes |
| --- | --- | --- | --- |
| `userId` | String | optional | User ID that triggered the event. |
| `eventType` | String | optional | Event type label. |
| `module` | String | optional | Source module or pillar. |
| `data` | Mixed | optional | Event payload. |
| `triggeredActions` | [Mixed] | optional | Actions run by orchestrator. |
| `timestamp` | Date | default `Date.now` | Event time. |
| `causeEventId` | String | optional | Causality link to a prior event. |
| `impactDomain` | String | optional | One of `skill`, `livelihood`, `safety`. |
| `confidenceScore` | Number | optional | 0 to 1 for ML confidence. |

Indexes:
- `{ eventType: 1, timestamp: -1 }`
- `causeEventId` is indexed for causality queries.

Data shape example:
```json
{
  "userId": "user_123",
  "eventType": "skill_completed",
  "module": "shiksha",
  "data": { "skill": "excel_intermediate", "pointsEarned": 50 },
  "triggeredActions": [],
  "timestamp": "2026-02-03T00:00:00.000Z",
  "causeEventId": "evt_001",
  "impactDomain": "skill",
  "confidenceScore": 0.92
}
```
