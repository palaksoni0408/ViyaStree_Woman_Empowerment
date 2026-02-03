# ViyaStree Submission Guide

This guide is written for judges and reviewers. It explains how to run the project locally, how to validate the core flows, and how to demo the full experience in a professional, repeatable way.

## What You Are Evaluating

ViyaStree is a three‑pillar platform that connects:
- Shiksha: skill learning and progress tracking
- Samruddhih: livelihood opportunities and matching
- Shaktih: safety, legal awareness, and emergency support

The system also includes an orchestration engine that links user actions across pillars and generates a unified empowerment score.

## Repository Structure

- `backend/` API server, MongoDB models, orchestration engine, scripts
- `frontend/` React dashboard application
- `landing page/` standalone marketing landing page
- `data/` local data assets

## System Requirements

- Node.js 18+ recommended
- MongoDB (local or Atlas)

## Quick Start (Recommended)

### 1. Start Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed, then run:
npm run dev
```

Default backend port is `5000`. If you change it, update `frontend/vite.config.mjs` to match.

### 2. Seed Sample Data (Optional but recommended for demos)

```bash
cd backend
node scripts/seed_database.js
```

This populates courses and legal knowledge base entries used by Shiksha and Shaktih.

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on the Vite default port and proxies `/api` to the backend.

### 4. (Optional) Start Landing Page

```bash
cd "landing page"
npm install
npm run dev
```

## Core Demo Script (5–7 minutes)

### A. Create an Account

1. Open the frontend URL.
2. Click **Sign Up**.
3. Enter name, email, location, and password.
4. Submit to reach the dashboard.

### B. Shiksha (Skills)

1. Go to **Shiksha** from the top navigation.
2. Start a course and complete it.
3. Observe:
   - Points and completed skills update
   - Orchestration notification appears

### C. Samruddhih (Livelihood)

1. Go to **Samruddhih**.
2. Save an opportunity.
3. Observe:
   - Saved opportunities list updates
   - Orchestration notification appears

### D. Shaktih (Safety & Rights)

1. Go to **Shaktih**.
2. Ask a legal rights question in the chatbot.
3. Review the safety quiz and SOS actions.

### E. Dashboard (Empowerment Score)

1. Return to **Dashboard**.
2. Observe updated Empowerment Score and breakdown across pillars.

## API Verification (Optional)

If you want a scripted end‑to‑end check:

```bash
cd backend
node scripts/verify_full_flow.js
```

This script tests signup, login, profile update, course completion, opportunity saving, legal query, and dashboard score.

## Configuration Notes

The frontend proxy is configured in `frontend/vite.config.mjs`:
- `/api` and `/uploads` are proxied to `http://localhost:5001` by default.
- If backend runs on port `5000`, adjust the proxy target or the backend port.

Recommended config alignment:
- Backend `PORT=5001` in `backend/.env`
- Frontend proxy pointing to `http://localhost:5001`

## Known Limitations (For Transparency)

- Several advanced flows (UdyamKosh, StartupGuide, Unnati) are UI‑driven prototypes and do not persist to backend.
- Shaktih chatbot in the frontend uses local keyword logic for demo behavior.
- Opportunity data is partially demo‑based in the UI; backend matching is available via API.

## Troubleshooting

If API calls fail:
1. Verify backend is running.
2. Confirm `MONGO_URI` is valid and MongoDB is reachable.
3. Check frontend proxy target in `frontend/vite.config.mjs`.

If login fails:
1. Ensure `JWT_SECRET` is set in `backend/.env`.
2. Clear localStorage and re‑login.

If uploads do not display:
1. Confirm `/uploads` is proxied.
2. Verify backend is serving `backend/uploads/` as static.

## Where to Find Deep Technical Docs

- `backend/docs/` deep dive on controllers, routes, models, and orchestrator
- `frontend/docs/README.md` deep dive on frontend flows

## Clean Shutdown

Stop each dev server with `Ctrl+C` in its terminal.

---

For any evaluation questions, please refer to the architecture details in the docs above.
