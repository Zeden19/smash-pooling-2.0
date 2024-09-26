import prisma from "@/prisma/prismaClient";
import GoogleMap from "@/components/GoogleMap";
import { makeTitle } from "@/app/services/makeTitle";
import { DriverInfo } from "@/app/profile/[id]/DriverInfo";
import MapElements from "@/app/carpool/[id]/MapElements";

interface Props {
  params: { id: string };
}

async function CarpoolPage({ params: { id } }: Props) {
  const carpool = await prisma.carpool.findUnique({ where: { id: parseInt(id) } });
  if (!carpool) return null;
  const driver = await prisma.user.findUnique({
    where: { id: carpool.driverId },
  });
  if (!driver) return null;

  const carpoolInfo = [
    { title: "Tournament:", value: makeTitle(carpool.tournamentSlug) },
    { title: "Origin:", value: makeTitle(carpool.originName) },
    { title: "Distance:", value: makeTitle(carpool.distance) },
    { title: "Status:", value: makeTitle(carpool.status) },
  ];

  return (
    <div className={"m-5"}>
      <h1 className={"text-5xl font-bold mb-8"}>
        Carpool to {makeTitle(carpool.tournamentSlug)}
      </h1>
      <div className={"flex gap-5 justify-center"}>
        <div className={"mx-3"}>
          <DriverInfo driver={driver} />
        </div>

        <div className={"grid grid-cols-2 h-64"}>
          {carpoolInfo.map((info) => (
            <div
              key={info.title}
              className={
                "flex flex-col text-center bg-slate-800 m-5 p-2 shadow-inner rounded-lg"
              }>
              <h5 className={"text-lg font-bold underline mb-1 vertical"}>
                {info.title}
              </h5>
              <h2 className={"font-bold text-3xl"}>{info.value}</h2>
            </div>
          ))}
        </div>

        <GoogleMap
          className={"border-4 border-slate-700 rounded"}
          disableDefaultUI={true}
          size={{ width: "45vw", height: "50vh" }}
        />

        {/*Hacky solution to get around server component*/}
        <MapElements carpool={carpool} />
      </div>
    </div>
  );
}

export default CarpoolPage;
