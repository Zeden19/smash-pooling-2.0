"use client";
import useMapStore from "@/app/stores";
import { Carpool } from "prisma/prisma-client";
import { DecimalToNumber } from "@/app/carpool/DecimalConversions";
import { orangeMarker } from "@/app/MarkerStyles";
import decodePolyline from "@/app/services/decodePath";

interface Props {
  carpool: Carpool;
}

function MapElements({ carpool }: Props) {
  const { mapsApi } = useMapStore();
  const route = carpool.route;

  const decodedRoute = decodePolyline(route) as unknown as google.maps.LatLng[];
  const middle = decodedRoute[Math.floor(decodedRoute.length / 2)];

  // destination Marker
  mapsApi?.addMarker({
    lat: DecimalToNumber(carpool.destinationLat),
    lng: DecimalToNumber(carpool.destinationLng),
  });

  // origin marker
  mapsApi?.addMarker(
    {
      lat: DecimalToNumber(carpool.originLat),
      lng: DecimalToNumber(carpool.originLng),
    },
    orangeMarker,
  );

  mapsApi?.setRoute(route);

  // set centre
  mapsApi?.setCentre(middle);
  return <></>;
}

export default MapElements;
