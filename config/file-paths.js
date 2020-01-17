const path = require('path');

module.exports = {
  PATH_CONSOLIDATED_ARTWORKS : path.resolve(__dirname + '/../artwork-data/consolidated-artworks.json'),
  PATH_ARTWORKS_PUBLIC: path.resolve(__dirname + '/../js/art.js'),
  PATH_SCRAPED_ARTWORKS: path.resolve(__dirname + '/../artwork-data/_scraped-artworks.json'),
  PATH_SCRAPED_ARTWORKS_ERRORS: path.resolve(
    __dirname + '/../artwork-data/_scraped-artworks-errors.json'
  ),
  PATH_CHECKED_POIs: path.resolve(__dirname + '/../artwork-data/checked-POIs.json'),
  PATH_ARTWORKS_OVERRIDES: path.resolve(__dirname + '/../artwork-data/artworks-overrides.json')
};
