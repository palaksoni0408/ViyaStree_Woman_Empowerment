# ViyaStree: शक्तिः, शिक्षा, समृद्धिः
Power, Education, Prosperity — an empowerment loop connecting Skills → Livelihood → Safety.

This repo contains a minimal demo scaffold (backend + frontend) to showcase the ViyaStree empowerment loop and orchestration layer.

Quick start — Backend

1. Open PowerShell and start the backend:

```powershell
cd "c:\Users\palak\OneDrive\Desktop\New folder (2)\codeforher\backend"
npm install
copy .env.example .env
npm run seed   # loads demo user and knowledge base
npm start
```

The backend runs on http://localhost:5000 and exposes the demo API under `/api/v1`.

Quick start — Frontend (Vite + React)

1. In a new terminal, start the frontend dev server:

```powershell
cd "c:\Users\palak\OneDrive\Desktop\New folder (2)\codeforher\frontend"
npm install
npm run dev
```

Open the Vite URL shown (typically http://localhost:5173). The frontend is pre-wired to call the backend endpoints (same origin or via proxy).

What was added

- Backend: Express server (`backend/index.js`), route stubs (`backend/routes/*`), controllers (`backend/controllers/*`), Mongoose models (`backend/models/*`), an `orchestrator.js` event-bus skeleton, and a seed script (`backend/scripts/seed_database.js`).
- Data: `data/knowledge_base.json` contains sample legal-awareness snippets.
- Frontend: Vite + React app in `frontend/` with four main pages (Dashboard, Shiksha, Samruddhih, Shaktih).
- Demo state: `frontend/src/context/DemoContext.jsx` provides a demo user, in-app notifications, and helper actions (`completeCourse`, `saveOpportunity`, `askLegalQuery`).
- Accessibility & UI: added accessible components (`frontend/src/components/Header.jsx`, `Button.jsx`, `Icon.jsx`), skip link, aria attributes, focus styles and semantic sections.

Demo flows

- Skill completion → `orchestrator.emitEvent('skill_completed', ...)` → opportunity matching (logged in orchestrator).
- Save opportunity → `orchestrator.emitEvent('opportunity_saved', ...)` → safety recommendation if needed.
- Legal query uses `knowledge_base` entries and returns educational snippets with a disclaimer.

Notes

- The system is intentionally demo-focused: single demo user (`demo_user`) and lightweight, explainable logic. The legal snippets are educational only and not legal advice.
- To change the demo user or add more content, edit `backend/scripts/seed_database.js` and `data/knowledge_base.json`.

Files of interest

- Backend: `backend/index.js`, `backend/orchestrator.js`, `backend/models/*`, `backend/controllers/*`, `backend/routes/*`, `backend/scripts/seed_database.js`
- Frontend: `frontend/src/context/DemoContext.jsx`, `frontend/src/components/*`, `frontend/src/pages/*`, `frontend/src/App.jsx`

Next steps

- Run backend and frontend locally (commands above) and test the demo flows: complete a course (Shiksha), view matched opportunities (Samruddhih), save an opportunity and follow the safety suggestion (Shaktih).

Contact

For questions or to extend the scaffold, open an issue or contact the project owner.

