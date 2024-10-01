"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CarpoolStatusBadge from "@/components/CarpoolStatusBadge";
import Link from "next/link";
import { makeTitle } from "@/app/helpers/services/makeTitle";
import { CarpoolNumber } from "@/components/CarpoolsDisplay";

interface Props {
  carpools: CarpoolNumber[];
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
          <Link legacyBehavior key={carpool.id} href={`/carpool/${carpool.id}`}>
            <TableRow key={carpool.id}>
              <TableCell className={"pl-5"}>
                <a
                  target={"_blank"}
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
          </Link>
        ))}
      </TableBody>
    </Table>
  );
}

export default CarpoolTable;
