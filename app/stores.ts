import { create } from "zustand";
import MapsApi from "@/app/services/MapsApi";

interface MapStore {
  map: google.maps.Map | null;
  mapsApi: MapsApi | null;

  setMap: (map: google.maps.Map) => void;
  setMapsApi: (mapApi: MapsApi) => void;
}

const useMapStore = create<MapStore>((setState) => ({
  map: null,
  mapsApi: null,

  setMap: (map: google.maps.Map) => setState(() => ({ map: map })),
  setMapsApi: (mapsApi: MapsApi) => setState(() => ({ mapsApi: mapsApi })),
}));

export default useMapStore;
