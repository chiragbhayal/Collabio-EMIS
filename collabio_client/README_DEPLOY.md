Deployment steps (Vercel)

1. Push your repo to GitHub/GitLab.
2. Import the `collabio_client` project into Vercel.
3. Use the default build settings for Vite:
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Set environment variables if your client reads any at build/runtime (e.g., API base URL):
   - `VITE_API_URL` → `https://<your-backend-domain>/api`
5. Deploy and verify the frontend.

Notes:
- The frontend uses `vite build` and expects `dist` output.
- If using Vercel CLI: `vercel --prod` from `collabio_client` folder.
