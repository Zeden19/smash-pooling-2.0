import { CarpoolStatus } from "prisma/prisma-client";
import { Badge } from "@/components/ui/badge";

interface Props {
  carpoolStatus: CarpoolStatus;
}

function CarpoolStatusBadge({ carpoolStatus }: Props) {
  const badge = () => {
    switch (carpoolStatus) {
      case "OPEN":
        return <Badge variant={"open"}>Open</Badge>;
      case "IN_PROGRESS":
        return <Badge variant={"inProgress"}>In Progress</Badge>;
    }
    return <Badge variant={"completed"}>Completed</Badge>;
  };
  return badge();
}

export default CarpoolStatusBadge;
