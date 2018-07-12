const readline = require('readline');
const fs = require('fs');

module.exports = class ArtworkScraper {
  constructor(pathOutputFile, host, url, httpBody) {
    this.pathOutputFile = pathOutputFile;
    this.osmosis = require('osmosis');
    this.counter = 0;
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
   * @param {String=null} singleArtworkUrl If passed, only the single page will be scraped, overriding any data set in constructor.
   */
  scrapeAndWriteData(singleArtworkUrl = null) {
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

    if (singleArtworkUrl) {
      return this.osmosis
        .get(singleArtworkUrl)
        .set(setMap)
        .data(artwork => {
          this.storeArtworks(artwork);
        })
        .done(() => {
          this.cleanArtworks();
          this.writeData();
        });
    }

    return this.osmosis
      .post(this.url, this.httpBody)
      .find('h3 > a') // selector for links to indivdual pages about art work
      .set({ url: '@href' })
      .then((_content, data) => {
        data.url = this.host + data.url;
      })
      .follow('@href') // follow link to individual page about the art work
      .set(setMap)
      .data(artwork => {
        this.storeArtworks(artwork);
      })
      .done(() => {
        this.cleanArtworks();
        this.writeData();
      });
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

  writeData() {
    fs.writeFile(this.pathOutputFile, JSON.stringify(this.artworks), { flags: 'r+' }, err => {
      if (err) {
        throw err;
      }
      console.log(`\nArtworks scraped: ${this.counter}`);
      console.log(`Errors in formatting: ${this.numErrors}`);
      console.log(`\nData written to '${this.pathOutputFile}'`);
    });
  }

  storeArtworks(artwork) {
    readline.clearLine(process.stdout);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write('storing artwork number: ');
    process.stdout.write(String(++this.counter));
    artwork.description = artwork.rawDescription;
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
   * @param {Object} item
   * @return {Object}
   */
  setTitleDateArtist(item) {
    let { description } = item;
    description = description.split('\r\n');
    return Object.assign({}, item, {
      title: this.getTitle(description),
      creationDate: this.getCreationDate(description),
      artist: this.getArtist(description)
    });
  }

  cleanCategoriesByRules(item) {
    let cleanedItem = {};
    for (let category in item) {
      cleanedItem[category] = item[category];
      if (!cleanedItem[category]) {
        continue;
      }
      const rules = this.CLEAN_UP_RULES[category];
      if (rules) {
        for (let rule of rules) {
          cleanedItem[category] = cleanedItem[category].replace(rule, '');
        }
        cleanedItem[category] = cleanedItem[category].trim();
      }
    }
    return cleanedItem;
  }

  removeTitleDateArtistFromDescription(item) {
    const cloneItem = Object.assign({}, item);
    const { description, title, artist, creationDate } = cloneItem;
    let cleanedDescription = description;
    [title, artist, creationDate].forEach(category => {
      cleanedDescription = cleanedDescription.replace(category, '');
    });
    if (!title || !artist || !creationDate) {
      this.numErrors++;
      cloneItem.error = true;
    }
    cloneItem.description = cleanedDescription.trim();
    return Object.assign(cloneItem, { title, artist, creationDate });
  }
};
