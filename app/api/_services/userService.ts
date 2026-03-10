import prisma from "@/prisma/prismaClient";
import { notFound } from "@/app/api/_core/responses";

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { carpoolsAttending: true, carpoolsDriving: true },
  });
}

export async function getUserByIdOrThrow(id: string) {
  const user = await getUserById(id);
  if (!user) {
    return notFound("User not found");
  }
  return user;
}
