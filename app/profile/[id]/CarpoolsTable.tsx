"use client";
import { Carpool } from "@/prisma/generated/prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { redirect } from "next/navigation";
import { makeTitle } from "@/app/_helpers/functions/makeTitle";
import CarpoolStatusBadge from "@/app/profile/[id]/CarpoolStatusBadge";

interface Props {
  carpools: Carpool[];
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
          <TableRow key={carpool.id} onClick={() => redirect(`/carpool/${carpool.id}`)}>
            <TableCell className={"pl-5"}>{makeTitle(carpool.tournamentSlug)}</TableCell>
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
