const { readOsuFiles } = require('./osufiles.js');

// Program start
const main = () => {
    console.log("Welcome to the osu! map collaborator. \nThis is a program which allows you to mash up beatmaps.\nPlease drag your .osu files into the current directory...\n");
    readOsuFiles();
};

main();
