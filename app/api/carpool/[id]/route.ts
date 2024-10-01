import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/app/helpers/hooks/getUser";
import prisma from "@/prisma/prismaClient";

export async function DELETE(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { user } = await getUser();
  const carpool = await prisma.carpool.findUnique({ where: { id: parseInt(id) } });
  console.log(id, user, carpool);

  if (!carpool) return NextResponse.json({ error: "Carpool not found" }, { status: 404 });

  if (!user) return NextResponse.json({ error: "User not logged in" }, { status: 404 });

  if (carpool.driverId !== user.id)
    return NextResponse.json({ error: "User not driver of carpool" }, { status: 401 });

  const data = await prisma.carpool.delete({ where: { id: parseInt(id) } });
  return NextResponse.json(data, { status: 200 });
}
