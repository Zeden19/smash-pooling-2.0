import React from "react";
import { CarpoolProvider } from "./CarpoolContext";
import prisma from "@/prisma/prismaClient";
import { getUser } from "@/app/_helpers/hooks/getUser";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

async function CarpoolLayout({ children, params }: Props) {
  const { id } = await params;
  const { user } = await getUser();
  console.log(id);
  if (!user || !id) redirect("/");

  const carpool = await prisma.carpool.findUnique({
    where: { id: parseInt(id) },
    include: { attendees: true, driver: true, messages: true },
  });
  if (!carpool) return;
  if (!carpool.attendees.map((attendee) => attendee.id).includes(user.id)) return;
  return <CarpoolProvider value={{ carpool, user, id }}>{children}</CarpoolProvider>;
}

export default CarpoolLayout;
