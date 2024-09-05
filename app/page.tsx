import { validateRequest } from "@/app/hooks/validateRequest";
import { logout } from "@/app/hooks/logout";
import GoogleMap from "@/app/components/GoogleMap";
import ThemeSelector from "@/components/theme-selector";

export default async function Home() {
  const { user } = await validateRequest();
  return (
    <div className={"block"}>
      <a href="api/login/startgg">Sign in with StartGG</a>
      {user && <p>hello {user.slug}</p>}
      {user && (
        <form action={logout}>
          <button>Sign out</button>
        </form>
      )}
      <ThemeSelector />
      <GoogleMap />
    </div>
  );
}
