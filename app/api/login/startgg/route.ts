import { generateState } from "arctic";
import { startgg } from "@/app/api/auth/auth";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
	const state = generateState();
	const url = await startgg.createAuthorizationURL(state, {
		scopes: ["user.identity", "user.email"],
	});

	cookies().set("startgg_oauth_state", state, {
		path: "/",
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax"
	});

	return Response.redirect(url);
}