import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/prismaClient";
import { getUser } from "@/app/_helpers/hooks/getUser";

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
  price: z.optional(z.number().min(0, { message: "Price must be positive" })),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  const price = parseInt(body.price);
  const { error } = schema.safeParse({
    ...body,
    price: isNaN(price) ? undefined : price,
  });
  if (error) return NextResponse.json({ error: error }, { status: 400 });

  const { user } = await getUser();
  if (!user) return NextResponse.json({ error: "User not logged in" }, { status: 400 });

  if (new Date(body.date) < new Date())
    return NextResponse.json({ error: "Date is in the past" }, { status: 400 });

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
      price: !price ? 0 : price,
      startTime: date,
      messages: {
        create: {
          serverMessage: true,
          content: `Carpool has been created.`,
        },
      },
      attendees: {
        connect: [user],
      },
    },
  });

  return NextResponse.json({ route: newCarpool.route }, { status: 200 });
}
