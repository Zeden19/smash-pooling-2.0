import { UserInfo } from "@/app/profile/[id]/UserInfo";
import prisma from "@/prisma/prismaClient";
import { redirect } from "next/navigation";
import { getUser } from "@/app/_helpers/hooks/getUser";
import CarpoolsDisplay from "@/app/_components/carpools/CarpoolsDisplay";

interface Props {
  params: { id: string };
}

async function ProfilePage({ params: { id } }: Props) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      carpoolsAttending: true,
      carpoolsDriving: true,
    },
  });

  const { user: validatedUser } = await getUser();

  if (!user) redirect("/");

  const carpoolsDriving = user.carpoolsDriving;
  const carpoolsAttending = user.carpoolsAttending;

  return (
    <div className={"flex gap-12 w-[1400px]"}>
      {/*Left side*/}
      <UserInfo profileUser={user} validatedUser={validatedUser} />

      {/*Right Side*/}
      <div className={"mt-7 flex flex-col gap-5"}>
        <h1 className={"text-5xl font-bold"}>Carpool Info</h1>

        <CarpoolsDisplay
          carpoolsDriving={carpoolsDriving}
          carpoolsAttending={carpoolsAttending}
        />
      </div>
    </div>
  );
}

export default ProfilePage;
