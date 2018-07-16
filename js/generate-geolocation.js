const fs = require('fs');
const Nominatim = require('nominatim-browser');
const CONSTANTS = require('./constants');

function setGeolocationForArtworks(artworks) {
  return getGeolocationForArtworks(artworks).then(results => {
    return results.map(result => {
      const { artwork, geolocation } = result;
      if (geolocation) {
        return Object.assign({}, artwork, { coordinates: [geolocation.long, geolocation.lat] });
      }
      return Object.assign({}, artwork, { geolocationError: true });
    });
  });
}

function getGeolocationForArtworks(artworks) {
  const promises = artworks.map(artwork => {
    return getGeolocationForArtwork(artwork);
  });
  return Promise.all(promises).then(results => {
    return results;
  });
}

function getGeolocationForArtwork(artwork) {
  const { streetAddress: street, city, state, postalCode: postalcode } = artwork;

  return getGeolocation({
    street,
    city,
    state,
    country: 'US',
    postalcode
  }).then(geolocation => {
    return { artwork, geolocation };
  });
}

function getGeolocation(query) {
  return Nominatim.geocode(query).then(results => {
    query;
    const firstResult = results[0];
    if (firstResult) {
      return firstResult && { lat: firstResult.lat, long: firstResult.lon };
    }
    return null;
  });
}

module.exports = setGeolocationForArtworks;
