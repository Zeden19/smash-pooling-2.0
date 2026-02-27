"use client";
import { Message } from "prisma/prisma-client";
import { createContext, type ReactNode, useContext, useRef } from "react";
import { create, useStore } from "zustand";

interface MessageStore {
  messages: Message[];

  addMessage: (message: Message) => void;
  removeMessage: (message: Message) => void;
  editMessage: (message: Message) => void;
  revertMessages: (messages: Message[]) => void;
}

const createMessageStore = (messages: Message[]) => {
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

export type MessageStoreApi = ReturnType<typeof createMessageStore>;
export const MessageStoreContext = createContext<MessageStoreApi | undefined>(undefined);

interface Props {
  messages: Message[];
  children: ReactNode;
}
export function MessageStoreProvider({ messages, children }: Props) {
  const storeRef = useRef<MessageStoreApi>();
  if (!storeRef.current) storeRef.current = createMessageStore(messages);
  return (
    <MessageStoreContext.Provider value={storeRef.current}>
      {children}
    </MessageStoreContext.Provider>
  );
}

export const useMessageStore = <T,>(selector: (store: MessageStore) => T): T => {
  const messageStoreContext = useContext(MessageStoreContext);

  if (!messageStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`);
  }

  return useStore(messageStoreContext, selector);
};
