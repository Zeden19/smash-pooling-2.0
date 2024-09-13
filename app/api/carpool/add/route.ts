import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const cords = z.record(
  z.string({ message: "Cords" }),
  z.object({ lat: z.number({ message: "Lat" }), lng: z.number({ message: "Lng" }) }),
);
const origin = z.object({ cords: cords, name: z.string({ message: "Origin Name" }) });
const destination = z.object({
  cords: cords,
  name: z.string({ message: "Destination Name" }),
  slug: z.string({ message: "Destination Slug" }),
});
const route = z.object({ route: z.array(cords) });
const schema = z.object({
  origin,
  destination,
  route,
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body);

  const { error } = schema.safeParse(body);
  console.log(error);

  if (error) return NextResponse.json({ error: error.format() }, { status: 400 });

  return NextResponse.json({ route: body.destination.route }, { status: 200 });
}
