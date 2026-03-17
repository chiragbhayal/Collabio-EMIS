# Collabio Project Management Tool

Collabio is a full-stack project management platform built to help teams collaborate, manage workspaces, organize projects, and track tasks efficiently.

## Overview

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript + MongoDB
- Auth: Google OAuth + session-based authentication
- Deployment-ready for Vercel (monorepo setup)

## Repository Structure

```text
Collabio-Project-Managment-Tool/
|- collabio_client/      # Frontend (React + Vite)
|- collabio_backend/     # Backend (Express + TypeScript)
|- api/[...path].ts      # Vercel serverless entry for backend API
|- scripts/              # Build/deploy helper scripts
|- vercel.json           # Root Vercel configuration
`- README.md
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Express.js
- MongoDB + Mongoose
- Passport.js (Google OAuth)
- TanStack Query

## Prerequisites

- Node.js (recommended: 22.x)
- npm (recommended: 10+)
- MongoDB instance (local or cloud)

## Getting Started (Local Development)

1. Clone the repository

```bash
git clone <your-repo-url>
cd Collabio-Project-Managment-Tool
```

2. Install dependencies for all apps

```bash
npm run install:all
```

3. Create environment files

```bash
npm run setup:env
```

4. Update environment variables in:

- `collabio_backend/.env`
- `collabio_client/.env`

5. Start development servers

```bash
npm run dev
```

Default local apps:

- Backend API: `http://localhost:8000`
- Frontend: `http://localhost:3000`

## Environment Variables

### Backend (`collabio_backend/.env`)

Set values for:

- `NODE_ENV`
- `PORT`
- `BASE_PATH`
- `MONGO_URI`
- `SESSION_SECRET`
- `SESSION_EXPIRES_IN`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `FRONTEND_ORIGIN`
- `FRONTEND_GOOGLE_CALLBACK_URL`

Note: `FRONTEND_ORIGIN` supports comma-separated values for multiple allowed origins.

### Frontend (`collabio_client/.env`)

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## NPM Scripts (Root)

- `npm run install:all` - Install backend and frontend dependencies
- `npm run dev` - Run backend and frontend in development mode
- `npm run build` - Build backend and frontend
- `npm run start` - Start backend and preview frontend build
- `npm run setup:env` - Copy `.env.example` files to `.env`
- `npm run vercel-build` - Build script for Vercel

## Deployment

## Vercel (Full-stack)

This repository is configured so the frontend and backend can be deployed from the root project.

1. Import the root repository into Vercel.
2. Configure backend environment variables in the Vercel project.
3. Deploy.

Important backend env example:

- `GOOGLE_CALLBACK_URL=https://<your-domain>/api/auth/google/callback`
- `FRONTEND_ORIGIN=https://<your-domain>`
- `FRONTEND_GOOGLE_CALLBACK_URL=https://<your-domain>/google/oauth/callback`

If you use multiple frontend domains, set:

- `FRONTEND_ORIGIN=https://domain-a.vercel.app,https://domain-b.vercel.app`

## Render (Backend only)

You can deploy only the backend from `collabio_backend/` and connect the frontend separately.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Developed By

Chirag Bhayal