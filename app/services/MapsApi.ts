import AdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement;

class MapsApi {
  private geocoder: google.maps.Geocoder;

  constructor(
    private map: google.maps.Map,
    private advancedMarker: typeof AdvancedMarkerElement,
  ) {
    this.geocoder = google.maps.Geocoder.prototype;
  }

  async geocode(address: { address: string }) {
    const data = await this.geocoder.geocode(address);
    return data.results[0];
  }

  addMarker(cords: { lat: number; lng: number }) {
    new this.advancedMarker({ map: this.map, position: cords });
  }
}

export default MapsApi;
