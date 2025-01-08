export const GET_TOURNAMENT_BY_URL =
  "query getTournamentBySlug($slug: String) {\n" +
  "  tournament(slug: $slug) {\n" +
  "    name\n" +
  "    lat\n" +
  "    lng\n" +
  "    id\n" +
  "    mapsPlaceId\n" +
  "    state\n" +
  "    venueAddress\n" +
  "    name\n" +
  '    url(relative: true, tab:"details")\n' +
  "  }\n" +
  "}";

export const GET_CURRENT_USER =
  "query {\n" +
  "  currentUser {\n" +
  "    player {\n" +
  "      gamerTag\n" +
  "    }\n" +
  "    id\n" +
  "    slug\n" +
  "    email\n" +
  '    images(type:"profile") {\n' +
  "      url\n" +
  "    }\n" +
  "  }\n" +
  "}\n";

export const CHECK_TOURNAMENT_EXISTS =
  "query checkTournamentExists($slug: String!) {\n" +
  "  tournament (slug: $slug) {\n" +
  "    id\n" +
  "  }\n" +
  "}\n";
