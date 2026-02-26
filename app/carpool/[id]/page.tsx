"use client";
import { mapProps, orangeMarker, polylineOptions } from "@/app/carpool/_maps/mapConfig";
import { makeTitle } from "@/app/_helpers/functions/makeTitle";
import { DriverInfo } from "@/app/profile/[id]/DriverInfo";
import { DeleteCarpoolDialog } from "@/app/carpool/[id]/DeleteCarpoolDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ChatWindow from "@/app/carpool/[id]/Chat/ChatWindow";
import dynamic from "next/dynamic";
import { MessageStoreProvider } from "@/app/carpool/[id]/Chat/MessageStoreProvider";
import AttendeeTable from "@/app/carpool/[id]/AttendeeTable";
import { AdvancedMarker, Map, Pin, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { User } from "prisma/prisma-client";
import { Polyline } from "@/app/carpool/_maps/Polyline";
import { useCarpool } from "@/app/carpool/[id]/CarpoolContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const AlbyProvider = dynamic(() => import("./Chat/AlbyProvider"), {
  ssr: false,
});

function CarpoolPage({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();
  const carpool = useCarpool();
  let [carpoolInfo, setCarpoolInfo] = useState<{ title: string; value: string }[] | null>(
    null,
  );
  const [user, setUser] = useState<User | null>(null);

  const map = useMap();

  useEffect(() => {
    if (!carpool) return;
    setCarpoolInfo([
      { title: "Tournament:", value: makeTitle(carpool.tournamentSlug) },
      { title: "Origin:", value: carpool.originName },
      { title: "Distance:", value: carpool.distance },
      { title: "Status:", value: carpool.status },
      { title: "Price", value: "$" + carpool.price },
    ]);
    setUser(carpool.driver);
  }, [carpool]);

  useEffect(() => {
    if (!map || !carpool) return;
    map.setZoom(8);
  }, [map]);
  return (
    carpool &&
    carpoolInfo &&
    user && (
      <div className={"m-5"}>
        <h1 className={"text-5xl font-bold mb-8"}>
          Carpool to {makeTitle(carpool.tournamentSlug)}
        </h1>

        <div className={"flex gap-5 justify-center"}>
          <div className={"grid grid-cols-2"}>
            <div className={"mx-3"}>
              <DriverInfo driver={carpool.driver} />
              <div className={"flex gap-3 items-center my-3"}>
                <DeleteCarpoolDialog carpoolId={carpool.id} />
                <Button onClick={() => router.push(`/carpool/${id}/edit`)}>
                  Edit Carpool
                </Button>
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
            <AttendeeTable currentUser={user} carpool={carpool} />
          </div>

          <Accordion
            type="multiple"
            defaultValue={["item-1"]}
            className={"w-[45vw] h-[50vh]"}>
            <AccordionItem value={"item-1"}>
              <AccordionTrigger>Map</AccordionTrigger>
              <AccordionContent>
                <Map {...mapProps} style={{ width: "40vw", height: "50vh" }}>
                  <AdvancedMarker
                    position={{ lat: carpool.originLat, lng: carpool.originLng }}>
                    <Pin {...orangeMarker} />
                  </AdvancedMarker>

                  <AdvancedMarker
                    position={{
                      lat: carpool.destinationLat,
                      lng: carpool.destinationLng,
                    }}
                  />

                  <Polyline
                    onLoad={(path) =>
                      map?.setCenter(path.getAt(Math.floor(path.getLength() / 2)))
                    }
                    {...polylineOptions}
                    encodedPath={carpool.route}
                  />
                </Map>
              </AccordionContent>
            </AccordionItem>

            <MessageStoreProvider messages={carpool.messages}>
              <AccordionItem value={"item-2"}>
                <AccordionTrigger>Chat</AccordionTrigger>
                <AccordionContent>
                  <AlbyProvider>
                    <ChatWindow
                      carpoolId={carpool.id}
                      chatroomUsers={carpool.attendees}
                      currentUser={user}
                      chatroomName={`Carpool Chat: From ${carpool.originName} to ${makeTitle(carpool.tournamentSlug)}`}
                    />
                  </AlbyProvider>
                </AccordionContent>
              </AccordionItem>
            </MessageStoreProvider>

            <AccordionItem value={"item-3"}>
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                {carpool.description && <div>{carpool.description}</div>}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    )
  );
}

export default CarpoolPage;
