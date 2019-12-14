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
            // 1. Fly to the point
            flyToArt(marker_elem);
            // 2. Close all other popups and display popup for clicked art
            createPopUp(marker_elem, listing_id);
            // 3. Highlight listing in sidebar (and remove highlight for all other listings)
            e.stopPropagation();
            deselectListing();
            console.log("attempting to show listing for " + listing_id);
            let listing = document.getElementById(listing_id);
            selectListing(listing);
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
      setTimeout(() => { window.location.hash = "#" + linkId; }, 250);
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
    displayEntry(currentFeature);
    }
  }

  function displayEntry(currentFeature) {
    // Simplify properties variable
    let prop = currentFeature.properties;

    // Create a listing entry
    let listing = document.getElementById("listings").appendChild(document.createElement("div"));
    listing.className = "item";
    listing.id = "listing-" + currentFeature.id;
    
    // Display inactive entry box
    let link = listing.appendChild(document.createElement("a"));
    link.href = "#";
    link.className = "entry";
    link.listingFeature = currentFeature;
    link.listingId = "listing-" + currentFeature.id;
    link.style.overflow = "hidden";

    // Display inactive details
    displayTitle(link, prop);
    displayThumbnail(link, prop);

    // Display active details
    displayArtist(listing, prop);
    displayAddress(listing, prop);

    // TODO: Pagination so we don't overload external servers
    // TODO: Scrapper needs to be updated due to changes to the San Jose government's website.
    if (prop.image) { 
      var artImage = listing.appendChild(document.createElement("div"));
      artImage.style.display = "none";
      artImage.className = "artImage full";
      artImage.innerHTML = "<br/>" + '<img src="' + prop.image + '">';
    }
  
    displayDescription(listing, prop);
    displayURL(listing, prop);

    link.addEventListener("click", linkOnClickHandler);
  }

  function displayTitle(listing, prop) {
    let title = listing.appendChild(document.createElement("div"));
    title.className = "title";
    title.innerHTML = "<br/>" + prop.title;
  }

  function displayArtist(listing, prop) {
    let artist = listing.appendChild(document.createElement("div"));
    artist.className = "artist full";
    artist.innerHTML = "by " + prop.artist;
  }

  function displayThumbnail(listing, prop) {
    let thumbnail = listing.appendChild(document.createElement("div"));
    thumbnail.className = "thumbnails";
    thumbnail.style.maxWidth = "100px";
    thumbnail.style.float = "right";
    thumbnail.style.clear = "both";
    if(prop.image) {
      thumbnail.innerHTML = '<img src="' + prop.image + '">';
    }
  }
  function displayAddress(listing, prop) {
    let address = listing.appendChild(document.createElement("div"));
    address.style.display = "none";
    address.className = "address full";
    address.innerHTML =
      prop.address +
      ", " +
      prop.city +
      ", " +
      prop.state +
      " " +
      prop.postalCode;
  }

  function displayDescription(listing, prop) {
    let story = listing.appendChild(document.createElement("div"));
    story.style.display = "none";
    story.className = "story full";
    if (prop.description) {
      story.innerHTML = "<br/>" + prop.description + "<br/>";
    }
  }

  function displayURL(listing, prop) {
    let info = listing.appendChild(document.createElement("div"));
    info.style.display = "none";
    info.className = "info full";

    if (prop.sourceURL) {
      let url = info.appendChild(document.createElement("a"));
      url.href = prop.sourceURL;
      url.innerHTML = "Source";
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
    // 3. Show full info and highlight listing in sidebar (and remove highlight for all other listings)
    deselectListing();
    selectListing(this.parentNode);
  }

function deselectListing() {
  var activeItem = document.getElementsByClassName("active");
  if (activeItem[0]) { 
    let activeProps = activeItem[0].getElementsByClassName("full");
    for(let i = 0; i < activeProps.length; i++) {
      activeProps[i].style.display = "none";
    }
    if(activeItem[0].getElementsByClassName("thumbnails").length > 0) {
      activeItem[0].getElementsByClassName("thumbnails")[0].style.display = "block";
      activeItem[0].classList.remove("active");
    }
  }
}

function selectListing(node) {
  node.classList.add("active");
  let hiddenProps = node.getElementsByClassName("full");
  
  for(let i = 0; i < hiddenProps.length; i++) {
    hiddenProps[i].style.display = "block";
  }
  console.log(node.getElementsByClassName("thumbnails"));
  if(node.getElementsByClassName("thumbnails").length > 0) {
    node.getElementsByClassName("thumbnails")[0].style.display = "none";
  }
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
