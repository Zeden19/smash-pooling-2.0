import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { startgg, lucia } from "@/app/api/auth/auth";
import prisma from "@/prisma/prismaClient";
import { GraphQLClient } from "graphql-request";
import { GET_CURRENT_USER } from "@/app/hooks/startggQueries";

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

  try {
    const tokens = await startgg.validateAuthorizationCode(code);
    const apiVersion = "alpha";
    const endpoint = "https://api.start.gg/gql/" + apiVersion;
    const client = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    
    let startGgUserResponse: StartGGResponse = await client.request(GET_CURRENT_USER);
    const startGGUser = startGgUserResponse.currentUser;

    const existingUser = await prisma.user.findFirst({
      where: {
        startggId: startGGUser.id,
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = generateIdFromEntropySize(10); // 16 characters long

    await prisma.user.create({
      data: {
        id: userId,
        startggId: startGGUser.id,
        slug: startGGUser.slug,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    console.log(e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface StartGGResponse {
    currentUser: StartGGUser
}

interface StartGGUser {
  id: number;
  slug: string;
  email: string;
  player: { gamerTag: string };
  images: [{ url: string }];
}
