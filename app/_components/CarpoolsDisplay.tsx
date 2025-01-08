import CarpoolTable from "@/app/_components/CarpoolTable";
import { CarpoolNumber } from "@/app/_helpers/entities/CarpoolTypes";

interface Props {
  carpoolsDriving: CarpoolNumber[];
  carpoolsAttending: CarpoolNumber[];
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
