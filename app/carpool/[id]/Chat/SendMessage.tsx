import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Send } from "lucide-react";
import failureToast from "@/components/FailureToast";
import ALBY_CHAT_NAME from "@/app/carpool/[id]/Chat/AlbyChatName";
import { useRef, useState } from "react";
import { Chatroom, Message, User } from "prisma/prisma-client";
import { RealtimeChannel } from "ably";
import axios from "axios";
import { OptimisticUpdate } from "@/app/carpool/[id]/Chat/ChatWindow";

interface Props extends OptimisticUpdate {
  currentUser: User;
  chatRoom: Chatroom;
  channel: RealtimeChannel;
  addMessage: (message: Message) => void;
  removeMessage: (messageId: number) => void;
}

function SendMessage({
  chatRoom,
  currentUser,
  channel,
  addMessage,
  removeMessage,
  optimisticUpdate,
}: Props) {
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
          data: { action: "add", newMessage: data.newMessage },
        });
        input.value = "";
        // Replace the "fake" message with a real one
        removeMessage(-1);
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
