const { PATH_SCRAPED_ARTWORKS, PATH_MANAGED_POIs } = require('../../config/file-paths');
const fs = require('fs');

class POIManager {
  constructor(data) {
    this.scrapedArtworks = {};
    this.managedArtworks = {};
  }

  refreshArtworks() {
    const managedArr = require(PATH_MANAGED_POIs);
    const scrapedArr = require(PATH_SCRAPED_ARTWORKS);
    managedArr.forEach((artwork) => {
      this.managedArtworks[artwork.id] = artwork;
    });
    scrapedArr.forEach( (artwork) => {
      if (!this.managedArtworks[artwork.id]) {
        this.scrapedArtworks[artwork.id] = artwork;
      } else if (this.managedArtworks[artwork.id]) {
        delete this.scrapedArtworks[artwork.id]
      }
    });
  }

  writeArtworkToFile(artworkToSubmit) {
    this.managedArtworks[artworkToSubmit.id] = artworkToSubmit;
    const managedArtworksString = JSON.stringify(Object.values(this.managedArtworks), null, 2)
    return new Promise(resolve => {
        fs.writeFile(PATH_MANAGED_POIs, managedArtworksString, {flags: "r+"}, err => {
          if (err) { return reject(err) };
          resolve();
        })
    }).catch(console.error);
  }
}

module.exports = POIManager;