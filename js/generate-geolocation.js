const fs = require('fs');
const mbxGeocodingService = require('../lib/mapbox-geocoding-service');
let artworks;
fs.readFile('../arwork-data/wip-artworks.json', (err, data) => {
  if (err) {
    throw err;
  }
  
  artworks = JSON.parse(data);
});

// https://github.com/mapbox/mapbox-sdk-js/blob/master/docs/services.md#geocoding
// @method forwardGeocode
// Search for a place.

// Parameters
// config Object
// config.query string A place name.
// config.mode ("mapbox.places" | "mapbox.places-permanent") Either mapbox.places for ephemeral geocoding, or mapbox.places-permanent for storing results and batch geocoding. (optional, default "mapbox.places")
// config.countries Array<string>? Limits results to the specified countries. Each item in the array should be an ISO 3166 alpha 2 country code.
// config.proximity Coordinates? Bias local results based on a provided location.
// config.types Array<("country" | "region" | "postcode" | "district" | "place" | "locality" | "neighborhood" | "address" | "poi" | "poi.landmark")>? Filter results by feature types.
// config.autocomplete boolean Return autocomplete results or not. (optional, default true)
// config.bbox BoundingBox? Limit results to a bounding box.
// config.limit number Limit the number of results returned. (optional, default 5)
// config.language Array<string>? Specify the language to use for response text and, for forward geocoding, query result weighting. Options are IETF language tags comprised of a mandatory ISO 639-1 language code and optionally one or more IETF subtags for country or script.
// @return MapiRequest

function getGeolocation(query) {
  const config = { query, mode: 'mapbox.places-permanent', countries: ['US'] };
  mbxGeocodingService
    .forwardGeocode(config)
    .send()
    .then(res => {}, err => {});
}
