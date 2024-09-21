import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { validateRequest } from "@/app/hooks/validateRequest";
import { carColours, carMakes } from "@/app/profile/[id]/CarData";
import { z } from "zod";

interface Props {
  params: { id: string };
}

export async function GET(req: NextRequest, { params: { id } }: Props) {
  const data = await prisma.user.findUnique({
    where: { id: id },
    include: { carpoolsAttending: true, carpoolsDriving: true },
  });

  if (!data) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ data }, { status: 201 });
}

const driverSchema = z.object({
  fullName: z.string().min(3).max(100),
  phoneNumber: z.string().min(8).max(100),
  carMake: z.enum(carMakes),
  carModel: z.string(),
  carColour: z.enum(carColours),
  licencePlate: z.string().min(6).max(12),
  carSeats: z.number().min(1).max(12),
});

export async function PATCH(req: NextRequest, { params: { id } }: Props) {
  const body = await req.json();
  const { user } = await validateRequest();
  const data = await prisma.user.findUnique({
    where: { id: id },
    include: { carpoolsAttending: true, carpoolsDriving: true },
  });

  if (!data) return NextResponse.json({ error: "User not found" }, { status: 401 });

  if (user?.id !== id)
    return NextResponse.json({ error: "Access Denied" }, { status: 403 });

  const validation = driverSchema.safeParse(body);

  console.log(body);

  if (validation.error)
    return NextResponse.json({ error: validation.error }, { status: 400 });

  const driverInfo = await prisma.user.update({
    where: { id: id },
    data: {
      isDriver: true,
      phoneNumber: body.phoneNumber,
      fullName: body.fullName,
      carInfo: body.carMake + " " + body.carModel + " " + body.carColour,
      carSeats: body.carSeats,
      licencePlate: body.licencePlate,
    },
  });

  return NextResponse.json(driverInfo, { status: 200 });
}
