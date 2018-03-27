/*
 *	Heart of the Valley 
 *		main.js
 */

// This will let you use the .remove() function later on
if (!('remove' in Element.prototype)) {
	Element.prototype.remove = function() {
		if (this.parentNode) {
			this.parentNode.removeChild(this);
		}
	};
}

mapboxgl.accessToken = 'pk.eyJ1IjoieWNob3kiLCJhIjoiY2pmOTYwdzZ5MG52dDJ3b2JycXY4ZDU5ciJ9.m9H_Mqu1b42AObg_u_tjpA';

// Initialize a new map in the div with id 'map'
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/light-v9',
	center: [-121.893028, 37.335480],  // position in long, lat format
	zoom: 12,
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
	// Create an img class='responsive' element for the marker
	var el = document.createElement('div');
	el.id = "marker-" + i;
	el.className = 'marker';
	// Add markers to the map at all points
	new mapboxgl.Marker(el)
			.setLngLat(marker.geometry.coordinates)
			.addTo(map);

el.addEventListener('click', function(e) {
		var activeItem = document.getElementsByClassName('active');
		// 1. Fly to the point
		flyToArt(marker);
		// 2. Close all other popups and display popup for clicked art
		createPopUp(marker, "listing-"+i);
		// 3. Highlight listing in sidebar (and remove highlight for all other listings)
		e.stopPropagation();
		if (activeItem[0]) {
			activeItem[0].classList.remove('active');
		}
		var listing = document.getElementById('listing-' + i);
		console.log(listing);
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

	var popup = new mapboxgl.Popup({closeOnClick: true, closeButton: true, anchor: 'top'})
				.setLngLat(currentFeature.geometry.coordinates)
				.setHTML(
					'<h3>' + currentFeature.properties.title + '</h3>' +
					'<h4>' + `by ` + currentFeature.properties.artist + '<br/>' + 
						`Address: ` +  currentFeature.properties.address + ', ' + 
						currentFeature.properties.city + ', ' +  
						currentFeature.properties.state + ' ' + 
						currentFeature.properties.postalCode + '</h4>'
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
		link.dataPosition = i;
		link.innerHTML = prop.title;

		// Create a new div with the class 'details' for each listing
		// and fill it with the following
		var artist = listing.appendChild(document.createElement('div'));
		artist.innerHTML = 'by ' + prop.artist;

		var address = listing.appendChild(document.createElement('div'));
		address.innerHTML = prop.address + ', ' + prop.city + ', ' + prop.state + " " + prop.postalCode ;

    if (prop.image) {
		  var artImage = listing.appendChild(document.createElement('div'));
		  artImage.innerHTML = '<br/>' + "<img src=\"" + prop.image + "\">";
    }

		var story = listing.appendChild(document.createElement('div'));
		if (prop.description) {
			story.innerHTML = '<br/>' + prop.description;
		}

	 link.addEventListener('click', function(e){
			// Update the currentFeature to the art associated with the clicked link
			var clickedListing = data.features[this.dataPosition];

			// 1. Fly to the point
			flyToArt(clickedListing);

			// 2. Close all other popups and display popup for clicked point
			createPopUp(clickedListing, listing.id);

			// 3. Highlight listing in sidebar (and remove highlight for all other listings)
			var activeItem = document.getElementsByClassName('active');

			if (activeItem[0]) {
				 activeItem[0].classList.remove('active');
			}
			this.parentNode.classList.add('active');

		});
	}
}

