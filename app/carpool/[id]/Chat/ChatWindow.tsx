"use client";
import Message from "@/app/carpool/[id]/Chat/Message";
import { Chatroom, Message as Messages, User } from "prisma/prisma-client";
import { useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import { useChannel } from "ably/react";
import { ALBY_CHAT_NAME } from "@/app/carpool/[id]/Chat/AlbyProvider";
import SendMessage from "@/app/carpool/[id]/Chat/SendMessage";
import FailureToast from "@/components/FailureToast";
import { useMessageStore } from "@/app/carpool/[id]/Chat/MessageStoreProvider";

interface ChatroomMessages extends Chatroom {
  messages: Messages[];
}

interface Props {
  chatroomName: string;
  chatRoom: ChatroomMessages;
  chatroomUsers: User[];
  currentUser: User;
}

export interface OptimisticUpdate {
  optimisticUpdate: (
    updateFnc: () => void,
    errorFnc: () => void,
    errorMessage: string,
  ) => void;
}

function ChatWindow({ chatRoom, chatroomName, chatroomUsers, currentUser }: Props) {
  if (!currentUser) redirect("/");
  const messageStore = useMessageStore((state) => state);

  // runs when we receive a new message
  const { channel, ably } = useChannel(ALBY_CHAT_NAME, (action) => {
    const functionName: "addMessage" | "editMessage" | "removeMessage" =
      action.data.functionName;
    const args: Messages = action.data.args[0];
    messageStore[functionName](args);
  });

  const bottomDiv = useRef<HTMLDivElement>(null); // to scroll to bottom of container
  const scrollToBottom = () => bottomDiv.current!.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 50);
  }, [messageStore.messages]);

  async function optimisticUpdate(
    updateFnc: () => void,
    errorFnc: () => void,
    errorMessage: string,
  ) {
    const prevMessages = messageStore.messages; // prev messages is needed since updateFnc will change messages
    try {
      await updateFnc(); // await is needed here so catch can actually catch the errors
    } catch (e) {
      console.log(e);
      FailureToast(errorMessage);
      messageStore.revertMessages(prevMessages);
      errorFnc();
    }
  }

  return (
    <div className={"h-[60vh] bg-slate-900 rounded-lg m-1 flex flex-col overflow-auto"}>
      <div className={"flex flex-[9] flex-col m-3 items-center gap-2"}>
        <div className={"mb-5 font-bold text-xl"}>{chatroomName}</div>
        {messageStore.messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            currentUser={currentUser}
            chatroomUsers={chatroomUsers}
            channel={channel}
            optimisticUpdate={optimisticUpdate}
          />
        ))}
      </div>
      <SendMessage
        currentUser={currentUser}
        chatRoom={chatRoom}
        channel={channel}
        optimisticUpdate={optimisticUpdate}
      />
      <div ref={bottomDiv} />
    </div>
  );
}

export default ChatWindow;
