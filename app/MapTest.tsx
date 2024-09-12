"use client";
import GoogleMap from "@/components/GoogleMap";
import useMapStore from "@/app/stores";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import startggClient, { slug } from "@/app/services/startggClient";
import { GET_TOURNAMENT_BY_URL } from "@/app/hooks/startggQueries";
import { Button } from "@/components/ui/button";
import LatLngLiteral = google.maps.LatLngLiteral;
import LatLng = google.maps.LatLng;

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
  const [origin, setOrigin] = useState<LatLngLiteral>();
  const [destination, setDestination] = useState<LatLngLiteral>();

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
    const cords = { lat: tournament.lat, lng: tournament.lng };
    mapsApi?.addMarker(cords);
    setDestination(cords);
  }

  async function handleOrigin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = event.target as HTMLFormElement;
    const data = await mapsApi?.geocode({ address: formData.origin.value });

    // add toaster
    if (!data) return;

    // add toaster
    const cords = {
      lat: data.geometry.location.lat(),
      lng: data.geometry.location.lng(),
    };
    mapsApi?.addMarker(cords);
    setOrigin(cords);
  }

  async function getRoutes() {
    // add error message
    if (!origin || !destination) return;
    const route: LatLng[] | undefined = await mapsApi?.getRoutes(origin, destination);

    // add toaster
    if (!route) return;
    mapsApi?.setRoute(route);
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

      <Button onClick={() => getRoutes()}>Find Directions</Button>

      {/*Used in the future when user has to select a route*/}
      {/*<Button onClick={() => setRoute()}>Set Route</Button>*/}
      <GoogleMap />
    </div>
  );
}

export default MapTest;
