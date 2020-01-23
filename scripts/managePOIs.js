const express = require('express');
const server = express();
const path = require('path');
const { PATH_SCRAPED_ARTWORKS, PATH_MANAGED_POIs } = require('../config/file-paths');

const Artwork = require('../lib/artwork.js');
const POIManager = require('../lib/POIManager.js')

// config vars
const PORT = 3000;

server.use(express.json());

// POI Manager
const app = new POIManager();
app.refreshArtworks();


//app.writeArtworkToFile();

// const sampleArtwork = require(PATH_SCRAPED_ARTWORKS)[7];
// console.log(sampleArtwork)
// app.writeArtworkToFile(sampleArtwork);

// index of POIs
server.get('/', (req, res) => {
  res.render('../debug-helpers/index.ejs', {
    scrapedArtworks: Object.values(app.scrapedArtworks),
    managedArtworks: Object.values(app.managedArtworks)
  });
});

// show an existing POI
server.get('/POI/:id', (req, res) => {
  const allArtworks = {...app.scrapedArtworks, ...app.managedArtworks};
  const artwork = allArtworks[req.params.id];
  res.render('../debug-helpers/show.ejs', {artwork});
});

// show form for new POI
server.get('/POI/new', (req, res) => {
  res.render('../debug-helpers/show.ejs');
});

// handle submission of new POI
server.post('/POI', (req, res) => {
  var {title, artist, address, city, state, postalCode, image, description, sourceURL, id, latitude, longitude} = req.body
  var submittedPOI;
  try {
      submittedPOI = new Artwork({
      title,
      artist,
      streetAddress: address,
      city,
      state,
      postalCode,
      image,
      rawDescription: description.trim(),
      sourceURL,
      sourceOfInformation: "Created by POI Manager",
      coordinates: [longitude, latitude]
    });
    if (!id) {submittedPOI.generateID()}
    else {submittedPOI.id = id};
    app.writeArtworkToFile(submittedPOI);
    app.refreshArtworks();
  } catch {
    res.status(400).json({message: "missing details"})
  }
  res.status(201).json({artwork: submittedPOI});
});


// create/overwrite a POI
server.post('/POI/:id', (req, res) => {
  var {title, artist, address, city, state, postalCode, image, description, sourceURL, id, latitude, longitude} = req.body
  var submittedPOI;
  try {
      submittedPOI = new Artwork({
      title,
      artist,
      streetAddress: address,
      city,
      state,
      postalCode,
      image,
      rawDescription: description.trim(),
      sourceURL,
      sourceOfInformation: "Created by POI Manager",
      coordinates: [longitude, latitude]
    });
    if (!id) {submittedPOI.generateID()}
    else {submittedPOI.id = id};
    app.writeArtworkToFile(submittedPOI);
    app.refreshArtworks();
  } catch {
    res.status(400).json({message: "missing details"})
  }
  res.status(201).json({artwork: submittedPOI});
})

// serve static files
server.use('/modules', express.static(path.join(__dirname, '/../node_modules')));
server.use('/static', express.static(path.join(__dirname, '/../debug-helpers')));


server.listen(PORT, () => {
  console.log(`Running POI Manager on port ${PORT}`);
  console.log(PATH_SCRAPED_ARTWORKS);
});
