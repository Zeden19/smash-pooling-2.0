"use client";
import GoogleMap from "@/components/GoogleMap";
import { useState } from "react";
import TournamentForm from "@/app/add/TournamentForm";
import OriginForm from "@/app/add/OriginForm";
import GetRoute from "@/app/add/GetRoute";
import AddCarpool from "@/app/add/AddCarpool";
import LatLngLiteral = google.maps.LatLngLiteral;
import LatLng = google.maps.LatLng;

export interface Origin {
  cords: LatLngLiteral;
  name: string;
}

export interface Destination {
  cords: LatLngLiteral;
  name: string;
  slug: string;
}

// consider using server search params: this might be overly complex due to the nature of things;
// using placeids might help
function MapTest() {
  const [origin, setOrigin] = useState<Origin>();
  const [destination, setDestination] = useState<Destination>();
  const [route, setRoute] = useState<LatLng[]>();

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
      <GoogleMap />
    </>
  );
}

export default MapTest;
