import { UserInfo } from "@/app/profile/[id]/UserInfo";
import { validateRequest } from "@/app/hooks/validateRequest";
import prisma from "@/prisma/prismaClient";
import CarpoolTable from "@/app/profile/[id]/CarpoolTable";
import { redirect } from "next/navigation";

async function ProfilePage() {
  const { user } = await validateRequest();
  const data = await prisma.user.findUnique({
    where: { id: user?.id },
    include: {
      carpoolsAttending: true,
      carpoolsDriving: true,
    },
  });

  if (!data) redirect("/");
  return (
    <div className={"flex gap-16"}>
      {/*Left side*/}
      <UserInfo />

      {/*Right Side*/}
      <div className={"mt-7 flex flex-col gap-5"}>
        <h1 className={"text-5xl font-bold"}>Carpool Info</h1>

        <div>
          <h3 className={"text-2xl font-bold"}>Carpools Driving/Driven</h3>
          <CarpoolTable carpools={data.carpoolsDriving} />
        </div>

        <div>
          <h3 className={"text-2xl font-bold"}>Carpools Attending/Attended</h3>
          <CarpoolTable carpools={data.carpoolsAttending} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
