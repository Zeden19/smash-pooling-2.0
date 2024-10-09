"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Send } from "lucide-react";
import { Chatroom, User } from "prisma/prisma-client";
import axios from "axios";
import FailureToast from "@/components/FailureToast";

interface Props {
  user: User;
  chatRoom: Chatroom;
}

export function MessageInput({ user, chatRoom }: Props) {
  const messageInput = useRef(null);

  async function sendMessage() {
    const input = messageInput.current as unknown as HTMLInputElement;
    try {
      const data = await axios.post(`/api/chat`, {
        user,
        chatRoom,
        content: input.value,
      });
      input.value = "";
    } catch (e: any) {
      console.log(e);
      FailureToast("Could not send message", e.response.data.error);
    }
  }

  return (
    <div className={"flex self-center w-11/12 gap-2 sticky bottom-0"}>
      <Input ref={messageInput} className={"bg-gray-950 mb-2 self-center"} />
      <Button onClick={sendMessage}>
        <Send />
      </Button>
    </div>
  );
}
