const Nominatim = require('nominatim-browser');

function setGeolocationForArtworks(artworks) {
  return getGeolocationForArtworks(artworks).then(results => {
    return results.map(result => {
      const { artwork, geolocation } = result;
      let coordinates = null;
      if (geolocation) {
        coordinates = [geolocation.long, geolocation.lat];
      }
      return Object.assign({}, artwork, { coordinates });
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

module.exports = { setGeolocationForArtworks };
