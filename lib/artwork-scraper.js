const fs = require('fs');
const GeocodingService = require('./geocoding-service');
const CONSTANTS = require('../config/constants');
let legacyArt = require(CONSTANTS.PATH_LEGACY_ARTWORKS);
const Artwork = require('./artwork');

class ArtworkScraper {
  static writeData(data, path) {
    return new Promise(resolve => {
      fs.writeFile(path, JSON.stringify(data), { flags: 'r+' }, err => {
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

    artworkFilePaths.forEach(filePath => {
      console.log(`Merging in artworks from file: '${filePath}'`);
      const file = require(filePath);
      const fileArtworks = file.features || file;
      console.log(`Num artworks: ${fileArtworks.length}`);
      fileArtworks.forEach(artwork => {
        let { id } = artwork;

        if (!id) {
          throw `${artwork.properties.title} is missing an ID!`;
        }

        if (map[id]) {
          numOverrides++;
        }
        map[id] = artwork;
      });
    });

    for (let id in map) {
      artworks.push(map[id]);
    }

    console.log(`Num overrides: ${numOverrides}`);
    console.log(`Total artworks to write: ${artworks.length}`);

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

    this.legacyArtMap = legacyArt.reduce((map, art) => {
      map[art.properties.title] = true;
      return map;
    }, {});
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
        return ArtworkScraper.writeData(artworks, CONSTANTS.PATH_SCRAPED_ARTWORKS);
      })
      .then(() => {
        console.log(`Artworks scraped written to file: '${CONSTANTS.PATH_SCRAPED_ARTWORKS}'`);
      })
      .then(() => {
        console.log(`Artworks with errors: ${artworkErrors.length}`);
        return ArtworkScraper.writeData(artworkErrors, CONSTANTS.PATH_SCRAPED_ARTWORKS_ERRORS);
      })
      .then(() => {
        console.log(
          `Artworks scraping errors written to file: '${CONSTANTS.PATH_SCRAPED_ARTWORKS_ERRORS}'`
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
            sourceOfInformation: 'http://sanjoseca.gov/Facilities',
            image: artwork.image ? CONSTANTS.URL_SAN_JOSE_GOV + artwork.image : null
          });
          artwork = new Artwork(artwork);
          artworks.push(artwork);
        })
        .done(() => {
          resolve(artworks);
        });
    }).then(artworks => {
      console.log('\nScraping done.');
      console.log('Formatting data and gathering geolocations.');

      const promises = artworks.reduce((arr, artwork) => {
        artwork.cleanArtist();
        artwork.cleanTitle();
        artwork.cleanDescription();

        if (
          artwork.properties.title.toLowerCase() !== 'untitled' &&
          this.legacyArtMap[artwork.properties.title]
        ) {
          // already found in legacy art file, let's skip.
          console.log(
            `Artwork already exists in legacy file, will not store: "${artwork.properties.title}"`
          );
          return arr;
        }
        this.numScraped++;
        artwork.id = id;
        id++;

        console.log(`Finding geolocation for '${artwork.properties.title}'`);
        const promise = GeocodingService.getGeolocationForArtwork(artwork)
          .then(geolocation => {
            artwork.geometry.coordinates = [geolocation.long, geolocation.lat];
          })
          .catch(e => {
            console.error(
              `\nError finding geolocation for '${artwork.properties.title}'; query '${
                artwork.postalAddress
              }'\n${e}`
            );
          })
          .then(() => {
            artwork.documentErrors();
            return artwork;
          });

        arr.push(promise);
        return arr;
      }, []);

      return Promise.all(promises).catch(console.error);
    });
  }
}

module.exports = ArtworkScraper;
