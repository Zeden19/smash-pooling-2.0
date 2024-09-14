import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import useMapStore from "@/app/stores";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";
import LatLngLiteral = google.maps.LatLngLiteral;

interface Props {
  setOrigin: (origin: { cords: LatLngLiteral; name: string }) => void;
}

function OriginForm({ setOrigin }: Props) {
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
      toast({
        variant: "destructive",
        title: (
          <>
            <XCircle /> Could Not Find Address
          </>
        ),
        description: "Make sure you entered a valid address",
      });
      return;
    }

    const cords = {
      lat: data!.geometry.location.lat(),
      lng: data!.geometry.location.lng(),
    };
    mapsApi?.addMarker(cords);
    setOrigin({ cords: cords, name: inputValue });
    toast({
      variant: "success",
      title: (
        <>
          <CheckCircle /> Successfully Found Address
        </>
      ),
    });
  }

  return (
    <form
      onSubmit={async (event) => {
        setLoadingOrigin(true);
        await handleOrigin(event);
        setLoadingOrigin(false);
      }}>
      <Input
        disabled={loadingOrigin}
        className={""}
        defaultValue={"Toronto"}
        id={"origin"}
        placeholder={"From"}
      />
    </form>
  );
}

export default OriginForm;
