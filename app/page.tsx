import { validateRequest } from "@/app/hooks/validateRequest";
import { logout } from "@/app/hooks/logout";
import GoogleMap from "@/app/components/GoogleMap";

export default async function Home() {
  const { user } = await validateRequest();
  return (
    <>
      <h1>Sign in</h1>
      <a href="api/login/startgg">Sign in with StartGG</a>
      {user && <p>hello {user.slug}</p>}
      {user && (
        <form action={logout}>
          Logout
          <button>Sign out</button>
        </form>
      )}
      <GoogleMap />
    </>
  );
}
