import { cookies } from "next/headers";
import { startgg } from "@/app/api/_services/startggAuthService";
import prisma from "@/prisma/prismaClient";
import * as arctic from "arctic";
import { createSession } from "@/app/api/_services/sessionService";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { getCurrentUser } from "@/app/api/_services/startggService";
import { handleRoute } from "@/app/api/_core/handler";
import { AppError, ValidationError } from "@/app/api/_core/errors";

async function createAndSetSession(id: string) {
  const { token } = await createSession(id);
  (await cookies()).set("session_token", token, {
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

export async function GET(request: Request): Promise<Response> {
  return handleRoute(async () => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState = (await cookies()).get("startgg_oauth_state")?.value ?? null;

    if (!code || !state || !storedState || state !== storedState) {
      throw new ValidationError("Invalid OAuth state");
    }

    let tokens: arctic.OAuth2Tokens;
    try {
      tokens = await startgg.validateAuthorizationCode(code, [
        "user.identity",
        "user.email",
      ]);
    } catch (e) {
      if (e instanceof arctic.OAuth2RequestError) {
        throw new ValidationError(e.code);
      }
      if (e instanceof arctic.ArcticFetchError) {
        throw new AppError("StartGG is unavailable", 502, "STARTGG_UNAVAILABLE");
      }
      throw e;
    }

    const accessToken = tokens.accessToken();
    const startGGUser = (await getCurrentUser(accessToken)) as StartGGUser;

    const existingUser = await prisma.user.findFirst({
      where: {
        startggId: startGGUser.id,
      },
    });

    if (existingUser) {
      return createAndSetSession(existingUser.id);
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

    return createAndSetSession(userId);
  });
}

function generateSessionId(): string {
  const bytes = new Uint8Array(25);
  crypto.getRandomValues(bytes);

  return encodeBase32LowerCaseNoPadding(bytes);
}

interface StartGGUser {
  id: number;
  slug: string;
  email: string;
  player: { gamerTag: string };
  images: [{ url?: string }];
}
