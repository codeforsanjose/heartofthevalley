function queryNominatim() {
  var nominatimAPI = `https://nominatim.openstreetmap.org/?`;
  var query = { 
    params:{
      q: "491 East Empire Street, San Jose, CA",
      format: "geocodejson",
      limit: "1",
    }
  }
  // var r = `https://nominatim.openstreetmap.org/?q=491%20East%20Empire%20Street,%20San%20Jose,%20CA&format=geocodejson&limit=1`;
  axios
    .get(nominatimAPI, query)
    .then(
      function(response) {
        [longitude, latitude] = response.data.features[0].geometry.coordinates;
        document.getElementById("longitude").value = longitude;
        document.getElementById("latitude").value = latitude; 
        refreshVariables();
        mapFlyToCurrent();
      })
    .catch(
      function(error) {
        alert("Error getting coordinates from Nominatim. Please try a different address.")
    });
}

function mapFlyToCurrent() {
  refreshVariables();
  if (!latitude || !longitude) { alert("You are missing coordinates"); return }
  map.flyTo({
    center: [longitude, latitude],
    zoom: 15
  });
  if (popup) {popup.remove()}
  popup = new mapboxgl.Popup({ closeOnClick: true, closeButton: true, anchor: "top" })
  .setLngLat([longitude, latitude])
  .setHTML(
  `<div style="width: 300px;">
    <h3>${title}</h3>
    <p>by ${artist}</p>
    <p>Address: ${address}, ${city}, ${state}, ${postalCode}</p>
    <div>
      <img style="width: 300px" src=${image}>
    </div>
    <p>Description: ${description}</p>
  </div>`
  ).addTo(map);
}

function refreshVariables() {
  title = document.getElementById("title").value;
  artist = document.getElementById("artist").value;
  description = document.getElementById("description").value;
  address = document.getElementById("address").value;
  city = document.getElementById("city").value;
  state = document.getElementById("state").value;
  postalCode = document.getElementById("postalCode").value;
  image = document.getElementById("image").value;
  sourceUrl = document.getElementById("sourceUrl").value;

  latitude = document.getElementById("latitude").value;
  longitude = document.getElementById("longitude").value;
}
