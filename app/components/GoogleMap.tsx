"use client";
import { AdvancedMarker, APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useState } from "react";

//Map's styling
export const defaultMapContainerStyle = {
  width: "100%",
  height: "80vh",
  borderRadius: "15px 0px 0px 15px",
};

const mapCentre = {
  lat: 43.6532,
  lng: -79.3832,
};
const zoom = 6;

function GoogleMap() {
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([
    { lat: 53.54992, lng: 10.00678 },
  ]);
  return (
    <div style={defaultMapContainerStyle}>
      <button onClick={() => setMarkers([...markers, { lat: 43.6532, lng: -79.3832 }])}>
        Add marker to Toronto
      </button>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
        <Map
          style={{ width: "100%", height: "100%" }}
          gestureHandling={"greedy"}
          defaultZoom={zoom}
          defaultCenter={mapCentre}
          mapId={process.env.NEXT_PUBLIC_MAP_ID as string}
        />

        {markers.map((marker, index) => (
          <AdvancedMarker key={index} position={marker} />
        ))}
      </APIProvider>
    </div>
  );
}

export default GoogleMap;
