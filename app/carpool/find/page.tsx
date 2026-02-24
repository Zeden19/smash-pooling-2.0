"use client";
import { mapProps, orangeMarker, polylineOptions } from "@/app/carpool/_maps/mapConfig";
import { Input } from "@/components/ui/input";
import React, { FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import styles from "./styles.module.css";
import { slug as getSlug } from "@/app/_helpers/services/startggClient";
import FailureToast from "@/app/_components/toast/FailureToast";
import SuccessToast from "@/app/_components/toast/SuccessToast";
import type { Carpool } from "@prisma/client";
import { LoadingSpinner } from "@/app/_components/LoadingSpinner";
import { AdvancedMarker, InfoWindow, Map, Pin, useMap } from "@vis.gl/react-google-maps";
import { Polyline } from "@/app/carpool/_maps/Polyline";

function FindCarpoolPage() {
  const [findingCarpools, setFindingCarpools] = useState(false);
  const [infoWindow, setInfoWindow] = useState<React.ReactNode>(null);
  const [carpools, setCarpools] = useState<Carpool[]>();
  const map = useMap();

  async function attendCarpool(id: number) {
    try {
      await axios.patch(`/api/carpool/attendee/${id}`);
      SuccessToast("Successfully attended Carpool!", "Stay safe!");
    } catch (e: any) {
      FailureToast(
        "Could not attend carpool: " + e.response.data.error,
        "Please try again",
      );
    }
  }

  async function getCarpools(event: FormEvent<HTMLFormElement>) {
    if (!map) {
      FailureToast("Something went wrong", "Please try again");
      return;
    }

    event.preventDefault();
    setFindingCarpools(true);
    const form = event.target as HTMLFormElement;

    const slug = getSlug(form.url.value);
    if (!slug) {
      FailureToast("Could not find carpool tournament", "Make sure your URL is correct");
      return;
    }

    let carpools;

    try {
      const { data } = await axios.get<Carpool[]>(`/api/carpool/find/${slug}`);
      carpools = data;
    } catch (e: any) {
      if (e instanceof AxiosError) {
        setFindingCarpools(false);
        return FailureToast(e.response?.data.error);
      }
      FailureToast("Could not Find Carpool");
      setFindingCarpools(false);
    }

    setCarpools(carpools);
    SuccessToast("Successfully Found Carpools");
    setFindingCarpools(false);
  }

  useEffect(() => {
    if (!map) return;
    map.addListener("drag", () => setInfoWindow(null));
  }, [map]);

  return (
    <>
      <div className={"flex gap-5 space-x-6 justify-start ms-5 my-3 "}>
        <form
          className={"flex gap-2 items-center"}
          onSubmit={(event) => getCarpools(event)}>
          <Input
            disabled={findingCarpools}
            defaultValue={"https://www.start.gg/tournament/bullet-hell-1/details"}
            id={"url"}
            className={"w-96"}
            placeholder={"TournamentURL"}
          />
          {findingCarpools && <LoadingSpinner />}
        </form>
      </div>
      <Map {...mapProps} style={{ width: "100vw", height: "80vh" }}>
        {carpools &&
          carpools.map(
            ({
              originLat,
              originLng,
              destinationLng,
              destinationLat,
              destinationName,
              route,
              id,
            }) => {
              const infoWindowNode = (event: google.maps.MapMouseEvent) => (
                <InfoWindow
                  className={"text-black"}
                  position={event.latLng}
                  onClose={() => setInfoWindow(null)}>
                  <div>
                    <div>Carpool to {destinationName}</div>
                    <button
                      className={styles.attendButton}
                      onClick={() => attendCarpool(id)}>
                      Attend Carpool
                    </button>
                  </div>
                </InfoWindow>
              );

              return (
                <div key={id}>
                  <AdvancedMarker position={{ lat: originLat, lng: originLng }}>
                    <Pin {...orangeMarker} />
                  </AdvancedMarker>

                  <AdvancedMarker
                    position={{ lat: destinationLat, lng: destinationLng }}
                  />

                  <Polyline
                    onClick={(event) => setInfoWindow(infoWindowNode(event))}
                    encodedPath={route}
                    {...polylineOptions}
                  />
                </div>
              );
            },
          )}
        {infoWindow !== null && infoWindow}
      </Map>
    </>
  );
}

export default FindCarpoolPage;
