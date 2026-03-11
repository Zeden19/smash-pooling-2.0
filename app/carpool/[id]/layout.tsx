import React from "react";
import { CarpoolProvider } from "./CarpoolContext";
import { getUser } from "@/app/_helpers/hooks/getUser";
import { redirect } from "next/navigation";
import { getCarpoolById } from "@/app/api/_services/carpoolService";

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

async function CarpoolLayout({ children, params }: Props) {
  const { id } = await params;
  const { user } = await getUser();
  if (!user) redirect("/login");

  if (!id || id == "edit") redirect(`/profile/${user.id}`);

  const carpool = await getCarpoolById(parseInt(id));
  if (!carpool) redirect("/");
  if (!carpool.attendees.map((attendee) => attendee.id).includes(user.id)) redirect("/");
  return <CarpoolProvider value={{ carpool, user, id }}>{children}</CarpoolProvider>;
}

export default CarpoolLayout;
