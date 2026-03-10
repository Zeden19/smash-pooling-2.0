import { NextRequest } from "next/server";
import { handleRoute } from "@/app/api/_core/handler";
import {
  assertDriverThrow,
  assertMembershipThrow,
  requireUser,
} from "@/app/api/_core/auth";
import { parseId } from "@/app/api/_core/params";
import { getCarpoolByIdOrThrow } from "@/app/api/_services/carpoolService";
import prisma from "@/prisma/prismaClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: Props) {
  return handleRoute(async () => {
    const user = await requireUser();
    const { id } = await params;
    const carpoolId = parseId(id);
    const carpool = await getCarpoolByIdOrThrow(carpoolId);

    assertMembershipThrow(user.id, carpool);

    return carpool;
  });
}

export async function DELETE(_: NextRequest, { params }: Props) {
  return handleRoute(async () => {
    const user = await requireUser();
    const { id } = await params;
    const carpoolId = parseId(id);
    const carpool = await getCarpoolByIdOrThrow(carpoolId);

    assertDriverThrow(user.id, carpool);

    return prisma.carpool.delete({ where: { id: carpoolId } });
  });
}
