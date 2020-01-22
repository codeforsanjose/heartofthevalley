const express = require('express');
const app = express();
const { PATH_SCRAPED_ARTWORKS, PATH_CHECKED_POIs } = require('../config/file-paths');
const Artwork = require('../lib/artwork.js');
const fs = require('fs');
const path = require('path');
const { getGeolocationForArtwork } = require('../lib/geocoding-service.js');



const PORT = 3000;
const scrapedArtworks = require(PATH_SCRAPED_ARTWORKS);
const checkedPOIs = require(PATH_CHECKED_POIs);
const scrapedArtworksObj = {};

scrapedArtworks.forEach(artwork => {
  scrapedArtworksObj[artwork.id] = artwork;
});

app.get('/', (req, res) => 
  res.render('../debug_views/index.ejs', {scrapedArtworks, checkedPOIs})
);

app.get('/POI/:id', (req, res) => 
  res.render('../debug_views/show.ejs', {artwork: 
    //scrapedArtworksObj[req.params.id]
    checkedPOIs[0], getGeolocationForArtwork
  })
);

// serve static files
app.use('/modules', express.static(path.join(__dirname, '/../node_modules')));
app.use('/static', express.static(path.join(__dirname, '/../lib')));


app.listen(PORT, () => {
  console.log(`Running POI Checker on port ${PORT}`);
  console.log(PATH_SCRAPED_ARTWORKS);
});
