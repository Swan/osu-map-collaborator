const parser = require('osu-parser');
const _ = require('lodash');

const { makeNewOsuFile } = require('./makefile');

// Responsible for mixing the two beatmaps together and creating a new object
module.exports.getMixedMapObject = (mapsToMix) => {

    // Create new beatmap object
    let newBeatmap = {};
    let secondBeatmap = {};

    parser.parseFile(mapsToMix[0], (err, beatmap) => {
        if (err) throw err;

        // Add all of the metadata from the first file ------ what the hell... lol
        newBeatmap.fileFormat = beatmap.fileFormat;
        newBeatmap.bgFileName = beatmap.bgFilename;
        newBeatmap.timingPoints = beatmap.timingPoints;
        newBeatmap.hitObjects = beatmap.hitObjects;
        newBeatmap.AudioFilename = beatmap.AudioFilename;
        newBeatmap.AudioLeadIn = beatmap.AudioLeadIn;
        newBeatmap.PreviewTime = beatmap.PreviewTime;
        newBeatmap.Countdown = beatmap.Countdown;
        newBeatmap.SampleSet = beatmap.SampleSet;
        newBeatmap.StackLeniency = beatmap.StackLeniency;
        newBeatmap.Mode = beatmap.Mode;
        newBeatmap.LetterboxInBreaks = beatmap.LetterboxInBreaks;
        newBeatmap.WidescreenStoryboard = beatmap.WidescreenStoryboard;
        newBeatmap.Bookmarks = beatmap.Bookmarks;
        newBeatmap.DistanceSpacing = beatmap.DistanceSpacing;
        newBeatmap.BeatDivisor = beatmap.BeatDivisor;
        newBeatmap.GridSize = beatmap.GridSize;
        newBeatmap.TimelineZoom = beatmap.TimelineZoom;
        newBeatmap.Title = beatmap.Title;
        newBeatmap.TitleUnicode = beatmap.TitleUnicode;
        newBeatmap.Artist = beatmap.Artist;
        newBeatmap.ArtistUnicode = beatmap.ArtistUnicode;
        newBeatmap.Creator = beatmap.Creator;
        newBeatmap.Version = 'Collab';
        newBeatmap.Source = beatmap.Source;
        newBeatmap.Tags = beatmap.Tags;
        newBeatmap.BeatmapID = beatmap.BeatmapID;
        newBeatmap.BeatmapSetID = beatmap.BeatmapSetID;
        newBeatmap.HPDrainRate = beatmap.HPDrainRate;
        newBeatmap.CircleSize = beatmap.CircleSize;
        newBeatmap.OverallDifficulty = beatmap.OverallDifficulty;
        newBeatmap.ApproachRate = beatmap.ApproachRate;
        newBeatmap.SliderMultiplier = beatmap.SliderMultiplier;
        newBeatmap.SliderTickRate = beatmap.SliderTickRate;
    

        // Parse the second beatmap and add the timing points and hit objects to the new beatmap. 
        parser.parseFile(mapsToMix[1], (err, beatmap) => {
            
            // Add timing points and hit objects and remove if there are any duplicates
            newBeatmap.timingPoints = newBeatmap.timingPoints.concat(beatmap.timingPoints);
            newBeatmap.hitObjects = newBeatmap.hitObjects.concat(beatmap.hitObjects);     

            // TODO: Remove Duplicate timing points, and hitobjects?? idk why this doesnt do that already -- really buggy and will create duplicates
            newBeatmap.timingPoints = _.uniq(newBeatmap.timingPoints);
            newBeatmap.hitObjects = _.uniq(newBeatmap.hitObjects);

            // Create a new .osu file with the new beatmap
            makeNewOsuFile(newBeatmap, mapsToMix);

        });       
    });
    
};