const fs = require('fs');
const GeocodingService = require('./geocoding-service');
const CONSTANTS = require('../config/constants');
let legacyArt = require('../artwork-data/art');
const Artwork = require('./artwork');

class ArtworkScraper {
  constructor({ numArtworksToScrape, mergeOverrides }) {
    this.numArtworksToScrape = numArtworksToScrape || 1;
    this.numScraped = 0;
    this.numNewArtworks = 0;
    this.numErrors = 0;
    this.numLegacyArtworks = 0;
    this.numOverridenArtworks = 0;
    this.artworksOverridesMap = {};
    this.mergeOverrides = mergeOverrides || false;

    this.legacyArtMap = legacyArt.features.reduce((map, art) => {
      map[art.properties.title] = true;
      return map;
    }, {});

    if (this.mergeOverrides) {
      this.artworksOverrides = require(CONSTANTS.PATH_ARTWORKS_OVERRIDES);
      this.artworksOverridesMap = this.artworksOverrides.reduce((map, art) => {
        map[art.properties.sourceURL] = art;
        return map;
      }, {});
    }
  }

  get query() {
    return `featureIDs=&categoryIDs=15&occupants=null&keywords=&pageSize=${
      this.numArtworksToScrape
    }&pageNumber=1&sortBy=3&currentLatitude=null&currentLongitude=null&isReservableOnly=false`;
  }

  run() {
    return this.scrapeArtworks().then(artworks => {
      artworks = this.mergeInLegacyArt(artworks);
      if (this.mergeOverrides) {
        artworks = this.mergeInOverrides(artworks);
      }
      return this.writeData({ type: 'FeatureCollection', features: artworks });
    });
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
          if (this.mergeInOverrides && this.artworksOverridesMap[artwork.sourceURL]) {
            return console.log(`URL found in overrides file, skipping: '${artwork.sourceURL}'`);
          }

          console.log(`Scraping artwork url: ${artwork.sourceURL}`);
          artwork = Object.assign(artwork, {
            sourceOfInformation: 'http://sanjoseca.gov/Facilities',
            image: artwork.image ? CONSTANTS.URL_SAN_JOSE_GOV + artwork.image : null
          });
          artwork = new Artwork(artwork);
          ++this.numScraped;
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
        ++this.numNewArtworks;

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

            if (artwork.errors && artwork.errors.length > 0) {
              this.numErrors++;
            }
            return artwork;
          });

        arr.push(promise);
        return arr;
      }, []);

      return Promise.all(promises).catch(console.error);
    });
  }

  writeData(data) {
    return new Promise(resolve => {
      fs.writeFile(
        CONSTANTS.PATH_CONSOLIDATED_ARTWORKS,
        JSON.stringify(data),
        { flags: 'r+' },
        err => {
          if (err) {
            throw err;
          }
          console.log(`\nNew artworks that do not exist in 'art.js' file: ${this.numNewArtworks}`);
          console.log(`Legacy artworks merged: ${this.numLegacyArtworks}`);
          console.log(`Overriden artworks merged: ${this.numOverridenArtworks}`);
          console.log(
            `Total artworks: ${this.numNewArtworks +
              this.numLegacyArtworks +
              this.numOverridenArtworks}`
          );
          console.log(`All artworks written to: '${CONSTANTS.PATH_CONSOLIDATED_ARTWORKS}'`);
          resolve(data);
        }
      );
    }).then(data => {
      const artworkErrors = data.features.filter(
        artwork => artwork.errors && artwork.errors.length > 0
      );

      fs.writeFile(
        CONSTANTS.PATH_SCRAPED_ARTWORKS_ERRORS,
        JSON.stringify(artworkErrors),
        { flags: 'r+' },
        err => {
          if (err) {
            throw err;
          }
          console.log(
            `${artworkErrors.length} scraped errors written to: '${
              CONSTANTS.PATH_SCRAPED_ARTWORKS_ERRORS
            }'`
          );
        }
      );
    });
  }

  mergeInLegacyArt(artworks) {
    legacyArt.features = legacyArt.features.map(artwork => {
      this.numLegacyArtworks++;
      artwork.sourceOfInformation = 'San Jose Art';
      artwork.sourceURL = null;
      return artwork;
    });

    artworks = artworks.map(artwork => artwork.toObject());
    return legacyArt.features.concat(artworks);
  }

  mergeInOverrides(artworks) {
    artworks = artworks.concat(this.artworksOverrides);
    this.numOverridenArtworks = this.artworksOverrides.length;
    return artworks;
  }
}

module.exports = ArtworkScraper;
