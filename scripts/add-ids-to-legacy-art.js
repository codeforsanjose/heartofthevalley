const ArtworkScraper = require('../lib/artwork-scraper');
const legacyArtworks = require('../artwork-data/_legacy-art.json');
const filePaths = require('../config/file-paths');

for (let artwork of legacyArtworks) {
  artwork.id = ArtworkScraper.generateID(artwork);
}

ArtworkScraper.writeData(legacyArtworks, filePaths.PATH_LEGACY_ARTWORKS).then(() => {
  console.log('done');
});
