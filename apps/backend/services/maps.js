/**
 * Maps Service - Mock Integration for Google Maps
 */
class MapsService {
  async calculateDistance(origin, destination) {
    console.log(`[MapsService] Calculating distance between ${origin} and ${destination}`);
    // Simulate Distance Matrix API
    return {
      distance: { text: "12.5 km", value: 12500 },
      duration: { text: "35 mins", value: 2100 }
    };
  }

  async geocode(address) {
    console.log(`[MapsService] Geocoding address: ${address}`);
    return { lat: 28.6139, lng: 77.2090 }; // Default to Delhi coords
  }
}

module.exports = new MapsService();
