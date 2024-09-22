import { UserInfo } from "@/app/profile/[id]/UserInfo";
import prisma from "@/prisma/prismaClient";
import CarpoolTable from "@/components/CarpoolTable";
import { redirect } from "next/navigation";
import { DecimalToNumber } from "@/app/carpool/DecimalConversions";

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

  if (!user) redirect("/");

  // we have to do this or else we will get an error saying that we are passing decimal objects to client component
  const carpoolsDriving = user.carpoolsDriving.map((carpool) => ({
    ...carpool,
    originLat: DecimalToNumber(carpool.originLat),
    originLng: DecimalToNumber(carpool.originLng),
    destinationLat: DecimalToNumber(carpool.destinationLat),
    destinationLng: DecimalToNumber(carpool.destinationLng),
  }));

  const carpoolsAttending = user.carpoolsAttending.map((carpool) => ({
    ...carpool,
    originLat: DecimalToNumber(carpool.originLat),
    originLng: DecimalToNumber(carpool.originLng),
    destinationLat: DecimalToNumber(carpool.destinationLat),
    destinationLng: DecimalToNumber(carpool.destinationLng),
  }));

  return (
    <div className={"flex gap-12 w-[1400px]"}>
      {/*Left side*/}
      <UserInfo user={user} />

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
