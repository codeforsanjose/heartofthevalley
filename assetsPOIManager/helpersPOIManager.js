mapboxgl.accessToken = "pk.eyJ1IjoieWNob3kiLCJhIjoiY2pmOTYwdzZ5MG52dDJ3b2JycXY4ZDU5ciJ9.m9H_Mqu1b42AObg_u_tjpA";

let map = new mapboxgl.Map({
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
  let current = getCurrentVariables();
  let {longitude, latitude, address, city, state, postalCode} = current;
  if (longitude && latitude) {
    // coordinates are present
    mapFlyToCurrent();
  } else {
    // coordinates are not present.
    if (address && city && state && postalCode) {
      queryNominatim();
    } else {
      console.log("artwork does not have coordinates or a valid address")
    }
  }
});

function queryNominatim() {
  let current = getCurrentVariables();
  const nominatimAPI = `https://nominatim.openstreetmap.org/?`;
  let query = { 
    params:{
      q: current.address + ", " + current.city + ", " + current.state + ", " + current.postalCode,
      format: "geocodejson",
      limit: "1",
    }
  }
  axios
    .get(nominatimAPI, query)
    .then(
      function(response) {
        let [long, lat] = response.data.features[0].geometry.coordinates;
        document.getElementById("longitude").value = long;
        document.getElementById("latitude").value = lat; 
        mapFlyToCurrent();
      })
    .catch(
      function(error) {
        alert("Error getting coordinates from Nominatim.\nPlease make sure to have a legitimate address, city, and state.")
    });
}

function submitPOI() {
  let current = getCurrentVariables();
  let {title, artist, address, description, city, state, postalCode, image, sourceURL, id, latitude, longitude, pageType} = current;
  if (!current.latitude || !current.longitude) {
    alert("Missing Coordinates. Cannot Submit");
    return
  }
  if (!title || !artist || !description ) {
    alert("Missing Details. Cannot Submit")
    return
  }

  let pathTo = "/POI";
  if (pageType === "Edit") {pathTo = `/POI/${id}`}
  axios.post(pathTo, {
    title, artist, address, description, city, state, postalCode, image, sourceURL, id, latitude, longitude
  })
  .then( response => {
    const statusCode = response.status;
    if (statusCode === 201) {
      console.log(response.data.artwork);
      alert(
        "successfully submitted artwork\n" + 
        response.data.artwork.properties.title + 
        "\nby\n" + 
        response.data.artwork.properties.artist);
    }
    else {
      alert("Failed artwork creation")
    }
    window.location = ("/");
  }).catch(error => {
    alert(error);
    window.location = ("/");
  })
}

var popup;

function mapFlyToCurrent() {
  let current = getCurrentVariables();
  let {longitude, latitude, title, artist, address, city, state, postalCode, image, description} = current;
  if (!latitude || !longitude) { alert("Unable to fly to artwork. Missing coordinates"); return }
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
    <div><strong>Description: </strong><p>${description}</p></div>
  </div>`
  ).addTo(map);
}

function getCurrentVariables() {
  let lib = {
    title: 'title',
    artist: 'artist',
    description: 'description',
    address: 'address',
    city: 'city',
    state: 'state',
    postalCode: 'postalCode',
    image: 'image',
    sourceURL: 'sourceURL',
    id: 'artworkId',
    latitude: 'latitude',
    longitude: 'longitude',
  };
  // let title, artist, description, address, city, state, postalCode, image, sourceURL, id, longitude, latitude;
  Object.keys(lib).forEach( (key) => {
    lib[key] = document.getElementById(lib[key]).value;
  })
  lib.pageType = document.getElementById("pageType").innerText;
  return lib;
}
