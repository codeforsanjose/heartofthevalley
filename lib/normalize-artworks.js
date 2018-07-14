function normalizeArtwork(artwork) {
  const {
    artist,
    city,
    country,
    coordinates,
    description,
    image,
    postalCode,
    rawDescription,
    sourceURL,
    sourceOfInformation,
    state,
    streetAddress: address,
    title
  } = artwork;

  return Object.assign(
    {},
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates
      },
      properties: {
        address,
        artist,
        city,
        country,
        description,
        image: image || null,
        postalCode,
        rawDescription,
        sourceOfInformation,
        sourceURL,
        state,
        title
      }
    }
  );
}

function normalizeArtworks(artworks) {
  return artworks.map(normalizeArtwork);
}

module.exports = normalizeArtworks;
