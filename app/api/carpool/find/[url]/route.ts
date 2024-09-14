import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import startggClient from "@/app/services/startggClient";
import { CHECK_TOURNAMENT_EXISTS } from "@/app/services/startggQueries";

export async function GET(
  req: NextRequest,
  { params: { url } }: { params: { url: string } },
) {
  console.log(url);
  const { tournament } = await startggClient.request<{ tournament: { id: number } }>(
    CHECK_TOURNAMENT_EXISTS,
    {
      slug: url,
    },
  );

  if (!tournament)
    return NextResponse.json({ error: "Tournament does not exist" }, { status: 404 });

  const carpools = await prisma.carpool.findMany({
    where: { tournamentSlug: url },
  });

  if (carpools.length === 0)
    return NextResponse.json({ error: "No carpools not found" }, { status: 404 });

  return NextResponse.json({ data: carpools }, { status: 200 });
}
