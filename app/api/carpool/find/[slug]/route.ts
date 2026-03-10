import { NextRequest } from "next/server";
import prisma from "@/prisma/prismaClient";
import { handleRoute } from "@/app/api/_core/handler";
import { notFound } from "@/app/api/_core/responses";
import { checkTournamentExists } from "@/app/api/_services/startggService";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(_: NextRequest, { params }: Props) {
  return handleRoute(async () => {
    const { slug } = await params;
    const { tournament } = await checkTournamentExists(slug);

    if (!tournament) {
      return notFound("Tournament does not exist");
    }

    const carpools = await prisma.carpool.findMany({
      where: { tournamentSlug: slug },
    });

    if (carpools.length === 0) {
      return notFound("No carpools found");
    }

    return carpools;
  });
}
