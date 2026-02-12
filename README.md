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

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel  
2. Set `VITE_API_BASE_URL` to your deployed backend URL
3. Deploy!

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install dependencies for both apps |
| `npm run dev` | Start development servers |
| `npm run build` | Build both applications |
| `npm run start` | Start production servers |
| `npm run setup:env` | Copy environment example files |