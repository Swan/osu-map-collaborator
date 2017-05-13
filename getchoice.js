const prompt = require('prompt');
const { getMixedMapObject } = require('./mixedmap');

// Responsible for asking the user which beatmaps they want to mix together.
module.exports.getChoice = (osuFiles) => {

    var schema = {
        properties: {
            map1: {
                pattern: /^[0-9]+$/,
                message: 'You may only choose numbers!',
                required: true
            },
            map2: {
                pattern: /^[0-9]+$/,
                message: 'You may only choose numbers!',
                required: true
            },

        }
    };

    prompt.start();

    // Get beatmaps
    prompt.get(schema, (err, result) => {
        if (!osuFiles[result.map1] || !osuFiles[result.map2]) return console.log("\nOne or more of the choices you've selected don't exist");
        let map1 = osuFiles[result.map1];
        let map2 = osuFiles[result.map2];

        console.log(`\nYou have chosen to collaborate:\n\n ${osuFiles[result.map1]}\n ${osuFiles[result.map2]}\n\nIs this correct? (y/n)\n`);

        // Confirmation
        prompt.get(['choice'], (err, result) => {
            if (result.choice != 'y') return console.log('Okay, fine.');

            // Create the new beatmap object
            let mapsToMix = [map1, map2];
            getMixedMapObject(mapsToMix);
        });
    });
};