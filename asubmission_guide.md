# ViyaStree Submission Guide

**"Power, Education, Prosperity"**

---

## 1. Project Overview
ViyaStree is a comprehensive digital ecosystem designed to empower women through a continuous loop of skilling, economic opportunity, and safety. This prototype demonstrates the core "Empowerment Loop":
1.  **Shiksha (Education)**: Upskilling through bite-sized courses.
2.  **Samruddhih (Prosperity)**: Accessing hyper-local jobs and financial resources based on acquired skills.
3.  **Shaktih (Power)**: Ensuring safety and legal awareness to sustain independence.

### Key Differentiators
*   **Integrated Ecosystem**: Unlike standalone job portals or ed-tech apps, ViyaStree connects the dots (Skills → Jobs → Safety).
*   **Orchestrator Engine**: An intelligent backend event bus that proactively connects user actions (e.g., completing a sewing course triggers a notification for a tailor job).
*   **Hyper-Local Focus**: Features like "RozgarSetu" (local jobs map) and "KutumbSahay" (community creches) address real-world barriers for women.
*   **Accessibility**: Voice-enabled interfaces and simple language support.

---

## 2. Directory Structure & Tech Stack
The project is organized into three main modules:

```text
viyas/
├── backend/                 # Node.js + Express + MongoDB
│   ├── models/              # Mongoose Schemas (User, Opportunity, etc.)
│   ├── routes/              # API Enpoints
│   ├── orchestrator.js      # Event Bus for business logic
│   ├── server.js            # Entry point
│   └── package.json
│
├── frontend/                # React + Vite (Main Dashboard)
│   ├── src/
│   │   ├── components/      # Reusable UI (Cards, Badges, Modals)
│   │   ├── context/         # State Management (Auth, Demo State)
│   │   ├── pages/           # Main Views (Samruddhih, Shiksha, Shaktih)
│   │   └── App.jsx
│   └── package.json
│
├── landing page/            # React + Vite + TypeScript (Marketing)
│   ├── src/                 # Public facing content
│   └── index.html
│
└── README.md                # Quick start guide
```

---

## 3. Setup & Installation Guide

### Prerequisites
*   **Node.js** (v16 or higher)
*   **MongoDB** (Running locally on port 27017)

### Step 1: Start the Backend (API & Database)
The backend manages data and the intelligent orchestration layer.
1.  Open a terminal in the `backend` folder.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Seed the Database** (Crucial for Demo):
    ```bash
    npm run seed
    ```
    *This creates a `demo_user` with pre-filled progress to showcase the platform features immediately.*
4.  Start the server:
    ```bash
    npm start
    ```
    ✅ *Verify: Console should say "Server running on port 5000"*

### Step 2: Start the Frontend (User Dashboard)
This is where the main user interaction happens.
1.  Open a new terminal in the `frontend` folder.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    ✅ *Verify: Access the dashboard at the URL shown (e.g., http://localhost:5173)*

### Step 3: Start the Landing Page (Optional)
The public marketing face of the project.
1.  Open a new terminal in the `landing page` folder.
2.  Install & Run:
    ```bash
    npm install && npm run dev
    ```

---

## 4. Demo Walkthrough Script (For Reviewers)
Follow this path to experience the full "Empowerment Loop":

### Phase 1: Shiksha (Skilling)
1.  **Login** (Automatic with demo user).
2.  Navigate to **Shiksha**.
3.  Click on the **"Financial Literacy"** course.
4.  Interact with the content and click **"Complete Module"**.
5.  *Observation*: Note that the system acknowledges the new skill.

### Phase 2: Samruddhih (Livelihood)
1.  Navigate to **Samruddhih**.
2.  **Jobs & Gigs**: See a list of jobs matched to your skills.
3.  **RozgarSetu (New!)**: Click the **RozgarSetu** tab to see the interactive map of nearby opportunities.
4.  **UdyamSakhi (New!)**:
    *   Click the **UdyamSakhi** tab.
    *   Click **"Open Toolkit"** on the Business Tools card to see the new Modal UI.
    *   Try the "Entrepreneur Mindset Check" quiz.
5.  **KutumbSahay (New!)**:
    *   Click the **KutumbSahay** tab.
    *   Explore the "Childcare Co-ops" modal.
    *   Take the "Community Leader Badge" quiz.

### Phase 3: Shaktih (Safety)
1.  Navigate to **Shaktih**.
2.  View the **SOS features** and legal rights information.
3.  *Logic*: The system recommends safety tools based on the user's job location (e.g., "Night Shift Rights" if a night job is viewed).

---

## 5. Key Implementation Highlights
*   **Premium UI Design**: The *Samruddhih* page features a new "Teal & Gold" aesthetic with Glassmorphism effects, distinguishing it as a premium feature for empowered users.
*   **Interactive Modals**: Custom-built modals for the Toolkit and Community sections verify seamless user experience without page reloads.
*   **Voice Integration**: Native Web Speech API integration in job cards (Click the 🔊 icon) for accessibility.

## 6. Contact
**Team CodeForHer**
*   Palak Soni
*   [Add other team members]
