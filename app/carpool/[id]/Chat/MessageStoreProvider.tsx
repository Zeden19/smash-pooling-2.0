"use client";
import { Message } from "prisma/prisma-client";
import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";
import createMessageStore, { MessageStore } from "@/app/carpool/[id]/Chat/messagesStore";

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
