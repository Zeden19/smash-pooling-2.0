import { NextRequest } from "next/server";
import prisma from "@/prisma/prismaClient";
import { carColours, carData } from "@/app/profile/[id]/CarData";
import { z } from "zod";
import { carMakes } from "@/app/api/user/[id]/carMakes";
import { handleRoute } from "@/app/api/_core/handler";
import { parseBody } from "@/app/api/_core/validation";
import { requireUser, requireUserOwnership } from "@/app/api/_core/auth";
import { badRequest } from "@/app/api/_core/responses";
import { getUserByIdOrThrow } from "@/app/api/_services/userService";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: Props) {
  return handleRoute(async () => {
    const { id } = await params;
    const data = await getUserByIdOrThrow(id);
    return { data };
  });
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

// todo make microservice to host this instead of having enermouse json file
export async function PATCH(req: NextRequest, { params }: Props) {
  return handleRoute(async () => {
    const { id } = await params;
    const user = await requireUser();
    requireUserOwnership(id, user);

    const body = await parseBody(req, driverSchema);
    const carModels = body.carMake ? carData[body.carMake] : null;

    if (!carModels) {
      throw new badRequest("Invalid car make");
    }

    if (!carModels.includes(body.carModel)) {
      return badRequest("Car model does not exist with selected car Make");
    }

    return prisma.user.update({
      where: { id },
      data: {
        isDriver: true,
        phoneNumber: body.phoneNumber,
        fullName: body.fullName,
        carInfo: body.carMake + " " + body.carModel + " " + body.carColour,
        carSeats: body.carSeats,
        licencePlate: body.licencePlate,
      },
    });
  });
}
