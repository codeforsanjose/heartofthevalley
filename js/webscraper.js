const readline = require('readline');
const PATH_OUTPUT_FILE = 'wip_artworks.json';
const ArtworkScraper = require('./artwork-scraper');
const numArtworksToScrape = 2; // number of artwork listings per page
const categoryIDs = 15; // categoryID = 15 is category for 'public art'
const httpBody = `featureIDs=&categoryIDs=${categoryIDs}&occupants=null&keywords=&pageSize=${numArtworksToScrape}&pageNumber=1&sortBy=3&currentLatitude=null&currentLongitude=null&isReservableOnly=false`;
const HOST = 'http://sanjoseca.gov';
const URL = `${HOST}/Facilities/Facility/Search`;

(function main() {
  let readlineInterface;
  const DEBUG_MODE = true; // Debug mode skips terminal prompt; necessary if running the program through IDE debugger.

  new Promise((resolve, reject) => {
    if (DEBUG_MODE) {
      return resolve();
    }

    readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readlineInterface.question(
      `This action will overwrite '${PATH_OUTPUT_FILE}' if it exists. Are you sure you want to continue?\n`,
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
      new ArtworkScraper(PATH_OUTPUT_FILE, HOST, URL, httpBody).scrapeAndWriteData();
    })
    .catch(err => {
      throw err
      console.log('aborted.');
      if (!DEBUG_MODE) {
        readlineInterface.close();
      }
    });
})();
