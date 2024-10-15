import { create } from "zustand";
import { Message } from "prisma/prisma-client";

export interface MessageStore {
  messages: Message[];

  addMessage: (message: Message) => void;
  removeMessage: (message: Message) => void;
  editMessage: (message: Message) => void;
  revertMessages: (messages: Message[]) => void;
}

export const createMessageStore = (messages: Message[]) => {
  return create<MessageStore>((set) => ({
    messages: messages,
    addMessage: (message) =>
      set(({ messages }) => ({ messages: [...messages, message] })),
    removeMessage: (messageToDelete) =>
      set(({ messages }) => ({
        messages: messages.filter((message) => message.id !== messageToDelete.id),
      })),
    editMessage: (messageToEdit) =>
      set(({ messages }) => ({
        messages: messages.map((message) =>
          message.id === messageToEdit.id ? messageToEdit : message,
        ),
      })),
    revertMessages: (messagesRevert) => set(() => ({ messages: messagesRevert })),
  }));
};

export default createMessageStore;
