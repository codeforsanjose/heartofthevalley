/*
 *	Heart of the Valley
 *		main.js
 */

(async function() {
  MAPBOX_API_TOKEN =
    "pk.eyJ1IjoieWNob3kiLCJhIjoiY2pmOTYwdzZ5MG52dDJ3b2JycXY4ZDU5ciJ9.m9H_Mqu1b42AObg_u_tjpA";

  // This will let you use the .remove() function later on
  if (!("remove" in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  function mapboxMapArtwork() {
    mapboxgl.accessToken = MAPBOX_API_TOKEN;
    // Initialize a new map in the div with id 'map'
    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v9",
      center: [-121.893028, 37.33548], // position in long, lat format
      zoom: 10,
      dragPan: true, // If true , the "drag to pan" interaction is enabled (see DragPanHandler)
      trackResize: true, // If true, the map will automatically resize when the browser window resizes.
      doubleClickZoom: true, //If true double click will zoom
      keyboard: true //If true will enable keyboard shortcuts
    });
    addFeaturesToMap();

    // adds data to map
    map.on("load", function(e) {
      map.addSource("places", {
        type: "geojson",
        data: art
      });
      if (art && art.features && art.features.length > 0) {
        buildLocationList(art); //initilize list.  call function when map loads
      } else {
        const notice = document.createElement("div");
        notice.innerText = "No artworks found.";
        document.getElementById("listings").appendChild(notice);
      }
    });
  }

  function addFeaturesToMap() {
    //Interaction with DOM markers
    art.features.forEach(marker => {
      if (marker.addToMap === false) {
        console.warn(
          `"${marker.properties.title}" is explicitly not added to the map.`
        );
      } else if (!marker.geometry || !marker.geometry.coordinates) {
        console.warn(
          `Missing coordinates for listing: "${
            marker.properties.title
          }". No marker will be added to map.`
        );
      } else {
        // Create an img class='responsive' element for the marker
        let el = document.createElement("div");
        el.id = "marker-" + marker.id;
        el.className = "marker";
        // Add markers to the map at all points

        try {
          new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
          let marker_elem = marker;
          let listing_id = "listing-" + marker.id;
          el.addEventListener("click", function(e) {
            console.log("marker has been clicked", marker_elem.id);
            let activeItem = document.getElementsByClassName("active");
            // 1. Fly to the point
            flyToArt(marker_elem);
            // 2. Close all other popups and display popup for clicked art
            createPopUp(marker_elem, listing_id);
            // 3. Highlight listing in sidebar (and remove highlight for all other listings)
            e.stopPropagation();
            if (activeItem[0]) {
              console.log("activeItem: ", activeItem);
              activeItem[0].classList.remove("active");
            }
            console.log("attempting to show listing for " + listing_id);
            let listing = document.getElementById(listing_id);

            listing.classList.add("active");
          });
        } catch (exception) {
          console.error(exception);
        }
      }
    });
  }

  function flyToArt(currentFeature) {
    map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15
    });
  }

  function createPopUp(currentFeature, linkId) {
    var popUps = document.getElementsByClassName("mapboxgl-popup");
    if (popUps[0]) popUps[0].remove();

    if (typeof linkId !== "undefined") {
      window.location.hash = "#" + linkId;
    }

    console.log("showing popup for ", currentFeature.properties.title);
    new mapboxgl.Popup({ closeOnClick: true, closeButton: true, anchor: "top" })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(
        "<h3>" +
          currentFeature.properties.title +
          "</h3><p>" +
          `by ` +
          currentFeature.properties.artist +
          "<br/><br/>" +
          `Address: ` +
          currentFeature.properties.address +
          ", " +
          currentFeature.properties.city +
          ", " +
          currentFeature.properties.state +
          " " +
          currentFeature.properties.postalCode +
          "<br/><br/>" +
          currentFeature.properties.description +
          "<br/><br/> Source: " +
          currentFeature.properties.sourceURL +
          "</p>"
      )
      .addTo(map);
  }

  function buildLocationList(data) {
    // Iterate through the list of arts
    for (let i = 0; i < data.features.length; i++) {
      var currentFeature = data.features[i];
      if (currentFeature.addToMap === false) {
        console.warn(
          `"${
            currentFeature.properties.title
          }" is explicitly not added to the locations list.`
        );
        continue;
      } else if (
        !currentFeature.geometry ||
        !currentFeature.geometry.coordinates
      ) {
        console.warn(
          `Missing coordinates for listing: "${
            currentFeature.properties.title
          }". No entry will be made in the locations list.`
        );
        continue;
      }

      // Shorten data.feature.properties to just `prop` so we're not
      // writing this long form over and over again.
      var prop = currentFeature.properties;
      // Select the listing container in the HTML and append a div
      // with the class 'item' for each art
      var listings = document.getElementById("listings");
      var listing = listings.appendChild(document.createElement("div"));
      listing.className = "item";
      listing.id = "listing-" + currentFeature.id;
      // Create a new link with the class 'title' for each art
      // and fill it with the art address
      var link = listing.appendChild(document.createElement("a"));
      link.href = "#";
      link.className = "title";
      link.innerHTML = "<br/>" + prop.title;
      link.listingFeature = currentFeature;
      link.listingId = "listing-" + currentFeature.id;

      // Create a new div with the class 'details' for each listing
      // and fill it with the following
      var artist = listing.appendChild(document.createElement("div"));
      artist.innerHTML = "by " + prop.artist;

      var address = listing.appendChild(document.createElement("div"));
      address.innerHTML =
        prop.address +
        ", " +
        prop.city +
        ", " +
        prop.state +
        " " +
        prop.postalCode;

      if (prop.image) {
        var artImage = listing.appendChild(document.createElement("div"));
        artImage.innerHTML = "<br/>" + '<img src="' + prop.image + '">';
      }

      var story = listing.appendChild(document.createElement("div"));
      if (prop.description) {
        story.innerHTML = "<br/>" + prop.description + "<br/>";
      }

      var info = listing.appendChild(document.createElement("a"));
      if (prop.sourceURL) {
        info.href = prop.sourceURL;
        info.innerHTML = "Source: " + prop.sourceURL;
      }

      link.addEventListener("click", linkOnClickHandler);
    }
  }

  //Series of action to perform after a listing link is clicked.
  function linkOnClickHandler(_e) {
    // switch back to map view if on mobile
    showMap();
    // Update the currentFeature to the art associated with the clicked link
    // var clickedListing = data.features[this.dataPosition];
    var clickedListing = this.listingFeature;

    if (!clickedListing.geometry.coordinates) {
      return console.warn(
        `Missing coordinates for listing: "${
          clickedListing.properties.title
        }". There is no marker on the map for this listing.`
      );
    }

    // 1. Fly to the point
    flyToArt(clickedListing);
    // 2. Close all other popups and display popup for clicked point
    createPopUp(clickedListing, this.listingId);

    // 3. Highlight listing in sidebar (and remove highlight for all other listings)
    var activeItem = document.getElementsByClassName("active");

    if (activeItem[0]) {
      activeItem[0].classList.remove("active");
    }
    this.parentNode.classList.add("active");
  }

  // mobile tabs at bottom of page to switch between map and list view
  var container = document.querySelector(".container");
  document
    .querySelector(".tabs .list-button")
    .addEventListener("click", function(e) {
      if (!container.classList.contains("list-visible")) {
        container.classList.add("list-visible");
      }
    });
  function showMap() {
    container.classList.remove("list-visible");
  }
  document
    .querySelector(".tabs .map-button")
    .addEventListener("click", function(e) {
      showMap();
    });
  mapboxMapArtwork();
})();
