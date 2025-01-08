import { getUser } from "@/app/_helpers/hooks/getUser";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/_helpers/hooks/logout";

async function UserControls() {
  const { user } = await getUser();

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/profile/${user.id}`}>
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <Link href={`/profile/${user.id}/carpools`}>
              <DropdownMenuItem>Your Carpools</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              <form action={logout}>
                <Button>Log Out</Button>
              </form>
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
