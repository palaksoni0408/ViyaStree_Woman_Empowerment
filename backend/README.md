# ViyaStree Backend

This repository contains the server-side logic for **ViyaStree**, an empowerment platform focusing on three pillars: **Shiksha** (Education), **Samruddhih** (Livelihood), and **Shaktih** (Legal/Safety).

The backend is built using **Node.js**, **Express**, and **MongoDB**. It features a unique **Event-Driven Orchestration Engine** that connects user progress across these three pillars to drive holistic empowerment.

---

## 🏗️ Project Structure

```
backend/
├── controllers/       # Business logic for each module
├── middleware/        # Request processing (Auth, Uploads)
├── models/            # Mongoose data schemas
├── routes/            # API endpoint definitions
├── scripts/           # Utility scripts (Seeding, Debugging)
├── uploads/           # User-uploaded content (Avatars)
├── index.js           # Server entry point & configuration
├── orchestrator.js    # Rule-based business logic engine
└── package.json       # Dependencies & Scripts
```

---

## 🧩 Key Modules & Logic

### 1. Orchestration Engine (`orchestrator.js`)
The "brain" of the platform. Instead of isolated features, actions in one pillar trigger responses in others.
- **Rule-Based System**: Listens for specific events (e.g., `skill_completed`, `opportunity_saved`).
- **Cross-Module Logic**:
  - *Example*: Completing a "Digital Literacy" course (Shiksha) might unlock "Remote Data Entry" jobs (Samruddhih).
  - *Example*: Saving a job (Samruddhih) might suggest "Workplace Safety" guides (Shaktih).
- **Empowerment Score**: Calculates a holistic score based on progress in all three pillars.

### 2. Samruddhih - Livelihood (`samruddhihController.js`)
Handles job and opportunity matching.
- **Matching Algorithm**: Uses **Jaccard Similarity** to rank opportunities against a user's skill set.
  - *Formula*: `(UserSkills ∩ RequiredSkills) / (UserSkills ∪ RequiredSkills)`
  - *Result*: A score between 0 (no match) and 1 (perfect match).
- **Features**: Opportunity search, saving opportunities for later, and automatic skill gap analysis.

### 3. Shaktih - Safety & Rights (`shaktihController.js`)
Provides legal guidance and safety resources.
- **Intent Analysis**: Categorizes user queries into intents like `maternity`, `pay`, `harassment`, or `workplace`.
- **Severity Detection**:
  - **Urgent**: Keywords like "abuse", "violence", "threat" trigger an immediate helpline response (Police 100, Women Helpline 181).
  - **Informational**: Standard legal queries return content from the knowledge base.
- **Knowledge Base**: Curated legal articles with keyword-based retrieval.

### 4. Shiksha - Education (`shikshaController.js`)
Manages learning paths and skill acquisition.
- **Course Management**: Retrieval of courses and tracking of completion.
- **Progress Tracking**: Updates user points, badges, and skill inventory.
- **Gamification**: Awards points based on quiz performance (e.g., >80% score = 50 points).

---

## 🗄️ internal Data Models (`models/`)

- **User.js**: The central entity. Stores profile, preferences, progress (levels, badges), and saved items.
- **Course.js**: Educational content with metadata (skills taught, duration, difficulty).
- **Opportunity.js**: Job listings with required skills, location, and salary data.
- **KnowledgeBase.js**: Legal articles with associated keywords and related topics.
- **Event.js**: Stores significant user actions for the orchestrator to process.

---

## 🔒 Security & Middleware

- **Authentication** (`authController.js`, `authMiddleware.js`):
  - Uses **JWT (JSON Web Tokens)** for stateless authentication.
  - Passwords are hashed using **bcrypt** before storage.
- **Uploads** (`upload.js`):
  - Configured with **Multer** to handle profile picture uploads.
  - Validates file types (images only) and enforces size limits.

---

## 🚀 Setup & Installation

1.  **Install Dependencies**:
    ```bash
    cd backend
    npm install
    ```

2.  **Environment Configuration**:
    Create a `.env` file in the `backend/` directory:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/viyastree
    JWT_SECRET=your_secure_secret_here
    ```

3.  **Seed Database**:
    Populate the database with initial courses and legal content:
    ```bash
    npm run seed
    ```

4.  **Run Application**:
    - **Development** (with hot-reload):
      ```bash
      npm run dev
      ```
    - **Production**:
      ```bash
      npm start
      ```

---

## 🛠️ Utility Scripts

- `npm run seed`: Resets and seeds the `courses` and `knowledgebases` collections.
- `node scripts/check_courses.js`: Verifies course data integrity.
- `node scripts/verify_full_flow.js`: Runs an end-to-end simulation of user signup -> course completion -> job matching -> legal query.

---

## 📡 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/signup` | Register a new user |
| **POST** | `/api/auth/login` | Authenticate user & get token |
| **GET** | `/api/shiksha/courses` | List all available courses |
| **POST** | `/api/shiksha/progress` | Update course progress & trigger specific skill events |
| **POST** | `/api/samruddhih/match` | Get job matches based on profile skills |
| **POST** | `/api/shaktih/query` | Ask a legal/safety question |
| **GET** | `/api/orchestration/dashboard` | Get holistic empowerment metrics |
