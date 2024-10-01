import { getUser } from "@/app/helpers/hooks/getUser";
import prisma from "@/prisma/prismaClient";
import { redirect } from "next/navigation";
import carpoolDecimalToNumber from "@/app/helpers/services/carpoolDecimalToNumber";
import CarpoolsDisplay from "@/components/CarpoolsDisplay";

async function EditCarpoolsPage() {
  const { user } = await getUser();
  if (!user) redirect("/");
  const data = await prisma.user.findUnique({
    where: { id: user?.id },
    include: {
      carpoolsAttending: true,
      carpoolsDriving: true,
    },
  });

  if (!data) redirect("/");

  const carpoolsDriving = carpoolDecimalToNumber(data.carpoolsDriving);
  const carpoolsAttending = carpoolDecimalToNumber(data.carpoolsAttending);
  return (
    <div className={"m-5 flex w-[90vw] flex-col gap-5"}>
      <h1 className={"text-5xl font-bold"}>Select Carpool To Edit</h1>

      <CarpoolsDisplay
        carpoolsDriving={carpoolsDriving}
        carpoolsAttending={carpoolsAttending}
      />
    </div>
  );
}

export default EditCarpoolsPage;
