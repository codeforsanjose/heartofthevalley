const CONSTANTS = require('../config/constants');
const expect = require('chai').expect;

const HEADER_TXT = 'HEART OF THE VALLEY';

module.exports = {
  'App loads': client => {
    client.url('file://' + CONSTANTS.URL_INDEX_HTML);
    client.expect.element('html').text.to.contain(HEADER_TXT);
    client.waitForElementPresent('.listings .item:first-child', 5000);
  },
  'Correct number of artworks': client => {
    client.elements('css selector', '.listings .item', result => {
      expect(result.value.length).to.equal(270); // XXX: nightwatch can't check for number of elements????
    });

    client.elements('css selector', '.marker.mapboxgl-marker', result => {
      expect(result.value.length).to.equal(269);
    });
  },
  'Close selenium': client => {
    client.end();
  }
};
