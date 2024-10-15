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
import ALBY_CHAT_NAME from "@/app/carpool/[id]/Chat/AlbyChatName";
import { Message } from "prisma/prisma-client";
import axios from "axios";
import { RealtimeChannel } from "ably";
import { OptimisticUpdate } from "@/app/carpool/[id]/Chat/ChatWindow";

interface Props extends OptimisticUpdate {
  message: Message;
  removeMessage: (message: Message) => void;
  channel: RealtimeChannel;
}

function DeleteMessage({ message, removeMessage, channel, optimisticUpdate }: Props) {
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function remove() {
    optimisticUpdate(
      async () => {
        setDeleteLoading(true);
        removeMessage(message);

        await axios.delete("/api/chat", {
          data: { message },
        });
        await channel.publish({
          name: ALBY_CHAT_NAME,
          data: { action: "remove", messageId: message.id },
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
