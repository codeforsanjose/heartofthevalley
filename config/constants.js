const path = require('path');

module.exports = {
  MAPBOX_API_TOKEN:
    'pk.eyJ1IjoieWNob3kiLCJhIjoiY2pmOTYwdzZ5MG52dDJ3b2JycXY4ZDU5ciJ9.m9H_Mqu1b42AObg_u_tjpA',
  PATH_ARTWORKS_LIST_SCRAPED: path.resolve(__dirname + '/../artwork-data/artworks-scraped.json'),
  PATH_ARTWORKS_LIST_PUBLIC: path.resolve(
    __dirname + '/../artwork-data/artworks-manually-fixed.json'
  ),
  URL_SAN_JOSE_GOV: 'http://sanjoseca.gov'
};
