import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_MAPS_KEY!,
  version: "weekly",
  //   additional options
});

export default loader;
