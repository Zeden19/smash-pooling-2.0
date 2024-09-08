import { GraphQLClient } from "graphql-request";

const apiVersion = "alpha";
const endpoint = "https://api.start.gg/gql/" + apiVersion;
const startggClient = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STARTGG_ID}`,
  },
});

export const slug = (url : string) => {
  try {
    const slug = new URL(url).pathname.match(/[^\/]+/g);
    if (slug) return slug[1];
    else return false;
  } catch (e) {
    return false;
  }
}

export default startggClient;