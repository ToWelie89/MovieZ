//const directoryReader = require('./directoryReader.js');
//directoryReader.normalizeName('Warcraft 1080p BluRay x264-RK - Dual Audio + Legenda.mkv', true);

const getMostCommonWords = (listOfMovies, slice = undefined) => {
    let allWords = [];
    listOfMovies.forEach(x => {
        allWords = [...allWords, ...x.normalizedName.split(' ')];
    });
    let result = [];
    allWords.forEach(x => {
        if (result.find(y => y.name === x)) {
            result.find(y => y.name === x).count++;
        } else {
            result.push({
                name: x,
                count: 1
            });
        }
    });
    result.sort((a, b) => b.count - a.count);
    if (slice) {
        console.table(result.slice(0, slice));
    } else {
        console.table(result);
    }
};

var testFunctions = {
    getMostCommonWords
};

module.exports = testFunctions;