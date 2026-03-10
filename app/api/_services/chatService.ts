import prisma from "@/prisma/prismaClient";
import { notFound } from "@/app/api/_core/responses";

export async function getMessageById(id: number) {
  return prisma.message.findUnique({
    where: { id },
    include: { carpool: { include: { attendees: true, driver: true } } },
  });
}

export async function getMessageByIdOrThrow(id: number) {
  const message = await getMessageById(id);
  if (!message) {
    return notFound("Message not found");
  }
  return message;
}
