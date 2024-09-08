"use client";
import GoogleMap from "@/app/components/GoogleMap";
import { Button } from "@/components/ui/button";
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
    mapsPlaceId: number;
    name: string;
    state: number;
    url: string;
    venueAddress: string;
  };
}

function MapTest() {
  const { addMarker, geocoder } = useMapStore();

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
    addMarker({ lat: tournament.lat, lng: tournament.lng });
  }

  async function handleOrigin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = event.target as HTMLFormElement;
    const data = await geocoder?.geocode({ address: formData.origin.value });
    
    // add toaster
    if (!data) return;
    
    const location = data.results[0].geometry.location
    // add toaster
    addMarker({ lat: location.lat(), lng: location.lng() });
  }
  return (
    <div className={"flex flex-col gap-3"}>
      <Button
        className={"w-48"}
        onClick={() => addMarker({ lat: 43.6532, lng: -79.3832 })}>
        Add marker to Toronto
      </Button>

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
