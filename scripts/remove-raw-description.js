const ArtworkScraper = require('../lib/artwork-scraper');
const CONSTANTS = require('../config/constants');
let overriddenArtworks = require(CONSTANTS.PATH_ARTWORKS_OVERRIDES);

overriddenArtworks = overriddenArtworks.map(artwork => {
  if (artwork.properties.rawDescription) {
    delete artwork.properties.rawDescription;
  }
  return artwork;
});

ArtworkScraper.writeData(overriddenArtworks, CONSTANTS.PATH_ARTWORKS_OVERRIDES);
