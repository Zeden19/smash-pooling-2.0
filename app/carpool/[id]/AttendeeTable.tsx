"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CarpoolAttendeesAll } from "@/app/helpers/entities/CarpoolTypes";
import AttendeeRow from "@/app/carpool/[id]/AttendeeRow";
import { User } from "prisma/prisma-client";

interface Props {
  carpool: CarpoolAttendeesAll;
  currentUser: User;
}

function AttendeeTable({ carpool, currentUser }: Props) {
  return (
    <Table className={"bg-slate-900 rounded"}>
      <TableHeader>
        <TableRow>
          <TableHead>Attendees</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {carpool.attendees.map((attendee) => (
          <AttendeeRow
            key={attendee.id}
            attendee={attendee}
            driverId={carpool.driverId}
            carpoolId={carpool.id}
            currentUser={currentUser}
          />
        ))}
      </TableBody>
    </Table>
  );
}

export default AttendeeTable;
