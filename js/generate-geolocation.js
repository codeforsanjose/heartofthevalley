const fs = require('fs');
const Nominatim = require('nominatim-browser');
const CONSTANTS = require('./constants');

function setGeolocationForArtworks(artworks) {
  return getGeolocationForArtworks(artworks).then(results => {
    return results.map(result => {
      const { artwork, geolocation } = result;
      if (geolocation) {
        return Object.assign({}, artwork, { lat: geolocation.lat, long: geolocation.long });
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

new Promise(resolve => {
  console.log(
    `Reading artworks from file: '${CONSTANTS.PATH_ARTWORKS_SCRAPED_FROM_SAN_JOSE_SITE}'`
  );
  fs.readFile(CONSTANTS.PATH_ARTWORKS_SCRAPED_FROM_SAN_JOSE_SITE, (err, data) => {
    if (err) {
      console.error(
        `There was an error in reading the file '${
          CONSTANTS.PATH_ARTWORKS_SCRAPED_FROM_SAN_JOSE_SITE
        }'`
      );
      throw err;
    }
    console.log('Data read... Now fetching and setting geolocation data.');
    resolve(setGeolocationForArtworks(JSON.parse(data)));
  });
}).then(artworks => {
  console.log(`Writing updated data to '${CONSTANTS.PATH_ARTWORKS_WITH_GEOLOCATION}'`);
  fs.writeFile(
    CONSTANTS.PATH_ARTWORKS_WITH_GEOLOCATION,
    JSON.stringify(artworks),
    { encoding: 'utf8' },
    err => {
      if (err) {
        console.error(`Error writing data to file '${CONSTANTS.PATH_ARTWORKS_WITH_GEOLOCATION}'`);
        throw err;
      }
      console.log('Writing to file complete!');
    }
  );
});
