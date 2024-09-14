import LatLngLiteral = google.maps.LatLngLiteral;
import LatLng = google.maps.LatLng;
import PinElementOptions = google.maps.marker.PinElementOptions;

class MapsApi {
  private geocoder: google.maps.Geocoder;
  private readonly advancedMarker: typeof google.maps.marker.AdvancedMarkerElement;
  private directionsService: google.maps.DirectionsService;
  private PinElement = google.maps.marker.PinElement;

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
    const pin = new this.PinElement(markerOptions);
    new this.advancedMarker({ map: this.map, position: cords, content: pin.element });
  }

  async getRoutes(
    origin: LatLngLiteral,
    destination: LatLngLiteral,
  ): Promise<LatLng[] | undefined> {
    let route: LatLng[] | undefined;
    await this.directionsService.route(
      //@ts-ignore
      { origin: origin, destination: destination, travelMode: "DRIVING" },
      (result, status) => {
        if (status !== "OK") return;
        route = result?.routes[0].overview_path;
      },
    );
    return route;
  }

  setRoute(route: LatLng[]) {
    new google.maps.Polyline({
      path: route,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map: this.map,
    });
  }
}

export default MapsApi;
