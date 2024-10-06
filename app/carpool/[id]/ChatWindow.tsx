import { Input } from "@/components/ui/input";

function ChatWindow() {
  const sampleMessages = [
    { id: 0, message: "Yooooo" },
    { id: 1, message: "Hi" },
    { id: 0, message: "U ready!!" },
    { id: 1, message: "Kinda...." },
  ];
  return (
    <div className={"h-[60vh] bg-slate-900 rounded m-1 flex flex-col align-center"}>
      <div className={"flex-[9] mt-2"}>CHAT</div>
      <Input className={"bg-gray-950 w-11/12 mb-2"} />
    </div>
  );
}

export default ChatWindow;