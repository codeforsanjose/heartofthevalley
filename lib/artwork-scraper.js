const readline = require('readline');
const fs = require('fs');
const GeocodingService = require('./geocoding-service');
const CONSTANTS = require('../config/constants');

class ArtworkScraper {
  constructor(pathOutputFile, host, url, query) {
    this.pathOutputFile = pathOutputFile;
    this.osmosis = require('osmosis');
    this.numScraped = 0;
    this.numErrors = 0;
    this.artworks = [];
    this.url = url;
    this.query = query;
    this.host = host;

    /**
     * Used for matching text content to be removed.
     * key - artwork category
     * value - regex rules or function
     */
    this.CLEAN_UP_RULES = {
      artist: [/artists*:/i, /\d+/, /\r\n/gm],
      title: [/artists*:/i, /\r\n/gm],
      description: [
        /artists*:/i,
        /report a concern/i,
        '(408) 793-4330',
        'publicart@sanjoseca.gov',
        /\r\n/gm,
        /District.*/gm // To remove HTML styling data at end of description
      ]
    };
  }

  /**
   * @method scrapeAndWriteData
   */
  scrapeAndWriteData() {
    const setMap = {
      // grab and store the appropriate details about the art work
      title: '.editorContent .Subhead1',
      artist: '.editorContent .Subhead2',
      streetAddress: '.street-address',
      city: '.locality',
      state: '.locality + .locality',
      postalCode: '.postal-code',
      rawDescription: '.editorContent',
      image: 'ol li img@src'
    };

    console.log('scraping data...\n');

    return new Promise(resolve => {
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
          artwork.sourceOfInformation = 'http://sanjoseca.gov/Facilities';
          artwork.description = artwork.rawDescription;
          artwork.image = artwork.image ? CONSTANTS.URL_SAN_JOSE_GOV + artwork.image : null;
          readline.clearLine(process.stdout);
          readline.cursorTo(process.stdout, 0);
          process.stdout.write('storing artwork number: ');
          process.stdout.write(String(++this.numScraped));
          this.artworks.push(artwork);
        })
        .done(resolve);
    })
      .then(() => {
        return this.setGeolocation();
      })
      .then(artworks => {
        readline.clearLine(process.stdout);
        readline.cursorTo(process.stdout, 0);
        console.log('\nscraping done.');
        console.log('formatting data...');

        this.artworks = artworks.map(artwork => {
          artwork = this.cleanArtwork(artwork);
          artwork = this.documentErrors(artwork);
          if (artwork.errors && artwork.errors.length > 0) {
            this.numErrors++;
          }
          return this.normalizeArtwork(artwork);
        });
        this.mergeInLegacyArt();
        return this.writeData(this.createFeaturesCollection());
      });
  }

  setGeolocation() {
    return GeocodingService.setGeolocationForArtworks(this.artworks);
  }

  cleanArtwork(artwork) {
    artwork = this.setTitleDateArtist(artwork);
    artwork = this.cleanCategoriesByRules(artwork);
    artwork = this.removeTitleDateArtistFromDescription(artwork);
    return artwork;
  }

  writeData(data) {
    return new Promise(resolve => {
      fs.writeFile(this.pathOutputFile, JSON.stringify(data), { flags: 'r+' }, err => {
        if (err) {
          throw err;
        }
        console.log(`\nArtworks scraped: ${this.numScraped}`);
        console.log(`Errors in formatting: ${this.numErrors}`);
        console.log(`\nData written to '${this.pathOutputFile}'`);
        resolve();
      });
    });
  }

  getTitle(words) {
    return words[0] || null;
  }

  getCreationDate(words) {
    return words[2] || null;
  }

  getArtist(words) {
    return words[1] || null;
  }

  /**
   * @param {Object} artwork
   * @return {Object}
   */
  setTitleDateArtist(artwork) {
    let { description } = artwork;
    description = description.split('\r\n');
    return Object.assign({}, artwork, {
      title: this.getTitle(description),
      creationDate: this.getCreationDate(description),
      artist: this.getArtist(description)
    });
  }

  cleanCategoriesByRules(artwork) {
    let cleanedArtwork = {};
    for (let category in artwork) {
      cleanedArtwork[category] = artwork[category];
      if (!cleanedArtwork[category]) {
        continue;
      }
      const rules = this.CLEAN_UP_RULES[category];
      if (rules) {
        for (let rule of rules) {
          cleanedArtwork[category] = cleanedArtwork[category].replace(rule, '');
        }
        cleanedArtwork[category] = cleanedArtwork[category].trim();
      }
    }
    return cleanedArtwork;
  }

  removeTitleDateArtistFromDescription(artwork) {
    let cloneArtwork = Object.assign({}, artwork);
    const { description, title, artist, creationDate } = cloneArtwork;
    let cleanedDescription = description;
    [title, artist, creationDate].forEach(category => {
      cleanedDescription = cleanedDescription.replace(category, '');
    });
    cloneArtwork.description = cleanedDescription.trim();
    return Object.assign(cloneArtwork, { title, artist, creationDate });
  }

  documentErrors(artwork) {
    const cloneArtwork = Object.assign({}, artwork);
    const errors = [];
    const { title, artist, coordinates } = cloneArtwork;
    if (!title) {
      errors.push({ type: 'title' });
    }
    if (!artist) {
      errors.push({ type: 'artist' });
    }
    if (!coordinates || coordinates.__proto__ !== Array.prototype) {
      errors.push({ type: 'coordinates' });
    }
    cloneArtwork.errors = errors;
    return cloneArtwork;
  }

  mergeInLegacyArt() {
    let legacyArt;
    try {
      legacyArt = require('../artwork-data/art.js').features.map(art => {
        const properties = Object.assign(art.properties, {
          sourceOfInformation: 'San Jose Art',
          sourceURL: null
        });

        return Object.assign({}, art, { properties });
      });
    } catch (e) {
      // In case file is missing, for example.
      console.error(e);
      legacyArt = [];
    }
    this.artworks = [legacyArt, this.artworks].reduce((previousArtwork, currentArtwork) => {
      return previousArtwork.concat(currentArtwork);
    }, []);
  }

  createFeaturesCollection() {
    return Object.assign({ type: 'FeatureCollection', features: this.artworks });
  }

  normalizeArtwork(artwork) {
    const base = artwork.errors.length > 0 ? { errors: artwork.errors } : {};

    return Object.assign(base, {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: artwork.coordinates },
      properties: {
        address: artwork.streetAddress,
        artist: artwork.artist,
        city: artwork.city,
        country: artwork.country,
        description: artwork.description,
        image: artwork.image || null,
        postalCode: artwork.postalCode,
        rawDescription: artwork.rawDescription,
        sourceOfInformation: artwork.sourceOfInformation,
        sourceURL: artwork.sourceURL,
        state: artwork.state,
        title: artwork.title
      }
    });
  }
}

module.exports = ArtworkScraper;
