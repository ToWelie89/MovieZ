var fs = require('fs');

const CACHE_FILE_PATH = __dirname + '\\cache\\cache.json';

const readLibraryFromCache = () => {
    return new Promise((resolve, reject) => {
        console.log('Reading cache fromfile ' + __dirname + '\\cache\\cache.json');
        fs.readFile(CACHE_FILE_PATH, "utf-8", (err, data) => {
            console.log('Read cache from ' + CACHE_FILE_PATH);
            if (data) {
                resolve(JSON.parse(data));
            } else {
                reject('No cache found');
            }
        });
    });
};

const cacheLibrary = data => {
    fs.writeFile(CACHE_FILE_PATH, JSON.stringify(data, null, 4), (err) => {
        if (err) console.error(err);
        console.log('Successfully cached data to ' + CACHE_FILE_PATH);
    });
};

var cacheFunctions = {
    cacheLibrary,
    readLibraryFromCache
};

module.exports = cacheFunctions;