import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { getUser } from "@/app/_helpers/hooks/getUser";

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

  //

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

export async function DELETE(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { user } = await getUser();
  if (!user)
    return NextResponse.json(
      { error: "You cannot remove attendees in this carpool" },
      { status: 401 },
    );

  const body = await req.json();
  const userId = body.attendeeId;

  const attendeeToDelete = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!attendeeToDelete)
    return NextResponse.json({ error: "User does not exist" }, { status: 404 });

  const carpool = await prisma.carpool.findUnique({
    where: { id: parseInt(id) },
    include: { attendees: true, chatroom: true },
  });
  if (!carpool) return NextResponse.json({ error: "Carpool not found" }, { status: 404 });

  await prisma.carpool.update({
    where: { id: parseInt(id) },
    include: {
      attendees: true,
    },
    data: {
      id: 30,
      // attendees: {
      //   delete: [attendeeToDelete],
      // },
      chatroom: {
        update: {
          where: {
            carpoolId: carpool.id,
          },
          data: {
            messages: {
              create: {
                serverMessage: true,
                content: `${attendeeToDelete.gamertag} has removed from Carpool.`,
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ deletedAttendee: attendeeToDelete }, { status: 200 });
}
