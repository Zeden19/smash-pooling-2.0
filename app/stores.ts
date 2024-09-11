import { create } from "zustand";
import MapsApi from "@/app/services/MapsApi";

interface MapStore {
  mapsApi: MapsApi | null;

  setMapsApi: (mapApi: MapsApi) => void;
}

const useMapStore = create<MapStore>((setState) => ({
  mapsApi: null,
  setMapsApi: (mapsApi: MapsApi) => setState(() => ({ mapsApi: mapsApi })),
}));

export default useMapStore;
