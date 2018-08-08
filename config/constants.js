const path = require('path');

const URL_SAN_JOSE_GOV = 'http://sanjoseca.gov';
const PATH_CONSOLIDATED_ARTWORKS = path.resolve(
  __dirname + '/../artwork-data/consolidated-artworks.json'
);

module.exports = {
  MAPBOX_API_TOKEN:
    'pk.eyJ1IjoieWNob3kiLCJhIjoiY2pmOTYwdzZ5MG52dDJ3b2JycXY4ZDU5ciJ9.m9H_Mqu1b42AObg_u_tjpA',
  PATH_CONSOLIDATED_ARTWORKS,
  PATH_ARTWORKS_PUBLIC: PATH_CONSOLIDATED_ARTWORKS,
  PATH_SCRAPED_ARTWORKS: path.resolve(__dirname + '/../artwork-data/scraped-artworks.json'),
  PATH_SCRAPED_ARTWORKS_ERRORS: path.resolve(
    __dirname + '/../artwork-data/scraped-artworks-errors.json'
  ),
  PATH_ARTWORKS_OVERRIDES: path.resolve(__dirname + '/../artwork-data/artworks-overrides.json'),
  PATH_LEGACY_ARTWORKS: path.resolve(__dirname + '/../artwork-data/art.js'),

  URL_SAN_JOSE_GOV,
  URL_SEARCH: `${URL_SAN_JOSE_GOV}/Facilities/Facility/Search`
};
