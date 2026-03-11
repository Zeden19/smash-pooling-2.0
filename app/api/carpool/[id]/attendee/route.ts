import { NextRequest } from "next/server";
import prisma from "@/prisma/prismaClient";
import { handleRoute } from "@/app/api/_core/handler";
import {
  assertDriverThrow,
  assertMembership,
  assertMembershipThrow,
  requireUser,
} from "@/app/api/_core/auth";
import { parseId } from "@/app/api/_core/params";
import { badRequest } from "@/app/api/_core/responses";
import { getCarpoolByIdOrThrow } from "@/app/api/_services/carpoolService";
import { parseBody } from "@/app/api/_core/validation";
import { z } from "zod";
import { getUserByIdOrThrow } from "@/app/api/_services/userService";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(_: NextRequest, { params }: Props) {
  return handleRoute(async () => {
    const user = await requireUser();
    const { id } = await params;
    const carpoolId = parseId(id);
    const carpool = await getCarpoolByIdOrThrow(carpoolId);

    if (assertMembership(user.id, carpool)) {
      return badRequest("You are already apart of this carpool");
    }

    return prisma.carpool.update({
      where: { id: carpoolId },
      include: {
        attendees: true,
      },
      data: {
        attendees: {
          set: [...carpool.attendees, user],
        },
        messages: {
          create: {
            serverMessage: true,
            content: `${user.gamertag} has been added to Carpool.`,
          },
        },
      },
    });
  });
}

export async function DELETE(req: NextRequest, { params }: Props) {
  return handleRoute(async () => {
    const user = await requireUser();
    const { id } = await params;
    const carpoolId = parseId(id);
    const body = await parseBody(
      req,
      z.object({ attendeeId: z.string({ message: "attendeeId required" }) }),
    );

    const attendeeToDelete = await getUserByIdOrThrow(body.attendeeId);
    const carpool = await getCarpoolByIdOrThrow(carpoolId);
    assertMembershipThrow(attendeeToDelete.id, carpool);
    assertDriverThrow(user.id, carpool);

    await prisma.carpool.update({
      where: { id: carpoolId },
      include: {
        attendees: true,
      },
      data: {
        attendees: {
          disconnect: { id: attendeeToDelete.id },
        },
        messages: {
          create: {
            serverMessage: true,
            content: `${attendeeToDelete.gamertag} has removed from Carpool.`,
          },
        },
      },
    });

    return { deletedAttendee: attendeeToDelete };
  });
}
