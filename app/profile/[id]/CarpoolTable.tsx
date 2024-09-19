import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Carpool } from "@prisma/client";
import CarpoolStatusBadge from "@/components/CarpoolStatusBadge";

interface Props {
  carpools: Carpool[];
}

function makeTitle(input: string) {
  return input
    .split("-") // Split the string by hyphens
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" "); // Join the words back with spaces
}

function CarpoolTable({ carpools }: Props) {
  return (
    <Table className={"bg-slate-900 rounded m-2"}>
      <TableHeader>
        <TableRow>
          <TableHead className={"pl-5"}>Tournament</TableHead>
          <TableHead>Origin</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Starting Time</TableHead>
          <TableHead>Seats Available</TableHead>
          <TableHead>Distance</TableHead>
          <TableHead className={"text-right pr-5"}>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {carpools.map((carpool) => (
          <TableRow key={carpool.id}>
            <TableCell className={"pl-5"}>
              <a
                href={`https://www.start.gg/tournament/${carpool.tournamentSlug}/details`}>
                {makeTitle(carpool.tournamentSlug)}
              </a>
            </TableCell>
            <TableCell>{carpool.originName}</TableCell>
            <TableCell>{carpool.destinationName}</TableCell>
            <TableCell>{carpool.startTime?.toDateString() || "N/A"}</TableCell>
            <TableCell>{carpool.seatsAvailable || "N/A"}</TableCell>
            <TableCell>{carpool.distance}</TableCell>
            <TableCell className={"w-32 text-right pr-5"}>
              <CarpoolStatusBadge carpoolStatus={carpool.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default CarpoolTable;
