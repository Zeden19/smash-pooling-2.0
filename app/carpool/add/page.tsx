"use client";
import GoogleMap, { defaultMapSize } from "@/components/GoogleMap";
import { useState } from "react";
import TournamentForm from "@/app/carpool/add/TournamentForm";
import OriginForm from "@/app/carpool/add/OriginForm";
import GetRoute from "@/app/carpool/add/GetRoute";
import AddCarpool from "@/app/carpool/add/AddCarpool";
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

// consider using server search params: this might be overly complex due to the nature of things;
// using placeids might help
function AddCarpoolPage() {
  const [origin, setOrigin] = useState<Origin>();
  const [destination, setDestination] = useState<Destination>();
  const [route, setRoute] = useState<Route>();

  return (
    <>
      <div className={"flex flex-row gap-5 space-x-6 justify-start ms-5 my-3"}>
        <TournamentForm
          destination={destination}
          handleSubmit={(venueAddress, cords, slug) =>
            setDestination({ name: venueAddress, cords: cords, slug: slug })
          }
        />

        <OriginForm origin={origin} setOrigin={(origin) => setOrigin(origin)} />

        <GetRoute
          route={route}
          origin={origin}
          destination={destination}
          setRoute={(route) => setRoute(route)}
        />

        <AddCarpool origin={origin} destination={destination} route={route} />

        {/*Used in the future when user has to select a route*/}
        {/*<Button onClick={() => setRoute()}>Set Route</Button>*/}
      </div>
      <GoogleMap size={defaultMapSize} />
    </>
  );
}

export default AddCarpoolPage;
