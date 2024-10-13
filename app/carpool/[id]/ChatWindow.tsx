"use client";
import Message from "@/app/carpool/[id]/Message";
import { Chatroom, Message as Messages, User } from "prisma/prisma-client";
import { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import FailureToast from "@/components/FailureToast";
import failureToast from "@/components/FailureToast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Send } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useChannel } from "ably/react";
import ALBY_CHAT_NAME from "@/app/carpool/[id]/AlbyChatName";

//todo use reducer for messages cause its too much
// todo organize message component

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

  // runs when we receive a new message
  const { channel, ably } = useChannel(ALBY_CHAT_NAME, (message) => {
    setMessages([...messages, message.data]);
  });

  async function sendMessage() {
    const input = messageInput.current as unknown as HTMLInputElement;
    if (loading || input.value === "") return;

    if (input.value.length > 500) {
      failureToast("Message cannot be longer than 500 characters");
      return;
    }
    setLoading(true);
    const prevMessages = messages;
    // Optimistic update
    setMessages([
      ...messages,
      {
        id: -1,
        content: input.value,
        userId: currentUser.id,
        chatroomId: chatRoom.carpoolId,
        serverMessage: false,
        edited: false,
      },
    ]);

    try {
      const { data } = await axios.post(`/api/chat`, {
        chatRoom,
        content: input.value,
      });
      await channel.publish({ name: ALBY_CHAT_NAME, data: data.newMessage });
      input.value = "";
      // Replace the "fake" message with a real one
      setMessages([...messages.filter((message) => message.id !== -1), data.newMessage]);
      setLoading(false);
    } catch (e: any) {
      console.log(e);
      setMessages(prevMessages);
      FailureToast("Could not send message");
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
            messages={messages}
            currentUser={currentUser}
            chatroomUsers={chatroomUsers}
            removeMessage={(removedMessage) =>
              setMessages(messages.filter((message) => removedMessage.id !== message.id))
            }
            editMessage={(editedMessage) =>
              setMessages(
                messages.map((message) =>
                  editedMessage.id === message.id ? editedMessage : message,
                ),
              )
            }
            setMessage={(messages) => setMessages(messages)}
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
        <Button onClick={sendMessage} disabled={loading}>
          <Send />
          {loading && <LoadingSpinner />}
        </Button>
      </div>
      <div ref={bottomDiv} />
    </div>
  );
}

export default ChatWindow;
