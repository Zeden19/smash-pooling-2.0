"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AttendeeRow from "@/app/carpool/[id]/AttendeeRow";
import { Prisma, User } from "prisma/prisma-client";
import { useState } from "react";

interface Props {
  carpool: Prisma.CarpoolGetPayload<{ include: { attendees: true } }>;
  currentUser: User;
}

function AttendeeTable({ carpool, currentUser }: Props) {
  const [attendees, setAttendees] = useState<User[]>(carpool.attendees);
  return (
    <Table className={"bg-slate-900 rounded-lg"}>
      <TableHeader>
        <TableRow>
          <TableHead>Attendees</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendees.map((attendee) => (
          <AttendeeRow
            key={attendee.id}
            attendee={attendee}
            removeAttendee={(attendeeDeleted) =>
              setAttendees(
                attendees.filter((attendee) => attendee.id !== attendeeDeleted.id),
              )
            }
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
