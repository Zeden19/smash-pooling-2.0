import CarpoolTable from "@/components/CarpoolTable";
import { validateRequest } from "@/app/hooks/validateRequest";
import prisma from "@/prisma/prismaClient";
import { redirect } from "next/navigation";
import { DecimalToNumber } from "@/app/carpool/DecimalConversions";

async function EditCarpoolsPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/");
  const data = await prisma.user.findUnique({
    where: { id: user?.id },
    include: {
      carpoolsAttending: true,
      carpoolsDriving: true,
    },
  });

  if (!data) redirect("/");

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
    <div className={"m-5 flex w-[90vw] flex-col gap-5"}>
      <h1 className={"text-5xl font-bold"}>Select Carpool To Edit</h1>

      <div>
        <h3 className={"text-2xl font-bold"}>Carpools Driving/Driven</h3>
        <CarpoolTable carpools={carpoolsDriving} />
      </div>

      <div>
        <h3 className={"text-2xl font-bold"}>Carpools Attending/Attended</h3>
        <CarpoolTable carpools={carpoolsAttending} />
      </div>
    </div>
  );
}

export default EditCarpoolsPage;
