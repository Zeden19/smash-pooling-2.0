"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prisma, User } from "prisma/prisma-client";
import { Crown, UserRoundMinus } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import SuccessToast from "@/app/_components/toast/SuccessToast";
import FailureToast from "@/app/_components/toast/FailureToast";
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
import AvatarComponent from "@/app/_components/AvatarComponent";

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
      removeAttendee(data.deletedAttendee);
    } catch (e) {
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
          <AlertDialogTitle>Remove User</AlertDialogTitle>
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

interface Props {
  carpool: Prisma.CarpoolGetPayload<{ include: { attendees: true } }>;
  currentUser: User;
}

function AttendeeTable({ carpool, currentUser }: Props) {
  const [attendees, setAttendees] = useState<User[]>(carpool.attendees);
  const [isHovering, setIsHovering] = useState(false);
  return (
    <Table className={"bg-slate-900 rounded-lg"}>
      <TableHeader>
        <TableRow>
          <TableHead>Attendees</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendees.map((attendee) => (
          <TableRow
            onMouseOver={() => setIsHovering(true)}
            onMouseOut={() => setIsHovering(false)}
            key={attendee.id}>
            <TableCell>
              <div className={"flex gap-5 items-center"}>
                <AvatarComponent
                  src={attendee.profilePicture}
                  fallback={attendee.gamertag.charAt(0).toUpperCase()}
                />
                <div
                  className={`text-2xl font-bold my-auto ${attendee.id === currentUser.id && "italic"}`}>
                  {attendee.gamertag}
                </div>
                {attendee.id === carpool.driverId && <Crown />}
                {isHovering &&
                  attendee.id !== carpool.driverId &&
                  carpool.driverId === currentUser.id && (
                    <RemoveAttendee
                      removeAttendee={(attendeeDeleted) =>
                        setAttendees(
                          attendees.filter(
                            (attendee) => attendee.id !== attendeeDeleted.id,
                          ),
                        )
                      }
                      carpoolId={carpool.id}
                      attendeeId={attendee.id}
                    />
                  )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default AttendeeTable;
