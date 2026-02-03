# AI Survival Radar

A web app that helps users stay competitive in the AI economy with personalized AI skill learning paths, news tracking, and progress monitoring.

## Tech stack

- **Frontend:** React 19 + TypeScript + Vite 7
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v6
- **Auth:** Firebase Auth (Google Sign-in)
- **Database:** Firebase Firestore
- **AI:** Google Generative AI (Gemini)
- **Icons:** Lucide React

## Features

- **Auth:** Google sign-in only. After login, a join request is sent; only after admin approval can the user access the app. Admin: `mjsahab570@gmail.com`.
- **Admin panel:** View pending join requests, approve/reject, manage existing users (Admin tab visible only to admin).
- **Skills Lab:** User-defined categories (add/edit/delete). Generate courses with AI (goal + level). Adaptive syllabi (excludes already-learned topics). Syllabus on the right, content on the left; mark topics finished.
- **Achievements:** Completed courses by category (no points); badges, completion dates, learning hours.
- **Finland Intel / Global Trends / Tools Buzz:** Update automatically once every day. Data from **free, publicly available sources only** (news, government, research, universities, RSS, open APIs, trusted communities). No paid APIs.
- **Data storage:** All learning progress and user data in Firebase (Firestore + Auth). News, rankings, and tool lists are not stored—fetched from external sources.
- **Branding:** App logo and favicon (growth, knowledge, AI learning—minimal, modern).

## Setup

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env` and fill in:

   - **Firebase:** Create a project at [Firebase Console](https://console.firebase.google.com), enable Authentication (Google) and Firestore. Add web app and paste config into `.env`.
   - **Gemini:** Get an API key from [Google AI Studio](https://aistudio.google.com/apikey) and set `VITE_GEMINI_API_KEY`.

   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_GEMINI_API_KEY=...
   ```

3. **Firestore rules**

   Deploy the rules in `firestore.rules` from the Firebase Console (Firestore → Rules) or via Firebase CLI.

4. **Run locally**

   ```bash
   npm run dev
   ```

   Open the URL shown (e.g. `http://localhost:5173`).

## Build and deploy

- **Build:** `npm run build` → output in `dist/`
- **Deploy:** Use Vercel or Netlify with the `dist` folder as the publish directory. Set the same env vars in the host’s dashboard.
- **Firebase:** Ensure Auth (Google) and Firestore are enabled; deploy `firestore.rules` as above.

## Project structure

- `src/components/` – Layout, Sidebar, ProtectedRoute, modals (GenerateCourse, CategoryEdit, MarkComplete, CompletionCelebration)
- `src/contexts/` – AuthContext
- `src/data/` – News, tools (Finland Intel, Global Trends, Tools Buzz)
- `src/lib/` – Firebase, Firestore helpers, Gemini, constants (admin email), utils
- `src/pages/` – Landing, Login, PendingApproval, Dashboard, Skills Lab, Course detail, Achievements, Finland Intel, Global Trends, Tools Buzz, Settings, Admin
- `src/types/` – Shared TypeScript types
- `public/favicon.svg` – App logo and favicon

## License

MIT
