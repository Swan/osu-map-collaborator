const _ = require('lodash');
const createFile = require('create-file');
const read = require('read-file');

// Responsible for creating the new file with the mixed beatmap
module.exports.makeNewOsuFile = (mixedMapObject, osuFiles) => {

    // Replace all the nasty characters in the file name.
    let nastyCharacters = ['/', '\\', '<', '>', ':', '"', '|', '?', '*'];
    nastyCharacters.forEach(nastyCharacter => {
        if (mixedMapObject.Artist.includes(nastyCharacter)) mixedMapObject.Artist = mixedMapObject.Artist.replace(nastyCharacter, '');
        if (mixedMapObject.Title.includes(nastyCharacter)) mixedMapObject.Title = mixedMapObject.Title.replace(nastyCharacter, '');
    });

    // Create the string of the .osu file
    let content = 
    `osu file format ${mixedMapObject.fileFormat}\n\n` +

    `[General]\n` +
    `AudioFilename: ${mixedMapObject.AudioFilename}\n` +
    `AudioLeadIn: ${mixedMapObject.AudioLeadIn}\n` +
    `PreviewTime: ${mixedMapObject.PreviewTime}\n`+
    `Countdown: ${mixedMapObject.Countdown}\n` +
    `SampleSet: ${mixedMapObject.SampleSet}\n` +
    `StackLeniency: ${mixedMapObject.StackLeniency}\n` +
    `Mode: ${mixedMapObject.Mode}\n` +
    `LetterboxInBreaks: ${mixedMapObject.LetterboxInBreaks}\n` +
    `WidescreenStoryboard: ${mixedMapObject.WidescreenStoryboard}\n\n` +

    `[Editor]\n` +
    `Bookmarks: ${mixedMapObject.Bookmarks}\n` +
    `DistanceSpacing: ${mixedMapObject.DistanceSpacing}\n` +
    `BeatDivisor: ${mixedMapObject.BeatDivisor}\n` +
    `GridSize: ${mixedMapObject.GridSize}\n` +
    `TimelineZoom: ${mixedMapObject.TimelineZoom}\n\n` +

    `[Metadata]\n` +
    `Title: ${mixedMapObject.Title}\n`+
    `TitleUnicode: ${mixedMapObject.TitleUnicode}\n` +
    `Artist: ${mixedMapObject.Artist}\n` +
    `ArtistUnicode: ${mixedMapObject.ArtistUnicode}\n` +
    `Creator: ${mixedMapObject.Creator}\n` +
    `Version: ${mixedMapObject.Version}\n` +
    `Source: ${mixedMapObject.Source}\n` +
    `Tags: ${mixedMapObject.Tags}\n` +
    `BeatmapID: ${mixedMapObject.BeatmapID}\n` +
    `BeatmapSetID: ${mixedMapObject.BeatmapSetID}\n\n` +

    `[Difficulty]\n` +
    `HPDrainRate: ${mixedMapObject.HPDrainRate}\n`+
    `CircleSize: ${mixedMapObject.CircleSize}\n` +
    `OverallDifficulty: ${mixedMapObject.OverallDifficulty}\n` +
    `ApproachRate: ${mixedMapObject.ApproachRate}\n` +
    `SliderMultiplier: ${mixedMapObject.SliderMultiplier}\n` +
    `SliderTickRate: ${mixedMapObject.SliderTickRate}\n\n` +

    `[Events]\n`+
    `//Background and Video events\n` +
    `//Break Periods\n` +
    `//Storyboard Layer 0 (Background)\n`+
    `//Storyboard Layer 1 (Fail)\n` +
    `//Storyboard Layer 2 (Pass)\n` +
    `//Storyboard Layer 3 (Foreground)\n` +
    `//Storyboard Sound Samples\n\n` + 
    
    `[TimingPoints]\n`;


    // Concat all the timing points to the file
    mixedMapObject.timingPoints.forEach((timingPoint) => {
        if (!timingPoint.timingChange) {
            timingPoint.beatLength = -100;
            timingPoint.timingChange = 0;
        } else {
            timingPoint.timingChange = 1;
        }

        (timingPoint.kiaiTimeActive) ? timingPoint.kiaiTimeActive = 1 : timingPoint.kiaiTimeActive  = 0; 
        content = content.concat(`${timingPoint.offset},${timingPoint.beatLength},${timingPoint.timingSignature},${timingPoint.sampleSetId},${timingPoint.velocity},${timingPoint.sampleVolume},${timingPoint.timingChange}, ${timingPoint.kiaiTimeActive}\n`);
    });

    // Concat HitObjects
    content = content.concat(`\n[HitObjects]\n`);

    // Read both files and concat the hit objects to the file
    read(osuFiles[0], 'utf8', (err, buffer) => {
        // Get only the hitObjects from the file and concat it
        let mapOneObjects = _.trim(buffer.substring(buffer.indexOf('[HitObjects]') + 12));
        content = content.concat(mapOneObjects);

        content = content.concat('\n');

        // Read the second file, get only the hitobjects and concat it
        read(osuFiles[1], 'utf8', (err, buffer) => {
            let mapTwoObjects = _.trim(buffer.substring(buffer.indexOf('[HitObjects]') + 12));
            content = content.concat(mapTwoObjects);

            // Create File new file
            const newFilePath = `${mixedMapObject.Artist} - ${mixedMapObject.Title} (${mixedMapObject.Creator}) [${mixedMapObject.Version}].osu`;
            createFile(newFilePath, content, (err) => {
                if (err) throw err;
                console.log('File Created -', newFilePath);
                console.log('Now, just drag the file into your beatmap folder!');
            });            
        });
    });
};