"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message as MessageType, User } from "prisma/prisma-client";
import { useState } from "react";
import { RealtimeChannel } from "ably";
import DeleteMessage from "@/app/carpool/[id]/Chat/DeleteMessage";
import EditMessage from "@/app/carpool/[id]/Chat/EditMessage";
import { OptimisticUpdate } from "@/app/carpool/[id]/Chat/ChatWindow";

interface Props extends OptimisticUpdate {
  message: MessageType;
  currentUser: User;
  chatroomUsers: User[];
  channel: RealtimeChannel;
  removeMessage: (message: MessageType) => void;
  editMessage: (message: MessageType) => void;
}

function Message({
  message,
  currentUser,
  chatroomUsers,
  channel,
  removeMessage,
  editMessage,
  optimisticUpdate,
}: Props) {
  const isCurrentUser = message.userId === currentUser.id;
  const [isHovering, setIsHovering] = useState(false);

  const messageAuthor = chatroomUsers.find((user) => user.id === message.userId);

  return (
    <>
      {message.serverMessage ? (
        <span
          className={
            "self-center bg-white rounded-xl border-slate-800 text-black p-2 mb-2"
          }>
          {message.content}
        </span>
      ) : (
        <div
          className={`flex gap-2 w-full px-2 rounded-lg ${!isCurrentUser && "justify-end"} ${isHovering && "bg-slate-800"} relative`}
          onMouseOver={() => setIsHovering(true)}
          onMouseOut={() => setIsHovering(false)}>
          {isCurrentUser ? (
            <Avatar className={"mt-2.5"}>
              <AvatarImage src={messageAuthor!.profilePicture} />
              <AvatarFallback>{messageAuthor!.gamertag.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : null}

          {message.edited && !isCurrentUser && (
            <span className={"text-xs text-gray-500 italic bold self-end"}>Edited</span>
          )}
          <div className={"flex flex-col gap-1"}>
            <span className={"text-gray-400 text-xs"}>{messageAuthor!.gamertag}</span>
            <span
              className={`self-end mb-1 bg-slate-500 border border-slate-800 p-2 rounded-xl ${isCurrentUser ? "mr-auto" : "ml-auto"}`}>
              {message.content}
            </span>
          </div>
          {message.edited && isCurrentUser && (
            <span className={"text-xs text-gray-500 italic bold self-end"}>Edited</span>
          )}

          {!isCurrentUser ? (
            <Avatar className={"mt-2.5"}>
              <AvatarImage src={messageAuthor!.profilePicture} />
              <AvatarFallback>{messageAuthor!.gamertag.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : null}

          {isHovering && message.userId === currentUser.id && (
            <div
              className={
                "absolute top-[-17px] right-3 flex ml-auto gap-1 mb-1 overflow-visible"
              }>
              <DeleteMessage
                message={message}
                removeMessage={removeMessage}
                channel={channel}
                optimisticUpdate={optimisticUpdate}
              />

              <EditMessage
                message={message}
                editMessage={editMessage}
                channel={channel}
                optimisticUpdate={optimisticUpdate}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Message;
