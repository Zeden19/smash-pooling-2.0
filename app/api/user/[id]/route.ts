import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const data = await prisma.user.findUnique({
    where: { id: id },
    include: { carpoolsAttending: true, carpoolsDriving: true },
  });

  if (!data) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ data }, { status: 201 });
}
