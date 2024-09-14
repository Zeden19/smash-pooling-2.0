import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import startggClient, { slug } from "@/app/services/startggClient";
import { GET_TOURNAMENT_BY_URL } from "@/app/services/startggQueries";
import useMapStore from "@/app/stores";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

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
}

function TournamentForm({ handleSubmit }: Props) {
  const [loadingDestination, setLoadingDestination] = useState(false);
  const { mapsApi } = useMapStore();

  async function handleStartggLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = event.target as HTMLFormElement;
    const tournamentSlug = slug(formData.link.value);

    // add toast here
    if (!tournamentSlug) {
      toast({
        title: (
          <>
            <XCircle />
            Could Not Find Tournament Slug
          </>
        ),
        description: "Make sure the URL is correct",
        variant: "destructive",
      });
      return;
    }

    const { tournament }: TournamentResponse = await startggClient.request(
      GET_TOURNAMENT_BY_URL,
      {
        slug: tournamentSlug,
      },
    );
    // add toast here
    if (!tournament) {
      toast({
        title: (
          <>
            <XCircle />
            Could Not Find tournament
          </>
        ),
        description: "Make sure the URL is correct",
        variant: "destructive",
      });
      return;
    }

    // add toast here
    const cords = { lat: tournament.lat, lng: tournament.lng };
    mapsApi?.addMarker(cords);
    handleSubmit(tournament.venueAddress, cords, tournamentSlug);
    toast({
      title: (
        <>
          <CheckCircle />
          Successfully Found tournament
        </>
      ),
      variant: "success",
    });
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
      />
    </form>
  );
}

export default TournamentForm;
