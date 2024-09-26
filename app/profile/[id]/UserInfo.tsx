"use client";
import { Separator } from "@/components/ui/separator";
import { MailIcon, PhoneIcon, TagIcon } from "lucide-react";
import { DriverInfo } from "@/components/DriverInfo";
import { User } from "prisma/prisma-client";
import EditDriverForm from "@/app/profile/[id]/EditDriverForm";
import { useState } from "react";

interface Props {
  profileUser: User;
  validatedUser: User | null;
}

export function UserInfo({ profileUser, validatedUser }: Props) {
  const [user, setUser] = useState<User>(profileUser);
  if (!user) return null;
  const canEdit = user.id === validatedUser?.id;

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
          {canEdit && <EditDriverForm setUser={(user) => setUser(user)} user={user} />}
        </>
      ) : (
        canEdit && <EditDriverForm setUser={(user) => setUser(user)} user={user} />
      )}
    </div>
  );
}
