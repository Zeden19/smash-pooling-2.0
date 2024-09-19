import prisma from "@/prisma/prismaClient";
import GoogleMap from "@/components/GoogleMap";
import { makeTitle } from "@/app/services/makeTitle";

interface Props {
  params: { id: string };
}

async function CarpoolPage({ params: { id } }: Props) {
  const carpool = await prisma.carpool.findUnique({ where: { id: parseInt(id) } });
  if (!carpool) return null;
  return (
    <>
      <h1 className={"text-3xl font-bold"}>
        Carpool to {makeTitle(carpool.tournamentSlug)}
      </h1>
      <div className={"flex gap-3"}>
        <GoogleMap disableDefaultUI={true} size={{ width: "50vw", height: "50vh" }} />
      </div>
    </>
  );
}

export default CarpoolPage;
