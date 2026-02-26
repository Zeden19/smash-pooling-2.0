import CarpoolTable from "./CarpoolTable";
import { Carpool } from "prisma/prisma-client";

interface Props {
  carpoolsDriving: Carpool[];
  carpoolsAttending: Carpool[];
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
