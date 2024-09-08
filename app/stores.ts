import { create } from "zustand";
import Geocoder = google.maps.Geocoder;


interface MapStore {
  map: google.maps.Map | null;
  advancedMarkerClass: typeof google.maps.marker.AdvancedMarkerElement | null;
  geocoder: Geocoder | null;
  
  setMap: (map: google.maps.Map) => void;
  setAdvancedMarkerClass: (advancedMarker: typeof google.maps.marker.AdvancedMarkerElement) => void;
  setGeocoder: (geocoder: Geocoder) => void;
  addMarker: (cords: { lat: number; lng: number }) => void;
}

const useMapStore = create<MapStore>((setState) => ({
  map: null,
  advancedMarkerClass: null,
  geocoder: null,
  
  setMap: (map: google.maps.Map) => setState(() => ({ map: map })),
  setAdvancedMarkerClass: (advancedMarker) => setState(() => ({ advancedMarkerClass: advancedMarker })),
  setGeocoder: (geocoder: Geocoder) => setState(() => ({ geocoder: geocoder })),
  addMarker: (cords) =>
    setState(
      (state) =>
        new state.advancedMarkerClass!({
          map: state.map,
          position: cords,
          title: "I want to die"
        })
    )
}));

export default useMapStore;
