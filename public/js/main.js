/*
 *	Heart of the Valley
 *		main.js
 */

(async function() {
  const res = await fetch('http://localhost:3000/api/artworks');
  const art = await res.json();

  // This will let you use the .remove() function later on
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  mapboxgl.accessToken =
    'pk.eyJ1IjoiY29kZWZvcmFtZXJpY2EiLCJhIjoiY2pmY3U3M3dlMXY1OTMzb2IxOGZkNW5wcyJ9.0qZCHLOM2Vy_JEE_Zx5-1g';

  // Initialize a new map in the div with id 'map'
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-121.893028, 37.33548], // position in long, lat format
    zoom: 8,
    dragPan: true, // If true , the "drag to pan" interaction is enabled (see DragPanHandler)
    trackResize: true, // If true, the map will automatically resize when the browser window resizes.
    doubleClickZoom: true, //If true double click will zoom
    keyboard: true //If true will enable keyboard shortcuts
  });

  // adds data to map
  map.on('load', function(e) {
    map.addSource('places', {
      type: 'geojson',
      data: art
    });
    buildLocationList(art); //initilize list.  call function when map loads
  });

  //Interaction with DOM markers
  art.features.forEach(function(marker, i) {
    if (!marker.coordinates) {
      continue;
    }
    
    // Create an img class='responsive' element for the marker
    var el = document.createElement('div');
    el.id = 'marker-' + i;
    el.className = 'marker';
    // Add markers to the map at all points
    new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);

    el.addEventListener('click', function(e) {
      var activeItem = document.getElementsByClassName('active');
      // 1. Fly to the point
      flyToArt(marker);
      // 2. Close all other popups and display popup for clicked art
      createPopUp(marker, 'listing-' + i);
      // 3. Highlight listing in sidebar (and remove highlight for all other listings)
      e.stopPropagation();
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      var listing = document.getElementById('listing-' + i);

      listing.classList.add('active');
    });
  });

  function flyToArt(currentFeature) {
    map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15
    });
  }

  function createPopUp(currentFeature, linkId) {
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();

    if (typeof linkId !== 'undefined') {
      window.location.hash = '#' + linkId;
    }

    var popup = new mapboxgl.Popup({ closeOnClick: true, closeButton: true, anchor: 'top' })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(
        '<h3>' +
          currentFeature.properties.title +
          '</h3><p>' +
          `by ` +
          currentFeature.properties.artist +
          '<br/><br/>' +
          `Address: ` +
          currentFeature.properties.address +
          ', ' +
          currentFeature.properties.city +
          ', ' +
          currentFeature.properties.state +
          ' ' +
          currentFeature.properties.postalCode +
          '<br/><br/>' +
          currentFeature.properties.description +
          '</p>'
      )
      .addTo(map);
  }

  function buildLocationList(data) {
    // Iterate through the list of arts
    for (i = 0; i < data.features.length; i++) {
      var currentFeature = data.features[i];
      // Shorten data.feature.properties to just `prop` so we're not
      // writing this long form over and over again.
      var prop = currentFeature.properties;
      // Select the listing container in the HTML and append a div
      // with the class 'item' for each art
      var listings = document.getElementById('listings');
      var listing = listings.appendChild(document.createElement('div'));
      listing.className = 'item';
      listing.id = 'listing-' + i;
      // Create a new link with the class 'title' for each art
      // and fill it with the art address
      var link = listing.appendChild(document.createElement('a'));
      link.href = '#';
      link.className = 'title';
      link.innerHTML = '<br/>' + prop.title;
      link.listingFeature = currentFeature;
      link.listingId = 'listing-' + i;

      // Create a new div with the class 'details' for each listing
      // and fill it with the following
      var artist = listing.appendChild(document.createElement('div'));
      artist.innerHTML = 'by ' + prop.artist;

      var address = listing.appendChild(document.createElement('div'));
      address.innerHTML =
        prop.address + ', ' + prop.city + ', ' + prop.state + ' ' + prop.postalCode;

      if (prop.image) {
        var artImage = listing.appendChild(document.createElement('div'));
        artImage.innerHTML = '<br/>' + '<img src="' + prop.image + '">';
      }

      var story = listing.appendChild(document.createElement('div'));
      if (prop.description) {
        story.innerHTML = '<br/>' + prop.description;
      }

      link.addEventListener('click', linkOnClickHandler);
    }
  }

  //Series of action to perform after a listing link is clicked.
  function linkOnClickHandler(e) {
    // switch back to map view if on mobile
    showMap();
    // Update the currentFeature to the art associated with the clicked link
    // var clickedListing = data.features[this.dataPosition];
    var clickedListing = this.listingFeature;
    // 1. Fly to the point
    flyToArt(clickedListing);
    // 2. Close all other popups and display popup for clicked point
    createPopUp(clickedListing, this.listingId);

    // 3. Highlight listing in sidebar (and remove highlight for all other listings)
    var activeItem = document.getElementsByClassName('active');

    if (activeItem[0]) {
      activeItem[0].classList.remove('active');
    }
    this.parentNode.classList.add('active');
  }

  // mobile tabs at bottom of page to switch between map and list view
  var container = document.querySelector('.container');
  document.querySelector('.tabs .list-button').addEventListener('click', function(e) {
    if (!container.classList.contains('list-visible')) {
      container.classList.add('list-visible');
    }
  });
  function showMap() {
    container.classList.remove('list-visible');
  }
  document.querySelector('.tabs .map-button').addEventListener('click', function(e) {
    showMap();
  });
})();
