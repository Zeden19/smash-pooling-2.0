import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/app/_components/LoadingSpinner";
import { Message } from "prisma/prisma-client";
import { RealtimeChannel } from "ably";
import FailureToast from "@/app/_components/FailureToast";
import { ALBY_CHAT_NAME } from "@/app/carpool/[id]/Chat/AlbyProvider";
import { useRef, useState } from "react";
import { Pencil } from "lucide-react";
import axios from "axios";
import { OptimisticUpdate } from "@/app/carpool/[id]/Chat/ChatWindow";
import { useMessageStore } from "@/app/carpool/[id]/Chat/MessageStoreProvider";

interface Props extends OptimisticUpdate {
  message: Message;
  channel: RealtimeChannel;
}

function EditMessage({ message, channel, optimisticUpdate }: Props) {
  const [open, setOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const editedMessageInput = useRef<HTMLInputElement>(null);
  const { editMessage } = useMessageStore((state) => state);

  async function edit() {
    optimisticUpdate(
      async () => {
        const editedMessage = {
          ...message,
          content: editedMessageInput.current!.value,
          edited: true,
        };
        if (editedMessage.content === message.content) {
          setOpen(false);
          return;
        }

        if (editedMessage.content === "") {
          // await remove();
          return;
        }

        if (editedMessage.content.length > 500) {
          FailureToast("Message length must be shorter than 500 characters");
          return;
        }
        setEditLoading(true);
        editMessage({ ...message, content: editedMessage.content, edited: true });
        setOpen(false);
        const { data } = await axios.patch("/api/chat", {
          message: { ...message, content: editedMessage.content, edited: true },
        });
        await channel.publish({
          name: ALBY_CHAT_NAME,
          data: { functionName: "editMessage", args: [data.editedMessage] },
        });
        setEditLoading(false);
      },
      () => setEditLoading(false),
      "Could not edit message",
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size={"smallIcon"}>
          <Pencil />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
          <DialogDescription>Enter the edited message</DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-2"}>
          <Label htmlFor={"newMessage"}>New Message</Label>
          <Input
            ref={editedMessageInput}
            defaultValue={message.content}
            id={"newMessage"}
          />
          <Button className={"w-1/4"} onClick={() => edit()}>
            Send
            {editLoading && <LoadingSpinner />}
          </Button>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditMessage;
