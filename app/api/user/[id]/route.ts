import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { validateRequest } from "@/app/hooks/validateRequest";
import { carColours, carData } from "@/app/profile/[id]/CarData";
import { z } from "zod";
import { carMakes } from "@/app/api/user/[id]/carMakes";

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
  fullName: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name must be longer than 3 characters" })
    .max(40, { message: "Name must be smaller than 40 characters" }),
  phoneNumber: z
    .string({ message: "Phone number is required" })
    .min(4, { message: "Phone number must be larger than 4 characters" })
    .max(22, { message: "Phone number must be smaller than 23 characters" }),
  carMake: z.enum(carMakes, { message: "Invalid car make" }),
  carModel: z.string({ message: "Car model is required" }),
  carColour: z.enum(carColours, { message: "Invalid car colour" }),
  licencePlate: z
    .string({ message: "Licence Plate is required" })
    .min(6, { message: "Licence Plate must be longer than 6 characters" })
    .max(12, { message: "Licence Plate must be shorter than 13 characters" }),
  carSeats: z
    .number({ message: "Car Seats is required" })
    .min(1, { message: "Car seats must be greater than 1" })
    .max(12, { message: "Car seats must be smaller than 13" }),
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

  const carModels = body.carMake
    ? //@ts-ignore
      carData[body.carMake]
    : null;

  if (!carModels?.includes(body.carModel))
    return NextResponse.json(
      { error: "Car model does not exist with selected car Make" },
      { status: 400 },
    );

  if (validation.error)
    return NextResponse.json({ error: validation.error.format() }, { status: 400 });

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
