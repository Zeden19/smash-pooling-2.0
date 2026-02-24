import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/app/_helpers/hooks/getUser";
import prisma from "@/prisma/prismaClient";

export async function GET(
  _: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { user } = await getUser();
  if (!user)
    return NextResponse.json({ error: "User not driver of carpool" }, { status: 401 });

  const carpool = await prisma.carpool.findUnique({
    where: { id: parseInt(id) },
    include: { attendees: true, driver: true, chatroom: { include: { messages: true } } },
  });
  if (!carpool) return NextResponse.json({ error: "Carpool not found" }, { status: 404 });
  if (carpool.driverId !== user.id && !carpool.attendees.includes(user))
    return NextResponse.json({ error: "User not apart of carpool" });

  return NextResponse.json(carpool, { status: 200 });
}

export async function DELETE(
  _: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { user } = await getUser();
  const carpool = await prisma.carpool.findUnique({ where: { id: parseInt(id) } });

  if (!carpool) return NextResponse.json({ error: "Carpool not found" }, { status: 404 });

  if (!user) return NextResponse.json({ error: "User not logged in" }, { status: 404 });

  if (carpool.driverId !== user.id)
    return NextResponse.json({ error: "User not driver of carpool" }, { status: 401 });

  const data = await prisma.carpool.delete({ where: { id: parseInt(id) } });
  return NextResponse.json(data, { status: 200 });
}
