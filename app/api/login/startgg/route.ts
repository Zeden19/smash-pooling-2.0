import { generateState } from "arctic";
import { startgg } from "@/app/api/auth";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  const state = generateState();
  const url = startgg.createAuthorizationURL(state, ["user.identity", "user.email"]);

  (await cookies()).set("startgg_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 86400,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
