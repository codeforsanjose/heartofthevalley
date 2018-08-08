const fs = require('fs');
const GeocodingService = require('./geocoding-service');
const CONSTANTS = require('../config/constants');
let legacyArt = require('../artwork-data/art');
const Artwork = require('./artwork');

class ArtworkScraper {
  constructor(pathOutputFile, host, url, query) {
    this.pathOutputFile = pathOutputFile;
    this.osmosis = require('osmosis');
    this.numScraped = 0;
    this.numStored = 0;
    this.numErrors = 0;
    this.artworks = [];
    this.url = url;
    this.query = query;
    this.host = host;
  }

  /**
   * @method scrapeAndWriteData
   */
  scrapeAndWriteData() {
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

    new Promise(resolve => {
      this.osmosis
        .post(this.url, this.query)
        .find('h3 > a') // selector for links to indivdual pages about art work
        .set({ sourceURL: '@href' })
        .then((_content, data) => {
          data.sourceURL = this.host + data.sourceURL;
        })
        .follow('@href') // follow link to individual page about the art work
        .set(setMap)
        .data(artwork => {
          console.log(`Scraping artwork url: ${artwork.sourceURL}`);
          artwork = new Artwork(artwork);
          artwork.properties.sourceOfInformation = 'http://sanjoseca.gov/Facilities';
          artwork.properties.image = artwork.properties.image
            ? CONSTANTS.URL_SAN_JOSE_GOV + artwork.properties.image
            : null;
          ++this.numScraped;
          artworks.push(artwork);
        })
        .done(() => {
          resolve(artworks);
        });
    })
      .then(artworks => {
        console.log('\nscraping done.');
        console.log('formatting data...');

        return artworks.reduce((arr, artwork) => {
          artwork.cleanArtist();
          artwork.cleanTitle();
          artwork.cleanDescription();

          if (legacyArtMap[artwork.properties.title]) {
            // already found in legacy art file, let's skip.
            console.log(
              `"${artwork.properties.title}" already exists in legacy file. Will not store.`
            );
            return arr;
          }

          console.log(`Storing artwork number: ${++this.numStored}`);
          arr.push(artwork);
          return arr;
        }, []);
      })
      .then(artworks => {
        const promises = artworks.map(artwork => {
          return GeocodingService.setGeolocationForArtwork(artwork);
        });
        return Promise.all(promises);
      })
      .then(artworks => {
        artworks.forEach(artwork => {
          artwork.documentErrors();

          if (artwork.errors && artwork.errors.length > 0) {
            this.numErrors++;
          }
        });

        artworks = this.mergeInLegacyArt(artworks);
        return this.writeData({ type: 'FeatureCollection', features: artworks });
      })
      .catch(console.error);
  }

  writeData(data) {
    return new Promise(resolve => {
      fs.writeFile(this.pathOutputFile, JSON.stringify(data), { flags: 'r+' }, err => {
        if (err) {
          throw err;
        }
        console.log(`\nArtworks scraped: ${this.numScraped}`);
        console.log(`\nArtworks stored: ${this.numStored}`);
        console.log(`\nLegacy artworks merged: ${this.numScraped - this.numStored}`);
        console.log(`\nTotal artworks written to file: ${this.numScraped}`);
        console.log(`Errors in formatting: ${this.numErrors}`);
        console.log(`\nData written to '${this.pathOutputFile}'`);
        resolve(data);
      });
    }).then(data => {
      const artworkErrors = data.features.filter(
        artwork => artwork.errors && artwork.errors.length > 0
      );

      fs.writeFile(
        CONSTANTS.PATH_ARTWORKS_ERRORS,
        JSON.stringify(artworkErrors),
        { flags: 'r+' },
        err => {
          if (err) {
            throw err;
          }
          console.log(
            `${artworkErrors.length} errors written to ${CONSTANTS.PATH_ARTWORKS_ERRORS}`
          );
        }
      );
    });
  }

  mergeInLegacyArt(artworks) {
    try {
      legacyArt.features = legacyArt.features.map(artwork => {
        artwork.sourceOfInformation = 'San Jose Art';
        artwork.sourceURL = null;
        return artwork;
      });
    } catch (e) {
      // In case file is missing, for example.
      console.error(e);
      legacyArt = [];
    }
    artworks = artworks.map(artwork => artwork.toObject());

    return legacyArt.features.concat(artworks);
  }
}

const legacyArtMap = legacyArt.features.reduce((map, art) => {
  map[art.properties.title] = true;
  return map;
}, {});

module.exports = ArtworkScraper;
