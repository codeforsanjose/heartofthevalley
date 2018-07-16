const path = require('path');

module.exports = {
  MAPBOX_API_TOKEN:
    'pk.eyJ1IjoieWNob3kiLCJhIjoiY2pmOTYwdzZ5MG52dDJ3b2JycXY4ZDU5ciJ9.m9H_Mqu1b42AObg_u_tjpA',
  PATH_ARTWORKS_WITH_GEOLOCATION: path.resolve(
    __dirname + '/../artwork-data/wip-artworks-with-geolocation.json'
  ),
  PATH_ARTWORKS_SCRAPED_FROM_SAN_JOSE_SITE: path.resolve(
    __dirname + '/../artwork-data/wip-artworks.json'
  ),
  PATH_CONSOLIDATED_ARTWORKS: path.resolve(__dirname + '/../ar')
};
