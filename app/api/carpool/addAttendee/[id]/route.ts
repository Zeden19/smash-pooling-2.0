import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { getUser } from "@/app/helpers/hooks/getUser";

export async function PATCH(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { user } = await getUser();
  if (!user)
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

  const carpool = await prisma.carpool.findUnique({
    where: { id: parseInt(id) },
    include: { attendees: true, chatroom: true },
  });
  if (!carpool) return NextResponse.json({ error: "Carpool not found" }, { status: 404 });

  if (carpool.attendees.map((attendee) => attendee.id).includes(user.id))
    return NextResponse.json(
      { error: "You are already in this carpool." },
      { status: 400 },
    );

  const data = await prisma.carpool.update({
    where: { id: parseInt(id) },
    include: {
      attendees: true,
    },
    data: {
      attendees: {
        set: [...carpool.attendees, user],
      },
      chatroom: {
        update: {
          where: {
            carpoolId: carpool.id,
          },
          data: {
            messages: {
              create: {
                serverMessage: true,
                content: `${user.gamertag} has been added to Carpool.`,
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json(data, { status: 200 });
}
