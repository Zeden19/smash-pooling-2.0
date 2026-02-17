import { cookies } from "next/headers";
import { cache } from "react";
import { Session, User } from "@prisma/client";

import { validateSessionToken } from "@/app/api/session";

export const getUser = cache(
  async (): Promise<{ user: User | null; session: Session | null }> => {
    const cookieStore = cookies();
    const token = cookieStore.get("session_token")?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }

    return await validateSessionToken(token);
  },
);
