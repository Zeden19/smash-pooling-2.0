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
  const { setMapsApi } = useMapStore();

  async function initMap(): Promise<void> {
    const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
    const map = new Map(document.getElementById("map") as HTMLElement, {
      center: mapCentre,
      zoom: zoom,
      mapId: process.env.NEXT_PUBLIC_MAP_ID,
      gestureHandling: "greedy",
    });

    // we have to load advanced marker here because its await ):
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      "marker",
    )) as google.maps.MarkerLibrary;
    const { DirectionsService } = (await google.maps.importLibrary(
      "routes",
    )) as google.maps.RoutesLibrary;
    const mapsApi = new MapsApi(map, AdvancedMarkerElement, DirectionsService.prototype);
    setMapsApi(mapsApi);
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
