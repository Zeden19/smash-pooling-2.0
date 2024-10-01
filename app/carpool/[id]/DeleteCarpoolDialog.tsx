"use client";
import {
  AlertDialog,
  AlertDialogAction,
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
import SuccessToast from "@/components/SuccessToast";
import { useRouter } from "next/navigation";
import FailureToast from "@/components/FailureToast";

interface Props {
  carpoolId: number;
}

export function DeleteCarpoolDialog({ carpoolId }: Props) {
  const router = useRouter();
  async function deleteCarpool() {
    try {
      await axios.delete(`/api/carpool/${carpoolId}`);
      SuccessToast("Carpool deleted successfully.");
      router.push("/carpool/edit");
    } catch (e: any) {
      console.log(e);
      FailureToast("Could not delete carpool", e.response);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className={"w-[50%] ml-4"} variant={"destructive"}>
          Delete Carpool
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this Carpool?
          </AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteCarpool}>Delete Carpool</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
