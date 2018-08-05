const express = require('express');
const CONSTANTS = require('../config/constants');
const PORT = 3000;
const app = express();

app.use(express.static('public'));

app.get('/', (_req, res) => {
  res.sendfile('index.html');
});

app.get('/api/artworks', (_req, res) => {
  res.sendFile(CONSTANTS.PATH_ARTWORKS_LIST, {}, err => {
    console.error(err);
    console.error('something wrong happened while trying to find artworks file');
  });
});

app.get('/api/mapboxkeys', (_req, res) => {
  res.send({ mapbox_token: CONSTANTS.MAPBOX_API_TOKEN });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
