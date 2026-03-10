import prisma from "@/prisma/prismaClient";
import { notFound } from "@/app/api/_core/responses";

export async function getCarpoolById(id: number) {
  return prisma.carpool.findUnique({
    where: { id },
    include: { attendees: true, driver: true, messages: true },
  });
}

export async function getCarpoolByIdOrThrow(id: number) {
  const carpool = await getCarpoolById(id);
  if (!carpool) {
    return notFound("Carpool not found");
  }
  return carpool;
}
