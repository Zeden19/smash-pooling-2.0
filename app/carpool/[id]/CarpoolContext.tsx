"use client";
import { createContext, ReactNode, useContext } from "react";
import { Prisma } from "@prisma/client";
import { User } from "prisma/prisma-client";

export type CarpoolProps = Prisma.CarpoolGetPayload<{
  include: { attendees: true; driver: true; messages: true };
}>;

interface Context {
  carpool: CarpoolProps | null;
  user: User;
  id: string;
}

const CarpoolContext = createContext<Context | null>(null);

export function CarpoolProvider({
  value,
  children,
}: {
  value: Context;
  children: ReactNode;
}) {
  return <CarpoolContext.Provider value={value}>{children}</CarpoolContext.Provider>;
}

export function useCarpool() {
  const ctx = useContext(CarpoolContext);
  if (!ctx) throw new Error("useCarpool must be used within CarpoolProvider");
  return ctx;
}
