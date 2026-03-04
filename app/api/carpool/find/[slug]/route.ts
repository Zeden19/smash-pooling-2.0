import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import startggClient from "@/app/_helpers/services/startggClient";
import { CHECK_TOURNAMENT_EXISTS } from "@/app/_helpers/services/startggQueries";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(_: NextRequest, { params }: Props) {
  const { slug } = await params;
  const { tournament } = await startggClient.request<{ tournament: { id: number } }>(
    CHECK_TOURNAMENT_EXISTS,
    {
      slug,
    },
  );

  if (!tournament)
    return NextResponse.json({ error: "Tournament does not exist" }, { status: 404 });

  const carpools = await prisma.carpool.findMany({
    where: { tournamentSlug: slug },
  });

  if (carpools.length === 0)
    return NextResponse.json({ error: "No carpools not found" }, { status: 404 });

  return NextResponse.json(carpools, { status: 200 });
}
