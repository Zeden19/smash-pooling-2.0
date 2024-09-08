"use client";
import GoogleMap from "@/app/components/GoogleMap";
import { Button } from "@/components/ui/button";
import useMapStore from "@/app/stores";

function MapTest() {
  const {setMarker} = useMapStore()
  return (
    <>
      <Button onClick={() => setMarker({lat: 0, lng: 0})}>
        Add marker to Toronto
      </Button>

      <GoogleMap />
    </>
  );
}

export default MapTest;
