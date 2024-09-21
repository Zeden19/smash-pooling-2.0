import { UserInfo } from "@/app/profile/[id]/UserInfo";
import { validateRequest } from "@/app/hooks/validateRequest";
import prisma from "@/prisma/prismaClient";
import CarpoolTable from "@/components/CarpoolTable";
import { redirect } from "next/navigation";
import { DecimalToNumber } from "@/app/carpool/DecimalConversions";

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

  // we have to do this or else we will get an error saying that we are passing decimal objects to client component
  const carpoolsDriving = data.carpoolsDriving.map((carpool) => ({
    ...carpool,
    originLat: DecimalToNumber(carpool.originLat),
    originLng: DecimalToNumber(carpool.originLng),
    destinationLat: DecimalToNumber(carpool.destinationLat),
    destinationLng: DecimalToNumber(carpool.destinationLng),
  }));

  const carpoolsAttending = data.carpoolsAttending.map((carpool) => ({
    ...carpool,
    originLat: DecimalToNumber(carpool.originLat),
    originLng: DecimalToNumber(carpool.originLng),
    destinationLat: DecimalToNumber(carpool.destinationLat),
    destinationLng: DecimalToNumber(carpool.destinationLng),
  }));

  return (
    <div className={"flex gap-12 w-[1400px]"}>
      {/*Left side*/}
      <UserInfo />

      {/*Right Side*/}
      <div className={"mt-7 flex flex-col gap-5"}>
        <h1 className={"text-5xl font-bold"}>Carpool Info</h1>

        <div>
          <h3 className={"text-2xl font-bold"}>Carpools Driving/Driven</h3>
          <CarpoolTable carpools={carpoolsDriving} />
        </div>

        <div>
          <h3 className={"text-2xl font-bold"}>Carpools Attending/Attended</h3>
          <CarpoolTable carpools={carpoolsAttending} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
