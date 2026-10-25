/**
 * Places for the travels globe (travels.html).
 *
 * This is the only file you need to edit to change the map.
 * The globe, the flight arcs, the "countries" count, and the list
 * under the globe all read from TRAVELS. Order here is the list order.
 *
 * Each entry:
 *   name     string   Label on the globe and in the list. Usually a city.
 *   country  string   Country, counted the way Jasroop counts them.
 *                     England and Scotland are separate entries, and so is
 *                     Vatican City. The counter is the number of unique
 *                     country values, so keep one row per country.
 *   lat      number   Decimal degrees. North is positive.
 *   lon      number   Decimal degrees. East is positive.
 *   home     boolean  Optional. Set on exactly one row. Arcs leave from
 *                     that place and go to every other pin.
 *                     Home is New York. The repo's pages say New York,
 *                     not another US city.
 *
 * Most countries use one main city. The United States also has the
 * other cities from the trip list, all with country "USA", so they
 * share the existing home country and do not raise the country count.
 * Aruba is its own pin. Existing pins stay as they were.
 */
window.TRAVELS = [
  { name: "New York", country: "USA", lat: 40.7128, lon: -74.006, home: true },
  { name: "Toronto", country: "Canada", lat: 43.6532, lon: -79.3832 },
  { name: "Mexico City", country: "Mexico", lat: 19.4326, lon: -99.1332 },
  { name: "Punta Cana", country: "Dominican Republic", lat: 18.5601, lon: -68.3725 },
  { name: "Kingston", country: "Jamaica", lat: 17.9714, lon: -76.7936 },
  { name: "Nassau", country: "Bahamas", lat: 25.0443, lon: -77.3504 },
  { name: "Reykjavik", country: "Iceland", lat: 64.1466, lon: -21.9426 },
  { name: "Oslo", country: "Norway", lat: 59.9139, lon: 10.7522 },
  { name: "Brussels", country: "Belgium", lat: 50.8503, lon: 4.3517 },
  { name: "Berlin", country: "Germany", lat: 52.52, lon: 13.405 },
  { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522 },
  { name: "Madrid", country: "Spain", lat: 40.4168, lon: -3.7038 },
  { name: "New Delhi", country: "India", lat: 28.6139, lon: 77.209 },
  { name: "Istanbul", country: "Turkey", lat: 41.0082, lon: 28.9784 },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Bangkok", country: "Thailand", lat: 13.7563, lon: 100.5018 },
  { name: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708 },
  { name: "Vienna", country: "Austria", lat: 48.2082, lon: 16.3738 },
  { name: "London", country: "England", lat: 51.5074, lon: -0.1278 },
  { name: "Edinburgh", country: "Scotland", lat: 55.9533, lon: -3.1883 },
  { name: "Zurich", country: "Switzerland", lat: 47.3769, lon: 8.5417 },
  { name: "Rome", country: "Italy", lat: 41.9028, lon: 12.4964 },
  { name: "Prague", country: "Czech Republic", lat: 50.0755, lon: 14.4378 },
  { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { name: "Vatican City", country: "Vatican City", lat: 41.9029, lon: 12.4534 },
  { name: "Lisbon", country: "Portugal", lat: 38.7223, lon: -9.1393 },
  { name: "Dublin", country: "Ireland", lat: 53.3498, lon: -6.2603 },
  { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lon: 4.9041 },
  { name: "Newport", country: "USA", lat: 41.4901, lon: -71.3128 },
  { name: "Montauk", country: "USA", lat: 41.0359, lon: -71.9545 },
  { name: "Queens", country: "USA", lat: 40.7282, lon: -73.7949 },
  { name: "Brooklyn", country: "USA", lat: 40.6782, lon: -73.9442 },
  { name: "Half Moon Bay", country: "USA", lat: 37.4636, lon: -122.4286 },
  { name: "San Francisco", country: "USA", lat: 37.7749, lon: -122.4194 },
  { name: "Napa", country: "USA", lat: 38.5025, lon: -122.2654 },
  { name: "Point Reyes", country: "USA", lat: 38.0694, lon: -122.8069 },
  { name: "Philadelphia", country: "USA", lat: 39.9526, lon: -75.1652 },
  { name: "Cambridge", country: "USA", lat: 42.3736, lon: -71.1097 },
  { name: "Boston", country: "USA", lat: 42.3601, lon: -71.0589 },
  { name: "Honolulu", country: "USA", lat: 21.3069, lon: -157.8583 },
  { name: "Oranjestad", country: "Aruba", lat: 12.5092, lon: -70.0086 },
  { name: "San Diego", country: "USA", lat: 32.7157, lon: -117.1611 },
  { name: "Los Angeles", country: "USA", lat: 34.0522, lon: -118.2437 },
  { name: "Lake Tahoe", country: "USA", lat: 38.9399, lon: -119.9772 },
  { name: "Salt Lake City", country: "USA", lat: 40.7608, lon: -111.891 },
  { name: "Cheyenne", country: "USA", lat: 41.14, lon: -104.8202 },
  { name: "Omaha", country: "USA", lat: 41.2565, lon: -95.9345 },
  { name: "Chicago", country: "USA", lat: 41.8781, lon: -87.6298 }
];
