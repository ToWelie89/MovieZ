// DEPENDENCIES
const fs = require('fs');
const path = require('path');
var ffmpeg = require('fluent-ffmpeg');
var ffprobe = require('ffprobe-static');
const { performance } = require('perf_hooks');
// LOCAL PACKAGES
const imdbScraper = require('./imdbScraper');
const settingsPath = path.join(__dirname, '../settings.js');
const settings = require(settingsPath);

// CODE
ffmpeg.setFfprobePath(ffprobe.path);

const TYPES = {
    DVD: 0,
    VIDEO_FILE: 1
};

const isMovieFile = name => {
    const movieFileTypes = ['avi', 'mkv', 'mp4'];
    return movieFileTypes.some(x => name.endsWith(`.${x}`));
};

const isDvdMovie = name => {
    const movieFileTypes = ['iso', 'img', 'bin'];
    return movieFileTypes.some(x => name.endsWith(`.${x}`));
};

const getYear = (name) => {
    const match = name.match(/(19[0-9]{1,2})|(20[0-9]{1,2})/g, '');
    return (match && match.length > 0) ? match[0] : 'N/A';
};

const capitalizeFirstLetter = word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

const normalizeName = (name, debug = false) => {
    const FILTER = [
        '2160p',
        '1080p',
        'www',
        'seehd',
        '720p',
        'x264',
        'uhd',
        'dvdrip',
        'aac',
        'xvid',
        'hdr',
        'hdma',
        'hevc',
        'h264',
        'vhs',
        'bluray',
        'hdcam',
        'brrip',
        'blu-ray',
        'dts',
        'hc',
        '7.1',
        'truehd',
        '6ch',
        'ac3',
        'x265',
        'dd5',
        '1ch',
        '2ch',
        '3ch',
        '4ch',
        '5ch',
        '6ch',
        '7ch',
        '8ch',
        ' ch ',
        'yify',
        'swesub',
        'etrg',
        'hq',
        'webrip',
        '4k',
        'dual audio',
        'legenda',
        '80p',
        'jyk',
        ' web ',
        ' dl ',
        ' eng ',
        ' subs ',
        'anoxmous',
        'bokutox',
        'gaz',
        'rarbg',
        'rifftrax',
        'fgt',
        'x260bit',
        'bdrip',
        ' ita ',
        ' swe ',
        ' pal ',
        'dvdr',
        ' evo ',
        'evo ',
        ' evo',
        'blu ray',
        'h 264',
        'hazmatt',
        'ntsc',
        'ozlem',
        'lkrg',
        ' pal ',
        ' jpn ',
        ' jap',
        ' jap ',
        ' hd ',
        ' multi ',
        '1080',
        '264',
        'dvdscr',
        'badassmedia',
        'audiozpirate',
        'shaanig',
        'remastered',
        'plinkett',
        'theatrical cut',
        ' ws',
        'directors cut',
        'uncut',
        'theatrical',
        'nydic',
        'debtvid',
        '4rrived',
        'amzndl',
        'extended',
        'dublado',
        'vppv',
        'movie4u',
        'rapta',
        'hdtv',
        'haggebulle',
        'mysilu',
        'sparks',
        'cinefile',
        ' ip',
        'gsftx',
        'mkvcage',
        'ultrahd',
        'amiable',
        'nelly45',
        'mastered',
        'molpol',
        'sujadir',
        'Sujaidr',
        'hassman',
        'korsub',
        'nvee',
        'ctrlhd',
        'Iextv',
        ' gb ',
        'by stress',
        ' pt ',
        ' br ',
        ' ddp ',
        ' ntg',
        ' ddl ',
        ' 0dl ',
        ' dd',
        '0bit',
        'atmos',
        'x26',
        'ma poop',
        'poop',
        'Nlu002',
        'New Mr Hive',
        'Thadogg',
        'Bugz',
        'cm8',
        'Netflixdl',
        '10bit',
        'Qoq',
        'Jalucian',
        'soltu',
        'Earnest54',
        'Tomcat12',
        'Multisub',
        'Higode',
        'Fullbr',
        'Bitloks',
        'Gogo',
        'imax',
        'Bitloks',
        'unrated',
        'Despecialized',
        'Japhson',
        'Ganool',
        '1xbet',
        'Publichd',
        'Gcjm',
        'Criterion',
        'Hmaxdl',
        'Repack',
        'Shiv@',
        ' Srt ',
        'M2tv',
    ];

    let index = 1;
    const log = (debug, msg, output) => {
        if (debug) {
            console.log(msg);
            console.log(index + ': ' + output)
            index++;
        }
    };

    let newName = name;
    log(debug, 'File name', newName);

    newName = newName.replace(/5\.1/g, ' ');
    log(debug, 'Replace 5.1', newName);

    newName = newName.replace(/7\.1/g, ' ');
    log(debug, 'Replace 7.1', newName);

    let nameParts = newName.split('.');
    nameParts.pop(); // remove last part ie extension, like .avi
    newName = nameParts.join(' ').toLowerCase();
    log(debug, 'Remove file extension', newName);

    newName = newName.replace(/\[([a-zA-Z0-9_\- ]){0,100}]/g, ''); // Remove stuff in brackets
    log(debug, 'Remove stuff in brackets', newName);

    newName = newName.replace(/\(([^\)]+)\)/g, ''); // Remove stuff in parentheses
    log(debug, 'Remove stuff in parentheses', newName);

    newName = newName.replace(/(19[0-9]{1,2})|(20[0-9]{1,2})/g, '').trim(); // Remove years like 1985 or 2012
    log(debug, 'Remove years', newName);

    newName = newName.replace(/[=-]|{|}|\[|\]|\_|\+\@\&/g, ' '); // Remove special characters
    log(debug, 'Remove special characters', newName);

    FILTER.forEach(x => {
        newName = newName.replace(x.toLowerCase(), '');
    });
    log(debug, 'Filter specific words', newName);

    newName = newName.replace('-', ' ');
    log(debug, 'Remove dashes', newName);

    newName = newName.replace(/\s\s+/g, ' '); // Remove multiple spaces
    log(debug, 'Remove multiple spaces', newName);

    newName = newName.trim();

    let done = false;
    [' 0', ' part 1', ' part 3', ' 1 2', ' R4 3lt0n', ' srt', ' hysterical', ' Csg', ' 1 3', ' juggs', ' hive', ' Kingdom', ' veto', ' Soup', ' Animation Ita', ' svennen', ' Hdsi', ' Docu', ' Rude', ' Version Wiz', ' Svensk Mr Keff', ' part 2', ' Chd', ' r', ' &', ' ma', ' m', ' 1 2 gb iextv', ' subs', ' s give cm8', ' gopo', ' psa', ' 0 2', ' 0 1', ' dc', ' s hive', ' L', ' 1 3', ' new mr hive', ' New Mr', ' m', ' true', ' 0 cut', ' mgb', ' buddha', ' acc', 'ultimate', ' Oficial R4 Corumba', ' remake', ' 93 Son'].forEach(x => {
        if (!done && newName.endsWith(x.toLowerCase())) {
            newName = newName.slice(0, (x.length * -1)); // Remove certain trailing characters/words
            //done = true; // Only do this once, therefore the flag done
        }
    });
    done = false;
    ['pl ', 'blow ', '04 ', '01 ', '02 ', '03 ', 'Inc ', 'Invan ', 'Bubby'].forEach(x => {
        if (!done && newName.startsWith(x.toLowerCase())) {
            newName = newName.substring(x.length); // Remove certain preceding characters/words
            //done = true;
        }
    });

    newName = newName.split(' ').map(word => capitalizeFirstLetter(word)).join(' ');
    log(debug, 'Capitalize first letter of each word', newName);

    newName = newName.trim();

    return newName;
};

