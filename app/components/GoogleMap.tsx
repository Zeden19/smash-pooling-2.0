"use client";
import { useEffect } from "react";
import useMapStore from "@/app/stores";
import loadMapsAPI from "@/app/services/loadMapsApi";
import MapsApi from "@/app/services/MapsApi";

//Map's styling
const mapCentre = {
  lat: 43.6532,
  lng: -79.3832,
};
const zoom = 6;

function GoogleMap() {
  const { setMap, setMapsApi } = useMapStore();

  async function initMap(): Promise<void> {
    const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
    const map = new Map(document.getElementById("map") as HTMLElement, {
      center: mapCentre,
      zoom: zoom,
      mapId: process.env.NEXT_PUBLIC_MAP_ID,
    });

    // move geocoder and advanced marker element inside constructor so we only include map
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      "marker",
    )) as google.maps.MarkerLibrary;
    const mapsApi = new MapsApi(map, AdvancedMarkerElement);
    setMapsApi(mapsApi);
    setMap(map);
  }

  useEffect(() => {
    loadMapsAPI();
    initMap();
  }, []);

  return (
    <div>
      <div style={{ width: "80vw", height: "80vh" }} id={"map"} />
    </div>
  );
}

export default GoogleMap;
