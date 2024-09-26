import { Separator } from "@/components/ui/separator";
import { MailIcon, PhoneIcon, TagIcon } from "lucide-react";
import { DriverInfo } from "@/components/DriverInfo";
import { User } from "prisma/prisma-client";
import { validateRequest } from "@/app/hooks/validateRequest";
import EditDriverForm from "@/app/profile/[id]/EditDriverForm";

interface Props {
  user: User;
}

export async function UserInfo({ user }: Props) {
  if (!user) return null;

  const { user: validatedUser } = await validateRequest();
  const canEdit = user.id === validatedUser?.id;

  console.log(user.fullName);
  console.log(user.fullName ? "gamertag" : "fullname");

  return (
    <div className={"m-8 flex flex-col gap-3"}>
      <img
        className={"rounded-full"}
        alt={"Profile Picture"}
        src={user.profilePicture ?? ""}
        width={300}
        height={300}
      />
      <h1 className={"text-4xl font-bold"}>{user.fullName || user.gamertag}</h1>
      <div className={"flex gap-2"}>
        <MailIcon />
        <p>{user.email}</p>
      </div>
      <div className={"flex gap-2"}>
        <TagIcon />
        <p>{user.gamertag}</p>
      </div>
      <div className={"flex gap-2"}>
        {user.phoneNumber && (
          <>
            <PhoneIcon />
            <p>{user.phoneNumber}</p>
          </>
        )}
      </div>
      <Separator className={"w-56"} />
      {user.isDriver ? (
        <>
          <DriverInfo driver={user} />
          {canEdit && <EditDriverForm user={user} />}
        </>
      ) : (
        canEdit && <EditDriverForm user={user} />
      )}
    </div>
  );
}
