module.exports = {
    // This is the most important thing, set the full path to your folder where you store all your movies
    // The folder should preferrably only contain movie files, reading will be faster if there are less non-movie-files present
    directory: 'G:/Videos/Filmer',
    // If true MovieZ will try to fetch data from IMDB, like movie poster image, plot, director, actors involved, IMDB rating and so on
    // This will give more insight to the user, but it will also radically increase the initial setup time as MovieZ has to fetch IMDB data for every movie in your directory
    // Turn this off for faster initial load time, or if you want MovieZ to work offline
    scanDataFromIMDB: true,
    // Decide if you want to cache movie data locally on your computer. Recommended that you set to "true".
    // If true, MovieZ will remember data for movies that has already been scanned once, and therefore not scan them again. This will reduce loading time on setup.
    // You can always remove the cache from /backend/cache/cache.json
    cacheData: true,
};