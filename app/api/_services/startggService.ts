import startggClient from "@/app/_helpers/services/startggClient";
import {
  CHECK_TOURNAMENT_EXISTS,
  GET_CURRENT_USER,
} from "@/app/_helpers/services/startggQueries";
import { AppError } from "@/app/api/_core/errors";

export async function checkTournamentExists(slug: string) {
  return startggClient.request<{ tournament: { id: number } }>(CHECK_TOURNAMENT_EXISTS, {
    slug,
  });
}

export async function getCurrentUser(accessToken: string) {
  const response = await fetch("https://api.start.gg/gql/alpha", {
    method: "POST",
    body: JSON.stringify({ query: GET_CURRENT_USER }),
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new AppError("Failed to fetch StartGG user", 502, "STARTGG_FETCH_FAILED");
  }
  const json = (await response.json()) as { data?: { currentUser?: any } };
  if (!json?.data?.currentUser) {
    throw new AppError("Invalid StartGG response", 502, "STARTGG_INVALID_RESPONSE");
  }
  return json.data.currentUser;
}
