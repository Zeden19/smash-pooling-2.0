"use client";
import { mapProps, orangeMarker, polylineOptions } from "@/app/carpool/_maps/mapConfig";
import { AdvancedMarker, Map, Pin, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { RefObject, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FailureToast from "@/app/_components/toast/FailureToast";
import startggClient, { slug } from "@/app/_helpers/services/startggClient";
import { GET_TOURNAMENT_BY_URL } from "@/app/_helpers/services/startggQueries";
import SuccessToast from "@/app/_components/toast/SuccessToast";
import { LoadingSpinner } from "@/app/_components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/DateTimePicker";
import { Polyline } from "@/app/carpool/_maps/Polyline";
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
  polyline: string;
  distance: string | undefined;
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

  const originInput = useRef<HTMLInputElement>(null);
  const destinationInput = useRef<HTMLInputElement>(null);

  const [loadingRoute, setLoadingRoute] = useState(false);
  const [addingCarpool, setAddingCarpool] = useState(false);

  const routesLib = useMapsLibrary("routes");
  const geocodingLib = useMapsLibrary("geocoding");
  const map = useMap();

  async function getRoutes() {
    if (!routesLib || !geocodingLib || !map) {
      FailureToast("Something went wrong", "Please try again or report this error");
      return;
    }

    if (!originInput.current?.value) {
      setOriginObject({ ...originObject!, error: true });
      FailureToast("Origin required");
      return;
    }

    if (!destinationInput.current?.value) {
      setDestinationObject({ ...destinationObject!, error: true });
      FailureToast("Destination required");
      return;
    }

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
    setDestinationObject({
      error: false,
      cords: tournamentCords,
      name: tournament.venueAddress,
      slug: tournamentSlug,
    });

    // Getting Origin
    let data;
    try {
      const geocoder = new geocodingLib.Geocoder();
      const address = await geocoder.geocode({ address: originInput.current.value });

      if (address.results.length === 0) {
        setOriginObject({ ...originObject!, error: true });
        FailureToast(
          "Something went wrong with your origin location",
          "Please make sure the address is valid",
        );
        return;
      }

      data = address.results[0];
    } catch (e) {
      setOriginObject({ ...originObject!, error: true });
      FailureToast("Could Not Find Address", "Make sure you entered a valid address");
      return;
    }

    const originCords = {
      lat: data.geometry.location.lat(),
      lng: data.geometry.location.lng(),
    };
    setOriginObject({
      error: false,
      cords: originCords,
      name: originInput.current!.value,
    });

    // Get route
    try {
      const directionsService = new routesLib.DirectionsService();
      const { routes } = await directionsService.route({
        origin: originCords,
        destination: tournamentCords,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      if (routes.length === 0) {
        FailureToast("Could Not Find Route");
        return;
      }

      const route = routes[0];
      const polyline = route.overview_polyline;
      const distance = route.legs[0].distance?.text;
      
      map.setCenter(route.bounds.getCenter());
      setRoute({ polyline: polyline, distance });
      SuccessToast("Successfully Found Route");
    } catch (e) {
      FailureToast("Could Not Find Route", "Check your origin and tournament");
    }
  }

  async function addCarpool() {
    // Zod????
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
    
    if (!route) {
      FailureToast("Route not found");
      return;
    }
    try {
      await axios.post("/api/carpool/add", {
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
    <div className="flex h-[94vh]">
      <div className={"flex flex-col gap-4 p-4 w-1/4 bg-black"}>
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
      <Map {...mapProps}>
        {destinationObject?.cords && (
          <AdvancedMarker position={destinationObject.cords}></AdvancedMarker>
        )}

        {originObject?.cords && (
          <AdvancedMarker position={originObject.cords}>
            <Pin {...orangeMarker} />
          </AdvancedMarker>
        )}

        {route?.polyline && <Polyline encodedPath={route?.polyline} {...polylineOptions} />}
      </Map>
    </div>
  );
}

export default AddCarpoolPage;
