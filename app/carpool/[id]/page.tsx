import prisma from "@/prisma/prismaClient";
import GoogleMap from "@/components/GoogleMap";
import { makeTitle } from "@/app/helpers/services/makeTitle";
import { DriverInfo } from "@/app/profile/[id]/DriverInfo";
import MapElements from "@/app/carpool/[id]/MapElements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DeleteCarpoolDialog } from "@/app/carpool/[id]/DeleteCarpoolDialog";
import { redirect } from "next/navigation";
import carpoolDecimalToNumber from "@/app/helpers/services/carpoolDecimalToNumber";
import {
  CarpoolAttendeesDriver,
  CarpoolNumber,
} from "@/app/helpers/entities/CarpoolTypes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ChatWindow from "@/app/carpool/[id]/ChatWindow";

interface Props {
  params: { id: string };
}

async function CarpoolPage({ params: { id } }: Props) {
  let carpool: CarpoolAttendeesDriver | CarpoolNumber | null =
    await prisma.carpool.findUnique({
      where: { id: parseInt(id) },
      include: {
        attendees: true,
        driver: true,
      },
    });
  if (!carpool) return redirect("/carpool/edit");
  const driver = carpool.driver;
  const attendees = carpool.attendees;

  const carpoolInfo = [
    { title: "Tournament:", value: makeTitle(carpool.tournamentSlug) },
    { title: "Origin:", value: carpool.originName },
    { title: "Distance:", value: carpool.distance },
    { title: "Status:", value: carpool.status },
  ];

  return (
    <div className={"m-5"}>
      <h1 className={"text-5xl font-bold mb-8"}>
        Carpool to {makeTitle(carpool!.tournamentSlug)}
      </h1>

      <div className={"flex gap-5 justify-center"}>
        <div className={"grid grid-cols-2"}>
          <div className={"mx-3"}>
            <DriverInfo driver={driver} />
            <DeleteCarpoolDialog carpoolId={carpool.id} />
          </div>

          <div className={"grid grid-cols-2 h-64"}>
            {carpoolInfo.map((info) => (
              <div
                key={info.title}
                className={
                  "flex flex-col text-center bg-slate-800 m-5 p-2 shadow-inner rounded-lg break-words"
                }>
                <h5 className={"text-lg font-bold underline mb-1 vertical"}>
                  {info.title}
                </h5>
                <h2 className={"font-bold text-3xl"}>{info.value}</h2>
              </div>
            ))}
          </div>

          <Table className={"bg-slate-900 rounded"}>
            <TableHeader>
              <TableRow>
                <TableHead>Attendees</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendees.map((attendee) => (
                <TableRow key={attendee.id}>
                  <TableCell>
                    <div className={"flex gap-5 align-middle"}>
                      <Avatar>
                        <AvatarImage src={attendee.profilePicture} />
                      </Avatar>
                      <div className={"text-2xl font-bold my-auto"}>
                        {attendee.gamertag}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Accordion
          type="multiple"
          defaultValue={["item-1"]}
          className={"w-[45vw] h-[50vh]"}>
          <AccordionItem value={"item-1"}>
            <AccordionTrigger>Map</AccordionTrigger>
            <AccordionContent>
              <GoogleMap
                className={"border-4 border-slate-700 rounded"}
                disableDefaultUI={true}
                size={{ width: "40vw", height: "50vh" }}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value={"item-2"}>
            <AccordionTrigger>Chat</AccordionTrigger>
            <AccordionContent>
              <ChatWindow
                origin={carpool.originName}
                destination={makeTitle(carpool.tournamentSlug)}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/*Hacky solution to get around server component*/}
        <MapElements carpool={carpoolDecimalToNumber([carpool])[0]} />
      </div>
    </div>
  );
}

export default CarpoolPage;
