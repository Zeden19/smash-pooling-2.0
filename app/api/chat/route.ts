import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import prisma from "@/prisma/prismaClient";
import { getUser } from "@/app/_helpers/hooks/getUser";

const newMessageSchema = z
  .string()
  .max(500, { message: "Message must be shorter than 500 characters" })
  .min(0, { message: "Message is required" });

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

  const { error } = newMessageSchema.safeParse(data.content);

  if (error) return NextResponse.json({ error }, { status: 404 });

  if (!carpool) return NextResponse.json({ error: "Carpool not found" }, { status: 404 });

  if (
    !carpool.attendees.map((attendee) => attendee.id).includes(user.id) &&
    carpool.driver.id !== user.id
  )
    return NextResponse.json(
      { error: "You aren't apart of this carpool!" },
      { status: 401 },
    );

  const newMessage = await prisma.message.create({
    data: {
      user: {
        connect: { id: user.id },
      },
      chatRoom: {
        connect: { carpoolId: data.chatRoom.carpoolId },
      },
      content: data.content,
    },
  });

  return NextResponse.json({ newMessage }, { status: 200 });
}

export async function DELETE(body: NextRequest) {
  const data = await body.json();
  const { user } = await getUser();
  if (!user) return NextResponse.json({ error: "User not found" });

  if (user.id !== data.message.userId)
    return NextResponse.json(
      { error: "You are not the owner of this message" },
      { status: 401 },
    );

  const message = await prisma.message.findUnique({
    where: { id: data.message.id },
  });

  if (!message) return NextResponse.json({ error: "Message not found" }, { status: 404 });

  const deletedMessage = await prisma.message.delete({
    where: { id: message.id },
  });

  return NextResponse.json({ deletedMessage }, { status: 200 });
}

export async function PATCH(body: NextRequest) {
  const data = await body.json();
  const { user } = await getUser();

  if (!user) return NextResponse.json({ error: "User not found" });
  if (user.id !== data.message.userId)
    return NextResponse.json(
      { error: "You are not the owner of this message" },
      { status: 401 },
    );

  const message = await prisma.message.findUnique({
    where: { id: data.message.id },
  });
  if (!message) return NextResponse.json({ error: "Message not found" });

  const { error } = newMessageSchema.safeParse(data.message.content);
  if (error) return NextResponse.json({ error }, { status: 404 });

  const editedMessage = await prisma.message.update({
    where: { id: data.message.id },
    data: data.message,
  });

  return NextResponse.json({ editedMessage }, { status: 200 });
}
