# Collabio - Project Management Platform

A powerful B2B project management platform to streamline teamwork and collaboration.

## 🏗️ Project Structure

```
collabio/
├── collabio_backend/     # Node.js/Express/TypeScript Backend API
├── collabio_client/      # React/TypeScript Frontend
└── deployment/          # Deployment configurations
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd Collabio-Project-Managment-Tool
   npm run install:all
   ```

2. **Setup environment files:**
   ```bash
   npm run setup:env
   # Then edit .env files in both collabio_backend and collabio_client
   ```

3. **Start development environment:**
   ```bash
   npm run dev
   ```
   This will start:
   - Backend API on http://localhost:8000
   - Frontend on http://localhost:3000

## 📝 Environment Configuration

### Backend (.env)
Copy from `.env.example` and fill in your values:
- MongoDB connection string
- Google OAuth credentials  
- Session secret
- Frontend URL for CORS

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repo to Render
2. Set environment variables from your `.env` file
3. Deploy!

### Full-stack on Vercel (Frontend + API)
This repo includes a Vercel Serverless Function at `api/[...path].ts` that runs the Express app from `collabio_backend`.

1. Import the repo root into Vercel (so `vercel.json` is used)
2. Set backend environment variables in Vercel (Project Settings → Environment Variables):
   - `MONGO_URI`
   - `SESSION_SECRET`
   - `SESSION_EXPIRES_IN`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL` → `https://<your-domain>/api/auth/google/callback`
   - `FRONTEND_ORIGIN` → `https://<your-domain>`
   - `FRONTEND_GOOGLE_CALLBACK_URL` → `https://<your-domain>/google/oauth/callback`
3. Deploy.

Notes:
- The frontend defaults to calling the API at `/api` (no need to set `VITE_API_BASE_URL` for Vercel).

### Frontend-only on Vercel (API hosted elsewhere)
1. Connect your repo to Vercel and deploy `collabio_client`
2. Set `VITE_API_BASE_URL` to your deployed backend URL (e.g. `https://<your-backend-domain>/api`)
3. Deploy

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install dependencies for both apps |
| `npm run dev` | Start development servers |
| `npm run build` | Build both applications |
| `npm run start` | Start production servers |
| `npm run setup:env` | Copy environment example files |