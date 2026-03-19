import { ColorScheme } from "@vis.gl/react-google-maps";
import PinElementOptions = google.maps.marker.PinElementOptions;

export const mapCentre = {
  lat: 43.6532,
  lng: -79.3832,
};

export const mapZoom = 6;

export const mapProps: {
  defaultZoom: number;
  defaultCenter: { lat: number; lng: number };
  colorScheme: ColorScheme;
  mapId: string | undefined;
} = {
  defaultZoom: mapZoom,
  defaultCenter: mapCentre,
  colorScheme: "FOLLOW_SYSTEM",
  mapId: process.env.NEXT_PUBLIC_MAP_ID,
};

export const polylineOptions = {
  strokeColor: "#FF0000",
  strokeOpacity: 1.0,
  strokeWeight: 2,
};

export const orangeMarker: PinElementOptions = {
  background: "#ff9901",
  borderColor: "#d17700",
  glyphColor: "#d17700",
};

export const blueMarker: PinElementOptions = {
  background: "#2563eb",
  borderColor: "#1d4ed8",
  glyphColor: "#1d4ed8",
};

export const routeColors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];
export const selectedRouteColor = "#22c55e";
