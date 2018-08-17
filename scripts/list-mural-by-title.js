const PATHS = require('../config/file-paths');
const allArtworks = require(PATHS.PATH_CONSOLIDATED_ARTWORKS);

function listArtworksByTitle(targetTitle) {
  allArtworks.features.forEach(artwork => {
    if (artwork.properties.title === targetTitle) {
      console.log(`id: ${artwork.id} \ndescription: ${artwork.properties.description}`);
    }
  });
}

listArtworksByTitle('Untitled');
