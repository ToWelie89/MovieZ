const fetch = require('node-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();

const delay = ms => new Promise(resolve => {
    setTimeout(resolve, ms);
});

const getImdbPageContentBySelector = (document, selector, attribute = 'innerHTML', stripHTML = false) => {
    let element = document.querySelector(selector)
    if (element && element[attribute]) {
        if (stripHTML) {
            // TODO 
            return element[attribute];
        } else {
            return element[attribute];
        }
    } else {
        return 'N/A';
    }
}

const lookupMoviePage = link => {
    return new Promise(resolve => {
        fetch(link).then(resp => resp.text()).then(linkPageHtml => {
            resolve(linkPageHtml);
        }).catch(console.error)
    });
}

const searchForMovieAndLookupPage = (movieName, year) => {
    return new Promise(resolve => {
        const baseURL = 'https://www.imdb.com/find?s=tt&q=';
        const params = movieName.split(' ').join('+');
        let URL = baseURL + params;
        if (year && year !== 'N/A') {
            URL += ('+' + year);
        }
        fetch(URL).then(resp => resp.text()).then(html => {
            const dom = new JSDOM(html);
            const document = dom.window.document;
    
            const list = [...document.querySelectorAll('.findList .findResult')]
                .filter(x => !x.querySelector('.result_text').innerHTML.toLowerCase().includes('tv episode'))
                .filter(x => !x.querySelector('.result_text').innerHTML.toLowerCase().includes('video game'))
                .filter(x => !x.querySelector('.result_text').innerHTML.toLowerCase().includes('tv series'))
                .filter(x => !x.querySelector('.result_text').innerHTML.toLowerCase().includes('podcast episode'))
    
            let link;
            if (list && list[0] && list[0].querySelector('a')) {
                const persumedMatch = list[0];
                link = 'https://www.imdb.com' + persumedMatch.querySelector('a').getAttribute('href').split('?')[0];

                lookupMoviePage(link).then(html => {
                    resolve({ html, link });
                }).catch(console.error);
            } else {
                console.error('No Link found for movie ' + movieName + ' ' + year);
                resolve(undefined); // No link found
            }
        }).catch(console.error)
    });
};

const scrapeDataFromMoviePage = (linkPageHtml, link) => {
    return new Promise(resolve => {
        const dom = new JSDOM(linkPageHtml);
        const document = dom.window.document;
    
        // Plot
        let plot = getImdbPageContentBySelector(document, '[data-testid=plot-xs_to_m]', 'innerHTML', true);
        if (!plot || plot === 'N/A') {
            plot = getImdbPageContentBySelector(document, '[data-testid=plot-l]', 'innerHTML', true);
        }
        if (!plot || plot === 'N/A') {
            plot = getImdbPageContentBySelector(document, '[data-testid=plot-xl]', 'innerHTML', true);
        }

        const movieName = getImdbPageContentBySelector(document, 'h1[data-testid=hero-title-block__title]');
        const originalTitle = getImdbPageContentBySelector(document, '[data-testid=hero-title-block__original-title]').replace('Original title: ', '');
        const score = getImdbPageContentBySelector(document, 'div[data-testid=hero-rating-bar__aggregate-rating__score] span');
        const poster = getImdbPageContentBySelector(document, '.ipc-poster .ipc-media img', 'src');
    
        // Try to identify what language the movie name and the original movie title are
        const originalTitleLanguage = lngDetector.detect(originalTitle, 4);
        const movieNameLanguage = lngDetector.detect(movieName, 4);
    
        const imdbId = link.match(/tt[0-9]{3,12}/)[0];
    
        let director;
        let stars = [];
        [...document.querySelectorAll('.ipc-metadata-list-item__label')].forEach(x => {
            if (!director && x.innerHTML.includes('Director')) {
                director = x.nextElementSibling.querySelector('ul li a').innerHTML;
            } else if (stars.length === 0 && x.innerHTML.includes('Stars')) {
                let next = x.nextElementSibling;
                if (next) {
                    let starsElements = next.querySelectorAll('ul li');
                    if (starsElements && starsElements.length > 0) {
                        starsElements.forEach(se => {
                            let el = se.querySelector('a');
                            if (el) {
                                stars.push(se.querySelector('a').innerHTML);
                            }
                        })
                    }
                }
            }
        });
        const genres = [];
        if (document.querySelectorAll('.ipc-chip-list__scroller') && document.querySelectorAll('.ipc-chip-list__scroller').length > 0) {
            [...document.querySelectorAll('.ipc-chip-list__scroller')[0].querySelectorAll('.ipc-chip__text')].forEach(x => genres.push(x.innerHTML));
        }
        // Get year
        let year;
        const links = [...document.querySelectorAll('.ipc-inline-list__item')];
        if (links) {
            const firstLinkWithAYear = links.find(x => {
                let span = x.querySelector('span');
                if (span) {
                    const matches = span.innerHTML.match(/(19[0-9]{1,2})|(20[0-9]{1,2})/g, ''); // Regex for year format eg 1995 or 2017
                    if (matches && matches[0]) {
                        return true;
                    } else {
                        return false;
                    }
                }  
            });
            if (firstLinkWithAYear) {
                year = firstLinkWithAYear.querySelector('span').innerHTML;
            }
        }
        resolve({
            link,
            imdbId,
            year,
            plot,
            movieName,
            movieNameLanguage,
            originalTitle,
            originalTitleLanguage,
            poster,
            score,
            director,
            stars,
            genres
        });
    });
};

const getImdbDataForMovie = (movieName, year = undefined, customSettings, delayInMs = undefined) => {
    return new Promise(resolve => {
        return (delayInMs ? delay(delayInMs) : Promise.resolve()).then(() => {
            if (customSettings && customSettings.imdbData && customSettings.imdbData.imdbId) {
                console.log(movieName + ' has custom settings');
                // Custom IMDB id defined, override search algorithm
                console.log('Custom settings exists for movie ' + movieName);
                const link = `https://www.imdb.com/title/${customSettings.imdbData.imdbId}/`;
                lookupMoviePage(link).then(moviePageHtml => {
                    scrapeDataFromMoviePage(moviePageHtml, link).then(result => {
                        resolve(result);
                    }).catch(console.error);
                }).catch(console.error);
            } else {
                searchForMovieAndLookupPage(movieName, year).then(response => {
                    if (response && response.link) {
                        scrapeDataFromMoviePage(response.html, response.link).then(result => {
                            resolve(result);
                        }).catch(console.error);
                    } else {
                        console.error('Could not scrape IMDB data for movie ' + movieName);
                        resolve(undefined);
                    }
                }).catch(console.error);
            }
        });
    }).catch(console.error);
};

var imdbScraper = {
    getImdbDataForMovie
};

module.exports = imdbScraper;