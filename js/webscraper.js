const readline = require('readline');
const osmosis = require('osmosis');
const fs = require('fs');
const HOST = 'http://sanjoseca.gov';
const URL = `${HOST}/Facilities/Facility/Search`;
const PATH_OUTPUT_FILE = 'wip_artworks.json';
const artworks = [];
const numArtworksToScrape = 10; // number of artwork listings per page
const categoryIDs = 15; // categoryID = 15 is category for 'public art'
const httpBody = `featureIDs=&categoryIDs=${categoryIDs}&occupants=null&keywords=&pageSize=${numArtworksToScrape}&pageNumber=1&sortBy=3&currentLatitude=null&currentLongitude=null&isReservableOnly=false`;
let counter = 0;

const CLEAN_UP_RULES = {
  artist: [/artists*:/i, /\d+/],
  description: [
    function(item) {
      const { artist, title } = item;
      return item.description.replace(artist, '').replace(title, '');
    },
    /report a concern/i,
    '(408) 793-4330',
    'publicart@sanjoseca.gov',
    /[\r\n]+/gm,
    /artists*:/i,
    /District.*/g
  ]
};

function cleanUpItem(item) {
  for (let key in item) {
    item[key] = cleanText(key, item, CLEAN_UP_RULES);
  }
  return item;
}

function setYear(item) {
  let year = item.description.match(/\d{4}/);
  if (year) {
    year = parseInt(year[0]);
    item.year = year;
    item.description = item.description.replace(year, '');
  } else {
    item.year = null;
  }
  return item;
}

function cleanText(key, item, rules) {
  if (rules[key]) {
    let newText = item[key];
    for (let rule of rules[key]) {
      if (typeof rule === 'function') {
        newText = rule(item);
        continue;
      }
      newText = newText.replace(rule, '');
    }
    item[key] = newText;
  }

  return item[key].trim();
}

function scrape() {
  console.log('scraping data...');

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
        artwork = cleanUpItem(artwork);
        artwork = setYear(artwork);
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

function main() {
  let rl;

  new Promise((resolve, reject) => {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(
      `This action will overwrite ${PATH_OUTPUT_FILE} if it exists. Are you sure you want to continue?`,
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
      rl.close();
      scrape();
    })
    .catch(() => {
      console.log('aborted.');
      rl.close();
    });
}

main();
