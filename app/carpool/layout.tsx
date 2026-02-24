"use client";
import { APIProvider } from "@vis.gl/react-google-maps";

interface Props {
  children: React.ReactNode;
}
function CarpoolLayout({ children }: Props) {
  const key = process.env.NEXT_PUBLIC_MAPS_KEY;

  if (!key) {
    console.error("Missing NEXT_PUBLIC_MAPS_KEY");
    return null;
  }
  return (
    <APIProvider libraries={["geocoding", "routes", "marker", "core"]} apiKey={key}>
      {children}
    </APIProvider>
  );
}

export default CarpoolLayout;
