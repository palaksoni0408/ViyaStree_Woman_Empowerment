# Frontend Deep Documentation

Scope: `frontend/` with emphasis on `frontend/src/*`.

This document explains frontend flow, functions, state, and edge cases at a deep level, suitable for code walkthroughs or judging.

## 1. Entry and Routing

### `frontend/index.html`

Purpose: Vite HTML entry point.

Flow:
1. Browser loads static HTML.
2. `<div id="root">` provides the mount target.
3. `src/main.jsx` is loaded as a module.

Edge cases:
1. If `#root` is missing, React mount will fail.

### `frontend/src/main.jsx`

Purpose: React application bootstrap.

Flow:
1. Import React and `createRoot`.
2. Import `BrowserRouter` for client-side routing.
3. Import `App` and `styles.css`.
4. Mount `<App />` into `#root` inside `React.StrictMode` and `BrowserRouter`.

Edge cases:
1. Strict mode double-invokes some effects in development.
2. If `BrowserRouter` is removed, route navigation breaks.

### `frontend/src/App.jsx`

Purpose: App-level routes, protected routing, and global context provider.

Key components:
- `Notifications`: renders ephemeral notifications from `AuthContext`.
- `ProtectedRoute`: redirects unauthenticated users to `/login`.

Flow:
1. `AuthProvider` wraps the full app and makes auth state available.
2. Public routes: `/`, `/login`, `/signup`, `/docs`.
3. Protected route group at `/dashboard/*`:
4. `ProtectedRoute` checks `user` and `loading` from `AuthContext`.
5. If loading, show a full-page loading state.
6. If no user, navigate to `/login` and return `null` to block render.
7. If authenticated, render `Header`, `Notifications`, and nested dashboard routes.

Edge cases:
1. If `user` is `null` and `loading` is `false`, `ProtectedRoute` prevents rendering but still relies on `navigate`.
2. If navigation fails, the UI will remain blank.

## 2. API and Auth Flow

### `frontend/src/context/AuthContext.jsx`

Purpose: Centralized auth state, token management, user persistence, and helper actions that call the backend APIs.

State:
- `user`: current user object or `null`.
- `loading`: `true` until initial token check finishes.
- `notifications`: array of in-app messages.

Initialization flow:
1. On mount, read `token` from `localStorage`.
2. If token exists, call `/api/v1/auth/me`.
3. If response is OK, set `user` to returned data.
4. If response fails or network errors, remove token.
5. Set `loading` to `false`.

Functions:

`pushNotification(msg, explanation)`
Flow:
1. Create an ID using `Date.now()`.
2. Push a `{ id, msg, explanation }` item into `notifications`.
3. After 6 seconds, auto-remove by ID.

Edge cases:
1. Rapid consecutive calls can produce the same `Date.now()` value.
2. Notifications are only in-memory and are lost on reload.

`login(email, password)`
Flow:
1. POST `/api/v1/auth/login` with JSON body.
2. If response not OK, throw an error with backend message.
3. Store token in `localStorage`.
4. Set `user` state to response user.
5. Return `{ success: true }` or `{ success: false, error }`.

Edge cases:
1. Missing email or password is validated in backend, not frontend.
2. If network fails, returns a generic error message.

`signup(name, email, password, location)`
Flow:
1. POST `/api/v1/auth/signup` with JSON body.
2. On success, store token and update `user`.
3. Return success result shape.

Edge cases:
1. Duplicate email errors are returned by backend.
2. Network errors return a generic message.

`logout()`
Flow:
1. Remove token from `localStorage`.
2. Set `user` to `null`.

`completeCourse(courseId, quizScore)`
Flow:
1. POST `/api/v1/shiksha/update-progress` with `userId`, `courseId`, `quizScore`.
2. Update local `user.progress.points` and `completed_skills`.
3. If backend indicates orchestration, push a notification.
4. Return backend JSON response.

Edge cases:
1. If `user` is null, function returns early.
2. If backend returns invalid data, local state may become inconsistent.
3. Points are incremented optimistically using local state.

`saveOpportunity(opportunityId)`
Flow:
1. POST `/api/v1/samruddhih/save-opportunity` with `userId` and `opportunityId`.
2. Update `saved_opportunities` locally.
3. If orchestration triggered, push notification.
4. Return backend response.

Edge cases:
1. If `user` is null, function returns early.
2. If backend fails, UI may still show optimistic saved state.

`askLegalQuery(query)`
Flow:
1. POST `/api/v1/shaktih/legal-query` with `userId` and `query`.
2. Return response JSON.

