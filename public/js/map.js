mapboxgl.accessToken = maptoken; // this map token cone through show.ejs

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v9",
  projection: "globe",
  zoom: 9,
  center: listing.geometry.coordinates, // [lng, lat]
});

// Define the popup
const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(
  `<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`
);

// Add the marker and attach the popup
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);
