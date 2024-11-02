"use client";
import GoogleMap, { defaultMapSize } from "@/components/GoogleMap";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FailureToast from "@/components/FailureToast";
import startggClient, { slug } from "@/app/helpers/services/startggClient";
import { GET_TOURNAMENT_BY_URL } from "@/app/helpers/services/startggQueries";
import SuccessToast from "@/components/SuccessToast";
import useMapStore from "@/app/stores";
import { orangeMarker } from "@/app/MarkerStyles";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Label } from "@/components/ui/label";
import LatLngLiteral = google.maps.LatLngLiteral;

export interface Origin {
  cords: LatLngLiteral;
  name: string;
}

export interface Destination {
  cords: LatLngLiteral;
  name: string;
  slug: string;
}

export interface Route {
  route: string;
  distance: string;
}

interface Tournament {
  id: number;
  lat: number;
  lng: number;
  mapsPlaceId: string;
  name: string;
  state: number;
  url: string;
  venueAddress: string;
}

interface TournamentResponse {
  tournament: Tournament;
}

// consider using server search params: this might be overly complex due to the nature of things;
// using placeids might help
function AddCarpoolPage() {
  const [originObject, setOriginObject] = useState<Origin>();
  const [destinationObject, setDestinationObject] = useState<Destination>();
  const [route, setRoute] = useState<Route>();
  const [shownRoute, setShownRoute] = useState<google.maps.Polyline>();
  const [originMarker, setOriginMarker] =
    useState<google.maps.marker.AdvancedMarkerElement>();
  const [destinationMarker, setDestinationMarker] =
    useState<google.maps.marker.AdvancedMarkerElement>();

  const originInput = useRef<HTMLInputElement>(null);
  const destinationInput = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLTextAreaElement>(null);
  const price = useRef<HTMLInputElement>(null);

  const [loadingRoute, setLoadingRoute] = useState(false);
  const [addingCarpool, setAddingCarpool] = useState(false);

  const { mapsApi } = useMapStore();

  async function getRoutes() {
    if (!originInput.current!.value || !destinationInput.current!.value) {
      FailureToast("Origin and destination required");
      return;
    }

    if (shownRoute) shownRoute.setMap(null);
    if (destinationMarker) mapsApi?.removeMarker(destinationMarker);
    if (originMarker) mapsApi?.removeMarker(originMarker);

    // Getting destination
    const tournamentSlug = slug(destinationInput.current!.value);
    if (!tournamentSlug) {
      FailureToast("Could Not Find Tournament Slug", "Make sure the URL is correct");
      return;
    }

    const { tournament }: TournamentResponse = await startggClient.request(
      GET_TOURNAMENT_BY_URL,
      { slug: tournamentSlug },
    );

    if (!tournament) {
      FailureToast("Could Not Find tournament", "Make sure the URL is correct");
      return;
    }

    const tournamentCords = { lat: tournament.lat, lng: tournament.lng };
    const marker = mapsApi?.addMarker(tournamentCords);
    setDestinationObject({
      cords: tournamentCords,
      name: tournament.venueAddress,
      slug: tournamentSlug,
    });

    // Getting Origin
    let data;
    try {
      data = await mapsApi?.geocode({ address: originInput.current!.value });
    } catch (e) {
      FailureToast("Could Not Find Address", "Make sure you entered a valid address");
      return;
    }

    const originCords = {
      lat: data!.geometry.location.lat(),
      lng: data!.geometry.location.lng(),
    };
    const newOriginMarker = mapsApi?.addMarker(originCords, orangeMarker);
    setOriginObject({ cords: originCords, name: originInput.current!.value });

    // Get route
    try {
      const route = await mapsApi?.getRoutes(originCords, tournamentCords)!;
      const newRoute = mapsApi?.setRoute(route!.route);
      setRoute(route!);

      setOriginMarker(newOriginMarker);
      setDestinationMarker(marker);
      setShownRoute(newRoute);

      SuccessToast("Successfully Found Route");
    } catch (e) {
      FailureToast("Could Not Find Route", "Check your origin and tournament");
    }
  }

  async function addCarpool() {
    try {
      const { data } = await axios.post("/api/carpool/add", {
        origin: originObject,
        destination: destinationObject,
        route,
        description: description.current!.value,
        price: price.current!.value,
      });
      SuccessToast("Successfully Added Carpool", "Your good to go!");
    } catch (e) {
      console.log(e);
      FailureToast(
        "Could Not Add Carpool",
        "Please try again or report this bug if it persists",
      );
    }
  }

  return (
    <>
      <GoogleMap size={defaultMapSize}>
        <div
          className={
            "flex flex-col gap-4 p-4 h-full w-1/4 absolute top-0 left-0 bg-black"
          }>
          {/*Origin*/}
          <div>
            <Label htmlFor={"origin"}>Starting Location</Label>
            <Input
              id={"origin"}
              ref={originInput}
              className={`${originObject?.name && "border-green-400"}`}
              defaultValue={"Toronto"}
              placeholder={"From"}
            />
          </div>

          {/*Destination*/}
          <div>
            <Label htmlFor={"destination"}>Tournament</Label>
            <Input
              ref={destinationInput}
              defaultValue={"https://www.start.gg/tournament/bullet-hell-1/details"}
              id={"destination"}
              type={"text"}
              placeholder={"startgg Url"}
              className={`${destinationObject?.name && "border-green-400 row-start-2"}`}
            />
          </div>

          {/*Price*/}
          <div>
            <Label htmlFor={"price"}>Price</Label>
            <Input
              id={"price"}
              type={"number"}
              placeholder={"Carpool Price"}
              min={0}
              defaultValue={undefined}
              ref={price}
            />
          </div>

          {/*Description*/}
          <div>
            <Label htmlFor={"description"}>Description</Label>
            <Textarea
              id={"description"}
              placeholder={"Carpool Description"}
              maxLength={500}
              ref={description}
            />
          </div>
          <div className={"row-start-5"}>
            <Button
              disabled={loadingRoute}
              className={`${route && "border-green-400 border-2"}`}
              onClick={async () => {
                setLoadingRoute(true);
                await getRoutes();
                setLoadingRoute(false);
              }}>
              Find Route
              {loadingRoute && <LoadingSpinner />}
            </Button>
          </div>

          <div>
            <Button
              disabled={addingCarpool || !route}
              onClick={async () => {
                setAddingCarpool(true);
                await addCarpool();
                setAddingCarpool(false);
              }}>
              Add Carpool {addingCarpool && <LoadingSpinner />}
            </Button>
          </div>

          {/*Used in the future when user has to select a route*/}
          {/*<Button onClick={() => setRoute()}>Set Route</Button>*/}
        </div>
      </GoogleMap>
    </>
  );
}

export default AddCarpoolPage;
