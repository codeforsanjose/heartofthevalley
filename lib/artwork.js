var SHA256 = require("crypto-js/sha256");

class Artwork {
  constructor(data) {
    this.type = 'Feature';
    this.geometry = { type: 'Point', coordinates: data.coordinates || null };

    // const rawDescription = JSON.stringify(data.rawDescription);
    const rawDescription = data.rawDescription;
    this.properties = {
      title: data.title,
      artist: data.artist,
      address: data.streetAddress,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      image: data.image,
      description: rawDescription,
      sourceURL: data.sourceURL,
      sourceOfInformation: data.sourceOfInformation
    };
  }

  generateID() {
    this.id = Artwork.generateID(this.properties.artist, this.properties.title, this.properties.sourceURL);
  }

  static generateID(artist='', title='', sourceURL) {
    artist = artist || ''
    title = title || ''
    sourceURL = sourceURL || ''
    return 'art_'+(SHA256(`${artist}-${title}-${sourceURL}`).toString());
  }

  get postalAddress() {
    const { address, city, state, postalCode } = this.properties;
    return `${address}, ${city}, ${state} ${postalCode}`;
  }

  toObject() {
    const { type, geometry, properties, errors } = this;
    let base = { type, geometry, properties };
    if (errors && errors.length > 0) {
      base = Object.assign(base, { errors });
    }

    return base;
  }

  getArtistFromDescription() {
    if (!this.properties.artist) {
      const match = this.properties.description.match(/artists?:(.*)(.|\r|\n)/i);
      this.properties.artist = match ? match[1].trim() : null;
    }
  }

  documentErrors() {
    const errors = ['title', 'artist', 'description'].reduce((errors, key) => {
      if (!this.properties[key]) {
        errors.push(key);
      }
      return errors;
    }, []);

    if (this.properties.title.toLowerCase() === 'untitled') {
      errors.push('title is "untitled", check other details');
    }

    if (!this.geometry.coordinates) {
      errors.push('coordinates');
    }

    if (errors.length > 0) {
      this.errors = errors;
    }
  }

  cleanDescription() {
    let { description } = this.properties;
    if (!description) {
      return;
    }

    [/District\r\n(.|\r|\n)*/gm, /(.|\r|\n)*?\d{4}(?=\D)/].forEach(rule => {
      if (description) {
        description = description.replace(rule, '');
      }
    });
    this.properties.description = description.trim();
  }

  cleanArtist() {
    let { artist } = this.properties;
    if (!artist) {
      return;
    }

    [/artists?.*:/i, /\(.*\d{4}\)/ /* to escape (YYYY) from artist */].forEach(rule => {
      if (artist) {
        artist = artist.replace(rule, '');
      }
    });
    this.properties.artist = artist.trim();
  }

  cleanTitle() {
    let { title } = this.properties;

    if (!title) {
      return;
    }

    [/public art:/i, /\r\n/gm, /\(.*/].forEach(rule => {
      if (title) {
        title = title.replace(rule, '');
      }
    });
    this.properties.title = title.trim();
  }

  parseStreetAddress() {
    // generate clean address, city, state, postalCode
    let { address } = this.properties;

    if (!address) {
      return;
    }
    
    this.properties.address = address.split("\r")[0];
    this.properties.city = address.split("\n")[1].split(",")[0];
    this.properties.state = address.split("\n")[1].split(",")[1].split(" ")[1];
    this.properties.postalCode = address.split("\n")[1].split(",")[1].split(" ")[2];
  }
}

module.exports = Artwork;
