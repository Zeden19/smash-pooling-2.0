import prisma from "@/prisma/prismaClient";
import GoogleMap from "@/components/GoogleMap";
import { makeTitle } from "@/app/helpers/services/makeTitle";
import { DriverInfo } from "@/app/profile/[id]/DriverInfo";
import MapElements from "@/app/carpool/[id]/MapElements";
import { DeleteCarpoolDialog } from "@/app/carpool/[id]/DeleteCarpoolDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { redirect } from "next/navigation";
import carpoolDecimalToNumber from "@/app/helpers/services/carpoolDecimalToNumber";
import { getUser } from "@/app/helpers/hooks/getUser";
import ChatWindow from "@/app/carpool/[id]/Chat/ChatWindow";
import dynamic from "next/dynamic";
import { MessageStoreProvider } from "@/app/carpool/[id]/Chat/MessageStoreProvider";
import AttendeeTable from "@/app/carpool/[id]/AttendeeTable";
import { CarpoolFull } from "@/app/helpers/entities/CarpoolTypes";
import { Button } from "@/components/ui/button";

const AlbyProvider = dynamic(() => import("./Chat/AlbyProvider"), {
  ssr: false,
});

interface Props {
  params: { id: string };
}

async function CarpoolPage({ params: { id } }: Props) {
  let carpool = await prisma.carpool.findUnique({
    where: { id: parseInt(id) },
    include: {
      attendees: true,
      driver: true,
      chatroom: {
        include: {
          messages: true,
        },
      },
    },
  });
  if (!carpool) return redirect("/carpool/edit");
  const { user: currentUser } = await getUser();
  if (!currentUser) return redirect("/");

  const driver = carpool.driver;
  const attendees = carpool.attendees;

  if (!attendees.map((attendee) => attendee.id).includes(currentUser.id))
    return redirect("/");

  // @ts-ignore
  const decimalCarpool: CarpoolFull = carpoolDecimalToNumber([carpool])[0];

  const carpoolInfo = [
    { title: "Tournament:", value: makeTitle(carpool.tournamentSlug) },
    { title: "Origin:", value: carpool.originName },
    { title: "Distance:", value: carpool.distance },
    { title: "Status:", value: carpool.status },
    { title: "Price", value: "$" + carpool.price },
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
            <div className={"flex gap-3 items-center my-3"}>
              <DeleteCarpoolDialog carpoolId={carpool.id} />
              <Button>Edit Carpool</Button>
            </div>
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
          <div>
            <AttendeeTable currentUser={currentUser} carpool={decimalCarpool} />
            {carpool.description && (
              <>
                <h2 className={"text-2xl mt-2 font-bold"}>Description</h2>
                {carpool.description}
              </>
            )}
          </div>
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

          <MessageStoreProvider messages={carpool.chatroom!.messages}>
            <AccordionItem value={"item-2"}>
              <AccordionTrigger>Chat</AccordionTrigger>
              <AccordionContent>
                <AlbyProvider>
                  <ChatWindow
                    chatRoom={carpool.chatroom!}
                    chatroomUsers={attendees}
                    currentUser={currentUser}
                    chatroomName={`Carpool Chat: From ${carpool.originName} to ${makeTitle(carpool.tournamentSlug)}`}
                  />
                </AlbyProvider>
              </AccordionContent>
            </AccordionItem>
          </MessageStoreProvider>
        </Accordion>

        {/*Hacky solution to get around server component*/}
        <MapElements carpool={decimalCarpool} />
      </div>
    </div>
  );
}

export default CarpoolPage;
