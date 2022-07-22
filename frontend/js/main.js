const socket = io();

let library;

const renderStartView = () => {
    let html = '';
    library.forEach(movie => {
        html += `
            <div class="movieBox" movie-id="${movie.id}">
                <img src="${(movie.imdbData && movie.imdbData.poster !== 'N/A') ? movie.imdbData.poster : 'frontend/assets/noPoster.png'}" alt="${movie.path}" />
                <p>
                    ${movie.normalizedName}
                </p>
            </div>
        `;
    });
    document.getElementById('movieLibrary').innerHTML = html;
    setListeners();
};

const renderMovieView = movie => {
    document.querySelector('#movieInfo #movieName').innerText = movie.normalizedName;
    document.querySelector('#movieInfo #movieMainStats #year').innerText = movie.yearProduced;
    document.querySelector('#movieInfo #movieMainStats #rating #imdbRating').innerText = movie.imdbData.score;
    document.querySelector('#moviePageBody #plot').innerText = movie.imdbData.plot;
    document.querySelector('#movieTrailer #iframeContainer').innerHTML = `
    <iframe
        src="https://www.youtube.com/embed/DNHuK1rteF4?controls=0&autoplay=1"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
    </iframe>
    `;
};

const clickMovieBoxListener = (ev, id) => {
    const clickedMovie = library.find(x => x.id === Number(id));
    console.log(clickedMovie);

    renderMovieView(clickedMovie);

    //document.querySelector('#movieTrailer iframe').contentWindow.document.querySelector('.ytp-watermark').style.display = 'none';

    document.getElementById('outerWrapper').classList.add('moviePageVisible');
    [...document.querySelectorAll('#movieLibrary, #moviePage')].forEach(x => x.classList.add('slideToLeft'));
};

const setListeners = () => {
    [...document.querySelectorAll('.movieBox')].forEach(x => {
        x.addEventListener('click', ev => {
            clickMovieBoxListener(ev, x.getAttribute('movie-id'));
        });
    })
}

socket.on('socket', libraryFromBackend => {
    library = libraryFromBackend;
    renderStartView();    
});