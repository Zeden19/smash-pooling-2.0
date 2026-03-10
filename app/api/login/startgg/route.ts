import { generateState } from "arctic";
import { startgg } from "@/app/api/_services/startggAuthService";
import { cookies } from "next/headers";
import { handleRoute } from "@/app/api/_core/handler";

export async function GET(): Promise<Response> {
  return handleRoute(async () => {
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
  });
}
