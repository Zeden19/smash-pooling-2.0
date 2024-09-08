import { create } from "zustand";


interface MapStore {
  map: google.maps.Map | null;
  advancedMarkerClass: typeof google.maps.marker.AdvancedMarkerElement | null;
  
  setMap: (map: google.maps.Map) => void;
  setAdvancedMarkerClass: (advancedMarker : typeof google.maps.marker.AdvancedMarkerElement) => void;
  setMarker: (cords: { lat: number; lng: number }) => void;
}

const useMapStore = create<MapStore>((setState) => ({
  map: null,
  advancedMarkerClass: null,

  setMap: (map: google.maps.Map) => setState(() => ({ map: map })),
  setAdvancedMarkerClass: (advancedMarker) => setState(() => ({advancedMarkerClass: advancedMarker})),
  setMarker: (cords) =>
    setState(
      (state) =>
        new state.advancedMarkerClass!({
          map: state.map,
          position: cords,
          title: "I want to die",
        }),
    ),
}));

export default useMapStore;
