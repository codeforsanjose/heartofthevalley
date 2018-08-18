const Nominatim = require('nominatim-browser');

function getGeolocationForArtwork(artwork) {
  const {
    properties: { address: street, city, state, postalCode: postalcode }
  } = artwork;

  return getGeolocation({
    street,
    city,
    state,
    country: 'US',
    postalcode
  }).catch(e => {
    throw e;
  });
}

function getGeolocation(query) {
  return Nominatim.geocode(query)
    .then(results => {
      const firstResult = results[0];
      if (firstResult) {
        return firstResult && { lat: Number(firstResult.lat), long: Number(firstResult.lon) };
      }
      throw 'No geolocation found';
    })
    .catch(e => {
      throw e;
    });
}

module.exports = { getGeolocationForArtwork };
