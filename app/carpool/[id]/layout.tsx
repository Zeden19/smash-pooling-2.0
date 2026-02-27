import React from "react";
import { CarpoolProvider } from "./CarpoolContext";
import prisma from "@/prisma/prismaClient";
import { getUser } from "@/app/_helpers/hooks/getUser";

interface Props {
  children: React.ReactNode;
  params: { id: string };
}

async function CarpoolLayout({ children, params: { id } }: Props) {
  const { user } = await getUser();
  if (!user) return;

  const carpool = await prisma.carpool.findUnique({
    where: { id: parseInt(id) },
    include: { attendees: true, driver: true, messages: true },
  });
  if (!carpool) return;
  if (!carpool.attendees.map((attendee) => attendee.id).includes(user.id)) return;
  return <CarpoolProvider value={{ carpool, user }}>{children}</CarpoolProvider>;
}

export default CarpoolLayout;
