# The Baking Atlier — Phase 1

Full-stack bakery community web app (Phase 1 foundation):

- Frontend: React + JavaScript + React Router + Axios
- Backend: Express.js + JWT + bcrypt
- Database: MongoDB + Mongoose

## What Phase 1 includes

- Project architecture + setup
- Authentication (signup/login) with JWT + hashed passwords
- Persistent login session (token stored client-side)
- Protected routes + dashboard skeleton
- Role system foundation (`user`, `admin`)
- Bakery-themed landing page (scrollable sections)
- Light/Dark mode foundation with persistence

## What Phase 1 does NOT include (placeholders only)

- Posts, comments, recipes, moderation, reporting, notifications, advanced search

Those are intentionally left as `TODO:` tasks throughout the codebase.

---

## Project structure (high level)

```
The Baking Atlier/
  client/   # React app
  server/   # Express API
```

---

## Prerequisites

- Node.js 18+ (recommended)
- MongoDB (local or Atlas)

---

## Setup (step-by-step)

### 1) Install dependencies (root installs all workspaces)

```bash
npm install
```

### 2) Backend environment variables

Create `server/.env` by copying `server/.env.example`.

### 3) Start both frontend + backend (dev)

```bash
npm run dev
```

- React dev server: `http://localhost:5173`
- API server: `http://localhost:5000`

---

## Run separately (optional)

### Backend only

```bash
npm run dev:server
```

### Frontend only

```bash
npm run dev:client
```

---

## Common debugging tips

- If login/signup fails, check `server/.env` (`MONGO_URI`, `JWT_SECRET`) and restart the server.
- If the frontend can’t reach the backend, verify `client/.env` (`VITE_API_BASE_URL`) and that the backend is running.
- If MongoDB connection fails, confirm your Atlas IP allowlist or that local MongoDB is running.

---

## Next steps after Phase 1

- TODO: build posts + comments system (API + UI + schemas)
- TODO: recipe creation system + browsing
- TODO: admin moderation tools (role-gated routes + UI)
- TODO: notification system + real-time updates
- TODO: stronger validation UX and accessibility pass
- TODO: production hardening (rate limiting, helmet config tuning, refresh tokens, CSRF strategy if using cookies)

