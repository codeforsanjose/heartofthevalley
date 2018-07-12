const fs = require('fs');
const mbxGeocodingService = require('../lib/mapbox-geocoding-service');
let artworks;
fs.readFile('../arwork-data/wip-artworks.json', (err, data) => {
  if (err) {
    throw err;
  }

  artworks = JSON.parse(data);
});

function setGelocationForArtworks(artworks) {
  const promises = artworks.map(artwork => {
    return setGeolocationForArtwork(artwork);
  });

  Promise.all(promises).then(results => {});
}

function getGeolocationForArtwork(artwork) {
  const postalAddress = `${artwork.streetAddress} ${artwork.city} ${artwork.state} ${
    artwork.postalCode
  }`;
  return getGeolocation(postalAddress).then(coordinates => {
    return { artwork, coordinates };
  });
}

function getGeolocation(query) {
  const config = { query, mode: 'mapbox.places-permanent', countries: ['US'] };
  return mbxGeocodingService
    .forwardGeocode(config)
    .send()
    .then(
      res => {
        const { body } = res;
        return body.geometry.coordinates;
      },
      err => {
        if (err) {
          throw err;
        }
      }
    );
}
