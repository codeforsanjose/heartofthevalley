const path = require('path');

const PATH_CONSOLIDATED_ARTWORKS = path.resolve(
  __dirname + '/../artwork-data/consolidated-artworks.json'
);

module.exports = {
  PATH_CONSOLIDATED_ARTWORKS,
  PATH_ARTWORKS_PUBLIC: PATH_CONSOLIDATED_ARTWORKS,
  PATH_SCRAPED_ARTWORKS: path.resolve(__dirname + '/../artwork-data/_scraped-artworks.json'),
  PATH_SCRAPED_ARTWORKS_ERRORS: path.resolve(
    __dirname + '/../artwork-data/_scraped-artworks-errors.json'
  ),
  PATH_ARTWORKS_OVERRIDES: path.resolve(__dirname + '/../artwork-data/_artworks-overrides.json'),
  PATH_LEGACY_ARTWORKS: path.resolve(__dirname + '/../artwork-data/_legacy-art.json')
};
