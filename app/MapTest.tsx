"use client";
import GoogleMap from "@/app/components/GoogleMap";
import useMapStore from "@/app/stores";
import { Input } from "@/components/ui/input";
import { FormEvent } from "react";
import startggClient, { slug } from "@/app/services/startggClient";
import { GET_TOURNAMENT_BY_URL } from "@/app/hooks/startggQueries";

interface TournamentResponse {
  tournament: {
    id: number;
    lat: number;
    lng: number;
    mapsPlaceId: string;
    name: string;
    state: number;
    url: string;
    venueAddress: string;
  };
}

function MapTest() {
  const { mapsApi } = useMapStore();

  async function handleStartggLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = event.target as HTMLFormElement;
    const tournamentSlug = slug(formData.link.value);

    // add toast here
    if (!tournamentSlug) return;
    const { tournament }: TournamentResponse = await startggClient.request(
      GET_TOURNAMENT_BY_URL,
      {
        slug: tournamentSlug,
      },
    );
    // add toast here
    if (!tournament) return;

    // add toast here
    mapsApi?.addMarker({ lat: tournament.lat, lng: tournament.lng });
    // addMarker({ lat: tournament.lat, lng: tournament.lng });
  }

  async function handleOrigin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = event.target as HTMLFormElement;
    const data = await mapsApi?.geocode({ address: formData.origin.value });

    // add toaster
    if (!data) return;

    // add toaster
    mapsApi?.addMarker({
      lat: data.geometry.location.lat(),
      lng: data.geometry.location.lng(),
    });
    // addMarker({
    //   lat: result.geometry.location.lat(),
    //   lng: result.geometry.location.lng(),
    // });
  }

  return (
    <div className={"flex flex-col gap-3"}>
      <form onSubmit={(event) => handleStartggLink(event)}>
        <Input
          className={"w-96"}
          defaultValue={"https://www.start.gg/tournament/bullet-hell-1/details"}
          id={"link"}
          type={"text"}
          placeholder={"startgg Url"}
        />
      </form>

      <form onSubmit={(event) => handleOrigin(event)}>
        <Input
          className={"w-96"}
          defaultValue={"Toronto"}
          id={"origin"}
          placeholder={"From"}
        />
      </form>
      <GoogleMap />
    </div>
  );
}

export default MapTest;
