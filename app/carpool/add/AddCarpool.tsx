import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useState } from "react";
import axios from "axios";
import { Destination, Origin, Route } from "@/app/carpool/add/page";
import SuccessToast from "@/components/SuccessToast";
import FailureToast from "@/components/FailureToast";

interface Props {
  route: Route | undefined;
  origin: Origin | undefined;
  destination: Destination | undefined;
}

function AddCarpool({ route, destination, origin }: Props) {
  const [addingCarpool, setAddingCarpool] = useState(false);

  async function addCarpool() {
    try {
      const { data } = await axios.post("/api/carpool/add", {
        origin,
        destination,
        route,
      });
      SuccessToast("Successfully Added Carpool", "Your good to go!");
    } catch (e) {
      console.log(e);
      FailureToast(
        "Could Not Add Carpool",
        "Please try again or report this bug if it persists",
      );
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
