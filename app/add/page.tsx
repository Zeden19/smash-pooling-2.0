"use client";
import GoogleMap from "@/components/GoogleMap";
import useMapStore from "@/app/stores";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import startggClient, { slug } from "@/app/services/startggClient";
import { GET_TOURNAMENT_BY_URL } from "@/app/hooks/startggQueries";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import axios from "axios";
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

// things to do: seperate this file into each respective "fetch"
// find a better way to handle loading & error staes instead if using multiple useState hooks
// find out how to handle errors on front end
// does react router solve these issues?

function MapTest() {
  const { mapsApi } = useMapStore();
  const [origin, setOrigin] = useState<{ cords: LatLngLiteral; name: string }>();
  const [destination, setDestination] = useState<{
    cords: LatLngLiteral;
    name: string;
    slug: string;
  }>();
  const [route, setRoute] = useState<LatLng[]>();

  const [loadingOrigin, setLoadingOrigin] = useState(false);
  const [loadingDestination, setLoadingDestination] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [addingCarpool, setAddingCarpool] = useState(false);

  async function handleOrigin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = event.target as HTMLFormElement;
    const inputValue = formData.origin.value;
    const data = await mapsApi?.geocode({ address: inputValue });

    // add toaster
    if (!data) return;

    // add toaster
    const cords = {
      lat: data.geometry.location.lat(),
      lng: data.geometry.location.lng(),
    };
    mapsApi?.addMarker(cords);
    setOrigin({ cords: cords, name: inputValue });
  }

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
    setDestination({ cords, name: tournament.venueAddress, slug: tournamentSlug });
  }

  async function getRoutes() {
    // add error message
    if (!origin || !destination) return;
    const route: LatLng[] | undefined = await mapsApi?.getRoutes(
      origin.cords,
      destination.cords,
    );

    // add toaster
    if (!route) return;

    mapsApi?.setRoute(route);
    setRoute(route);
  }

  async function addCarpool() {
    try {
      const { data } = await axios.post("/api/carpool/add", {
        origin,
        destination,
        route,
      });

      console.log(data);
      // show toaster
    } catch (e) {
      console.log(e);
    }

    // add toaster for success
  }

  return (
    <>
      <div className={"flex flex-row gap-5 space-x-6 justify-start ms-5 my-3"}>
        <form
          className={"w-96"}
          onSubmit={async (event) => {
            setLoadingDestination(true);
            await handleStartggLink(event);
            setLoadingDestination(false);
          }}>
          <Input
            disabled={loadingDestination}
            defaultValue={"https://www.start.gg/tournament/bullet-hell-1/details"}
            id={"link"}
            type={"text"}
            placeholder={"startgg Url"}
          />
        </form>

        <form
          onSubmit={async (event) => {
            setLoadingOrigin(true);
            await handleOrigin(event);
            setLoadingOrigin(false);
          }}>
          <Input
            disabled={loadingOrigin}
            className={""}
            defaultValue={"Toronto"}
            id={"origin"}
            placeholder={"From"}
          />
        </form>

        <Button
          disabled={loadingRoute || !destination || !origin}
          className={"gap-3"}
          onClick={async () => {
            setLoadingRoute(true);
            await getRoutes();
            setLoadingRoute(false);
          }}>
          Find Route
          {loadingRoute && <LoadingSpinner />}
        </Button>
        <Button
          onClick={async () => {
            setAddingCarpool(true);
            await addCarpool();
            setAddingCarpool(false);
          }}>
          Add Carpool
        </Button>

        {/*Used in the future when user has to select a route*/}
        {/*<Button onClick={() => setRoute()}>Set Route</Button>*/}
      </div>
      <GoogleMap />
    </>
  );
}

export default MapTest;
