import { validateRequest } from "@/app/hooks/validateRequest";
import { logout } from "@/app/hooks/logout";
import GoogleMap from "@/app/components/GoogleMap";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";

export default async function Home() {
  const { user } = await validateRequest();
  return (
    <div className={"block"}>
      <Button asChild variant={"default"}>
        <Link href="api/login/startgg">Sign in with StartGG</Link>
      </Button>
      {user && (
        <>
          <p>hello {user.slug}</p>
          <form action={logout}>
            <button>Sign out</button>
          </form>
        </>
      )}
      <ModeToggle />
      <GoogleMap />
    </div>
  );
}
