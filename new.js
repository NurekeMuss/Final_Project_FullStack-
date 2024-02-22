const API_KEY = 'api_key=3329c2a65cf5820d22458d06284c19ae';
const BASE_URL = 'https://api.themoviedb.org/3';
let API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}&language=en-US`;
let searchURL = `${BASE_URL}/search/movie?${API_KEY}`;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('language-select');
    const knowMoreButtons = document.querySelectorAll('.know-more');
    knowMoreButtons.forEach(button => {
    button.addEventListener('click', async () => {
        // Check if the user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            // Display error message
            const errorMessage = document.getElementById('error');
            errorMessage.style.display = 'block';
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 3000);
            return;
        }

            // If the user is logged in, proceed with fetching the video data and displaying the overlay
            const movieId = button.id; // Get the movie ID from the button
            openNav(movieId);
        });
    });

    languageSelect.addEventListener('change', handleLanguageChange);
    knowMoreButtons.forEach(button => button.addEventListener('click', handleKnowMoreClick));

    fetchMovies();
});

async function fetchMovies() {
    try {
        const response = await fetch(API_URL);
        const movieData = await response.json();
        updateMovies(movieData.results);
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
}

function updateMovies(movies) {
    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = '';
    movies.forEach(movie => {
        const movieElement = createMovieElement(movie);
        moviesContainer.appendChild(movieElement);
    });
}

function createMovieElement(movie) {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    movieElement.innerHTML = `
        <img src="${IMG_URL}${movie.poster_path || 'http://via.placeholder.com/1080x1580'}" alt="${movie.title}">
        <div class="movie-info">
            <h3>${movie.title}</h3>
            <span class="${getColor(movie.vote_average)}">${movie.vote_average}</span>
        </div>
        <div class="overview">
            <h3>Overview</h3>
            ${movie.overview}
            <br/> 
            <button class="know-more" id="${movie.id}">Know More</button>
        </div>
    `;
    return movieElement;
}



function getColor(vote) {
    return vote >= 8 ? 'green' : (vote >= 5 ? 'orange' : 'red');
}

async function openNav(movieId) {
    try {
        const response = await fetch(BASE_URL + '/movie/' + movieId + '/videos?' + API_KEY);
        const videoData = await response.json();

        if (videoData && videoData.results.length > 0) {
            const embed = [];
            const dots = [];

            videoData.results.forEach((video, idx) => {
                const { name, key, site } = video;

                if (site === 'YouTube') {
                    embed.push(`
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    `);

                    dots.push(`
                        <span class="dot">${idx + 1}</span>
                    `);
                }
            });

            // Check if the overlay-content element exists
            const overlayContent = document.getElementById('overlay-content');
            if (overlayContent) {
                // Set the innerHTML if the element exists
                overlayContent.innerHTML = `
                    <h1 class="no-results">Video Player</h1>
                    <br/>
                    ${embed.join('')}
                    <br/>
                    <div class="dots">${dots.join('')}</div>
                `;

                // Display the overlay
                document.getElementById("myNav").style.width = "100%";
                activeSlide = 0;
                showVideos();
            } else {
                console.error('Error: overlay-content element not found');
            }
        } else {
            // No video results found
            console.error('No video results found');
        }
    } catch (error) {
        console.error('Error fetching video data:', error);
    }
}
// Function to close the overlay
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}


function handleLanguageChange() {
    const selectedLanguage = this.value;
    API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}&language=${selectedLanguage}`;
    searchURL = `${BASE_URL}/search/movie?${API_KEY}&language=${selectedLanguage}`;
    fetchMovies();
}

function displayErrorMessage(errorId) {
    const errorMessage = document.getElementById(errorId);
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

function logout() {
    const token = localStorage.getItem('token');
    if (token) {
        localStorage.removeItem('token');
        displaySuccessMessage('logout');
        console.log('User logged out successfully.');
    } else {
        displayErrorMessage('logoutError');
        console.log('User is not logged in.');
    }
}

function displaySuccessMessage(messageId) {
    const successMessage = document.getElementById(messageId);
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

document.getElementById('logout-button').addEventListener('click', logout);

// Initial genre selection
const urlParams = new URLSearchParams(window.location.search);
const genreParam = urlParams.get('genre');
const selectedGenre = genreParam ? genreParam.split(',') : [];
highlightSelectedGenres(selectedGenre);

// Add event listener to genre tags
const tags = document.querySelectorAll('.tag');
tags.forEach(tag => {
    tag.addEventListener('click', () => {
        const genreId = tag.id;
        if (genreId === 'clear') {
            selectedGenre.length = 0;
        } else {
            const index = selectedGenre.indexOf(genreId);
            if (index !== -1) {
                selectedGenre.splice(index, 1);
            } else {
                selectedGenre.push(genreId);
            }
        }
        highlightSelectedGenres(selectedGenre);
        window.location.href = `/${selectedGenre.length > 0 ? `?genre=${selectedGenre.join(',')}` : ''}`;
    });
});

function highlightSelectedGenres(selectedGenre) {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        if (selectedGenre.includes(tag.id)) {
            tag.classList.add('highlight');
        } else {
            tag.classList.remove('highlight');
        }
    });
}

// Pagination functionality
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');

prev.addEventListener('click', () => {
    const currentPage = parseInt(current.textContent);
    if (currentPage > 1) {
        fetchDataForPage(currentPage - 1);
    }
});

next.addEventListener('click', () => {
    const currentPage = parseInt(current.textContent);
    fetchDataForPage(currentPage + 1);
});

async function fetchDataForPage(page) {
    try {
        const pageURL = `${API_URL}&page=${page}`;
        const response = await fetch(pageURL);
        const movieData = await response.json();
        updateMovies(movieData.results);
        current.textContent = page;
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
}
