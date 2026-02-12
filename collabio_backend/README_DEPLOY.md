Deployment steps (Render)

1. Push your repo to GitHub/GitLab.
2. Create a new Web Service on Render and connect the repo.
3. Use Docker (the provided `Dockerfile`) or set:
   - Build Command: `npm run build`
   - Start Command: `npm start`
4. Add the following environment variables in the Render dashboard (values from your local `.env`):
   - `PORT` (optional)
   - `NODE_ENV` (production)
   - `MONGO_URI`
   - `SESSION_SECRET`
   - `SESSION_EXPIRES_IN`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL` (update to your deployed backend URL)
   - `FRONTEND_ORIGIN` (deployed frontend URL)
   - `FRONTEND_GOOGLE_CALLBACK_URL` (deployed frontend callback URL)
5. Deploy and monitor build logs on Render.

Notes:
- The app builds with `tsc` and serves `dist/index.js`.
- If you use container-based deployment the Dockerfile will run the build and start.
