import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/app/_components/LoadingSpinner";
import { Send } from "lucide-react";
import failureToast from "@/app/_components/FailureToast";
import { ALBY_CHAT_NAME } from "@/app/carpool/[id]/Chat/AlbyProvider";
import { useRef, useState } from "react";
import { Chatroom, User } from "prisma/prisma-client";
import { RealtimeChannel } from "ably";
import axios from "axios";
import { OptimisticUpdate } from "@/app/carpool/[id]/Chat/ChatWindow";
import { useMessageStore } from "@/app/carpool/[id]/Chat/MessageStoreProvider";

interface Props extends OptimisticUpdate {
  currentUser: User;
  chatRoom: Chatroom;
  channel: RealtimeChannel;
}

function SendMessage({ chatRoom, currentUser, channel, optimisticUpdate }: Props) {
  const { removeMessage, addMessage } = useMessageStore((state) => state);
  const [loading, setLoading] = useState(false);
  const messageInput = useRef(null); // to reset & get input

  async function sendMessage() {
    optimisticUpdate(
      async () => {
        const input = messageInput.current as unknown as HTMLInputElement;
        if (loading || input.value === "") return;

        if (input.value.length > 500) {
          failureToast("Message cannot be longer than 500 characters");
          return;
        }
        setLoading(true);

        const newMessage = {
          id: -1,
          content: input.value,
          userId: currentUser.id,
          chatroomId: chatRoom.carpoolId,
          serverMessage: false,
          edited: false,
        };

        addMessage(newMessage);

        const { data } = await axios.post(`/api/chat`, {
          chatRoom,
          content: input.value,
        });
        // Realtime updates
        await channel.publish({
          name: ALBY_CHAT_NAME,
          data: { functionName: "addMessage", args: [data.newMessage] },
        });
        input.value = "";
        // Replace the "fake" message with a real one
        removeMessage(newMessage);
        setLoading(false);
      },
      () => setLoading(false),
      "Could not send message",
    );
  }

  return (
    <div className={"flex self-center w-11/12 gap-2 sticky bottom-0"}>
      <Input
        onKeyDown={(event) => {
          if (event.key === "Enter") sendMessage();
        }}
        ref={messageInput}
        className={"bg-gray-950 mb-2 self-center"}
      />
      <Button onClick={sendMessage} disabled={loading}>
        <Send />
        {loading && <LoadingSpinner />}
      </Button>
    </div>
  );
}

export default SendMessage;
