"use client";
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
import { UserRoundMinus } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import FailureToast from "@/components/FailureToast";
import SuccessToast from "@/components/SuccessToast";
import { User } from "prisma/prisma-client";

interface Props {
  carpoolId: number;
  attendeeId: string;
  currentUser: User;
}

function RemoveAttendee({ carpoolId, attendeeId, currentUser }: Props) {
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function remove() {
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/carpool/attendee/${carpoolId}`, {
        data: { attendeeId: attendeeId },
      });
      setDeleteLoading(false);
      SuccessToast("Successfully removed attendee from carpool");
    } catch (e) {
      console.log(e);
      FailureToast("Could not delete user");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <AlertDialog>
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

export default RemoveAttendee;
