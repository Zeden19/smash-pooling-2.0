import { getUser } from "@/app/_helpers/hooks/getUser";
import { AuthError, ForbiddenError } from "./errors";
import { Carpool, Message, User } from "@prisma/client";
import { forbidden } from "@/app/api/_core/responses";

export async function requireUser() {
  const { user } = await getUser();
  if (!user) throw new AuthError();
  return user;
}

export function assertDriver(userId: string, carpool: Carpool) {
  return carpool.driverId === userId;
}

export function assertDriverThrow(userId: string, carpool: Carpool) {
  if (!assertDriver(userId, carpool)) {
    return forbidden("User not driver of carpool");
  }
}

export function assertMembership(userId: string, carpool: Carpool) {
  return (
    carpool.driverId === userId ||
    carpool.attendees.some((attendee: User) => attendee.id === userId)
  );
}

export function assertMembershipThrow(userId: string, carpool: Carpool) {
  if (!assertMembership(userId, carpool)) {
    return forbidden("User not apart of carpool");
  }
}

export function requireMessageOwnership(userId: string, message: Message) {
  if (userId !== message.userId) {
    throw new ForbiddenError();
  }
}

export function requireUserOwnership(userId: string, user: User) {
  if (userId !== user.id) {
    throw new ForbiddenError();
  }
}
