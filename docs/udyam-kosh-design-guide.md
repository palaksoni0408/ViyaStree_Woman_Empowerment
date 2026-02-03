# Udyam-Kosh Design Guide (Small Loans Journey)

## Purpose
Build a visual, step-by-step journey for the 8-step microfunding flow that feels supportive, inclusive, and practical for women with mixed literacy levels. The experience replaces traditional banking friction with a trust-first, guided interface.

## Target File & Route (Implementation Reference)
Use this guide to create a new page at `frontend/src/pages/UdyamKosh.jsx` and route it from the Samruddhih loan CTA (e.g., `/dashboard/udyam-kosh`).

## Layout & Navigation
1. Top bar: `Back` and `Home` buttons, plus a GuruSakhi voice icon that reads the current step.
2. Main layout: two columns on desktop, single column on mobile.
3. Left column: Growth Roadmap (vertical “Path to Prosperity” line).
4. Right column: Active step content card.
5. Roadmap: completed steps show a solid marigold line, upcoming steps are dotted in muted teal.
6. Padding and corners: 20px padding and 15px border radius everywhere.

## Color & Style Tokens
1. Deep Teal primary: `#0f766e`
2. Marigold accent: `#ca8a04`
3. Soft background: `#f8fafc`
4. Neutral text: `#1e293b`
5. Borders: `#e2e8f0`
6. Use gentle shadows and soft gradients; avoid harsh contrast.

## Step Structure (8-Step Flow)
Each step has a title, 1–2 line description, and one primary action.
1. Purpose Selection
2. Eligibility Light-Check
3. Literacy Nudge (5 minutes)
4. Funding Tier Selection
5. Plan Upload
6. Business Details
7. Payout Method
8. Review & Submit

## Core UI Components
1. Growth Roadmap
2. Category Chips for Step 1
3. Voice Self-Declaration for Step 2
4. Literacy Nudge Video for Step 3
5. Loan Slider for Step 4
6. Graduation Tracker footer

## Component Behavior
1. Growth Roadmap
Set step state: `done`, `active`, `locked`. The line changes from dotted to solid when a step is completed.

2. Category Chips (Step 1)
Use large cards with clear icons and labels:
Home Business, Skill Tools, Emergency Support.

3. Voice Self-Declaration (Step 2)
Provide a “Record” button. Show a “Saved” state once the recording is completed.

4. Literacy Nudge Video (Step 3)
Auto-play a lightweight video or animated explainer. Disable “Next” until the progress reaches 100%.

5. Loan Slider (Step 4)
Slider range: ₹2,000 to ₹50,000. Show a contextual icon or example as the value changes.
Example: ₹5,000 → sewing machine. ₹30,000 → laptop.

6. Graduation Tracker (Footer)
Show progression text such as: “3 on-time repayments to unlock Growth Loan Tier 2.”

## Lottie Animation Guidance
1. Processing state: Dharmachakra or blooming lotus animation.
2. Success state: Mangal-Kalash with gold petals.
3. Fallback: static SVG if Lottie fails.

## Accessibility & Inclusive UX
1. Provide a “Listen” button for each step.
2. Use large tap targets and simple labels.
3. Avoid long paragraphs. Prefer short sentences and whitespace.
4. Ensure emergency and help actions are always visible.

## Copy & Microcopy (Use in UI)
1. “Verified by Government sources”
2. “Free & confidential”
3. “Beginner friendly”
4. “You can listen instead of reading”

## Suggested Data Model (Front-End)
Use a config-driven approach for steps. Example fields:
`id`, `title`, `shortDescription`, `status`, `ctaLabel`, `ctaAction`, `audioText`.

## Interaction States
1. Loading: show processing animation.
2. Success: show Mangal-Kalash animation and a brief congratulatory line.
3. Error: show a single-line error message with a “Try Again” button.

## Acceptance Criteria
1. The user can complete each step without typing long text.
2. Every step has a working audio option.
3. The roadmap updates visually as steps complete.
4. The “Next” button is disabled until required step actions are completed.
5. The page retains Samruddhih styling conventions.

## Notes for Later Iterations
1. Voice-to-text integration for self-declaration.
2. UPI payment verification for disbursal.
3. Trust score growth based on repayment and ledger use.
