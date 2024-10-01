"use client";
import GoogleMap, { defaultMapSize } from "@/components/GoogleMap";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import styles from "./styles.module.css";
import { slug as getSlug } from "@/app/helpers/services/startggClient";
import FailureToast from "@/components/FailureToast";
import SuccessToast from "@/components/SuccessToast";
import useMapStore from "@/app/stores";
import type { Carpool } from "@prisma/client";
import { orangeMarker } from "@/app/MarkerStyles";
import { DecimalToNumber } from "@/app/carpool/DecimalConversions";
import { LoadingSpinner } from "@/components/LoadingSpinner";

function FindCarpoolPage() {
  const [findingCarpools, setFindingCarpools] = useState(false);
  const { mapsApi } = useMapStore();

  async function attendCarpool(id: number) {
    try {
      const data = await axios.patch(`/api/carpool/addAttendee/${id}`);
      SuccessToast("Successfully attended Carpool!", "Stay safe!");
    } catch (e: any) {
      FailureToast(
        "Could not attend carpool: " + e.response.data.error,
        "Please try again",
      );
    }
  }

  async function getCarpools(event: FormEvent<HTMLFormElement>) {
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
      const { data } = await axios.get(`/api/carpool/find/${slug}`);
      carpools = data;
    } catch (e: any) {
      if (e instanceof AxiosError) {
        setFindingCarpools(false);
        return FailureToast(e.response?.data.error);
      }
      FailureToast("Could not Find Carpool");
      setFindingCarpools(false);
    }

    mapsApi?.removeAllElements();
    carpools.forEach((carpool: Carpool) => {
      const container = document.createElement("div");
      const text = document.createElement("div");
      text.textContent = "Carpool to " + carpool.destinationName;
      container.appendChild(text);

      const button = document.createElement("button");
      button.textContent = "Attend Carpool";
      button.onclick = () => attendCarpool(carpool.id);
      button.classList.add(styles.attendButton);
      container.appendChild(button);

      mapsApi?.addMarker(
        {
          lat: DecimalToNumber(carpool.originLat),
          lng: DecimalToNumber(carpool.originLng),
        },
        orangeMarker,
      );
      // @ts-ignore
      mapsApi?.setRoute(carpool.route!, container);
      mapsApi?.addMarker({
        lat: DecimalToNumber(carpool.destinationLat),
        lng: DecimalToNumber(carpool.destinationLng),
      });
    });
    SuccessToast("Successfully Found Carpools");
    setFindingCarpools(false);
  }

  return (
    <>
      <div className={"flex gap-5 space-x-6 justify-start ms-5 my-3"}>
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
      <GoogleMap size={defaultMapSize} />
    </>
  );
}

export default FindCarpoolPage;
