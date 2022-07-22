// DEPENDENCIES
const path = require('path');
// LOGGER
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', { flags: 'w' });
var log_stdout = process.stdout;

console.warn = d => {
    log_file.write('WARN: ' + util.format(d) + '\n');
    log_stdout.write('WARN: ' + util.format(d) + '\n');
};
console.error = d => {
    log_file.write('ERROR: ' + util.format(d) + '\n');
    log_stdout.write('ERROR: ' + util.format(d) + '\n');
};
console.log = d => {
    log_file.write('INFO: ' + util.format(d) + '\n');
    log_stdout.write('INFO: ' + util.format(d) + '\n');
};
// LOCAL PACKAGES
const directoryReader = require('./directoryReader.js');
const server = require('./server.js');
const cacheFunctions = require('./cache.js');
const settingsPath = path.join(__dirname, '../settings.js');
const settings = require(settingsPath);
// CODE
const readMoviesCallback = (library, performCaching = true) => {
    //libraryTableFriendly = directoryReader.tableFriendlyFormat(library);
    if (performCaching) {
        cacheFunctions.cacheLibrary({
            timestamp: Date.now(),
            library
        });
    }
    server.emit(library);
    server.setConnetionCallback(() => {
        server.emit(library);
    });
};

server.startServer().then(() => {
    if (settings.cacheData) {
        cacheFunctions.readLibraryFromCache().then(cache => {
            console.log('Fetched cache', cache.timestamp, !!cache.library);
            if (cache && cache.library && cache.library.length > 0) {
                readMoviesCallback(cache.library, false);''
            } else {
                directoryReader.readAllInDirectory(settings.directory).then(readMoviesCallback).catch(console.error);
            }
        }).catch(err => {
            console.error(err);
            console.log('Reading from directory instead');
            directoryReader.readAllInDirectory(settings.directory).then(readMoviesCallback).catch(console.error);
        })
    } else {
        directoryReader.readAllInDirectory(settings.directory).then(readMoviesCallback).catch(console.error);
    }
});
