"use client";
import { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface TournamentResponse {
  tournament: {
    id: number;
    lat: number;
    lng: number;
    mapsPlaceId: number;
    name: string;
    state: number;
    url: string;
    venueAddress: string;
  };
}

//to fix putting everything in one file, we have to use zutland, (or useContext) to
// manage the states everywhere
// function GoogleMap() {
//   const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([
//     { lat: 53.54992, lng: 10.00678 },
//   ]);
//
//   async function handleStartggLink(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     const formData = event.target as HTMLFormElement;
//     const tournamentSlug = slug(formData.link.value);
//
//     // add toast here
//     if (!tournamentSlug) return;
//     const { tournament }: TournamentResponse = await startggClient.request(
//       GET_TOURNAMENT_BY_URL,
//       {
//         slug: tournamentSlug,
//       },
//     );
//     // add toast here
//     if (!tournament) return;
//
//     setMarkers([...markers, { lat: tournament.lat, lng: tournament.lng }]);
//   }
//
//   return (
//     <div className={"flex flex-col gap-3 w-60"}>
//       <Button onClick={() => setMarkers([...markers, { lat: 43.6532, lng: -79.3832 }])}>
//         Add marker to Toronto
//       </Button>
//
//       <form onSubmit={(event) => handleStartggLink(event)}>
//         <Input
//           defaultValue={"https://www.start.gg/tournament/bullet-hell-1/details"}
//           id={"link"}
//           type={"text"}
//           placeholder={"startgg Url"}
//         />
//       </form>
//       <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
//         <FromForm
//           updateMarkers={(latLng: { lat: number; lng: number }) =>
//             setMarkers([...markers, {lat: latLng.lat, lng: latLng.lng}],)
//           }
//         />
//         <Map
//           style={{ width: "95vw", height: "60vh" }}
//           gestureHandling={"greedy"}
//           defaultZoom={zoom}
//           defaultCenter={mapCentre}
//           mapId={process.env.NEXT_PUBLIC_MAP_ID as string}
//         />
//
//         {markers.map((marker, index) => (
//           <AdvancedMarker key={index} position={marker} />
//         ))}
//       </APIProvider>
//     </div>
//   );
// }

function GoogleMap() {

  return (
    <div>
      <div style={{ width: "80vw", height: "80vh" }} id={"map"} />
    </div>
  );
}

export default GoogleMap;
