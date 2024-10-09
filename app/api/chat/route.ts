import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import prisma from "@/prisma/prismaClient";
import { getUser } from "@/app/helpers/hooks/getUser";

const schema = z.object({
  content: z
    .string()
    .max(500, { message: "Message must be shorter than 500 characters" })
    .min(0, { message: "Message is required" }),
});

export async function POST(body: NextRequest) {
  const data = await body.json();
  const { user } = await getUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const carpool = await prisma.carpool.findUnique({
    where: { id: data.chatRoom.carpoolId },
    include: {
      driver: true,
      attendees: true,
    },
  });

  if (!carpool) return NextResponse.json({ error: "Carpool not found" }, { status: 404 });

  if (!carpool.attendees.includes(user) && carpool.driver.id !== user.id)
    return NextResponse.json(
      { error: "You aren't apart of this carpool!" },
      { status: 401 },
    );

  const newMessage = await prisma.message.create({
    data: {
      user: {
        connect: { id: data.user.id },
      },
      chatRoom: {
        connect: { carpoolId: data.chatRoom.carpoolId },
      },
      content: data.content,
    },
  });

  return NextResponse.json({ newMessage }, { status: 200 });
}
