import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import startggClient, { slug } from "@/app/services/startggClient";
import { GET_TOURNAMENT_BY_URL } from "@/app/services/startggQueries";
import useMapStore from "@/app/stores";
import FailureToast from "@/components/FailureToast";
import SuccessToast from "@/components/SuccessToast";
import { Destination } from "@/app/add/page";

interface Tournament {
  id: number;
  lat: number;
  lng: number;
  mapsPlaceId: string;
  name: string;
  state: number;
  url: string;
  venueAddress: string;
}

interface TournamentResponse {
  tournament: Tournament;
}

interface Props {
  handleSubmit: (
    venueAddress: string,
    cords: { lat: number; lng: number },
    slug: string,
  ) => void;
  destination: Destination | undefined;
}

function TournamentForm({ handleSubmit, destination }: Props) {
  const [loadingDestination, setLoadingDestination] = useState(false);
  const { mapsApi } = useMapStore();

  async function handleStartggLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = event.target as HTMLFormElement;
    const tournamentSlug = slug(formData.link.value);

    // add toast here
    if (!tournamentSlug) {
      FailureToast("Could Not Find Tournament Slug", "Make sure the URL is correct");
      return;
    }

    const { tournament }: TournamentResponse = await startggClient.request(
      GET_TOURNAMENT_BY_URL,
      { slug: tournamentSlug },
    );

    if (!tournament) {
      FailureToast("Could Not Find tournament", "Make sure the URL is correct");
      return;
    }

    const cords = { lat: tournament.lat, lng: tournament.lng };
    mapsApi?.addMarker(cords);
    handleSubmit(tournament.venueAddress, cords, tournamentSlug);
    SuccessToast("Successfully Found tournament");
  }

  return (
    <form
      className={"w-96"}
      onSubmit={async (event) => {
        setLoadingDestination(true);
        await handleStartggLink(event);
        setLoadingDestination(false);
      }}>
      <Input
        disabled={loadingDestination}
        defaultValue={"https://www.start.gg/tournament/bullet-hell-1/details"}
        id={"link"}
        type={"text"}
        placeholder={"startgg Url"}
        className={`${destination && "border-green-400"}`}
      />
    </form>
  );
}

export default TournamentForm;
