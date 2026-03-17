import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import passport from "passport";
import mongoose from "mongoose";

import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";

import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";

// Load Passport Strategies
import "./config/passport.config";

const isVercelRuntime = () => Boolean(process.env.VERCEL);

export const getBasePath = () => {
  // When deployed on Vercel, requests already come in under `/api/*`.
  // We strip the `/api` prefix in the Vercel handler, so routes should mount at `/`.
  if (isVercelRuntime()) return "";
  return config.BASE_PATH || "/api";
};

export const createApp = () => {
  const app = express();
  const BASE_PATH = getBasePath();

  // Vercel (and most platforms) run behind a proxy
  app.set("trust proxy", 1);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      name: "session",
      keys: [config.SESSION_SECRET],
      maxAge: 24 * 60 * 60 * 1000,
      secure: config.NODE_ENV === "production",
      httpOnly: true,
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const allowedOrigins = config.FRONTEND_ORIGIN
    ? config.FRONTEND_ORIGIN.split(",").map((o) => o.trim())
    : [];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      },
      credentials: true,
    })
  );

  app.get(`${BASE_PATH}/health`, (req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  app.get(`${BASE_PATH}/`, (req: Request, res: Response) => {
    res.status(200).send("Collabio Backend is running");
  });

  app.use(`${BASE_PATH}/auth`, authRoutes);
  app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
  app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
  app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
  app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
  app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

  app.use(errorHandler);

  return app;
};

export const app = createApp();

let dbConnectPromise: Promise<void> | null = null;

export const ensureDatabaseConnected = async () => {
  // 1 = connected
  if (mongoose.connection.readyState === 1) return;

  if (!dbConnectPromise) {
    dbConnectPromise = connectDatabase().catch((err) => {
      dbConnectPromise = null;
      throw err;
    });
  }

  await dbConnectPromise;
};
