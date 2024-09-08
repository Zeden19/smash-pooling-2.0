import { FormEvent, useEffect, useMemo } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Input } from "@/components/ui/input";

interface Props {
  updateMarkers : (latLng: {lat : number, lng: number}) => void;
}

function FromForm({ updateMarkers }: Props) {
  async function handleOriginAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = event.target as HTMLFormElement;

    console.log(formData.origin.value);
    console.log(geocoder);
    const data = await geocoder?.geocode({ address: formData.origin.value });
    const location = data?.results[0].geometry.location;
    if (!location) return;
    updateMarkers({ lat: location?.lat(), lng: location?.lng() });
  }

  const geocodingLibrary = useMapsLibrary("geocoding");
  const geocoder = useMemo(
    () => geocodingLibrary && new geocodingLibrary.Geocoder(),
    [geocodingLibrary],
  );

  useEffect(() => {
    if (!geocoder) return;
  }, [geocoder]);

  return (
    <form onSubmit={(event) => handleOriginAddress(event)}>
      <Input type={"text"} id={"origin"} placeholder={"From"} />
    </form>
  );
}

export default FromForm;
