"use client";
import { User } from "prisma/prisma-client";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Crown, UserRoundMinus } from "lucide-react";
import SuccessToast from "@/components/SuccessToast";
import FailureToast from "@/components/FailureToast";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface RemoveAttendeeProps {
  carpoolId: number;
  attendeeId: string;
  removeAttendee: (attendee: User) => void;
}

function RemoveAttendee({ carpoolId, attendeeId, removeAttendee }: RemoveAttendeeProps) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function remove() {
    setDeleteLoading(true);
    try {
      const { data } = await axios.delete(`/api/carpool/attendee/${carpoolId}`, {
        data: { attendeeId: attendeeId },
      });
      SuccessToast("Successfully removed attendee from carpool");
      console.log(data);
      removeAttendee(data.deletedAttendee);
    } catch (e) {
      console.log(e);
      FailureToast("Could not delete user");
    } finally {
      setDeleteLoading(false);
      setOpen(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className={"ml-auto"}>
        <Button size={"smallIcon"} disabled={deleteLoading}>
          <UserRoundMinus />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Message</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this user from Carpool? This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={remove}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface AttendeeRowProps {
  carpoolId: number;
  attendee: User;
  driverId: string;
  currentUser: User;
  removeAttendee: (attendee: User) => void;
}

function AttendeeRow({
  attendee,
  driverId,
  carpoolId,
  currentUser,
  removeAttendee,
}: AttendeeRowProps) {
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
              removeAttendee={removeAttendee}
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
