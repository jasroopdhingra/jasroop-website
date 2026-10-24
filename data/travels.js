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
 * Pins use one main city per country:
 *   Spain is Madrid (Barcelona would also have been fine).
 *   Mexico is Mexico City (not Cancun).
 *   Canada is Toronto.
 *   Everywhere else uses the city named with the country.
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
  { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lon: 4.9041 }
];
