"use client";
import GoogleMap, { defaultMapSize } from "@/components/GoogleMap";
import { useState } from "react";
import TournamentForm from "@/app/carpool/add/TournamentForm";
import OriginForm from "@/app/carpool/add/OriginForm";
import GetRoute from "@/app/carpool/add/GetRoute";
import AddCarpool from "@/app/carpool/add/AddCarpool";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
      <div className={"grid grid-rows-5 grid-cols-2 justify-start mx-5 my-3"}>
        <div className={"row-start-1 col-start-1"}>
          <OriginForm origin={origin} setOrigin={(origin) => setOrigin(origin)} />
        </div>

        <div className={"row-start-3 col-span-2 col-start-1"}>
          <Textarea placeholder={"Carpool Description"} />
        </div>

        <div className={"row-start-1 row-span-2"}>
          <Input placeholder={"Carpool Price"} />
        </div>

        <div className={"row-start-2 col-start-1"}>
          <TournamentForm
            destination={destination}
            handleSubmit={(venueAddress, cords, slug) =>
              setDestination({ name: venueAddress, cords: cords, slug: slug })
            }
          />
        </div>

        <div className={"row-start-4 col-start-1"}>
          <GetRoute
            route={route}
            origin={origin}
            destination={destination}
            setRoute={(route) => setRoute(route)}
          />
        </div>

        <div className={"row-start-5 col-start-1"}>
          <AddCarpool origin={origin} destination={destination} route={route} />
        </div>

        {/*Used in the future when user has to select a route*/}
        {/*<Button onClick={() => setRoute()}>Set Route</Button>*/}
      </div>
      <GoogleMap size={defaultMapSize} />
    </>
  );
}

export default AddCarpoolPage;
