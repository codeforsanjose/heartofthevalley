const readline = require('readline');
const CONSTANTS = require('../config/constants');
const ArtworkScraper = require('../lib/artwork-scraper');

// Config the scraper
const NUM_ARTWORKS_TO_SCRAPE = 300; // number of artwork listings per page, as of 7/16/18, there are 128 artwork pages at http://sanjoseca.gov/Facilities
const CATEGORY_IDS = 15; // categoryID = 15 is category for 'public art', likely will never need to change.
const QUERY = `featureIDs=&categoryIDs=${CATEGORY_IDS}&occupants=null&keywords=&pageSize=${NUM_ARTWORKS_TO_SCRAPE}&pageNumber=1&sortBy=3&currentLatitude=null&currentLongitude=null&isReservableOnly=false`;
const DEBUG_MODE = false; // Debug mode skips terminal prompt; necessary if running the program through IDE .

(function main() {
  let readlineInterface;

  new Promise((resolve, reject) => {
    if (DEBUG_MODE) {
      return resolve();
    }

    readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readlineInterface.question(
      `This action will overwrite '${
        CONSTANTS.PATH_ARTWORKS_LIST
      }' if it exists. Are you sure you want to continue?\n`,
      answer => {
        answer = answer.toLowerCase();
        if (answer === 'yes' || answer === 'y') {
          return resolve();
        }
        reject();
      }
    );
  })
    .then(() => {
      if (!DEBUG_MODE) {
        readlineInterface.close();
      }
      new ArtworkScraper(
        CONSTANTS.PATH_ARTWORKS_LIST,
        CONSTANTS.URL_SAN_JOSE_GOV,
        `${CONSTANTS.URL_SAN_JOSE_GOV}/Facilities/Facility/Search`,
        QUERY
      ).scrapeAndWriteData();
    })
    .catch(err => {
      err ? console.error(err) : null;
      console.log('aborted.');
      if (!DEBUG_MODE) {
        readlineInterface.close();
      }
    });
})();