Edge cases:
1. If `user` is null, returns `{ error: 'Please login' }`.
2. Network errors return `{ error: 'network' }`.

## 3. Global Styling

### `frontend/src/styles.css`

Purpose: Design system and reusable classes.

Key areas:
1. CSS variables for colors, spacing, typography, and z-index.
2. Base element resets and typographic defaults.
3. Utility classes for spacing and layout.
4. Component classes: header, cards, buttons, badges, lists, and progress bars.

Edge cases:
1. Many pages use inline styles that override the global system.
2. Some components mix global classes with inline styles, which can complicate consistency.

## 4. Reusable Components

### `frontend/src/components/Header.jsx`

Purpose: Global navigation and SOS modal.

State:
- `showSOS` toggles the SOS modal.

Flow:
1. Render brand and navigation links.
2. Show SOS button. Clicking it sets `showSOS` to `true`.
3. Show profile summary using `user` from `AuthContext`.
4. `logout()` clears auth state.
5. If `showSOS` is true, render a modal with `tel:` links.

Edge cases:
1. If `user.profile.avatar` is a relative URL, it relies on backend `/uploads` proxy.
2. SOS modal uses inline styles and is not keyboard focus managed.

### `frontend/src/components/Button.jsx`

Purpose: Wrapper around `<button>` with class name composition.

Flow:
1. Merge `className` with default `btn` class.
2. Pass through all other props.

Edge cases:
1. Relies on `.btn` styles defined in CSS.

### `frontend/src/components/Icon.jsx`

Purpose: Common SVG icons used across the app.

Exports:
- `Bell`, `User`, `Shield`, `BookOpen`, `Briefcase`, `ArrowRight`.

Edge cases:
1. Icons accept props but do not enforce sizing or color consistency.

### `frontend/src/components/base/*`

`MetricCard.jsx`
Flow:
1. Choose class names based on `variant`.
2. Render metric value and label.

`InfoCard.jsx`
Flow:
1. Render a standard card container.
2. Optionally render a title.

`Badge.jsx`
Flow:
1. Use `variant` to select base or colored badge class.
2. Render children inside a `<span>`.

`PageHeader.jsx`
Flow:
1. Render page title and subtitle using consistent layout.

## 5. Pages and Feature Flows

### `frontend/src/pages/Landing.jsx`

Purpose: Public marketing landing page.

Flow:
1. Renders a marketing header with links to Docs and Dashboard.
2. Hero section highlights the three pillars.
3. Features section summarizes Shaktih, Shiksha, Samruddhih.
4. CTA section links to dashboard.
5. Developer showcase section.
6. Footer with policy placeholders.

Edge cases:
1. Uses static images from `public/` and assumes they exist.

### `frontend/src/pages/Login.jsx`

Purpose: Login form.

Flow:
1. Collect email and password.
2. Call `login(email, password)` from `AuthContext`.
3. On success, navigate to `/dashboard`.
4. On error, show error message and optional signup link.

Edge cases:
1. Error handling relies on backend error strings.
2. Email and password validation is minimal.

### `frontend/src/pages/Signup.jsx`

Purpose: Signup form.

Flow:
1. Collect name, email, location, password.
2. Call `signup()` from `AuthContext`.
3. On success, navigate to `/dashboard`.
4. On error, show error message.

Edge cases:
1. Location is required in UI but backend allows defaulting.

### `frontend/src/pages/Dashboard.jsx`

Purpose: Show empowerment score and recent activity.

State:
- `data`: dashboard data from backend.
- `loading`: request status.

Flow:
1. When `user.userId` is available, fetch `/api/v1/orchestration/dashboard`.
2. Store `data` and `loading` flags.
3. Render profile summary from `user`.
4. Render Unnati preview card and CTA to `/dashboard/unnati`.
5. Render empowerment score and breakdown metrics.
6. Render next action and recent activity based on `data` and `user`.

Edge cases:
1. If fetch fails, `data` is `null` and score shows a fallback.
2. Dashboard relies on `user.progress` for recent activity.

### `frontend/src/pages/Profile.jsx`

Purpose: Update profile fields and avatar.

State:
- `name`, `location`, `avatarPreview`, `msg`, `error`, `saving`.

Flow:
1. Initialize form fields from `user.profile`.
2. File input creates a local preview URL.
3. On Save, create `FormData` with name, location, avatar file.
4. Send PUT `/api/v1/auth/profile` with bearer token.
5. On success, show message and reload page to refresh profile.

