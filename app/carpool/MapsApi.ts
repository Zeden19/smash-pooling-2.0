import LatLngLiteral = google.maps.LatLngLiteral;
import LatLng = google.maps.LatLng;
import PinElementOptions = google.maps.marker.PinElementOptions;
import { PopUp } from "@/app/carpool/PopUp";
import decodePolyline from "@/app/carpool/decodePath";

class MapsApi {
  private geocoder: google.maps.Geocoder;
  private directionsService: google.maps.DirectionsService;
  private pinElement = google.maps.marker.PinElement;
  private readonly advancedMarker: typeof google.maps.marker.AdvancedMarkerElement;
  private popUp: PopUp | undefined;

  private markers: Array<google.maps.marker.AdvancedMarkerElement> = [];
  private polyLines: Array<google.maps.Polyline> = [];

  constructor(private map: google.maps.Map) {
    this.directionsService = google.maps.DirectionsService.prototype;
    this.geocoder = google.maps.Geocoder.prototype;
    this.advancedMarker = google.maps.marker.AdvancedMarkerElement;
  }

  async geocode(address: { address: string }) {
    const data = await this.geocoder.geocode(address);
    return data.results[0];
  }

  addMarker(cords: LatLngLiteral, markerOptions?: PinElementOptions) {
    const pin = new this.pinElement(markerOptions);
    const newMarker = new this.advancedMarker({
      map: this.map,
      position: cords,
      content: pin.element,
    });
    this.markers.push(newMarker);
    return newMarker;
  }

  async getRoutes(
    origin: LatLngLiteral,
    destination: LatLngLiteral,
  ): Promise<{ route: string; distance: string } | void> {
    let data: { route: string; distance: string } | undefined;
    await this.directionsService.route(
      //@ts-ignore
      { origin: origin, destination: destination, travelMode: "DRIVING" },
      (result, status) => {
        if (status !== "OK") return;
        const route = result!.routes[0].overview_polyline;
        const distance = result!.routes[0].legs[0].distance!.text;
        data = { route, distance };
      },
    );

    return data;
  }

  setRoute(route: string, infoWindowContent?: HTMLElement) {
    const path = decodePolyline(route);
    const newRoute = new google.maps.Polyline({
      path,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map: this.map,
    });
    this.setCentre(path[Math.floor(path.length / 2)]);

    if (infoWindowContent) {
      google.maps.event.addListener(newRoute, "click", (event: { latLng: LatLng }) => {
        if (this.popUp) this.popUp.setMap(null);
        this.popUp = new PopUp(event.latLng, infoWindowContent);
        this.popUp.setMap(this.map);
      });
    }

    this.polyLines.push(newRoute);
    return newRoute;
  }

  removeRoute(route: google.maps.Polyline) {
    route.setMap(null);
  }

  removeMarker(marker: google.maps.marker.AdvancedMarkerElement) {
    marker.map = null;
  }

  removeAllElements() {
    this.markers.forEach((marker) => (marker.map = null));
    this.polyLines.forEach((polyline) => polyline.setMap(null));
  }

  setCentre(cords: LatLng | { lat: number; lng: number }, zoom = 7) {
    this.map.setCenter(cords);
    this.map.setZoom(zoom);
  }
}

export default MapsApi;
