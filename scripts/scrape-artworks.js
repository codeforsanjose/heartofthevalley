const readline = require('readline');
const CONSTANTS = require('../config/constants');
const ArtworkScraper = require('../lib/artwork-scraper');

// Config
const numArtworksToScrape = 300; // number of artwork listings per page
const categoryIDs = 15; // categoryID = 15 is category for 'public art'
const httpBody = `featureIDs=&categoryIDs=${categoryIDs}&occupants=null&keywords=&pageSize=${numArtworksToScrape}&pageNumber=1&sortBy=3&currentLatitude=null&currentLongitude=null&isReservableOnly=false`;
const HOST = 'http://sanjoseca.gov';
const URL = `${HOST}/Facilities/Facility/Search`;
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
      `This action will overwrite '${CONSTANTS.PATH_ARTWORKS_LIST}' if it exists. Are you sure you want to continue?\n`,
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
      new ArtworkScraper(CONSTANTS.PATH_ARTWORKS_LIST, HOST, URL, httpBody).scrapeAndWriteData();
    })
    .catch(err => {
      err ? console.error(err) : null;
      console.log('aborted.');
      if (!DEBUG_MODE) {
        readlineInterface.close();
      }
    });
})();
