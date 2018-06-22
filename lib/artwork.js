class Artwork {
  constructor(data) {
    this.type = 'Feature';
    this.geometry = { type: 'Point', coordinates: data.coordinates || null };

    // const rawDescription = JSON.stringify(data.rawDescription);
    const rawDescription = data.rawDescription;
    this.properties = {
      title: data.title,
      artist: this.getArtistFromDescription(rawDescription),
      address: data.streetAddress,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      image: data.image,
      rawDescription,
      description: rawDescription,
      sourceURL: data.sourceURL,
      sourceOfInformation: data.sourceOfInformation
    };
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

  getArtistFromDescription(description) {
    const match = description.match(/artists?:(.*)(.|\r|\n)/i);
    return match ? match[1].trim() : null;
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

    [/artists?.*:/i, /\d+/, /\r\n/gm].forEach(rule => {
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
}

module.exports = Artwork;
