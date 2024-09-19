import CarpoolTable from "@/components/CarpoolTable";
import { validateRequest } from "@/app/hooks/validateRequest";
import prisma from "@/prisma/prismaClient";
import { redirect } from "next/navigation";

async function EditCarpoolsPage() {
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
    <div className={"m-5 flex w-[90vw] flex-col gap-5"}>
      <h1 className={"text-5xl font-bold"}>Select Carpool To Edit</h1>

      <div>
        <h3 className={"text-2xl font-bold"}>Carpools Driving/Driven</h3>
        <CarpoolTable carpools={data.carpoolsDriving} />
      </div>

      <div>
        <h3 className={"text-2xl font-bold"}>Carpools Attending/Attended</h3>
        <CarpoolTable carpools={data.carpoolsAttending} />
      </div>
    </div>
  );
}

export default EditCarpoolsPage;
