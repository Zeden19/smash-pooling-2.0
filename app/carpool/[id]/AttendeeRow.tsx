"use client";
import { User } from "prisma/prisma-client";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import RemoveAttendee from "@/app/carpool/[id]/RemoveAttendee";
import { Crown } from "lucide-react";

interface Props {
  carpoolId: number;
  attendee: User;
  driverId: string;
  currentUser: User;
}

function AttendeeRow({ attendee, driverId, carpoolId, currentUser }: Props) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <TableRow
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
      key={attendee.id}>
      <TableCell>
        <div className={"flex gap-5 items-center"}>
          <Avatar>
            <AvatarImage src={attendee.profilePicture ?? undefined} />
            <AvatarFallback>{attendee.gamertag.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div
            className={`text-2xl font-bold my-auto ${attendee.id === currentUser.id && "italic"}`}>
            {attendee.gamertag}
          </div>
          {attendee.id === driverId && <Crown />}
          {isHovering && attendee.id !== driverId && driverId === currentUser.id && (
            <RemoveAttendee
              currentUser={currentUser}
              carpoolId={carpoolId}
              attendeeId={attendee.id}
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

export default AttendeeRow;
