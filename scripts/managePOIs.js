const express = require('express');
const server = express();
const path = require('path');
const { PATH_SCRAPED_ARTWORKS, PATH_MANAGED_POIs } = require('../config/file-paths');

const Artwork = require('../lib/artwork.js');
const POIManager = require('../assetsPOIManager/models/POIManager.js')

// config vars
const PORT = 3000;

server.use(express.json());
startServer();

// POI Manager
const app = new POIManager();

// index of POIs
server.get('/', (req, res) => {
  app.refreshArtworks();
  res.render('../assetsPOIManager/templates/index.ejs', {
    scrapedArtworks: Object.values(app.scrapedArtworks),
    managedArtworks: Object.values(app.managedArtworks)
  });
});

// show an existing POI
server.get('/POI/:id', (req, res) => {
  app.refreshArtworks();
  const allArtworks = {...app.scrapedArtworks, ...app.managedArtworks};
  const artwork = allArtworks[req.params.id];
  res.render('../assetsPOIManager/templates/show.ejs', {artwork});
});

// show form for new POI
server.get('/POI/new', (req, res) => {
  res.render('../assetsPOIManager/templates/show.ejs');
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
    res.status(201).json({artwork: submittedPOI});
  } catch {
    res.status(400);
  }
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
    res.status(201).json({artwork: submittedPOI});
  } catch {
    res.status(400);
  }
})

// serve static files
server.use('/modules', express.static(path.join(__dirname, '/../node_modules')));
server.use('/static', express.static(path.join(__dirname, '/../assetsPOIManager')));

function startServer() {
  server.listen(PORT, () => {
    console.log(`Running POI Manager on port ${PORT}`);
    console.log(PATH_SCRAPED_ARTWORKS);
  });
}

