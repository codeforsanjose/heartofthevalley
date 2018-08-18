const PATHS = require('../config/file-paths');
const scrapedArtworks = require(PATHS.PATH_SCRAPED_ARTWORKS);
const overriddenArtworks = require(PATHS.PATH_ARTWORKS_OVERRIDES);

let map = {};
let notMatched = [];

for (let artwork of scrapedArtworks) {
  const { id } = artwork;
  map[id] = artwork;
}

let numMatches = 0;
for (let artwork of overriddenArtworks) {
  const { id } = artwork;

  if (map[id]) {
    numMatches++;
    console.log(`artwork found in both files ${artwork.properties.title}, id: ${id}`);
    continue;
  }

  notMatched.push(artwork);
}

console.log(`total matches: ${numMatches}`);
console.log('');

for (let artwork of notMatched) {
  console.log(`not matched: ${artwork.properties.title}     ${artwork.id}`);
}
