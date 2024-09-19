import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Carpool } from "@prisma/client";

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
    <Table className={"bg-slate-900 rounded m-2 w-[800px]"}>
      <TableHeader>
        <TableRow>
          <TableHead>Tournament</TableHead>
          <TableHead>Origin</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Starting Time</TableHead>
          <TableHead>Seats Available</TableHead>
          <TableHead>Distance</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {carpools.map((carpool) => (
          <TableRow key={carpool.id}>
            <TableCell>
              <a
                href={`https://www.start.gg/tournament/${carpool.tournamentSlug}/details`}>
                {makeTitle(carpool.tournamentSlug)}
              </a>
            </TableCell>
            <TableCell>{carpool.originName}</TableCell>
            <TableCell>{carpool.destinationName}</TableCell>
            <TableCell>{carpool.StartTime?.toDateString() || "N/A"}</TableCell>
            <TableCell>{carpool.seatsAvailable || "N/A"}</TableCell>
            <TableCell>{carpool.distance}</TableCell>
            <TableCell>{carpool.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default CarpoolTable;
