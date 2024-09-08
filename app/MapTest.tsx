"use client";
import GoogleMap from "@/app/components/GoogleMap";
import { MapContext, MapProvider } from "@/app/MapContext";
import { useContext } from "react";

function MapTest() {
  const {map, dispatch} = useContext(MapContext)
  return (
    <MapProvider>
      
      <GoogleMap />
    </MapProvider>
  );
}

export default MapTest;
