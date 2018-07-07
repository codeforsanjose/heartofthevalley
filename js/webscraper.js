var osmosis = require('osmosis');

var url = 'http://sanjoseca.gov/Facilities/Facility/Search';

// categoryID = 15 is 'public art'
var data =
  'featureIDs=&categoryIDs=15&occupants=null&keywords=&pageSize=500&pageNumber=1&sortBy=3&currentLatitude=null&currentLongitude=null&isReservableOnly=false';

osmosis
  .post(url, data)
  .find('h3 > a') // selector for links to indivdual pages about art work
  .follow('@href') // follow link to individual page about the art work
  .set({ // grab the appropriate details about the art work
    title: '.editorContent .Subhead1',
    artist: '.Subhead2',
    href: '@href',
    everything: '.editorContent'
  })
  .data(function(_data) {
    console.log('the data', _data);
  });
