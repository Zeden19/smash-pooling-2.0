import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { Loader } from "@googlemaps/js-api-loader";

//Map's styling
const mapCentre = {
  lat: 43.6532,
  lng: -79.3832,
};
const zoom = 6;

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_MAPS_KEY!,
  version: "weekly",
  //   additional options
});

interface MapContextType {
  map: google.maps.Map | null;
  dispatch: Dispatch<MapAction>;
}

interface AddMarker {
  type: "addMarker";
  cords: { lat: number; lng: number };
}

type MapAction = AddMarker;

const newMap = loader
  .importLibrary("maps")
  .then(({ Map }) => {
    new Map(document.getElementById("map")!, {
      zoom: zoom,
      mapId: process.env.NEXT_PUBLIC_MAP_ID,
      center: mapCentre,
    });
  })
  .catch(() => {
    return "Could not load Map";
  });
const AdvancedMarkerElement = loader.importLibrary("marker").then(r => r.AdvancedMarkerElement)
export const MapContext = createContext<MapContextType>({} as MapContextType);

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, dispatch] = useReducer(mapReducer, newMap);

  return <MapContext.Provider value={{ map, dispatch }}>{children}</MapContext.Provider>;
}

export async function mapReducer(map: google.maps.Map, action: MapAction) {
  switch (action.type) {
    case "addMarker":
      new (await AdvancedMarkerElement)({
        map: map,
        position: action.cords,
        title: "Origin",
      });
  }
}
