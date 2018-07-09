module.exports = class ArtworkScraper {
  constructor(pathOutputFile, host, url, httpBody) {
    this.pathOutputFile = pathOutputFile;
    this.osmosis = require('osmosis');
    this.counter = 0;
    this.artworks = [];
    this.url = url;
    this.httpBody = httpBody;
    this.host = host;

    /**
     * Used for matching text content to be remov =>d.
     * key - artwork category
     * value - regex rules or function
     */
    this.CLEAN_UP_RULES = {
      artist: [/artists*:/i, /\d+/],
      title: [/\r\n/gm],
      description: [
        /report a concern/i,
        '(408) 793-4330',
        'publicart@sanjoseca.gov',
        /[\r\n]+/gm,
        /District.*/g // To remove HTML styling data at end of description
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
      description: '.editorContent'
    };

    console.log('scraping data...');

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
    console.log('scraping done.');
    console.log('formatting data...');
    const cleanedArtworks = [];
    for (let artwork of this.artworks) {
      Object.assign(artwork, { description: this.cleanDescriptionByRules(artwork) });
      Object.assign(artwork, this.getTitleYearArtists(artwork));
      Object.assign(artwork, { description: this.removeTitleArtistYearFromDescription(artwork) });
      cleanedArtworks.push(artwork);
    }
    this.artworks = cleanedArtworks;
  }

  writeData() {
    const _this = this;

    require('fs').writeFile(
      _this.pathOutputFile,
      JSON.stringify(this.artworks),
      { flags: 'r+' },
      err => {
        if (err) {
          throw error;
        }
      }
    );
    console.log(`Data successfully written to '${this.pathOutputFile}'`);
  }

  /**
   * @param {String} s
   * @param {String} ruleCategory
   * @return {String}
   */
  cleanByRules(s, ruleCategory) {
    let cleanString = s;
    const rules = this.CLEAN_UP_RULES[ruleCategory];
    if (!rules) {
      throw 'No rules defined for that category type';
    }

    rules.forEach(rule => {
      cleanString = cleanString.replace(rule, '');
    });
    return cleanString;
  }

  storeArtworks(artwork) {
    console.log('artwork number: ', ++this.counter);
    this.artworks.push(artwork);
  }

  /**
   * @param {String} s
   * @return {String}
   */
  getTitle(s) {
    const match = s.match(/(.*)artists*:/i);
    return match && match[1] ? match[1].trim() : '';
  }

  /**
   * @param {String} s
   * @return {Number}
   */
  getYear(s) {
    const match = s.match(/artists*.*(\d{4})/i);
    return match && match[1] ? parseInt(match[1].trim()) : '';
  }

  /**
   * @param {String} s
   * @return {String}
   */
  getArtist(s) {
    const match = s.match(/artists*:(.*)\d{4}/i);
    return match && match[1] ? match[1].trim() : '';
  }

  /**
   * @param {Object} item
   * @return {Object}
   */
  getTitleYearArtists(item) {
    const { description } = item;
    return {
      title: this.getTitle(description),
      year: this.getYear(description),
      artist: this.getArtist(description)
    };
  }

  cleanDescriptionByRules(item) {
    const { title, year, artists, description } = item;
    let cleanedDescription = this.cleanByRules(description, 'description');
    [(title, year, artists)].forEach(prop => {
      if (prop) {
        cleanedDescription = cleanedDescription.replace(prop, '');
      }
    });
    return cleanedDescription.trim();
  }

  removeTitleArtistYearFromDescription(item) {
    const { description, title, artist, year } = item;
    let cleanedDescription = description;
    if (title && artist && year) {
      [title, artist, year].forEach(category => {
        cleanedDescription = cleanedDescription.replace(category, '');
      });
    } else {
      console.error(
        `Error attempting to remove title, artist and year from description of artwork:`
      );
      console.error();
      console.error(`Title:`);
      console.error(`${item.title}`);
      console.error();
      console.error(`URL:`);
      console.error(`${item.url}`);
      console.error();
    }

    cleanedDescription = cleanedDescription.replace(/artists*:/i, '');
    return cleanedDescription.trim();
  }
};
