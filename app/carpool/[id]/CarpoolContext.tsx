"use client";
import { createContext, ReactNode, useContext } from "react";
import { Prisma } from "@prisma/client";

export type CarpoolProps = Prisma.CarpoolGetPayload<{
  include: { attendees: true; driver: true; chatroom: { include: { messages: true } } };
}>;

const CarpoolContext = createContext<CarpoolProps | null>(null);

export function CarpoolProvider({
  value,
  children,
}: {
  value: CarpoolProps | null;
  children: ReactNode;
}) {
  return <CarpoolContext.Provider value={value}>{children}</CarpoolContext.Provider>;
}

export function useCarpool() {
  const ctx = useContext(CarpoolContext);
  if (!ctx) throw new Error("useCarpool must be used within CarpoolProvider");
  return ctx;
}