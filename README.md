# Heart of the Valley
Our Valley of Heart's Delight (Santa Clara Valley, or the South Bay Area) has so many incredible murals and public art. This open source project visualizes and maps data about local public art and murals. We hope that this will help community members discover the beautiful murals and public art that make our communities vibrant. We also hope the map can help community members discover local artists and creatives in the South Bay.

This is an open source project.

It is maintained by [Code for San José](http://codeforsanjose.com) volunteers.

Questions about forking or using this project? Read our [license](https://github.com/codeforsanjose/heartofthevalley/blob/master/license).

## Technologies:
- Mapbox GL JS
- Open Street Maps
- JavaScript
- Bootstrap
- HTML
- CSS

## How to contribute
Want to contribute data about local public art/murals? Submit the data as an issue, or in our [contact form](http://www.codeforsanjose.com/heartofthevalley/about.html)

Contribute your research, development or design skills. Check out our list of issues on GitHub, and join our discussion on [Slack](https://slackin-c4sj.herokuapp.com/): #public-art channel.

### Development
This project uses Node.js and works with the latest [Node.js LTS version 10.15.3](https://nodejs.org/en/). If you don't already have a preferred Node.JS IDE, it is recommended to use [Visual Studio Code](https://code.visualstudio.com/) with this project.

#### Project setup:
Fork, then clone the project and run `npm install` to install the required packages listed in `package.json`.

#### Updating the scraped data:

The following steps are involved in updating the artwork data:

1. **Scrape the Artwork files from sanjoseca.gov** -  Run `npm run scrapeArtworks`. This will fetch data from sanjoseca.gov and populate the `artwork-data/_scraped-artworks.json` file with the fetched data.
2. **Merge the scraped artwork data with the artwork overrides** - Run `npm run mergeArtworkFiles`. Some artwork files have incorrect addresses or addresses which cannot be looked up with Nomanatim. The `artwork-data/artworks-overrides.json` file exists as a way to reliably fix the data associated with the artwork so that Nominatim can find the location.
3. **Check for untitled art** (optional) - Run `npm run listUntitled`. Some art is reported as "untitled" for the "title" field. If you know the title of the art, then add an override for it in the `artworks-overrides.json` and re-run step 2.
4. **Lookup addresses with [OSM/Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim)** - Run `npm run lookupAddresses`. This will use the artwork address field to attempt to get the geolocation (latitude and longitude). The output of this command will indicate if there are failures to lookup the address. If you know the location, then add an override for it in the `artworks-overrides.json` and re-run step 2, then re-run step 4.
5. **Copy the artwork JSON data into art.js** - Finally, run `npm run moveArtToOutputDir` to copy the contents of `artwork-data/consolidated-artworks.json` into `js/art.js`, prefixing the content with `const art = `. This is the final step and is needed before the changes can be visible in the web application.

#### Running the POI Manager
1. open POI Manager
```ssh
npm run managePOIs
```
2. Go to http://localhost:3000


#### Running the project locally
This project is completely static, so simply open `index.html` in Chrome or Firefox.

You can also run the project in a local web server on the project directory. One way to do this is to use the `ws` command, which can be installed using `npm install -g local-web-server`, then start the webserver by running `ws --http2` in the project folder and going to `https://127.0.0.1:8000` in your web browser. [See the documentation for this program for more information](https://www.npmjs.com/package/local-web-server).

#### Running unit tests
Unit tests use the testing framework [Jest](https://jestjs.io/docs/en/getting-started). To run the unit tests, run `npm run test` from the command line.