import LatLngLiteral = google.maps.LatLngLiteral;

export interface Origin {
  cords: LatLngLiteral;
  name: string;
}

export interface Destination {
  cords: LatLngLiteral;
  name: string;
  slug: string;
}

export interface RouteOption {
  polyline: string;
  distance?: string;
  duration?: string;
  bounds: google.maps.LatLngBounds;
  summary?: string;
}
