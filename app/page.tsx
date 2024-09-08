import { validateRequest } from "@/app/hooks/validateRequest";
import { logout } from "@/app/hooks/logout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import MapTest from "@/app/MapTest";

export default async function Home() {
  const { user } = await validateRequest();
  return (
    <div className={"block m-5"}>
      {user ? (
        <>
          <p>hello {user.slug}</p>
          <form action={logout}>
            <Button>Sign out</Button>
          </form>
        </>
      ) : (
        <Button asChild>
          <Link href="api/login/startgg">Sign in with StartGG</Link>
        </Button>
      )}

      <ModeToggle />
      <MapTest/>
    </div>
  );
}
