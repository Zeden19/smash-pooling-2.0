import { Separator } from "@/components/ui/separator";
import { validateRequest } from "@/app/hooks/validateRequest";
import { MailIcon, PhoneIcon, TagIcon } from "lucide-react";
import { DriverInfo } from "@/components/DriverInfo";

export async function UserInfo() {
  const { user } = await validateRequest();
  if (!user) return null;
  return (
    <div className={"m-8 flex flex-col gap-3"}>
      <img
        className={"rounded-full"}
        alt={"Profile Picture"}
        src={user.profilePicture ?? ""}
        width={300}
        height={300}
      />
      <h1 className={"text-5xl font-bold"}>{user.gamertag}</h1>
      <div className={"flex gap-2"}>
        <MailIcon />
        <p>{user.email}</p>
      </div>
      <div className={"flex gap-2"}>
        <TagIcon />
        <p>Name or Gamer tag here</p>
      </div>
      <div className={"flex gap-2"}>
        <PhoneIcon />
        <p>Phone Number here</p>
      </div>

      <Separator className={"w-56"} />
      <DriverInfo driver={user} />
    </div>
  );
}