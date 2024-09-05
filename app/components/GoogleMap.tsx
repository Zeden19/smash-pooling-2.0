"use client";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

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
const zoom = 18;

const mapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
};

function GoogleMap() {
  return (
    <div style={defaultMapContainerStyle}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
        <Map defaultZoom={zoom} defaultCenter={mapCentre}></Map>
      </APIProvider>
    </div>
  );
}

export default GoogleMap;
