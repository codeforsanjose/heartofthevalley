var fs = require('fs');

const PATHS = require('../config/file-paths');

(function main() {
    const consolidatedArtworks = require(PATHS.PATH_CONSOLIDATED_ARTWORKS);
    console.log(`Num artworks: ${consolidatedArtworks.length}`);
      
    let outputObj = JSON.stringify(consolidatedArtworks, null, 2);
    outputObj = 'const art = ' + outputObj;
    fs.writeFile(PATHS.PATH_ARTWORKS_PUBLIC, outputObj, function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log('Art file copied successfully');
        }
    });
})();
  