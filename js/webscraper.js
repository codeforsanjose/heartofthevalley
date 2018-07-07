var osmosis = require('osmosis');

var url = 'http://sanjoseca.gov/Facilities/Facility/Search';
var data =
  'featureIDs=&categoryIDs=15&occupants=null&keywords=&pageSize=500&pageNumber=1&sortBy=3&currentLatitude=null&currentLongitude=null&isReservableOnly=false';

osmosis
  .post(url, data)
  .find('h3 > a')
  .follow('@href')
  .set({
    title: '.editorContent .Subhead1',
    artist: '.Subhead2',
    href: '@href',
    everything: '.editorContent'
  })
  .data(function(_data) {
    console.log('the data', _data);
  });
