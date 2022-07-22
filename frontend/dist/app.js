(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var socket = io();

var library = void 0;

var renderStartView = function renderStartView() {
    var html = '';
    library.forEach(function (movie) {
        html += '\n            <div class="movieBox" movie-id="' + movie.id + '">\n                <img src="' + (movie.imdbData && movie.imdbData.poster !== 'N/A' ? movie.imdbData.poster : 'frontend/assets/noPoster.png') + '" alt="' + movie.path + '" />\n                <p>\n                    ' + movie.normalizedName + '\n                </p>\n            </div>\n        ';
    });
    document.getElementById('movieLibrary').innerHTML = html;
    setListeners();
};

var renderMovieView = function renderMovieView(movie) {
    document.querySelector('#movieInfo #movieName').innerText = movie.normalizedName;
    document.querySelector('#movieInfo #movieMainStats #year').innerText = movie.yearProduced;
    document.querySelector('#movieInfo #movieMainStats #rating #imdbRating').innerText = movie.imdbData.score;
    document.querySelector('#moviePageBody #plot').innerText = movie.imdbData.plot;
    document.querySelector('#movieTrailer #iframeContainer').innerHTML = '\n    <iframe\n        src="https://www.youtube.com/embed/DNHuK1rteF4?controls=0&autoplay=1"\n        title="YouTube video player"\n        frameborder="0"\n        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">\n    </iframe>\n    ';
};

var clickMovieBoxListener = function clickMovieBoxListener(ev, id) {
    var clickedMovie = library.find(function (x) {
        return x.id === Number(id);
    });
    console.log(clickedMovie);

    renderMovieView(clickedMovie);

    //document.querySelector('#movieTrailer iframe').contentWindow.document.querySelector('.ytp-watermark').style.display = 'none';

    document.getElementById('outerWrapper').classList.add('moviePageVisible');
    [].concat(_toConsumableArray(document.querySelectorAll('#movieLibrary, #moviePage'))).forEach(function (x) {
        return x.classList.add('slideToLeft');
    });
};

var setListeners = function setListeners() {
    [].concat(_toConsumableArray(document.querySelectorAll('.movieBox'))).forEach(function (x) {
        x.addEventListener('click', function (ev) {
            clickMovieBoxListener(ev, x.getAttribute('movie-id'));
        });
    });
};

socket.on('socket', function (libraryFromBackend) {
    library = libraryFromBackend;
    renderStartView();
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udGVuZC9qcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBLElBQU0sU0FBUyxJQUFmOztBQUVBLElBQUksZ0JBQUo7O0FBRUEsSUFBTSxrQkFBa0IsU0FBbEIsZUFBa0IsR0FBTTtBQUMxQixRQUFJLE9BQU8sRUFBWDtBQUNBLFlBQVEsT0FBUixDQUFnQixpQkFBUztBQUNyQixtRUFDc0MsTUFBTSxFQUQ1Qyx1Q0FFcUIsTUFBTSxRQUFOLElBQWtCLE1BQU0sUUFBTixDQUFlLE1BQWYsS0FBMEIsS0FBN0MsR0FBc0QsTUFBTSxRQUFOLENBQWUsTUFBckUsR0FBOEUsOEJBRmxHLGdCQUUwSSxNQUFNLElBRmhKLHVEQUljLE1BQU0sY0FKcEI7QUFRSCxLQVREO0FBVUEsYUFBUyxjQUFULENBQXdCLGNBQXhCLEVBQXdDLFNBQXhDLEdBQW9ELElBQXBEO0FBQ0E7QUFDSCxDQWREOztBQWdCQSxJQUFNLGtCQUFrQixTQUFsQixlQUFrQixRQUFTO0FBQzdCLGFBQVMsYUFBVCxDQUF1Qix1QkFBdkIsRUFBZ0QsU0FBaEQsR0FBNEQsTUFBTSxjQUFsRTtBQUNBLGFBQVMsYUFBVCxDQUF1QixrQ0FBdkIsRUFBMkQsU0FBM0QsR0FBdUUsTUFBTSxZQUE3RTtBQUNBLGFBQVMsYUFBVCxDQUF1QixnREFBdkIsRUFBeUUsU0FBekUsR0FBcUYsTUFBTSxRQUFOLENBQWUsS0FBcEc7QUFDQSxhQUFTLGFBQVQsQ0FBdUIsc0JBQXZCLEVBQStDLFNBQS9DLEdBQTJELE1BQU0sUUFBTixDQUFlLElBQTFFO0FBQ0EsYUFBUyxhQUFULENBQXVCLGdDQUF2QixFQUF5RCxTQUF6RDtBQVFILENBYkQ7O0FBZUEsSUFBTSx3QkFBd0IsU0FBeEIscUJBQXdCLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBWTtBQUN0QyxRQUFNLGVBQWUsUUFBUSxJQUFSLENBQWE7QUFBQSxlQUFLLEVBQUUsRUFBRixLQUFTLE9BQU8sRUFBUCxDQUFkO0FBQUEsS0FBYixDQUFyQjtBQUNBLFlBQVEsR0FBUixDQUFZLFlBQVo7O0FBRUEsb0JBQWdCLFlBQWhCOztBQUVBOztBQUVBLGFBQVMsY0FBVCxDQUF3QixjQUF4QixFQUF3QyxTQUF4QyxDQUFrRCxHQUFsRCxDQUFzRCxrQkFBdEQ7QUFDQSxpQ0FBSSxTQUFTLGdCQUFULENBQTBCLDJCQUExQixDQUFKLEdBQTRELE9BQTVELENBQW9FO0FBQUEsZUFBSyxFQUFFLFNBQUYsQ0FBWSxHQUFaLENBQWdCLGFBQWhCLENBQUw7QUFBQSxLQUFwRTtBQUNILENBVkQ7O0FBWUEsSUFBTSxlQUFlLFNBQWYsWUFBZSxHQUFNO0FBQ3ZCLGlDQUFJLFNBQVMsZ0JBQVQsQ0FBMEIsV0FBMUIsQ0FBSixHQUE0QyxPQUE1QyxDQUFvRCxhQUFLO0FBQ3JELFVBQUUsZ0JBQUYsQ0FBbUIsT0FBbkIsRUFBNEIsY0FBTTtBQUM5QixrQ0FBc0IsRUFBdEIsRUFBMEIsRUFBRSxZQUFGLENBQWUsVUFBZixDQUExQjtBQUNILFNBRkQ7QUFHSCxLQUpEO0FBS0gsQ0FORDs7QUFRQSxPQUFPLEVBQVAsQ0FBVSxRQUFWLEVBQW9CLDhCQUFzQjtBQUN0QyxjQUFVLGtCQUFWO0FBQ0E7QUFDSCxDQUhEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3Qgc29ja2V0ID0gaW8oKTtcclxuXHJcbmxldCBsaWJyYXJ5O1xyXG5cclxuY29uc3QgcmVuZGVyU3RhcnRWaWV3ID0gKCkgPT4ge1xyXG4gICAgbGV0IGh0bWwgPSAnJztcclxuICAgIGxpYnJhcnkuZm9yRWFjaChtb3ZpZSA9PiB7XHJcbiAgICAgICAgaHRtbCArPSBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb3ZpZUJveFwiIG1vdmllLWlkPVwiJHttb3ZpZS5pZH1cIj5cclxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHsobW92aWUuaW1kYkRhdGEgJiYgbW92aWUuaW1kYkRhdGEucG9zdGVyICE9PSAnTi9BJykgPyBtb3ZpZS5pbWRiRGF0YS5wb3N0ZXIgOiAnZnJvbnRlbmQvYXNzZXRzL25vUG9zdGVyLnBuZyd9XCIgYWx0PVwiJHttb3ZpZS5wYXRofVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAke21vdmllLm5vcm1hbGl6ZWROYW1lfVxyXG4gICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW92aWVMaWJyYXJ5JykuaW5uZXJIVE1MID0gaHRtbDtcclxuICAgIHNldExpc3RlbmVycygpO1xyXG59O1xyXG5cclxuY29uc3QgcmVuZGVyTW92aWVWaWV3ID0gbW92aWUgPT4ge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21vdmllSW5mbyAjbW92aWVOYW1lJykuaW5uZXJUZXh0ID0gbW92aWUubm9ybWFsaXplZE5hbWU7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbW92aWVJbmZvICNtb3ZpZU1haW5TdGF0cyAjeWVhcicpLmlubmVyVGV4dCA9IG1vdmllLnllYXJQcm9kdWNlZDtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb3ZpZUluZm8gI21vdmllTWFpblN0YXRzICNyYXRpbmcgI2ltZGJSYXRpbmcnKS5pbm5lclRleHQgPSBtb3ZpZS5pbWRiRGF0YS5zY29yZTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb3ZpZVBhZ2VCb2R5ICNwbG90JykuaW5uZXJUZXh0ID0gbW92aWUuaW1kYkRhdGEucGxvdDtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb3ZpZVRyYWlsZXIgI2lmcmFtZUNvbnRhaW5lcicpLmlubmVySFRNTCA9IGBcclxuICAgIDxpZnJhbWVcclxuICAgICAgICBzcmM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9ETkh1SzFydGVGND9jb250cm9scz0wJmF1dG9wbGF5PTFcIlxyXG4gICAgICAgIHRpdGxlPVwiWW91VHViZSB2aWRlbyBwbGF5ZXJcIlxyXG4gICAgICAgIGZyYW1lYm9yZGVyPVwiMFwiXHJcbiAgICAgICAgYWxsb3c9XCJhY2NlbGVyb21ldGVyOyBhdXRvcGxheTsgY2xpcGJvYXJkLXdyaXRlOyBlbmNyeXB0ZWQtbWVkaWE7IGd5cm9zY29wZTsgcGljdHVyZS1pbi1waWN0dXJlXCI+XHJcbiAgICA8L2lmcmFtZT5cclxuICAgIGA7XHJcbn07XHJcblxyXG5jb25zdCBjbGlja01vdmllQm94TGlzdGVuZXIgPSAoZXYsIGlkKSA9PiB7XHJcbiAgICBjb25zdCBjbGlja2VkTW92aWUgPSBsaWJyYXJ5LmZpbmQoeCA9PiB4LmlkID09PSBOdW1iZXIoaWQpKTtcclxuICAgIGNvbnNvbGUubG9nKGNsaWNrZWRNb3ZpZSk7XHJcblxyXG4gICAgcmVuZGVyTW92aWVWaWV3KGNsaWNrZWRNb3ZpZSk7XHJcblxyXG4gICAgLy9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbW92aWVUcmFpbGVyIGlmcmFtZScpLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnl0cC13YXRlcm1hcmsnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRlcldyYXBwZXInKS5jbGFzc0xpc3QuYWRkKCdtb3ZpZVBhZ2VWaXNpYmxlJyk7XHJcbiAgICBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI21vdmllTGlicmFyeSwgI21vdmllUGFnZScpXS5mb3JFYWNoKHggPT4geC5jbGFzc0xpc3QuYWRkKCdzbGlkZVRvTGVmdCcpKTtcclxufTtcclxuXHJcbmNvbnN0IHNldExpc3RlbmVycyA9ICgpID0+IHtcclxuICAgIFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubW92aWVCb3gnKV0uZm9yRWFjaCh4ID0+IHtcclxuICAgICAgICB4LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXYgPT4ge1xyXG4gICAgICAgICAgICBjbGlja01vdmllQm94TGlzdGVuZXIoZXYsIHguZ2V0QXR0cmlidXRlKCdtb3ZpZS1pZCcpKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pXHJcbn1cclxuXHJcbnNvY2tldC5vbignc29ja2V0JywgbGlicmFyeUZyb21CYWNrZW5kID0+IHtcclxuICAgIGxpYnJhcnkgPSBsaWJyYXJ5RnJvbUJhY2tlbmQ7XHJcbiAgICByZW5kZXJTdGFydFZpZXcoKTsgICAgXHJcbn0pOyJdfQ==
