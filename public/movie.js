const API_KEY = 'api_key=3329c2a65cf5820d22458d06284c19ae';
        const BASE_URL = 'https://api.themoviedb.org/3';
        const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
        const IMG_URL = 'https://image.tmdb.org/t/p/w500';
        const searchURL = BASE_URL + '/search/movie?'+API_KEY;
    document.addEventListener('DOMContentLoaded', () => {
    
    const knowMoreButtons = document.querySelectorAll('.know-more');
    knowMoreButtons.forEach(button => {
        button.addEventListener('click', async () => {
            // Check if the user is logged in
            localStorage.setItem('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWQ0OTEyMTY4MmMyOGE1ZWFmNGYxMTAiLCJpYXQiOjE3MDg1NTAzNzcsImV4cCI6MTcxMTE0MjM3N30.uj5kKb0TG5mVHIKJisFwjrL-JR5kkI9l_cHyhjWMx7w') 
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
});

// Function to show videos and dots
function showVideos() {
    const embeds = document.querySelectorAll('.embed');
    const dotsContainer = document.querySelector('.dots');

    // Display the first video, hide others
    embeds.forEach((embed, idx) => {
        if (idx === activeSlide) {
            embed.classList.remove('hide');
            embed.classList.add('show');
        } else {
            embed.classList.remove('show');
            embed.classList.add('hide');
        }
    });

    // Clear existing dots
    dotsContainer.innerHTML = '';

    // Add a single dot
    const dot = document.createElement('span');
    dot.classList.add('dot', 'active');
    dot.innerText = '1'
    dotsContainer.appendChild(dot);
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

    // Function to highlight selected genres
    function highlightSelectedGenres(selectedGenre) {
        const tags = document.querySelectorAll('.tag');
        tags.forEach(tag => {
            // Check if the tag's id matches any selected genre
            if (selectedGenre.includes(tag.id)) {
                tag.classList.add('highlight'); // Add highlight class if selected
            } else {
                tag.classList.remove('highlight'); // Remove highlight class if not selected
            }
        });
    }

    // Get initial selected genres from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const genreParam = urlParams.get('genre');
    const selectedGenre = genreParam ? genreParam.split(',') : [];

    // Call highlightSelectedGenres function with initial selected genres
    highlightSelectedGenres(selectedGenre);

    // Add event listener to genre tags
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const genreId = tag.id;
            if (genreId === 'clear') {
                // Clear selected genres
                selectedGenre.length = 0;
            } else {
                const index = selectedGenre.indexOf(genreId);
                if (index !== -1) {
                    selectedGenre.splice(index, 1); // Deselect the genre if already selected
                } else {
                    selectedGenre.push(genreId); // Select the genre if not selected
                }
            }
            highlightSelectedGenres(selectedGenre); // Update the highlighted genres
            // Redirect to /movies route with genre query parameter
            window.location.href = `/${selectedGenre.length > 0 ? `?genre=${selectedGenre.join(',')}` : ''}`;
        });
    });

    // Pagination functionality
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    const current = document.getElementById('current');

    prev.addEventListener('click', () => {
        const prevPage = parseInt(current.textContent) - 1;
        if (prevPage >= 1) {
            window.location.href = `/?page=${prevPage}`;
        }
    });

    next.addEventListener('click', () => {
        const nextPage = parseInt(current.textContent) + 1;
        window.location.href = `/?page=${nextPage}`;
    });

 // Function to handle logout
    function logout() {
        // Check if the user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            // If user is logged in, remove token from localStorage
            localStorage.removeItem('token');
            // Display logout message
            const logoutMessage = document.getElementById('logout');
            logoutMessage.style.display = 'block';
            // Hide error message (if visible)
            const errorMessage = document.getElementById('logoutError');
            errorMessage.style.display = 'none';
            // Set timeout to hide the logout message after 3 seconds
            setTimeout(() => {
                logoutMessage.style.display = 'none';
            }, 3000);
            // You can redirect to the login page or perform any other action after logout
            // Example: window.location.href = '/login';
            console.log('User logged out successfully.');
        } else {
            // If user is not logged in, display error message
            const errorMessage = document.getElementById('logoutError');
            errorMessage.style.display = 'block';
            // Hide logout message (if visible)
            const logoutMessage = document.getElementById('logout');
            logoutMessage.style.display = 'none';
            // Set timeout to hide the error message after 3 seconds
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 3000);
            // You can also display a message to the user indicating that they are not logged in
            // Example: alert('User is not logged in.');
            console.log('User is not logged in.');
        }
    }

    // Call the logout function when the logout button is clicked
    document.getElementById('logout-button').addEventListener('click', logout);
