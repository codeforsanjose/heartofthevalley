const Nominatim = require('nominatim-browser');

function setGeolocationForArtwork(artwork) {
  return getGeolocationForArtwork(artwork).then(({ artwork, geolocation }) => {
    let coordinates = null;
    if (geolocation) {
      coordinates = [geolocation.long, geolocation.lat];
    }

    artwork.coordinates = coordinates;
    return artwork;
  });
}

function getGeolocationForArtwork(artwork) {
  const {
    properties: { streetAddress: street, city, state, postalCode: postalcode }
  } = artwork;

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
  return Nominatim.geocode(query)
    .then(results => {
      query;
      const firstResult = results[0];
      if (firstResult) {
        return firstResult && { lat: Number(firstResult.lat), long: Number(firstResult.lon) };
      }
      return null;
    })
    .catch(err => {
      console.error(`Error finding geolocation for query: ${JSON.stringify(query)}`);
      console.error(err);
      return null;
    });
}

module.exports = { setGeolocationForArtwork };
