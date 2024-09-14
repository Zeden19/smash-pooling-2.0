import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useState } from "react";
import axios from "axios";
import { Destination, Origin } from "@/app/add/page";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";
import LatLng = google.maps.LatLng;

interface Props {
  route: LatLng[] | undefined;
  origin: Origin | undefined;
  destination: Destination | undefined;
}

function AddCarpool({ route, destination, origin }: Props) {
  const [addingCarpool, setAddingCarpool] = useState(false);
  const { toast } = useToast();

  async function addCarpool() {
    try {
      const { data } = await axios.post("/api/carpool/add", {
        origin,
        destination,
        route,
      });

      toast({
        variant: "success",
        title: (
          <>
            <CheckCircle /> Successfully Added Carpool
          </>
        ),
        description: "Your good to go!",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: (
          <>
            <XCircle /> Could Not Add Carpool
          </>
        ),
        description: "Please try again or report this bug if it persists",
      });
    }
  }

  return (
    <>
      <Button
        disabled={addingCarpool || !route}
        onClick={async () => {
          setAddingCarpool(true);
          await addCarpool();
          setAddingCarpool(false);
        }}>
        Add Carpool {addingCarpool && <LoadingSpinner />}
      </Button>
    </>
  );
}

export default AddCarpool;
