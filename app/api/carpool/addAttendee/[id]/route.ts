import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { validateRequest } from "@/app/hooks/validateRequest";

export async function PATCH(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { user } = await validateRequest();
  if (!user)
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

  const carpool = await prisma.carpool.findUnique({ where: { id: parseInt(id) } });
  if (!carpool) return NextResponse.json({ error: "Carpool not found" }, { status: 404 });

  const updatedCarpool = prisma.carpool.update({
    where: { id: parseInt(id) },
    data: {
      attendees: {
        create: user,
      },
    },
  });

  return NextResponse.json({ status: 200 });
}
