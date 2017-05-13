const dir = require('node-dir');
const { getChoice } = require('./getChoice'); 

// Reads all of the osu! files in the current directory
module.exports.readOsuFiles = () => {
    var osuFiles = [];
    dir.readFiles(__dirname, {
        match: /.osu$/,
        exclude: /^\./
        }, (err, content, next) => {
            if (err) throw err;
            next();
        },
        (err, files) => {
            if (err) throw err;
            files.forEach((file) => {
                if (!file.includes('node_modules')) {
                    osuFiles.push(file);
                }
            });
            listFiles(osuFiles);
        });
};


// Responsible for listing all of the .osu files on the screen
const listFiles = (osuFiles) => {
    if (osuFiles.length < 2) return console.log("There aren't enough .osu files in this current directory. Please drag them in and try again!");
    console.log('Select two .osu files that you would like to mash up!\n');
    for (let i=0; i < osuFiles.length; i++) {
        console.log(`[${i}] ${osuFiles[i]}`);
    }
    console.log('');
    getChoice(osuFiles);
};