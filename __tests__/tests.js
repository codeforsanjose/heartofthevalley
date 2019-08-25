const fs = require('fs');

test('each artwork has an id', () => {
    var artJson = fs.readFileSync('./artwork-data/consolidated-artworks.json');
    var artParsed = JSON.parse(artJson);
    var features = artParsed.features;
    for (var i = 0; i < features.length; i++) {
        expect(features[i]).toHaveProperty("id");
    }
});

test('artwork id values are unique', () => {
    var artJson = fs.readFileSync('./artwork-data/consolidated-artworks.json');
    var artParsed = JSON.parse(artJson);
    var features = artParsed.features;
    var seenIds = [];
    for (var i = 0; i < features.length; i++) {
        expect(seenIds).not.toContain(features[i]["id"]);
        seenIds.push(features[i]["id"]);
    }
});
