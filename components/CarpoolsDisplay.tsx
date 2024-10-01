import CarpoolTable from "@/components/CarpoolTable";
import { CarpoolStatus } from "prisma/prisma-client";

interface Props {
  carpoolsDriving: CarpoolNumber[];
  carpoolsAttending: CarpoolNumber[];
}

export interface CarpoolNumber {
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  id: number;
  driverId: string;
  originName: string;
  destinationName: string;
  tournamentSlug: string;
  seatsAvailable: number | null;
  distance: string;
  startTime: Date | null;
  description: string | null;
  status: CarpoolStatus;
}

function CarpoolsDisplay({ carpoolsDriving, carpoolsAttending }: Props) {
  return (
    <>
      <div>
        <h3 className={"text-2xl font-bold"}>Carpools Driving/Driven</h3>
        <CarpoolTable carpools={carpoolsDriving} />
      </div>

      <div>
        <h3 className={"text-2xl font-bold"}>Carpools Attending/Attended</h3>
        <CarpoolTable carpools={carpoolsAttending} />
      </div>
    </>
  );
}

export default CarpoolsDisplay;