const readMovie = (path, type) => {
    return new Promise(resolve => {
        ffmpeg.ffprobe(path, (err, metadata) => {
            if (err) {
                console.error(err);
            } else {
                // metadata should contain 'width', 'height' and 'display_aspect_ratio'
                const pathParts = metadata.format.filename.split('/');
                console.log('Read metadata for movie ' + pathParts[pathParts.length - 1]);

                let sizeInMB = metadata.format.size / (1024 * 1024);
                sizeInMB = Math.round(sizeInMB * 100) / 100;
                
                let seconds;
                let formattedDuration;
                if (type === TYPES.VIDEO_FILE && metadata.format.duration && typeof metadata.format.duration === 'number') {
                    seconds = Math.round(metadata.format.duration);

                    const minutes = Math.round(metadata.format.duration / 60);
                    const hours = Math.floor(minutes / 60);
                    const minutesLeft = minutes % 60;

                    if (hours >= 1) {
                        formattedDuration = `${hours}h ${minutesLeft}min`;
                    } else {
                        formattedDuration = `${minutesLeft}min`;
                    }
                } else {
                    formattedDuration = 'N/A';
                }
                const formattedSize = formatSize(sizeInMB);
                const videoStream = (metadata.streams && metadata.streams.length > 0) ? metadata.streams.find(x => x.codec_type === 'video') : null;
                const audioStream = (metadata.streams && metadata.streams.length > 0) ? metadata.streams.find(x => x.codec_type === 'audio') : null;

                library.push({
                    name: pathParts[pathParts.length - 1],
                    normalizedName: normalizeName(pathParts[pathParts.length - 1]),
                    yearProduced: getYear(pathParts[pathParts.length - 1]),
                    path: metadata.format.filename,
                    format_name: metadata.format.format_name,
                    sizeInMB,
                    videoStream: videoStream ? {
                        bit_rate: videoStream.bit_rate,
                        mpeg4: videoStream.mpeg4,
                        resolution: {
                            width: videoStream.width,
                            height: videoStream.height    
                        }
                    } : undefined,
                    audioStream: audioStream ? {
                        bit_rate: audioStream.bit_rate,
                        channels: audioStream.channels,
                        channel_layout: audioStream.channel_layout,
                        codec_name: audioStream.codec_name,
                    } : undefined,
                    formattedSize,
                    seconds,
                    formattedDuration
                });
                resolve();
            }
        });
    })
};

