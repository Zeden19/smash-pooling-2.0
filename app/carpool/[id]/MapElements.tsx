"use client";
import useMapStore from "@/app/stores";
import { orangeMarker } from "@/app/MarkerStyles";
import decodePolyline from "@/app/carpool/decodePath";
import { CarpoolNumber } from "@/app/helpers/entities/CarpoolTypes";

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
