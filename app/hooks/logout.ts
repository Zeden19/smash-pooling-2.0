import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { validateRequest } from "@/app/hooks/validateRequest";
import { lucia } from "@/app/api/auth/auth";

export async function logout(): Promise<ActionResult> {
  "use server";
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect("/");
}

interface ActionResult {
  error: string | null;
}