Edge cases:
1. Uses `window.location.reload()` rather than updating context state.
2. If token is missing, backend returns 401.
3. File input is accessed via DOM ID, not React ref.

### `frontend/src/pages/Shiksha.jsx`

Purpose: Learning hub for courses, skill tracking, and guided experiences.

Key state:
- `courses`, `loading`, `activeCourse`, `modalOpen`, `processing`, `msg`.
- `infoModal`, `legalModal`, `viyaModal`, `manasModal`, `guruModal`.
- `answers`, `quizResult`.

Data flow:
1. Fetch `/api/v1/shiksha/courses` on mount.
2. Store the list of courses for display.
3. `hasCompleted(courseId)` checks progress from `user`.

Function flows:

`handleStart(course)`
1. Skip if already completed.
2. Choose Lottie animation URL based on course keywords.
3. Build Hindi narration text.
4. Set `activeCourse` and open modal.

`finishCourse()`
1. Call `completeCourse(courseId, 90)`.
2. If `pointsEarned` exists, show a success message.
3. Auto-close modal after 3 seconds.

`playVoice(text)` and `playVoiceHindi(text)`
1. Use `window.speechSynthesis` to speak text.
2. Cancel prior speech before starting.

`loadLottieAnimation(container, jsonUrl)`
1. Load lottie-web from CDN if missing.
2. Fetch JSON animation data.
3. Render and autoplay the animation in the container.

`submitQuiz()`
1. Score a 2-question quiz using string comparison.
2. Set `quizResult` with score and total.

Edge cases:
1. If course list is empty, shows an error.
2. Lottie loads from third-party CDN, which can fail.
3. Speech synthesis depends on browser support.
4. `submitQuiz()` uses string matching and is case sensitive for some inputs.

### `frontend/src/pages/Samruddhih.jsx`

Purpose: Livelihood hub with jobs, schemes, and interactive tools.

Key state:
- `activeTab`, `message`, `loading`.
- Quiz states for readiness and mindset.
- Modals for multiple sections.

Function flows:

`playVoiceHindi(text)`
1. Use speech synthesis in Hindi locale.

`saveOpportunityClick(oppId)`
1. Call `saveOpportunity(oppId)` from context.
2. Set a success message.

`getUserSkills()`
1. Return `user.progress.completed_skills` or empty array.

`getSkillMatch(oppSkills)`
1. Calculate `matched` and `missing` skill lists.
2. Return `{ matched, missing }`.

Flow summary:
1. Jobs tab lists demo opportunities and matches them to user skills.
2. Save button calls backend and updates state.
3. Apply button navigates to `ViyaApply` with job data in `location.state`.
4. Other tabs render static content, quizzes, and modals.

Edge cases:
1. Uses demo opportunity data instead of backend-driven matching.
2. Some tabs rely on large inline UI without backend persistence.

### `frontend/src/pages/Shaktih.jsx`

Purpose: Safety and legal rights hub with SOS, chatbot, and quiz.

Key state:
- `chatLanguage`, `query`, `chatMessages`, `loading`.
- `quizScore`, `quizAnswered`, `badgeEarned`.

Function flows:

`playVoiceHindi(text)`
1. Uses speech synthesis for Hindi output.

`dialEmergency(number, name)`
1. Play a Hindi voice prompt.
2. Redirect to `tel:` link for immediate dialing.

`handleChatSubmit()`
1. Validate `query`.
2. Append user message to `chatMessages`.
3. Generate bot response using `generateBotResponse()`.
4. Add bot reply after 800ms.
5. Clear the input.

`generateBotResponse(query)`
1. Keyword-based logic for rights, harassment, digital safety, loans, work.
2. Returns response in Hindi or English based on `chatLanguage`.
3. Returns a fallback response if no keywords match.

`handleQuizAnswer(questionIdx, isCorrect)`
1. Increment score when correct.
2. If score reaches 3, set `badgeEarned` and play a voice message.
3. Mark quiz as answered.

Edge cases:
1. Chatbot is local and does not call backend.
2. Query checks are substring-based and may misclassify.

### `frontend/src/pages/UdyamKosh.jsx`

Purpose: Multi-step microfunding journey.

Key state:
- `currentStep`, `loanIntent`, `loanAmount`, `eligibilityAnswers`.
- `literacyWatched`, `videoProgress`, `processing`, `loanApproved`.
- `disbursalSuccess`, `voiceRecording`.
- `repaymentsMade`, `totalRepaymentTarget`.

