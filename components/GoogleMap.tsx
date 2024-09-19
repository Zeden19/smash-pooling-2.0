"use client";
import { useEffect } from "react";
import useMapStore from "@/app/stores";
import MapsApi from "@/app/carpool/MapsApi";

//Map's styling
export const defaultMapSize = { width: "100vw", height: "80vh" };

const mapCentre = {
  lat: 43.6532,
  lng: -79.3832,
};
const zoom = 6;

interface Props {
  size: {
    width: string;
    height: string;
  };
  disableDefaultUI?: boolean;
}

function GoogleMap({ size, disableDefaultUI = false }: Props) {
  const { setMapsApi } = useMapStore();

  async function initMap(): Promise<void> {
    const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
    const map = new Map(document.getElementById("map") as HTMLElement, {
      center: mapCentre,
      zoom: zoom,
      mapId: process.env.NEXT_PUBLIC_MAP_ID,
      gestureHandling: "greedy",
      disableDefaultUI,
    });

    // We have  to load libraries
    if (!google.maps.marker)
      (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
    const mapsApi = new MapsApi(map);
    setMapsApi(mapsApi);
  }

  useEffect(() => {
    initMap();
  }, []);

  return (
    <div>
      <div style={size} id={"map"} />
    </div>
  );
}

export default GoogleMap;
