import { Input } from "@/components/ui/input";
import Message from "@/app/carpool/[id]/Message";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface Props {
  origin: string;
  destination: string;
}

function ChatWindow({ origin, destination }: Props) {
  const sampleMessages = [
    { id: 0, userId: 0, content: "Yooooo" },
    { id: 1, userId: 1, content: "Hi" },
    { id: 2, userId: 0, content: "U ready!!" },
    { id: 3, userId: 1, content: "Kinda...." },
  ];

  const sampleUsers = [
    { id: 0, gamertag: "Sleepy" },
    { id: 1, gamertag: "Hakurei" },
  ];
  return (
    <div className={"h-[60vh] bg-slate-900 rounded-lg m-1 flex flex-col"}>
      <div className={"flex-[9] flex-col flex m-3 items-center"}>
        <div className={"mb-5 font-bold text-xl"}>
          Carpool Chat: From {origin} to {destination}
        </div>
        {sampleMessages.map((message) => (
          <Message
            key={message.id}
            message={message}
            user={sampleUsers.find((user) => user.id === message.userId)!}
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
