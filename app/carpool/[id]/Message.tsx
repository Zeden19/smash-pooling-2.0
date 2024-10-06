import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Props {
  message: { content: string; id: number; userId: number };
  user: { id: number; gamertag: string };
}

function Message({ user, message }: Props) {
  const currentUserId = 0;
  const isCurrentUser = user.id === currentUserId;

  return (
    <div className={`flex gap-2 ${isCurrentUser ? "self-start" : "self-end"}`}>
      {isCurrentUser ? (
        <Avatar className={"mt-2.5"}>
          <AvatarFallback>{user.gamertag.charAt(0)}</AvatarFallback>
        </Avatar>
      ) : null}

      <div className={"flex flex-col gap-1"}>
        <span className={"text-gray-400 text-xs"}>{user.gamertag}</span>
        <span
          className={"self-end mb-1 bg-slate-500 border border-slate-800 p-2 rounded-xl"}>
          {message.content}
        </span>
      </div>

      {!isCurrentUser ? (
        <Avatar className={"mt-2.5"}>
          <AvatarFallback>{user.gamertag.charAt(0)}</AvatarFallback>
        </Avatar>
      ) : null}
    </div>
  );
}

export default Message;
