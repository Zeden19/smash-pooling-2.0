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
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { ALBY_CHAT_NAME } from "@/app/carpool/[id]/Chat/AlbyProvider";
import { Message } from "prisma/prisma-client";
import axios from "axios";
import { RealtimeChannel } from "ably";
import { OptimisticUpdate } from "@/app/carpool/[id]/Chat/ChatWindow";
import { useMessageStore } from "@/app/carpool/[id]/Chat/MessageStoreProvider";

interface Props extends OptimisticUpdate {
  message: Message;
  channel: RealtimeChannel;
}

function DeleteMessage({ message, channel, optimisticUpdate }: Props) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { removeMessage } = useMessageStore((state) => state);

  async function remove() {
    optimisticUpdate(
      async () => {
        setDeleteLoading(true);
        removeMessage(message);

        const { data } = await axios.delete("/api/chat", {
          data: { message },
        });
        await channel.publish({
          name: ALBY_CHAT_NAME,
          data: { functionName: "removeMessage", args: [data.deletedMessage] },
        });
        setDeleteLoading(false);
      },
      () => setDeleteLoading(false),
      "Could not delete message",
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button size={"smallIcon"} disabled={deleteLoading}>
          <Trash2 />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Message</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this message? This cannot be undone.
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

export default DeleteMessage;
