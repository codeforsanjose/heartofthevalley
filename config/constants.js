const URL_SAN_JOSE_GOV = 'http://sanjoseca.gov';
const path = require('path');

module.exports = {
  URL_SAN_JOSE_GOV,
  URL_SEARCH: `${URL_SAN_JOSE_GOV}/Facilities/Facility/Search`,
  URL_INDEX_HTML: path.resolve(__dirname + '/../public/index.html')
};
