import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message as MessageType, User } from "prisma/prisma-client";

interface Props {
  message: MessageType;
  currentUser: User;
  chatroomUsers: User[];
}

async function Message({ message, currentUser, chatroomUsers }: Props) {
  const isCurrentUser = message.userId === currentUser.id;

  const messageAuthor = chatroomUsers.find((user) => user.id === message.userId);
  return (
    <>
      {message.serverMessage ? (
        <span
          className={"self-center bg-white rounded-xl border-slate-800 text-black p-2"}>
          {message.content}
        </span>
      ) : (
        <div className={`flex gap-2 ${isCurrentUser ? "self-start" : "self-end"}`}>
          {isCurrentUser ? (
            <Avatar className={"mt-2.5"}>
              <AvatarFallback>{messageAuthor!.gamertag.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : null}

          <div className={"flex flex-col gap-1"}>
            <span className={"text-gray-400 text-xs"}>{messageAuthor!.gamertag}</span>
            <span
              className={
                "self-end mb-1 bg-slate-500 border border-slate-800 p-2 rounded-xl"
              }>
              {message.content}
            </span>
          </div>
          {!isCurrentUser ? (
            <Avatar className={"mt-2.5"}>
              <AvatarFallback>{messageAuthor!.gamertag.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : null}
        </div>
      )}
    </>
  );
}

export default Message;
