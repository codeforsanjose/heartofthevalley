const express = require('express');
const app = express();
const { PATH_SCRAPED_ARTWORKS } = require('../config/file-paths');

const PORT = 3000;

app.get('/', (req, res) => res.send(scrapedArtworks))


app.listen(PORT, () => {
  console.log(`Running POI Checker on port ${PORT}`);
  console.log(PATH_SCRAPED_ARTWORKS);
});
