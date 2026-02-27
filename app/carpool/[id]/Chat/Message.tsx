"use client";
import { Message as MessageType, User } from "prisma/prisma-client";
import { useState } from "react";
import { RealtimeChannel } from "ably";
import DeleteMessage from "@/app/carpool/[id]/Chat/DeleteMessage";
import EditMessage from "@/app/carpool/[id]/Chat/EditMessage";
import { OptimisticUpdate } from "@/app/carpool/[id]/Chat/ChatWindow";
import AvatarComponent from "@/app/_components/AvatarComponent";

interface Props extends OptimisticUpdate {
  message: MessageType;
  currentUser: User;
  chatroomUsers: User[];
  channel: RealtimeChannel;
}

function Message({
  message,
  currentUser,
  chatroomUsers,
  channel,
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
          className={`flex gap-2 w-full px-2 rounded-lg ${!isCurrentUser && "flex-row-reverse"} ${isHovering && "bg-slate-800"} relative`}
          onMouseOver={() => setIsHovering(true)}
          onMouseOut={() => setIsHovering(false)}>
          <AvatarComponent
            className={"mt-2.5"}
            src={messageAuthor?.profilePicture}
            fallback={messageAuthor?.gamertag.charAt(0)}
          />

          <div className={"flex flex-col gap-1"}>
            <span className={"text-gray-400 text-xs"}>{messageAuthor?.gamertag}</span>
            <span
              className={`self-end mb-1 bg-slate-500 border border-slate-800 p-2 rounded-xl ${isCurrentUser ? "mr-auto" : "ml-auto"}`}>
              {message.content}
            </span>
          </div>
          {message.edited && (
            <span className={"text-xs text-gray-500 italic bold self-end"}>Edited</span>
          )}

          {isHovering && isCurrentUser && (
            <div
              className={
                "absolute top-[-17px] right-3 flex ml-auto gap-1 mb-1 overflow-visible"
              }>
              <DeleteMessage
                message={message}
                channel={channel}
                optimisticUpdate={optimisticUpdate}
              />

              <EditMessage
                message={message}
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
