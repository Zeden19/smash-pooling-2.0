import { getUser } from "@/app/_helpers/hooks/getUser";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AvatarComponent from "@/app/_components/AvatarComponent";
import { deleteSession } from "@/app/api/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function logout(): Promise<ActionResult> {
  "use server";
  const session = await getUser();
  if (!session?.session) {
    return {
      error: "Unauthorized",
    };
  }

  await deleteSession(session.session.id);

  (await cookies()).set("session_token", "", {
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

async function UserControls() {
  const { user } = await getUser();

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {!user ? (
              <Button size={"icon"} variant={"outline"}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-circle-user">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                </svg>
              </Button>
            ) : (
              <AvatarComponent
                src={user.profilePicture}
                fallback={user.gamertag.charAt(0).toUpperCase()}
              />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/profile/${user.id}`}>
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <Link href={`/profile/${user.id}/carpools`}>
              <DropdownMenuItem>Your Carpools</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              <Button onClick={logout}>Log Out</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button size="sm">
          <Link href="/api/login/startgg">Sign in with StartGG</Link>
        </Button>
      )}
    </>
  );
}

export default UserControls;
