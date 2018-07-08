const osmosis = require('osmosis');
const fs = require('fs');
const URL = 'http://sanjoseca.gov/Facilities/Facility/Search';
const PATH_OUTPUT_FILE = 'wip_artworks.json';
const artworks = [];
const pageSize = 1; // number of artwork listings per page
const categoryIDs = 15; // categoryID = 15 is 'public art'
const httpBody = `featureIDs=&categoryIDs=${categoryIDs}&occupants=null&keywords=&pageSize=${pageSize}&pageNumber=1&sortBy=3&currentLatitude=null&currentLongitude=null&isReservableOnly=false`;

const cleanUpRules = {
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
    item[key] = cleanText(key, item);
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

function cleanText(key, item) {
  if (cleanUpRules[key]) {
    let newText = item[key];
    for (let rule of cleanUpRules[key]) {
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

console.log('scraping data...')

osmosis
  .post(URL, httpBody)
  .find('h3 > a') // selector for links to indivdual pages about art work
  .follow('@href') // follow link to individual page about the art work
  .set({
    // grab and store the appropriate details about the art work
    title: '.editorContent .Subhead1',
    artist: '.Subhead2',
    description: '.editorContent'
  })
  .data(function(_data) {
    artworks.push(_data);
  })
  .done(function() {
    console.log('scraping done.')
    console.log('formatting data...')
    const cleanedArtworks = [];
    for (let artwork of artworks) {
      artwork = cleanUpItem(artwork);
      artwork = setYear(artwork);
      cleanedArtworks.push(artwork);
    }
    fs.writeFile(PATH_OUTPUT_FILE, JSON.stringify(cleanedArtworks), { flags: 'r+' }, err => {
      if (err) {
        throw error
      }
    });
    console.log(`data successfully written to ${PATH_OUTPUT_FILE}`)
  });
