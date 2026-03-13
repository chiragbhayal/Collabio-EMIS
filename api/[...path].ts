import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app, ensureDatabaseConnected } from "../collabio_backend/src/app";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel routes this function under `/api/*`. The express app mounts routes at `/` in Vercel.
  if (req.url === "/api") req.url = "/";
  if (req.url?.startsWith("/api/")) req.url = req.url.slice(4);

  await ensureDatabaseConnected();

  return app(req as any, res as any);
}
