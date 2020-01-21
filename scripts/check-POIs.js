const express = require('express');
const app = express();
const { PATH_SCRAPED_ARTWORKS, PATH_CHECKED_POIs } = require('../config/file-paths');
const Artwork = require('../lib/artwork.js');
const fs = require('fs');

const PORT = 3000;
const scrapedArtworks = require(PATH_SCRAPED_ARTWORKS);
const scrapedArtworksObj = {};

scrapedArtworks.forEach(artwork => {
  scrapedArtworksObj[artwork.id] = artwork;
})

app.get('/', (req, res) => 
  res.render('../debug_views/index.ejs', {scrapedArtworks})
);

app.get('/POI/:id', (req, res) => 
  res.render('../debug_views/show.ejs', {artwork: scrapedArtworksObj[req.params.id]})
);


app.listen(PORT, () => {
  console.log(`Running POI Checker on port ${PORT}`);
  console.log(PATH_SCRAPED_ARTWORKS);
});
