import { validateRequest } from "@/app/hooks/validateRequest";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { logout } from "@/app/hooks/logout";

async function UserControls() {
  const { user } = await validateRequest();

  return (
    <>
      {user ? (
        <Button onClick={logout}>Log Out</Button>
      ) : (
        <Button size="sm">
          <Link href="api/login/startgg">Sign in with StartGG</Link>
        </Button>
      )}
    </>
  );
}

export default UserControls;
