"use client";
import GoogleMap, { defaultMapSize } from "@/app/carpool/_maps/GoogleMap";
import { RefObject, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FailureToast from "@/app/_components/FailureToast";
import startggClient, { slug } from "@/app/_helpers/services/startggClient";
import { GET_TOURNAMENT_BY_URL } from "@/app/_helpers/services/startggQueries";
import SuccessToast from "@/app/_components/SuccessToast";
import useMapStore from "@/app/carpool/_maps/mapStore";
import { orangeMarker } from "@/app/carpool/_maps/MarkerStyles";
import { LoadingSpinner } from "@/app/_components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/DateTimePicker";
import LatLngLiteral = google.maps.LatLngLiteral;

export interface Origin {
  error: boolean;
  cords: LatLngLiteral;
  name: string;
}

export interface Destination {
  error: boolean;
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
  const [date, setDate] = useState<{ dateTime: Date | undefined; error: boolean }>({
    dateTime: undefined,
    error: false,
  });

  const [price, setPrice] = useState<{
    priceInput: RefObject<HTMLInputElement>;
    error: boolean;
  }>({ priceInput: useRef(null), error: false });

  const [description, setDescription] = useState<{
    descriptionInput: RefObject<HTMLTextAreaElement>;
    error: boolean;
  }>({ descriptionInput: useRef(null), error: false });

  const [shownRoute, setShownRoute] = useState<google.maps.Polyline>();
  const [originMarker, setOriginMarker] =
    useState<google.maps.marker.AdvancedMarkerElement>();
  const [destinationMarker, setDestinationMarker] =
    useState<google.maps.marker.AdvancedMarkerElement>();

  const originInput = useRef<HTMLInputElement>(null);
  const destinationInput = useRef<HTMLInputElement>(null);

  const [loadingRoute, setLoadingRoute] = useState(false);
  const [addingCarpool, setAddingCarpool] = useState(false);

  const { mapsApi } = useMapStore();

  async function getRoutes() {
    if (!originInput.current!.value || !destinationInput.current!.value) {
      !originInput.current!.value && setOriginObject({ ...originObject!, error: true });
      !destinationInput.current!.value &&
        setDestinationObject({ ...destinationObject!, error: true });

      FailureToast("Origin and destination required");
      return;
    }

    if (shownRoute) shownRoute.setMap(null);
    if (destinationMarker) mapsApi?.removeMarker(destinationMarker);
    if (originMarker) mapsApi?.removeMarker(originMarker);

    // Getting destination
    const tournamentSlug = slug(destinationInput.current!.value);
    if (!tournamentSlug) {
      setDestinationObject({ ...destinationObject!, error: true });
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
      error: false,
      cords: tournamentCords,
      name: tournament.venueAddress,
      slug: tournamentSlug,
    });

    // Getting Origin
    let data;
    try {
      data = await mapsApi?.geocode({ address: originInput.current!.value });
    } catch (e) {
      setOriginObject({ ...originObject!, error: true });
      FailureToast("Could Not Find Address", "Make sure you entered a valid address");
      return;
    }

    const originCords = {
      lat: data!.geometry.location.lat(),
      lng: data!.geometry.location.lng(),
    };
    const newOriginMarker = mapsApi?.addMarker(originCords, orangeMarker);
    setOriginObject({
      error: false,
      cords: originCords,
      name: originInput.current!.value,
    });

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
    if (
      price.priceInput.current?.value !== null &&
      parseInt(price.priceInput.current!.value) < 0
    ) {
      FailureToast("Price must be greater than 0");
      setPrice({ ...price, error: true });
      return;
    }

    if (!date.dateTime) {
      setDate({ ...date, error: true });
      FailureToast("Date is required");
      return;
    }

    if (date.dateTime < new Date()) {
      setDate({ ...date, error: true });
      FailureToast("Date cannot be in the past");
      return;
    }

    if (
      description.descriptionInput.current?.value !== null &&
      description.descriptionInput.current!.value.length >= 500
    ) {
      setDescription({ ...description, error: true });
      FailureToast("Description must be smaller than 500 characters");
      return;
    }
    try {
      const { data } = await axios.post("/api/carpool/add", {
        origin: originObject,
        destination: destinationObject,
        route,
        description: description.descriptionInput.current!.value,
        price: price.priceInput.current!.value,
        date: date.dateTime,
      });
      SuccessToast("Successfully Added Carpool", "Your good to go!");
    } catch (e: any) {
      console.log(e);
      console.log(e.response.data.error);
      if (e.response.data.error.name === "ZodError") {
        FailureToast(
          "Could Not Add Carpool",
          e.response.data.error.issues.map(
            (error: { message: string }) => error.message + "\n",
          ),
        );
      } else if (e.response.data.error) {
        FailureToast("Could Not Add Carpool", e.response.data.error);
      } else {
        FailureToast(
          "Could Not Add Carpool",
          "Try again or report this error if it persists",
        );
      }
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
              className={`${originObject?.name && !originObject?.error && "border-green-400"} 
                          ${originObject?.error && "border-red-600"}`}
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
              className={`${
                destinationObject?.name &&
                !destinationObject?.error &&
                "border-green-400 row-start-2"
              } ${destinationObject?.error && "border-red-600"}`}
            />
          </div>

          {/*Date-Time*/}
          <DateTimePicker
            error={date.error}
            date={date.dateTime}
            setDate={(newDate: Date | undefined) =>
              setDate({ error: false, dateTime: newDate })
            }
          />

          {/*Price*/}
          <div>
            <Label htmlFor={"price"}>Price</Label>
            <Input
              id={"price"}
              type={"number"}
              placeholder={"Carpool Price"}
              min={0}
              defaultValue={undefined}
              ref={price.priceInput}
              className={`${price.error && "border-red-600"}`}
            />
          </div>

          {/*Description*/}
          <div>
            <Label htmlFor={"description"}>Description</Label>
            <Textarea
              id={"description"}
              placeholder={"Carpool Description"}
              maxLength={500}
              ref={description.descriptionInput}
              className={`${description.error && "border-red-600"}`}
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
