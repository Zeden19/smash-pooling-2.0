import { cookies } from "next/headers";
import { startgg } from "@/app/api/auth/auth";
import prisma from "@/prisma/prismaClient";
import { GET_CURRENT_USER } from "@/app/_helpers/services/startggQueries";
import * as arctic from "arctic";
import { createSession } from "@/app/api/session";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("startgg_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  let tokens: arctic.OAuth2Tokens;
  try {
    tokens = await startgg.validateAuthorizationCode(code, [
      "user.identity",
      "user.email",
    ]);
    const accessToken = tokens.accessToken();
    const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
    const refreshToken = tokens.refreshToken();

    const response = await fetch("https://api.start.gg/gql/alpha", {
      method: "POST",
      body: JSON.stringify({ query: GET_CURRENT_USER }),
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { data }: { data: StartGGResponse } = await response.json();
    const startGGUser = data.currentUser;

    const existingUser = await prisma.user.findFirst({
      where: {
        startggId: startGGUser.id,
      },
    });

    if (existingUser) {
      const { token } = await createSession(existingUser.id);
      cookies().set("session_token", token, {
        maxAge: 86400,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      });
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = generateSessionId(); // 16 characters long

    await prisma.user.create({
      data: {
        id: userId,
        startggId: startGGUser.id,
        gamertag: startGGUser.player.gamerTag,
        slug: startGGUser.slug,
        email: startGGUser.email,
        profilePicture: startGGUser.images[0]?.url,
      },
    });

    const { token } = await createSession(userId);
    cookies().set("session_token", token, {
      maxAge: 86400,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    if (e instanceof arctic.OAuth2RequestError) {
      // Invalid authorization code, credentials, or redirect URI
      const code = e.code;
      return new Response(code, {
        status: 500,
        headers: {
          Location: "/",
        },
      });
    }
    if (e instanceof arctic.ArcticFetchError) {
      // Failed to call `fetch()`
      const cause = e.cause;
      return new Response(null, {
        status: 404,
        headers: {
          Location: "/",
        },
      });
    }

    console.log(e);
    return new Response(null, {
      status: 500,
      headers: {
        Location: "/",
      },
    });
  }
}

function generateSessionId(): string {
  const bytes = new Uint8Array(25);
  crypto.getRandomValues(bytes);

  return encodeBase32LowerCaseNoPadding(bytes);
}

interface StartGGResponse {
  currentUser: StartGGUser;
}

interface StartGGUser {
  id: number;
  slug: string;
  email: string;
  player: { gamerTag: string };
  images: [{ url?: string }];
}
