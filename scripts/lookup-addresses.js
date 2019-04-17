const fs = require('fs');
const GeocodingService = require('../lib/geocoding-service');
const PATHS = require('../config/file-paths');
const ArtworkScraper = require('../lib/artwork-scraper');

(function main() {

  let filePath = PATHS.PATH_CONSOLIDATED_ARTWORKS
  console.log(`Merging in artworks from file: '${filePath}'`);
  const file = require(filePath);
  const fileArtworks = file.features || file;
  console.log(`Num artworks: ${fileArtworks.length}`);

  let promises = [];

  for (let artwork of fileArtworks) {
    if (artwork === null) {
      console.warn('unexpected null in artwork list')
      continue;
    }
    if (artwork.geometry && artwork.geometry.coordinates) {
      console.log(`Skipping '${artwork.properties.title}' because geolocation is already done.`);
      continue;
    }
    console.log(`Finding geolocation for '${artwork.properties.title}'`);

    const promise = GeocodingService.getGeolocationForArtwork(artwork)
      .then(geolocation => {
        artwork.geometry = artwork.geometry || [];
        artwork.geometry.coordinates = [geolocation.long, geolocation.lat];
        if (!artwork.geometry.coordinates) {
          artwork.errors = artwork.errors || [];
          artwork.errors.push('coordinates');
        }
        return artwork;
      })
      .catch(e => {
        console.error(
          `\nError finding geolocation for '${artwork.properties.title}'; query '${
          artwork.properties.address
          }'\n${e}`
        );
      });
    promises.push(promise);
  }

  Promise.all(promises).then(values => {
    fileArtworks.sort((a, b) => a.properties.title.localeCompare(b.properties.title));
    ArtworkScraper.writeData(
      { type: 'FeatureCollection', features: fileArtworks },
      PATHS.PATH_CONSOLIDATED_ARTWORKS
    ).then(() => {
      console.log(`Done! Data written to file: '${PATHS.PATH_CONSOLIDATED_ARTWORKS}'`);
    });
  }).catch(console.error);
})();
