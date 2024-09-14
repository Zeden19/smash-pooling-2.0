import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useMapStore from "@/app/stores";
import { Destination, Origin } from "@/app/add/page";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";
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
    let route: LatLng[] | undefined;
    try {
      route = await mapsApi?.getRoutes(origin.cords, destination.cords);
    } catch (e) {
      toast({
        variant: "destructive",
        title: (
          <>
            <XCircle /> Could Not Find Route
          </>
        ),
        description: "Check your origin and tournament",
      });
      return;
    }

    if (!route) {
      toast({
        variant: "destructive",
        title: (
          <>
            <XCircle /> Could Not Find Route
          </>
        ),
        description: "Check your origin and tournament markers",
      });
      return;
    }

    mapsApi?.setRoute(route);
    setRoute(route);
    toast({
      variant: "success",
      title: (
        <>
          <CheckCircle /> Successfully Found Route
        </>
      ),
    });
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
