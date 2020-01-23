mapboxgl.accessToken = "pk.eyJ1IjoieWNob3kiLCJhIjoiY2pmOTYwdzZ5MG52dDJ3b2JycXY4ZDU5ciJ9.m9H_Mqu1b42AObg_u_tjpA";

window.onload = (event) => {
  refreshVariables();
};

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v9",
  center: [-121.893028, 37.33548], // position in long, lat format
  zoom: 10,
  dragPan: true, // If true , the "drag to pan" interaction is enabled (see DragPanHandler)
  trackResize: true, // If true, the map will automatically resize when the browser window resizes.
  doubleClickZoom: true, //If true double click will zoom
  keyboard: true //If true will enable keyboard shortcuts
});

map.on("load", function(e) {
  if (!latitude || !longitude) {
    // missing coordinates
    console.log("artwork has missing coordinates")
  } else {
    // coordinates are present
    mapFlyToCurrent();
  }
});

function queryNominatim() {
  refreshVariables();
  var nominatimAPI = `https://nominatim.openstreetmap.org/?`;
  var query = { 
    params:{
      q: address + ", " + city + ", " + state + ", " + postalCode,
      format: "geocodejson",
      limit: "1",
    }
  }
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

function submitPOI() {
  refreshVariables();
  if (!latitude || !longitude) {
    alert("Missing Coordinates. Cannot Submit");
    return
  }
  if (!title || !artist || !description) {
    alert("Missing Details. Cannot Submit")
    return
  }

  var pathTo = "/POI";
  if (pageType === "Edit") {pathTo = `/POI/${id}`}
  axios.post(pathTo, {
    title, artist, address, description, city, state, postalCode, image, sourceURL, id, latitude, longitude
  })
  .then( response => {
    const data = response.data
    alert(`Successfully submitted artwork`);
    window.location = "/";
  }).catch(error => {
    alert(error)
  })
}

function mapFlyToCurrent() {
  refreshVariables();
  if (!latitude || !longitude) { console.log("Unable to fly to artwork. Missing coordinates"); return }
  map.flyTo({
    center: [longitude, latitude],
    zoom: 15
  });
  if (popup) {popup.remove()}
  var popup = new mapboxgl.Popup({ closeOnClick: true, closeButton: true, anchor: "top" })
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
  sourceURL = document.getElementById("sourceURL").value;
  id = document.getElementById("artworkId").value;
  latitude = document.getElementById("latitude").value;
  longitude = document.getElementById("longitude").value;
  pageType = document.getElementById("pageType").innerText;
}
