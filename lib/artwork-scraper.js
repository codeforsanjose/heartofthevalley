const readline = require('readline');
const fs = require('fs');
const normalizeArtworks = require('./normalize-artworks');
const path = require('path');

module.exports = class ArtworkScraper {
  constructor(pathOutputFile, host, url, httpBody) {
    this.pathOutputFile = pathOutputFile;
    this.osmosis = require('osmosis');
    this.numScraped = 0;
    this.numErrors = 0;
    this.artworks = [];
    this.url = url;
    this.httpBody = httpBody;
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
   * @param {String=null} singleArtworkURL If passed, only the single page will be scraped, overriding any data set in constructor.
   */
  scrapeAndWriteData(singleArtworkURL = null) {
    const setMap = {
      // grab and store the appropriate details about the art work
      title: '.editorContent .Subhead1',
      artist: '.editorContent .Subhead2',
      streetAddress: '.street-address',
      city: '.locality',
      state: '.locality + .locality',
      postalCode: '.postal-code',
      rawDescription: '.editorContent'
    };

    console.log('scraping data...\n');

    if (singleArtworkURL) {
      return this.osmosis
        .get(singleArtworkURL)
        .set(setMap)
        .data(artwork => {
          this.storeArtworks(artwork);
        })
        .done(() => {
          this.cleanArtworks();
          this.normalizeArtworks();
          this.mergeInLegacyArt();
          this.writeData(this.createFeaturesCollection());
        });
    }

    return this.osmosis
      .post(this.url, this.httpBody)
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
        this.storeArtworks(artwork);
      })
      .done(() => {
        this.cleanArtworks();
        this.normalizeArtworks();
        this.mergeInLegacyArt();
        this.writeData(this.createFeaturesCollection());
      });
  }

  normalizeArtworks() {
    this.artworks = normalizeArtworks(this.artworks);
  }

  cleanArtworks() {
    readline.clearLine(process.stdout);
    readline.cursorTo(process.stdout, 0);
    console.log('\nscraping done.');
    console.log('formatting data...');
    this.artworks = this.artworks.map(artwork => {
      artwork = this.setTitleDateArtist(artwork);
      artwork = this.cleanCategoriesByRules(artwork);
      artwork = this.removeTitleDateArtistFromDescription(artwork);
      return artwork;
    });
  }

  writeData(data) {
    fs.writeFile(this.pathOutputFile, JSON.stringify(data), { flags: 'r+' }, err => {
      if (err) {
        throw err;
      }
      console.log(`\nArtworks scraped: ${this.numScraped}`);
      console.log(`Errors in formatting: ${this.numErrors}`);
      console.log(`\nData written to '${this.pathOutputFile}'`);
    });
  }

  storeArtworks(artwork) {
    readline.clearLine(process.stdout);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write('storing artwork number: ');
    process.stdout.write(String(++this.numScraped));
    this.artworks.push(artwork);
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
    const cloneArtwork = Object.assign({}, artwork);
    const { description, title, artist, creationDate } = cloneArtwork;
    let cleanedDescription = description;
    [title, artist, creationDate].forEach(category => {
      cleanedDescription = cleanedDescription.replace(category, '');
    });
    if (!title || !artist || !creationDate) {
      this.numErrors++;
      cloneArtwork.error = true;
    }
    cloneArtwork.description = cleanedDescription.trim();
    return Object.assign(cloneArtwork, { title, artist, creationDate });
  }

  mergeInLegacyArt() {
    const legacyArt = require('../js/art.js').features.map(art => {
      const properties = Object.assign(art.properties, {
        sourceOfInformation: 'San Jose Art',
        sourceURL: null
      });

      return Object.assign({}, art, { properties });
    });
    this.artworks = [legacyArt, this.artworks].reduce((previousArtwork, currentArtwork) => {
      return previousArtwork.concat(currentArtwork);
    }, []);
  }

  createFeaturesCollection() {
    return Object.assign({ type: 'FeatureCollection', features: this.artworks });
  }
};
