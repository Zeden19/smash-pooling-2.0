import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/prismaClient";
import { handleRoute } from "@/app/api/_core/handler";
import {
  assertMembershipThrow,
  requireMessageOwnership,
  requireUser,
} from "@/app/api/_core/auth";
import { parseBody } from "@/app/api/_core/validation";
import { getCarpoolByIdOrThrow } from "@/app/api/_services/carpoolService";
import { getMessageByIdOrThrow } from "@/app/api/_services/chatService";

const newMessageSchema = z
  .string()
  .max(500, { message: "Message must be shorter than 500 characters" })
  .min(1, { message: "Message is required" });

const createMessageSchema = z.object({
  carpoolId: z.preprocess(
    (value) => (value == null || value === "" ? undefined : Number(value)),
    z.number({ message: "carpoolId is required" }),
  ),
  content: newMessageSchema,
});

const deleteMessageSchema = z.object({
  message: z.object({
    id: z.number({ message: "message.id is required" }),
  }),
});

const editMessageSchema = z.object({
  message: z.object({
    id: z.number({ message: "message.id is required" }),
    content: newMessageSchema,
  }),
});

export async function POST(body: NextRequest) {
  return handleRoute(async () => {
    const user = await requireUser();
    const data = await parseBody(body, createMessageSchema);

    const carpool = await getCarpoolByIdOrThrow(data.carpoolId);
    assertMembershipThrow(user.id, carpool);

    const newMessage = await prisma.message.create({
      data: {
        user: {
          connect: { id: user.id },
        },
        carpool: {
          connect: { id: carpool.id },
        },
        content: data.content,
      },
    });

    return { newMessage };
  });
}

export async function DELETE(body: NextRequest) {
  return handleRoute(async () => {
    const user = await requireUser();
    const data = await parseBody(body, deleteMessageSchema);
    const message = await getMessageByIdOrThrow(data.message.id);

    assertMembershipThrow(user.id, message.carpool);
    requireMessageOwnership(user.id, message);

    const deletedMessage = await prisma.message.delete({
      where: { id: message.id },
    });

    return { deletedMessage };
  });
}

export async function PATCH(body: NextRequest) {
  return handleRoute(async () => {
    const user = await requireUser();
    const data = await parseBody(body, editMessageSchema);
    const message = await getMessageByIdOrThrow(data.message.id);

    assertMembershipThrow(user.id, message.carpool);
    requireMessageOwnership(user.id, message);

    const editedMessage = await prisma.message.update({
      where: { id: message.id },
      data: { content: data.message.content, edited: true },
    });

    return { editedMessage };
  });
}
