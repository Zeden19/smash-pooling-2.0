import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/prismaClient";
import { validateRequest } from "@/app/hooks/validateRequest";
import { Prisma } from "@prisma/client";

const cords = z.object({
  lat: z.number({ message: "Lat" }),
  lng: z.number({ message: "Lng" }),
});

const origin = z.object({ cords: cords, name: z.string({ message: "Origin Name" }) });
const destination = z.object({
  cords: cords,
  name: z.string({ message: "Destination Name" }),
  slug: z.string({ message: "Destination Slug" }),
});
const route = z.array(cords);
const schema = z.object({
  origin,
  destination,
  route,
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { error } = schema.safeParse(body);
  if (error) return NextResponse.json({ error: error.format() }, { status: 400 });

  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ error: "User not logged in" }, { status: 400 });

  const destination = body.destination;
  const origin = body.origin;
  const route = body.route;
  const newCarpool = await prisma.carpool.create({
    data: {
      driverId: user.id,
      originLat: new Prisma.Decimal(origin.cords.lat),
      originLng: new Prisma.Decimal(origin.cords.lng),
      originName: origin.name,
      destinationLat: new Prisma.Decimal(destination.cords.lat),
      destinationLng: new Prisma.Decimal(destination.cords.lng),
      destinationName: destination.name,
      tournamentSlug: destination.slug,
      route: route,
    },
  });

  return NextResponse.json({ route: newCarpool.route }, { status: 200 });
}
