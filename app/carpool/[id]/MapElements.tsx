"use client";
import useMapStore from "@/app/carpool/_maps/mapStore";
import { orangeMarker } from "@/app/carpool/_maps/MarkerStyles";
import decodePolyline from "@/app/_helpers/functions/decodePath";
import { CarpoolNumber } from "@/app/_helpers/entities/CarpoolTypes";

interface Props {
  carpool: CarpoolNumber;
}

function MapElements({ carpool }: Props) {
  const { mapsApi } = useMapStore();
  const route = carpool.route;

  const decodedRoute = decodePolyline(route) as unknown as google.maps.LatLng[];
  const middle = decodedRoute[Math.floor(decodedRoute.length / 2)];

  // destination Marker
  mapsApi?.addMarker({
    lat: carpool.destinationLat,
    lng: carpool.destinationLng,
  });

  // origin marker
  mapsApi?.addMarker(
    {
      lat: carpool.originLat,
      lng: carpool.originLng,
    },
    orangeMarker,
  );

  mapsApi?.setRoute(route);

  // set centre
  mapsApi?.setCentre(middle);
  return <></>;
}

export default MapElements;
