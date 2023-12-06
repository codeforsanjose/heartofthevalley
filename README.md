# Heart of the Valley
Our Valley of Heart's Delight (Santa Clara Valley, or the South Bay Area) has so many incredible murals and public art. This open source project visualizes and maps data about local public art and murals. We hope that this will help community members discover the beautiful murals and public art that make our communities vibrant. We also hope the map can help community members discover local artists and creatives in the South Bay.

This is a Free and Open Source Project.

It is maintained by [Code for San José](https://codeforsanjose.org) volunteers.

Questions about forking or using this project? Read our [license](https://github.com/codeforsanjose/heartofthevalley/blob/develop/license).

## Technologies:
- Mapbox GL JS
- Open Street Maps
- React
- Express

## How to contribute
Want to contribute data about local public art/murals? Submit the data as an issue, or in our [contact form](http://www.codeforsanjose.com/heartofthevalley/about.html)

Contribute your research, development or design skills. Check out our list of issues on GitHub, and join our discussion on [Discord](https://discord.gg/hjSVPBsEhf): #heart-of-the-valley channel.

### Development
This project uses Node.js [Node.js LTS version 18](https://nodejs.org/en/). If you don't already have a preferred Node.JS IDE, it is recommended to use [Visual Studio Code](https://code.visualstudio.com/) with this project.
Node version is pinned in `.nvmrc`

#### Project setup:
Fork, then clone the project and run `npm install` to install the required packages listed in `package.json`.

#### Updating the scraped data:

The following steps are involved in updating the artwork data:

1. **Scrape the Artwork files from sanjoseca.gov** -  Run `npm run scrapeArtworks`. This will fetch data from sanjoseca.gov and populate the `artwork-data/_scraped-artworks.json` file with the fetched data.
2. **Merge the scraped artwork data with the artwork overrides** - Run `npm run mergeArtworkFiles`. Some artwork files have incorrect addresses or addresses which cannot be looked up with Nomanatim. The `artwork-data/artworks-overrides.json` file exists as a way to reliably fix the data associated with the artwork so that Nominatim can find the location.
3. **Check for untitled art** (optional) - Run `npm run listUntitled`. Some art is reported as "untitled" for the "title" field. If you know the title of the art, then add an override for it in the `artworks-overrides.json` and re-run step 2.
4. **Lookup addresses with [OSM/Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim)** - Run `npm run lookupAddresses`. This will use the artwork address field to attempt to get the geolocation (latitude and longitude). The output of this command will indicate if there are failures to lookup the address. If you know the location, then add an override for it in the `artworks-overrides.json` and re-run step 2, then re-run step 4.
5. **Copy the artwork JSON data into art.js** - Finally, run `npm run moveArtToOutputDir` to copy the contents of `artwork-data/consolidated-artworks.json` into `js/art.js`, prefixing the content with `const art = `. This is the final step and is needed before the changes can be visible in the web application.

#### Managing the live data:

***POI Manager***

The POI Manager exists to better assist with the creation and management of all artworks or points of interest. Because the primary source of data is the scraped artworks from the San Jose site, there exists some inconsistensies and each site needs to be vetted. The intent is to have all POIs in the **artwork-data/managedPOIs.json** file be complete with information before being shown by the [heartOfTheValley](https://www.codeforsanjose.com/heartofthevalley/) application.

***Running the POI Manager***
1. From the project directory, Open POI Manager. This opens up a local server using assets from the **assetsPOIManager** folder.
    ```bash
    npm run managePOIs
    ```
2. Go to http://localhost:3000. Use the POI Manager.
3. Once done, from the terminal window used to run the POI Manager, hit Ctrl + C.

***Using the POI Manager***
1. On the index page, the left hand side will have all the scraped artworks that are not yet live. The right hand side will have all the artworks that have been vetted. 
![Index Page](/img/POIManagerIndex.png)
2. Click on a scraped artwork to open up the Edit POI Page or click on "Create New POI" to open up the New POI Page.
3. Once on the Edit/New POI page, include all details. You can view how the artwork will appear on the map area to the right. Click on the "Refresh Map & Popup" button to see any changes that have been made.
![New/Edit Page](/img/POIManagerEdit.png)
4. Click "Submit POI" to have this sent to the **artwork-data/managedPOIs.json** file to be consumed by the [heartOfTheValley](https://www.codeforsanjose.com/heartofthevalley/) application.

#### Running unit tests
Unit tests use the testing framework [Jest](https://jestjs.io/docs/en/getting-started). To run the unit tests, run `npm run test` from the command line.
