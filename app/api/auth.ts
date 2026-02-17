import { StartGG } from "arctic";

export const startgg = new StartGG(
  process.env.STARTGG_CLIENT_ID!,
  process.env.STARTGG_CLIENT_SECRET!,
  process.env.STARTGG_REDIRECT_URI!,
);
