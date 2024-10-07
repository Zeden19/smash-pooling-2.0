import { Input } from "@/components/ui/input";
import Message from "@/app/carpool/[id]/Message";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Chatroom, Message as Messages, User } from "prisma/prisma-client";
import { getUser } from "@/app/helpers/hooks/getUser";
import { redirect } from "next/navigation";

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

  return (
    <div className={"h-[60vh] bg-slate-900 rounded-lg m-1 flex flex-col"}>
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
      <div className={"flex self-center w-11/12 gap-2"}>
        <Input className={"bg-gray-950 mb-2 self-center"} />
        <Button>
          <Send />
        </Button>
      </div>
    </div>
  );
}

export default ChatWindow;
