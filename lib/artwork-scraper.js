const fs = require('fs');
const GeocodingService = require('./geocoding-service');
const CONSTANTS = require('../config/constants');
const PATHS = require('../config/file-paths');
const Artwork = require('./artwork');

class ArtworkScraper {
  
  static writeData(data, path) {
    return new Promise(resolve => {
      fs.writeFile(path, JSON.stringify(data, null, 2), { flags: 'r+' }, err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    }).catch(console.error);
  }

  static mergeArtworksIntoFile(destinationPath, artworkFilePaths) {
    const artworks = [];
    const map = {};
    let numOverrides = 0;
    let numIgnored = 0;

    artworkFilePaths.forEach(filePath => {
      console.log(`Merging in artworks from file: '${filePath}'`);
      const file = require(filePath);
      const fileArtworks = file.features || file;
      console.log(`Num artworks: ${fileArtworks.length}`);
      for (let artwork of fileArtworks) {
        if (artwork.ignore) {
          numIgnored++;
          continue;
        }

        if (artwork.properties.rawDescription) {
          delete artwork.properties.rawDescription;
        }

        if (!artwork.id) {
          console.log(`${artwork.properties.title} is missing an ID!`);
        }
        artwork.id = Artwork.generateID(artwork.properties.artist, artwork.properties.title, artwork.properties.sourceURL);

        if (map[artwork.id]) {
          console.log(`'${map[artwork.id].properties.title}' was overriden`);
          numOverrides++;
        }
        map[artwork.id] = artwork;
      }
    });

    for (let id in map) {
      artworks.push(map[id]);
    }

    console.log(`Num overrides: ${numOverrides}`);
    console.log(`Num ignored: ${numIgnored}`);
    console.log(`Total artworks to write: ${artworks.length}`);

    artworks.sort((a, b) => a.properties.title.localeCompare(b.properties.title));
    return ArtworkScraper.writeData(
      { type: 'FeatureCollection', features: artworks },
      destinationPath
    ).then(() => {
      console.log(`Merging done! Data written to file: '${destinationPath}'`);
    });
  }

  constructor({ numArtworksToScrape, startID }) {
    if (!startID) {
      throw 'Must denote a starting ID before scraping!';
    }

    this.numArtworksToScrape = numArtworksToScrape || 1;
    this.numScraped = 0;
    this.startID = startID;

  }

  get query() {
    return `featureIDs=&categoryIDs=15&occupants=null&keywords=&pageSize=${
      this.numArtworksToScrape
    }&pageNumber=1&sortBy=3&currentLatitude=null&currentLongitude=null&isReservableOnly=false`;
  }

  run() {
    let artworks = [];
    let artworkErrors = [];

    return this.scrapeArtworks()
      .then(results => {
        results.forEach(artwork => {
          artwork.errors && artwork.errors.length > 0
            ? artworkErrors.push(artwork)
            : artworks.push(artwork);
        });

        console.log(`\nArtworks scraped without errors: ${this.numScraped - artworkErrors.length}`);
        return ArtworkScraper.writeData(artworks, PATHS.PATH_SCRAPED_ARTWORKS);
      })
      .then(() => {
        console.log(`Artworks scraped written to file: '${PATHS.PATH_SCRAPED_ARTWORKS}'`);
      })
      .then(() => {
        console.log(`Artworks with errors: ${artworkErrors.length}`);
        return ArtworkScraper.writeData(artworkErrors, PATHS.PATH_SCRAPED_ARTWORKS_ERRORS);
      })
      .then(() => {
        console.log(
          `Artworks scraping errors written to file: '${PATHS.PATH_SCRAPED_ARTWORKS_ERRORS}'`
        );
      })
      .then(() => {
        console.log('All Done!');
      })
      .catch(console.error);
  }

  scrapeArtworks() {
    const setMap = {
      // grab and store the appropriate details about the artwork
      title: '.details h2',
      streetAddress: '.street-address',
      city: '.locality',
      state: '.locality + .locality',
      postalCode: '.postal-code',
      rawDescription: '.editorContent',
      image: 'ol li img@src'
    };

    let artworks = [];

    console.log('scraping data...\n');
    let id = this.startID;

    return new Promise(resolve => {
      require('osmosis')
        .post(CONSTANTS.URL_SEARCH, this.query)
        .find('h3 > a') // selector for links to indivdual pages about art work
        .set({ sourceURL: '@href' })
        .then((_content, data) => {
          data.sourceURL = CONSTANTS.URL_SAN_JOSE_GOV + data.sourceURL;
        })
        .follow('@href') // follow link to individual page about the art work
        .set(setMap)
        .data(artwork => {
          console.log(`Scraping artwork url: ${artwork.sourceURL}`);
          artwork = Object.assign(artwork, {
            sourceOfInformation: 'https://sanjoseca.gov/Facilities',
            image: artwork.image ? CONSTANTS.URL_SAN_JOSE_GOV + artwork.image : null
          });
          artwork = new Artwork(artwork);
          artwork.getArtistFromDescription();
          artwork.cleanArtist();
          artwork.cleanTitle();
          artwork.cleanDescription();
          artwork.generateID();
          console.log('Generated id for artwork:\ntitle: '+ artwork.properties.title+
            "\nartist: "+artwork.properties.artist+
            "\nurl: "+artwork.properties.sourceURL+
            "\nid: "+artwork.id)
          artworks.push(artwork);
          this.numScraped++;
        })
        .done(() => {
          resolve(artworks);
        });
    });
  }
}

module.exports = ArtworkScraper;
