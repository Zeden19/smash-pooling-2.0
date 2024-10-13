import { Message } from "prisma/prisma-client";

interface AddAction {
  action: "add";
  newMessage: Message;
}

interface RemoveAction {
  action: "remove";
  messageId: number;
}

interface EditAction {
  action: "edit";
  message: Message;
}

interface RevertAction {
  action: "revert";
  messages: Message[];
}

type Actions = AddAction | RemoveAction | EditAction | RevertAction;

export default function messageReducer(messages: Message[], action: Actions) {
  switch (action.action) {
    default:
      return messages;
    case "add":
      return [...messages, action.newMessage];
    case "remove":
      return messages.filter((message) => message.id !== action.messageId);
    case "edit":
      return messages.map((message) =>
        message.id === action.message.id ? action.message : message,
      );
    case "revert":
      return action.messages;
  }
}
