import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app, ensureDatabaseConnected } from "../src/app";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Strip the /api prefix so Express sees clean paths (/auth/login, /user, etc.)
  if (req.url === "/api") req.url = "/";
  if (req.url?.startsWith("/api/")) req.url = req.url.slice(4);

  await ensureDatabaseConnected();

  return app(req as any, res as any);
}
