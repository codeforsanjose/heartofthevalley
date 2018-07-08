const readline = require('readline');
const osmosis = require('osmosis');
const fs = require('fs');
const PATH_OUTPUT_FILE = 'wip_artworks.json';

/**
 * Used for matching text content to be removed.
 * key - artwork category
 * value - regex rules or function.
 */
const CLEAN_UP_RULES = {
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

/**
 *
 * @param {String} s
 * @return {String}
 */
function getTitle(s) {
  const match = s.match(/(.*)artists*/i);
  return match && match[1] ? match[1].trim() : '';
}

/**
 *
 * @param {String} s
 * @return {Number}
 */
function getYear(s) {
  const match = s.match(/artists*.*(\d{4})/i);
  return match && match[1] ? parseInt(match[1].trim()) : '';
}

/**
 * @param {String} s
 * @return {String}
 */
function getArtist(s) {
  const match = s.match(/artists*:(.*)\d{4}/i);
  return match && match[1] ? match[1].trim() : '';
}

/**
 *
 * @param {Object} item
 * @return {Object}
 */
function getTitleYearArtists(item) {
  const { description } = item;
  return {
    title: getTitle(description),
    year: getYear(description),
    artist: getArtist(description)
  };
}

function cleanDescriptionByRules(item) {
  const { title, year, artists, description } = item;
  let cleanedDescription = cleanByRules(description, 'description');
  [(title, year, artists)].forEach(prop => {
    if (prop) {
      cleanedDescription = cleanedDescription.replace(prop, '');
    }
  });
  return cleanedDescription.trim();
}

function removeTitleArtistYearFromDescription(item) {
  const { description, title, artist, year } = item;
  let cleanedDescription = description;
  [title, artist, year].forEach(category => {
    if (category) {
      cleanedDescription = cleanedDescription.replace(category, '');
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
  });
  cleanedDescription = cleanedDescription.replace(/artists*:/i, '');

  return cleanedDescription.trim();
}

/**
 *
 * @param {String} s
 * @param {String} ruleCategory
 * @return {String}
 */
function cleanByRules(s, ruleCategory) {
  let cleanString = s;
  const rules = CLEAN_UP_RULES[ruleCategory];
  if (!rules) {
    throw 'No rules defined for that category type';
  }

  rules.forEach(rule => {
    cleanString = cleanString.replace(rule, '');
  });
  return cleanString;
}

function scrapeAndWriteData(singleArtworkUrl = null) {
  const artworks = [];
  const numArtworksToScrape = 20; // number of artwork listings per page
  const categoryIDs = 15; // categoryID = 15 is category for 'public art'
  const httpBody = `featureIDs=&categoryIDs=${categoryIDs}&occupants=null&keywords=&pageSize=${numArtworksToScrape}&pageNumber=1&sortBy=3&currentLatitude=null&currentLongitude=null&isReservableOnly=false`;
  const HOST = 'http://sanjoseca.gov';
  const URL = `${HOST}/Facilities/Facility/Search`;
  let counter = 0;

  console.log('scraping data...');

  if (singleArtworkUrl) {
    return osmosis
      .get(singleArtworkUrl)
      .set({
        // grab and store the appropriate details about the art work
        title: '.editorContent .Subhead1',
        artist: '.editorContent .Subhead2',
        description: '.editorContent'
      })
      .data(function(_data) {
        console.log('artwork number: ', ++counter);
        artworks.push(_data);
      })
      .done(function() {
        console.log('scraping done.');
        console.log('formatting data...');
        const cleanedArtworks = [];
        for (let artwork of artworks) {
          Object.assign(artwork, { description: cleanDescriptionByRules(artwork) });
          Object.assign(artwork, getTitleYearArtists(artwork));
          Object.assign(artwork, { description: removeTitleArtistYearFromDescription(artwork) });
          cleanedArtworks.push(artwork);
        }
        fs.writeFile(PATH_OUTPUT_FILE, JSON.stringify(cleanedArtworks), { flags: 'r+' }, err => {
          if (err) {
            throw error;
          }
        });
        console.log(`data successfully written to '${PATH_OUTPUT_FILE}'`);
      });
  }

  return osmosis
    .post(URL, httpBody)
    .find('h3 > a') // selector for links to indivdual pages about art work
    .set({ url: '@href' })
    .then((_content, data) => {
      data.url = HOST + data.url;
    })
    .follow('@href') // follow link to individual page about the art work
    .set({
      // grab and store the appropriate details about the art work
      title: '.editorContent .Subhead1',
      artist: '.editorContent .Subhead2',
      description: '.editorContent'
    })
    .data(function(_data) {
      console.log('artwork number: ', ++counter);
      artworks.push(_data);
    })
    .done(function() {
      console.log('scraping done.');
      console.log('formatting data...');
      const cleanedArtworks = [];
      for (let artwork of artworks) {
        Object.assign(artwork, { description: cleanDescriptionByRules(artwork) });
        Object.assign(artwork, getTitleYearArtists(artwork));
        Object.assign(artwork, { description: removeTitleArtistYearFromDescription(artwork) });
        cleanedArtworks.push(artwork);
      }
      fs.writeFile(PATH_OUTPUT_FILE, JSON.stringify(cleanedArtworks), { flags: 'r+' }, err => {
        if (err) {
          throw error;
        }
      });
      console.log(`data successfully written to ${PATH_OUTPUT_FILE}`);
    });
}

(function main() {
  let readlineInterface;
  const DEBUG_MODE = false; // Debug mode skips terminal prompt; necessary if running the program through IDE debugger.

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
      scrapeAndWriteData();
    })
    .catch(err => {
      throw err;
      console.log('aborted.');
      if (!DEBUG_MODE) {
        readlineInterface.close();
      }
    });
})();
