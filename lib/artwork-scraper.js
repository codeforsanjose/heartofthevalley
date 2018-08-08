const fs = require('fs');
const GeocodingService = require('./geocoding-service');
const CONSTANTS = require('../config/constants');
let legacyArt = require('../artwork-data/art.js');

class Artwork {
  constructor(data) {
    this.type = 'Feature';
    this.geometry = { type: 'Point', coordinates: data.coordinates || null };

    // const rawDescription = JSON.stringify(data.rawDescription);
    const rawDescription = data.rawDescription;
    this.properties = {
      title: data.title,
      artist: this.getArtistFromDescription(rawDescription),
      address: data.streetAddress,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      image: data.image,
      rawDescription,
      description: rawDescription,
      sourceURL: data.sourceURL,
      sourceOfInformation: data.sourceOfInformation
    };
  }

  get postalAddress() {
    const { address, city, state, postalCode } = this.properties;
    return `${address}, ${city}, ${state} ${postalCode}`;
  }

  toObject() {
    const { type, geometry, properties, errors } = this;
    let base = { type, geometry, properties };
    if (errors && errors.length > 0) {
      base = Object.assign(base, { errors });
    }

    return base;
  }

  id() {
    return `${this.properties.artist}:${this.properties.title}`;
  }

  getArtistFromDescription(description) {
    const match = description.match(/artists?:(.*)(.|\r|\n)/i);
    return match ? match[1].trim() : null;
  }

  documentErrors() {
    const errors = ['title', 'artist', 'description'].reduce((errors, key) => {
      if (!this.properties[key]) {
        errors.push(key);
      }
      return errors;
    }, []);

    if (!this.geometry.coordinates) {
      errors.push('coordinates');
    }

    if (errors.length > 0) {
      this.errors = errors;
    }
  }

  cleanDescription() {
    let { description } = this.properties;
    if (!description) {
      return;
    }

    [/District\r\n(.|\r|\n)*/gm, /(.|\r|\n)*?\d{4}(?=\D)/].forEach(rule => {
      if (description) {
        description = description.replace(rule, '');
      }
    });
    this.properties.description = description.trim();
  }

  cleanArtist() {
    let { artist } = this.properties;
    if (!artist) {
      return;
    }

    [/artists?.*:/i, /\d+/, /\r\n/gm].forEach(rule => {
      if (artist) {
        artist = artist.replace(rule, '');
      }
    });
    this.properties.artist = artist.trim();
  }

  cleanTitle() {
    let { title } = this.properties;

    if (!title) {
      return;
    }

    [/public art:/i, /\r\n/gm, /\(.*\)\*?/].forEach(rule => {
      if (title) {
        title = title.replace(rule, '');
      }
    });
    this.properties.title = title.trim();
  }
}

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
