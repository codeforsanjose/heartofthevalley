const PATHS = require('../config/file-paths');
const ArtworkScraper = require('../lib/artwork-scraper');
// const legacyArtworks = require('../artwork-data/_legacy-art.json');
const overriddenArtworks = require(PATHS.PATH_ARTWORKS_OVERRIDES);

for (let artwork of overriddenArtworks) {
  delete artwork.id;
}

ArtworkScraper.writeData(overriddenArtworks, PATHS.PATH_ARTWORKS_OVERRIDES).then(() => {
  console.log('done');
});
