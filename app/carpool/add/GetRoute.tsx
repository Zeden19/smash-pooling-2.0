import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useMapStore from "@/app/stores";
import { Destination, Origin, Route } from "@/app/carpool/add/page";
import FailureToast from "@/components/FailureToast";
import SuccessToast from "@/components/SuccessToast";

interface Props {
  destination: Destination | undefined;
  origin: Origin | undefined;
  setRoute: (route: Route) => void;
  route: Route | undefined;
}

function GetRoute({ route, destination, origin, setRoute }: Props) {
  const { mapsApi } = useMapStore();
  const [shownRoute, setShownRoute] = useState<google.maps.Polyline>();
  const [loadingRoute, setLoadingRoute] = useState(false);

  async function getRoutes() {
    // add error message
    if (!origin || !destination) return;

    if (shownRoute) shownRoute.setMap(null);
    try {
      const route = await mapsApi?.getRoutes(origin.cords, destination.cords)!;
      if (!route) return;
      const newRoute = mapsApi?.setRoute(route.route);
      setRoute(route);
      SuccessToast("Successfully Found Route");
      setShownRoute(newRoute);
    } catch (e) {
      FailureToast("Could Not Find Route", "Check your origin and tournament");
    }
  }

  return (
    <Button
      disabled={loadingRoute || !destination || !origin}
      className={`${route && "border-green-400 border-2"}`}
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
