const express = require('express');
const CONSTANTS = require('../config/constants');
const PORT = 3000;
const app = express();

app.use(express.static('public'));

app.get('/', (_req, res) => {
  res.sendfile('index.html');
});

app.get('/api/artworks', (_req, res) => {
  res.sendFile(CONSTANTS.PATH_ARTWORKS_PUBLIC);
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
