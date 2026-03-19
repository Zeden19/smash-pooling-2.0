import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/prismaClient";
import { handleRoute } from "@/app/api/_core/handler";
import { parseBody } from "@/app/api/_core/validation";
import { requireUser } from "@/app/api/_core/auth";
import { badRequest } from "@/app/api/_core/responses";

const cords = z.object({
  lat: z.number({ message: "Lat required" }),
  lng: z.number({ message: "Lng required" }),
});

const origin = z.object({
  cords: cords,
  name: z.string({ message: "Origin Name required" }),
});
const destination = z.object({
  cords: cords,
  name: z.string({ message: "Destination Name required" }),
  slug: z.string({ message: "Destination Slug required" }),
});
const route = z.object({
  polyline: z.string({ message: "polyline required" }),
  distance: z.string({ message: "Distance is required" }),
});
const schema = z.object({
  origin,
  destination,
  route,
  description: z.optional(
    z
      .string()
      .max(500, { message: "Description link must be smaller than 500 characters" }),
  ),
  date: z.string().datetime({ offset: true, message: "Date is required" }),
  price: z
    .preprocess(
      (value) => (value === "" || value == null ? undefined : Number(value)),
      z.number().min(0, { message: "Price must be positive" }).optional(),
    )
    .optional(),
});

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const user = await requireUser();
    const body = await parseBody(request, schema);

    if (new Date(body.date) < new Date()) {
      return badRequest("Date is in the past");
    }

    const destination = body.destination;
    const origin = body.origin;
    const route = body.route;
    const date = body.date;
    const newCarpool = await prisma.carpool.create({
      data: {
        driverId: user.id,
        originLat: origin.cords.lat,
        originLng: origin.cords.lng,
        originName: origin.name,
        destinationLat: destination.cords.lat,
        destinationLng: destination.cords.lng,
        destinationName: destination.name,
        tournamentSlug: destination.slug,
        route: route.polyline,
        distance: route.distance,
        description: body.description,
        price: body.price ?? 0,
        startTime: date,
        messages: {
          create: {
            serverMessage: true,
            content: "Carpool has been created.",
          },
        },
        attendees: {
          connect: { id: user.id },
        },
      },
    });

    return { id: newCarpool.id, route: newCarpool.route };
  });
}
