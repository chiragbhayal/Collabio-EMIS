// src/utils/get-env.ts
import dotenv from "dotenv";

dotenv.config();

export function getEnv(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value || defaultValue || "";
}
