import { validateRequest } from "@/app/hooks/validateRequest";

async function ProfilePage() {
  const { user } = await validateRequest();
  console.log(user);
  return (
    <div>
      <p>{user?.id}</p>
      <p>{user?.slug}</p>
      <p>{user?.startggId}</p>
      Profile Page
    </div>
  );
}

export default ProfilePage;
