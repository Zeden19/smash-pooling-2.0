import Message from "@/app/carpool/[id]/Message";
import { Chatroom, Message as Messages, User } from "prisma/prisma-client";
import { getUser } from "@/app/helpers/hooks/getUser";
import { redirect } from "next/navigation";
import { MessageInput } from "@/app/carpool/[id]/MessageInput";

interface ChatroomMessages extends Chatroom {
  messages: Messages[];
}

interface Props {
  origin: string;
  destination: string;
  chatroom: ChatroomMessages;
  chatroomUsers: User[];
}

async function ChatWindow({ origin, destination, chatroom, chatroomUsers }: Props) {
  const { user: currentUser } = await getUser();
  if (!currentUser) redirect("/");

  async function sendMessage() {}

  return (
    <div className={"h-[60vh] bg-slate-900 rounded-lg m-1 flex flex-col overflow-auto"}>
      <div className={"flex-[9] flex-col flex m-3 items-center gap-2"}>
        <div className={"mb-5 font-bold text-xl"}>
          Carpool Chat: From {origin} to {destination}
        </div>
        {chatroom.messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            currentUser={currentUser}
            chatroomUsers={chatroomUsers}
          />
        ))}
      </div>

      <MessageInput chatRoom={chatroom} user={currentUser} />
    </div>
  );
}

export default ChatWindow;
