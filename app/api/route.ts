import Ably from "ably";
import { handleRoute } from "@/app/api/_core/handler";
import { AppError } from "@/app/api/_core/errors";

// ensure Vercel doesn't cache the result of this route,
// as otherwise the token request data will eventually become outdated
// and we won't be able to authenticate on the client side
export const revalidate = 0;

export async function GET() {
  return handleRoute(async () => {
    const key = process.env.ALBY_KEY;
    if (!key) {
      throw new AppError("Missing ALBY_KEY", 500, "ALBY_KEY_MISSING");
    }

    const client = new Ably.Rest(key);

    return await client.auth.createTokenRequest({
      clientId: "ably-nextjs-demo",
    });
  });
}
