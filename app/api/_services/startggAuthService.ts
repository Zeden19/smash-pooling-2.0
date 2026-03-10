import { StartGG } from "arctic";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

export const startgg = new StartGG(
  requiredEnv("STARTGG_CLIENT_ID"),
  requiredEnv("STARTGG_CLIENT_SECRET"),
  requiredEnv("STARTGG_REDIRECT_URI"),
);