let customSettingsFiles = [];
let library = [];
let promises = [];

const readDirectory = path => {
    fs.readdirSync(path, {
        withFileTypes: true
    }).forEach(x => {
        if (x.isFile() && isMovieFile(x.name)) {
            if (!x.name.toLowerCase().includes('sample')) {
                const promise = readMovie(path + '/' + x.name, TYPES.VIDEO_FILE);
                promises.push(promise);
            }
        } else if (x.isFile() && isDvdMovie(x.name)) {
            const promise = readMovie(path + '/' + x.name, TYPES.DVD);
            promises.push(promise);
        } else if (x.isFile() && x.name === 'custom.json') {
            console.log('custom settings file found');
            console.log(path + '/' + x.name)
            customSettingsFiles.push(path + '/' + x.name);
        } else if (x.isDirectory()) {
            readDirectory(path + '/' + x.name);
        }
    });
};

const formatSize = sizeInMb => {
    sizeInMb = Math.round(sizeInMb);
    if (sizeInMb < 1000) {
        return sizeInMb + ' Mb';
    } else {
        let gigs = (sizeInMb / 1000);
        gigs = Math.round(gigs * 10) / 10;
        return gigs + ' Gb';
    }
};

const readAllCustomSettingsFiles = library => {
    return new Promise(resolve => {
        console.log('Read all custom.json files');
        const customSettings = [];
        const customSettingsPromises = [];

        customSettingsFiles.forEach(filePath => {
            const promise = new Promise((res, rej) => {
                fs.readFile(filePath, "utf-8", (err, data) => {
                    console.log('Read file ' + filePath);
                    if (data) {
                        customSettings.push({
                            path: filePath,
                            data: data
                        });
                        res();
                    } else {
                        console.error('Could not read custom file');
                        console.error(err);
                        rej();
                    }
                });
            });
            customSettingsPromises.push(promise);
        });
        return Promise.all(customSettingsPromises).then(() => {
            console.log(JSON.stringify(customSettings), null, 4);
            customSettings.forEach(c => {
                let parts = c.path.split('/');
                parts.pop();
                const pathForCustomJsonFile = parts.join('/');
                const movie = library.find(x => {
                    let parts = x.path.split('/');
                    parts.pop();
                    return parts.join('/') === pathForCustomJsonFile;
                });
                if (movie) {
                    movie.customSettings = JSON.parse(c.data);
                }
            });
        }).then(() => {
            console.log(JSON.stringify(customSettings, null, 4));
            resolve();
        }).catch(console.error);
    });
}

const readAllInDirectory = path => {
    return new Promise(resolve => {
        // Reset library list
        library = [];
        promises = [];
        customSettingsFiles = [];
        readDirectory(path);

        Promise.all(promises).then(() => {
            // Assign IDs
            library.forEach((movie, i) => {
                movie.id = i;
            });

            if (settings.scanDataFromIMDB) {
                console.log('Will read movie data from IMDB');
                readAllCustomSettingsFiles(library).then(() => {
                    console.log('All custom.json files read');
                    // Slice for testing limited amount
                    //library = library.slice(0, 100);
        
                    // Fetch IMDB links
                    const imdbPromises = [];
                    const totalLength = library.length;
        
                    let promiseCompleteCounter = 0;
        
                    library.forEach((movie, index) => {
                        const promise = imdbScraper.getImdbDataForMovie(
                            movie.normalizedName,
                            movie.yearProduced,
                            movie.customSettings,
                            index * 1000 // Delay
                        ).then(imdbData => {
                            if (imdbData === 'NO_LINK_IDENTIFIED') {
                                movie.imdbData = undefined;
                            } else {
                                movie.imdbData = imdbData;
                            }
                            console.log(`Loaded movie ${promiseCompleteCounter + 1} of ${totalLength} - ${movie.normalizedName}`);
                            promiseCompleteCounter++;
                        }).catch(console.error);
                        imdbPromises.push(promise);
                    });
                    Promise.all(imdbPromises).then(() => {
                        console.log('SCAN OF DIRECTORY COMPLETE')
                        resolve(library);
                    }).catch(console.error);
                }).catch(console.error);
            } else {
                console.log('Skipping IMDB scan');
                console.log('SCAN OF DIRECTORY COMPLETE')
                resolve(library);
            }
        });
    });
};

const tableFriendlyFormat = table => {
    const newTable = table.map(x => ({
        normalizedName: x.normalizedName,
        yearProduced: x.yearProduced,
        duration: x.formattedDuration,
        size: x.formattedSize
    }));
    // Sort by normalized name
    newTable.sort((a, b) => a.imdbLink - b.imdbLink);
    return newTable;
};


var directoryReader = {
    readAllInDirectory,
    tableFriendlyFormat,
    normalizeName
};

module.exports = directoryReader