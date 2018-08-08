const readline = require('readline');
const CONSTANTS = require('../config/constants');
const ArtworkScraper = require('../lib/artwork-scraper');

const DEBUG_MODE = false;

(function main() {
  let readlineInterface;

  new Promise((resolve, reject) => {
    console.log(`Debug mode is: ${DEBUG_MODE ? 'on' : 'off'}`);
    if (DEBUG_MODE) {
      return resolve();
    }

    readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readlineInterface.question(
      `This action will overwrite the public file: '${
        CONSTANTS.PATH_CONSOLIDATED_ARTWORKS
      }' if it exists. Are you sure you want to continue?\n`,
      answer => {
        answer = answer.toLowerCase();
        if (answer === 'yes' || answer === 'y') {
          return resolve();
        }
        reject('Aborted.');
      }
    );
  })
    .then(() => {
      return ArtworkScraper.mergeArtworksIntoFile(CONSTANTS.PATH_CONSOLIDATED_ARTWORKS, [
        CONSTANTS.PATH_LEGACY_ARTWORKS,
        CONSTANTS.PATH_SCRAPED_ARTWORKS,
        CONSTANTS.PATH_ARTWORKS_OVERRIDES
      ]);
    })
    .catch(err => {
      console.error(err);
    })
    .then(() => {
      if (readlineInterface) {
        readlineInterface.close();
      }
    });
})();
