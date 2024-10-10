"use client";
import Message from "@/app/carpool/[id]/Message";
import { Chatroom, Message as Messages, User } from "prisma/prisma-client";
import { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import FailureToast from "@/components/FailureToast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Send } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface ChatroomMessages extends Chatroom {
  messages: Messages[];
}

interface Props {
  origin: string;
  destination: string;
  chatRoom: ChatroomMessages;
  chatroomUsers: User[];
  currentUser: User;
}

function ChatWindow({
  origin,
  destination,
  chatRoom,
  chatroomUsers,
  currentUser,
}: Props) {
  if (!currentUser) redirect("/");

  const [messages, setMessages] = useState<Messages[]>(chatRoom.messages);
  const [loading, setLoading] = useState(false);
  const messageInput = useRef(null); // to reset & get input
  const bottomDiv = useRef<HTMLDivElement>(null); // to scroll to bottom of container
  const scrollToBottom = () => bottomDiv.current!.scrollIntoView({ behavior: "smooth" });

  async function sendMessage() {
    setLoading(true);
    const input = messageInput.current as unknown as HTMLInputElement;

    try {
      const { data } = await axios.post(`/api/chat`, {
        chatRoom,
        content: input.value,
      });
      input.value = "";
      setMessages([...messages, data.newMessage]);
      setLoading(false);
    } catch (e: any) {
      console.log(e);
      FailureToast("Could not send message", e.response.data.error);
      setLoading(false);
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={"h-[60vh] bg-slate-900 rounded-lg m-1 flex flex-col overflow-auto"}>
      <div className={"flex flex-[9] flex-col m-3 items-center gap-2"}>
        <div className={"mb-5 font-bold text-xl"}>
          Carpool Chat: From {origin} to {destination}
        </div>
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            currentUser={currentUser}
            chatroomUsers={chatroomUsers}
          />
        ))}
      </div>

      <div className={"flex self-center w-11/12 gap-2 sticky bottom-0"}>
        <Input
          onKeyDown={(event) => {
            if (event.key === "Enter") sendMessage();
          }}
          ref={messageInput}
          className={"bg-gray-950 mb-2 self-center"}
        />
        <Button onClick={sendMessage}>
          <Send />
          {loading && <LoadingSpinner />}
        </Button>
      </div>
      <div ref={bottomDiv} />
    </div>
  );
}

export default ChatWindow;
