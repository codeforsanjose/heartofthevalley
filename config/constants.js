const path = require('path');

const URL_SAN_JOSE_GOV = 'http://sanjoseca.gov';

module.exports = {
  MAPBOX_API_TOKEN:
    'pk.eyJ1IjoieWNob3kiLCJhIjoiY2pmOTYwdzZ5MG52dDJ3b2JycXY4ZDU5ciJ9.m9H_Mqu1b42AObg_u_tjpA',
  PATH_ARTWORKS_SCRAPED: path.resolve(__dirname + '/../artwork-data/artworks-scraped.json'),
  PATH_ARTWORKS_PUBLIC: path.resolve(__dirname + '/../artwork-data/artworks-scraped.json'),
  PATH_ARTWORKS_ERRORS: path.resolve(__dirname + '/../artwork-data/artworks-errors.json'),
  PATH_ARTWORKS_OVERRIDES: path.resolve(__dirname + '/../artwork-data/artworks-overrides.json'),
  URL_SAN_JOSE_GOV,
  URL_SEARCH: `${URL_SAN_JOSE_GOV}/Facilities/Facility/Search`
};
