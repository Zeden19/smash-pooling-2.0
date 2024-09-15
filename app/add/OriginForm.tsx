import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import useMapStore from "@/app/stores";
import FailureToast from "@/components/FailureToast";
import SuccessToast from "@/components/SuccessToast";
import { orangeMarker } from "@/app/MarkerStyles";
import { Origin } from "@/app/add/page";

interface Props {
  setOrigin: (origin: Origin) => void;
  origin: Origin | undefined;
}

function OriginForm({ setOrigin, origin }: Props) {
  const { mapsApi } = useMapStore();
  const [loadingOrigin, setLoadingOrigin] = useState(false);

  async function handleOrigin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = event.target as HTMLFormElement;
    const inputValue = formData.origin.value;
    let data;
    try {
      data = await mapsApi?.geocode({ address: inputValue });
    } catch (e) {
      FailureToast("Could Not Find Address", "Make sure you entered a valid address");
      return;
    }

    const cords = {
      lat: data!.geometry.location.lat(),
      lng: data!.geometry.location.lng(),
    };
    mapsApi?.addMarker(cords, orangeMarker);
    setOrigin({ cords: cords, name: inputValue });
    SuccessToast("Successfully Found Address");
  }

  return (
    <form
      onSubmit={async (event) => {
        setLoadingOrigin(true);
        await handleOrigin(event);
        setLoadingOrigin(false);
      }}>
      <Input
        className={origin && "border-green-400"}
        disabled={loadingOrigin}
        defaultValue={"Toronto"}
        id={"origin"}
        placeholder={"From"}
      />
    </form>
  );
}

export default OriginForm;
