const CONSTANTS = require('../config/constants');
const allArtworks = require(CONSTANTS.PATH_CONSOLIDATED_ARTWORKS);

const mapArtist = allArtworks.features.reduce((map, artwork) => {
  const { artist } = artwork.properties;

  if (map[artist]) {
    map[artist]++;
  } else {
    map[artist] = 1;
  }
  return map;
}, {});

const mapTitle = allArtworks.features.reduce((map, artwork) => {
  const { title } = artwork.properties;

  if (map[title]) {
    map[title]++;
  } else {
    map[title] = 1;
  }
  return map;
}, {});

// for (let artist in map) {
//   if (map[artist] > 1) {
//     console.log(`${artist} occurs ${map[artist]} times`);
//   }
// }

// for (let title in mapTitle) {
//   if (mapTitle[title] > 1) {
//     console.log(`${title} occurs ${mapTitle[title]} times`);
//   }
// }
