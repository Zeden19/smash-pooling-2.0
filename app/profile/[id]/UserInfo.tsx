"use client";
import { Separator } from "@/components/ui/separator";
import { MailIcon, PhoneIcon, TagIcon } from "lucide-react";
import { DriverInfo } from "@/app/profile/[id]/DriverInfo";
import { User } from "prisma/prisma-client";
import EditDriverForm from "@/app/profile/[id]/EditDriverForm";
import { useState } from "react";
import GenericToolTip from "@/app/_components/GenericToolTip";
import AvatarComponent from "@/app/_components/AvatarComponent";

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
      <GenericToolTip toolTipText={"Startgg Avatar"}>
        <AvatarComponent
          className={"w-[15vw] h-[25vh]"}
          src={user.profilePicture}
          fallback={user.gamertag.charAt(0).toUpperCase()}
        />
      </GenericToolTip>
      <h1 className={"text-4xl font-bold"}>{user.fullName || user.gamertag}</h1>

      <div className={"flex gap-2"}>
        <MailIcon />
        <GenericToolTip toolTipText={"Email"}>
          <p>{user.email}</p>
        </GenericToolTip>
      </div>

      <div className={"flex gap-2"}>
        <TagIcon />
        <GenericToolTip toolTipText={"Gamer Tag"}>
          <p>{user.gamertag}</p>
        </GenericToolTip>
      </div>

      <div className={"flex gap-2"}>
        {user.phoneNumber && (
          <>
            <PhoneIcon />
            <GenericToolTip toolTipText={"Phone Number"}>
              <p>{user.phoneNumber}</p>
            </GenericToolTip>
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