Function flows:

`playVoiceHindi(text)`
1. Speech synthesis for Hindi instructions.

`loadLottieAnimation(container, jsonUrl)`
1. Inject lottie-web script.
2. Render animation in the container.

`handleProcessing()`
1. Set processing state.
2. Simulate verification delay.
3. Mark loan approved and announce by voice.

`handleDisbursal()`
1. Set disbursal success state.
2. Announce transfer amount by voice.
3. Navigate to step 7 after delay.

`handleVideoComplete()`
1. Mark literacy video as watched.
2. Play completion voice feedback.

`useEffect` video progress
1. When on step 3, increment progress every second.
2. When progress hits 100, call `handleVideoComplete()`.

`getLoanRepresentation(amount)`
1. Choose closest pre-defined loan item for UI display.

Edge cases:
1. `handleProcessing` contains a hook call (`useRef`) inside a function body, which is not valid React hook usage.
2. The Lottie script is appended each time without a check in this file.
3. Many steps are simulated and not persisted to backend.

### `frontend/src/pages/StartupGuide.jsx`

Purpose: 5-step startup mentoring journey.

Key state:
- `currentStep`, `completedSteps`, `skills`, `businessPurpose`.
- `selectedNiche`, `pricing`, `budget`, `businessName`, `generatedQR`.

Function flows:

`playVoiceHindi(text)`
1. Speech synthesis for guidance.

`loadLottieAnimation(container, jsonUrl)`
1. Inject lottie-web if not already present.
2. Render animation in the container.

`markStepComplete(stepNum)`
1. Add the step to `completedSteps` if not present.
2. Announce progress with Hindi voice.

`calculatePrice(cost, profitMargin)`
1. Return `ceil(cost * (1 + margin/100))`.

Edge cases:
1. This flow is mostly UI-driven; no backend persistence.

### `frontend/src/pages/ViyaApply.jsx`

Purpose: Guided multi-step job application flow.

Key state:
- `step`, `formData`, `submitted`, `showSuccessAnimation`.

Function flows:

`playVoiceHindi(text)`
1. Speak Hindi guidance.

`toggleSkill(skillId)`
1. Toggle skill in `formData.skills` list.

`handleResumeUpload(e)`
1. Set uploaded file in `formData`.
2. Disable resume builder toggle.

`generateResume()`
1. Build a plain text resume from form data.
2. Create a `File` object and store it in state.

`handleSubmit()`
1. Play voice feedback.
2. Show success animation.
3. Mark submission as complete after a timeout.

`getRoleGuidance()`
1. Compute guidance based on job title keywords.
2. Return a focus message, nudge, and tips.

Edge cases:
1. Submission is simulated; no backend call is made.
2. `jobData` depends on route state and falls back to placeholders.

### `frontend/src/pages/Unnati.jsx`

Purpose: Unified progress visualization and mini-games.

Key state:
- `completedMilestones` for three pillars.
- `activeGame` and `gameProgress` for mini-games.

Flow:
1. Compute `overallProgress` from milestone counts.
2. Render progress meter and per-pillar progress.
3. Show milestone lists and interactive sections.
4. Provide mini-games for finance, rights, and scam awareness.

Edge cases:
1. Progress data is static and not synced to backend.

### `frontend/src/pages/Docs.jsx`

Purpose: In-app documentation / pitch page.

Flow:
1. Render static sections explaining ViyaStree model and navigation.
2. Provide a Hindi audio button using speech synthesis.

Edge cases:
1. Content is static and does not update from backend.

## 6. Build and Dev Configuration

### `frontend/vite.config.mjs`

Purpose: Vite configuration with API proxy.

Flow:
1. React plugin enabled.
2. `/api` and `/uploads` proxy to `http://localhost:5001`.
3. Proxy allows frontend to call backend without CORS issues in dev.

Edge cases:
1. Backend must run on port 5001 for proxies to work.

### `frontend/package.json`

Purpose: Dependencies and scripts.

Scripts:
- `dev`: starts Vite dev server.
- `build`: production build.
- `preview`: preview build output.

## 7. Data Shapes Used in Frontend

User (from backend `auth/me` or login responses):
```json
{
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
    "completed_skills": ["string"],
    "badges": ["string"],
    "completed_safety_lessons": 0
  },
  "saved_opportunities": ["string"]
}
```

Course list (`/api/v1/shiksha/courses`):
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

Dashboard data (`/api/v1/orchestration/dashboard`):
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
