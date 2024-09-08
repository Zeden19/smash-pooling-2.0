"use client";
import { useEffect } from "react";
import useMapStore from "@/app/stores";
import loader from "@/app/services/googleMapsLoader";

//Map's styling
const mapCentre = {
  lat: 43.6532,
  lng: -79.3832,
};
const zoom = 6;

function GoogleMap() {
  const { setMap, setAdvancedMarkerClass, setGeocoder } = useMapStore();

  useEffect(() => {
    loader
      .importLibrary("maps")
      .then(({ Map }) => {
        const newMap = new Map(document.getElementById("map")!, {
          zoom: zoom,
          mapId: process.env.NEXT_PUBLIC_MAP_ID,
          center: mapCentre,
        });
        setMap(newMap);
      })
      .catch(() => {
        return "Could not load Map";
      });

    loader
      .importLibrary("marker")
      .then((r) => setAdvancedMarkerClass(r.AdvancedMarkerElement));
    
    loader.importLibrary("geocoding").then((r) => setGeocoder(r.Geocoder.prototype))
  }, [setAdvancedMarkerClass, setGeocoder, setMap]);

  return (
    <div>
      <div style={{ width: "80vw", height: "80vh" }} id={"map"} />
    </div>
  );
}

export default GoogleMap;
