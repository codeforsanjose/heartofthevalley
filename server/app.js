const express = require('express');
const CONSTANTS = require('../config/constants');
const PATHS = require('../config/file-paths');
const PORT = 3000;
const app = express();

app.use(express.static('public'));

app.get('/', (_req, res) => {
  res.sendfile('index.html');
});

app.get('/api/artworks', (_req, res) => {
  res.sendFile(PATHS.PATH_ARTWORKS_PUBLIC, {}, err => {
    console.error(err);
  });
});

app.get('/api/mapboxkeys', (_req, res) => {
  res.send({ mapbox_token: CONSTANTS.MAPBOX_API_TOKEN });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
