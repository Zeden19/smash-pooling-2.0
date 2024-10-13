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
import FailureToast from "@/components/FailureToast";
import { Message } from "prisma/prisma-client";
import axios from "axios";
import { RealtimeChannel } from "ably";

interface Props {
  message: Message;
  messages: Message[];
  removeMessage: (message: Message) => void;
  channel: RealtimeChannel;
  revertMessages: (messages: Message[]) => void;
}

function DeleteMessage({
  message,
  messages,
  removeMessage,
  channel,
  revertMessages,
}: Props) {
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function remove() {
    setDeleteLoading(true);
    const prevMessages = messages;
    removeMessage(message);
    try {
      await axios.delete("/api/chat", {
        data: { message },
      });
      await channel.publish({
        name: ALBY_CHAT_NAME,
        data: { action: "remove", messageId: message.id },
      });
      setDeleteLoading(false);
    } catch (e) {
      console.log(e);
      FailureToast("Could not delete message");
      revertMessages(prevMessages);
      setDeleteLoading(false);
    }
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
