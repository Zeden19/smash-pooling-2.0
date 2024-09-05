export const GET_CURRENT_USER = "query {\n" +
    "  currentUser {\n" +
    "    player {\n" +
    "      gamerTag\n" +
    "    }\n" +
    "    id\n" +
    "    slug\n" +
    "    email\n" +
    "    images(type:\"profile\") {\n" +
    "      url\n" +
    "    }\n" +
    "  }\n" +
    "}\n"
