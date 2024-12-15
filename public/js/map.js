// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = maptoken; //show.ejs through coming mapToken

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  projection: 'globe',
  zoom: 10,
  center: listingUseInmap.geometry.coordinates, // [lng, lat] //show.ejs through coming listing
});

// Define the popup and set its HTML content
const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(
  `<h4>${listingUseInmap.location}</h4><p>Wellcome to BlissfulWander</p>`,
);

const customMarker = document.createElement('div');
customMarker.innerHTML = `<i class="fa-solid fa-location-dot" style="font-size: 24px; color: #FF5733;"></i>`;

// Add the marker and attach the popup
const marker = new mapboxgl.Marker({ color: 'red' })
  .setLngLat(listingUseInmap.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);
