"use client";
import GoogleMap from "@/components/GoogleMap";
import { Input } from "@/components/ui/input";
import { FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { XCircle } from "lucide-react";
import { slug as getSlug } from "@/app/services/startggClient";
import FailureToast from "@/components/FailureToast";
import SuccessToast from "@/components/SuccessToast";
import useMapStore from "@/app/stores";
import type { Carpool } from "@prisma/client";
import { orangeMarker } from "@/app/services/MarkerStyles";
import { DecimalToNumber } from "@/app/services/DecimalConversions";

function FindCarpoolPage() {
  const { mapsApi } = useMapStore();

  async function getCarpools(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const slug = getSlug(form.url.value);
    if (!slug) {
      toast({
        title: (
          <>
            <XCircle /> Tournament not Found
          </>
        ),
        variant: "destructive",
        description: "Make sure your URL is correct",
      });
      return;
    }

    let carpools;

    try {
      const { data } = await axios.get(`/api/carpool/find/${slug}`);
      carpools = data;
    } catch (e: any) {
      if (e instanceof AxiosError) return FailureToast(e.response?.data.error);
      console.log(e);
      FailureToast("Could not Find Carpool");
    }

    carpools.forEach((carpool: Carpool) => {
      mapsApi?.addMarker(
        {
          lat: DecimalToNumber(carpool.originLat),
          lng: DecimalToNumber(carpool.originLng),
        },
        orangeMarker,
      );
      //@ts-ignore
      mapsApi?.setRoute(carpool.route);
      mapsApi?.addMarker({
        lat: DecimalToNumber(carpool.destinationLat),
        lng: DecimalToNumber(carpool.destinationLng),
      });
    });
    SuccessToast("Successfully Found Carpools");
  }

  return (
    <>
      <div className={"flex gap-5 space-x-6 justify-start ms-5 my-3"}>
        <form onSubmit={(event) => getCarpools(event)}>
          <Input id={"url"} className={"w-96"} placeholder={"TournamentURL"} />
        </form>
      </div>
      <GoogleMap />
    </>
  );
}

export default FindCarpoolPage;
