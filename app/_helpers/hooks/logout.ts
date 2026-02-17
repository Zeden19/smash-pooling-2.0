import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUser } from "@/app/_helpers/hooks/getUser";
import { deleteSession } from "@/app/api/session";

export async function logout(): Promise<ActionResult> {
  "use server";
  const session = await getUser();
  if (!session?.session) {
    return {
      error: "Unauthorized",
    };
  }

  await deleteSession(session.session.id);

  cookies().set("session_token", "", {
    maxAge: 86400,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
  return redirect("/");
}

interface ActionResult {
  error: string | null;
}
