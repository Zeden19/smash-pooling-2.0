import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useMapStore from "@/app/stores";
import { Destination, Origin } from "@/app/add/page";
import LatLng = google.maps.LatLng;

interface Props {
  destination: Destination | undefined;
  origin: Origin | undefined;
  setRoute: (route: any) => void;
}

function GetRoute({ destination, origin, setRoute }: Props) {
  const { mapsApi } = useMapStore();

  async function getRoutes() {
    // add error message
    if (!origin || !destination) return;
    const route: LatLng[] | undefined = await mapsApi?.getRoutes(
      origin.cords,
      destination.cords,
    );

    // add toaster
    if (!route) return;

    mapsApi?.setRoute(route);
    setRoute(route);
  }

  const [loadingRoute, setLoadingRoute] = useState(false);

  return (
    <Button
      disabled={loadingRoute || !destination || !origin}
      className={"gap-3"}
      onClick={async () => {
        setLoadingRoute(true);
        await getRoutes();
        setLoadingRoute(false);
      }}>
      Find Route
      {loadingRoute && <LoadingSpinner />}
    </Button>
  );
}

export default GetRoute;
