"use client";
import { createContext, ReactNode, useContext } from "react";
import { Prisma } from "@prisma/client";
import { User } from "prisma/prisma-client";

export type CarpoolProps = Prisma.CarpoolGetPayload<{
  include: { attendees: true; driver: true; messages: true };
}>;

const CarpoolContext = createContext<{ carpool: CarpoolProps | null; user: User } | null>(
  null,
);

export function CarpoolProvider({
  value,
  children,
}: {
  value: { carpool: CarpoolProps | null; user: User };
  children: ReactNode;
}) {
  return <CarpoolContext.Provider value={value}>{children}</CarpoolContext.Provider>;
}

export function useCarpool() {
  const ctx = useContext(CarpoolContext);
  if (!ctx) throw new Error("useCarpool must be used within CarpoolProvider");
  return ctx;
}
