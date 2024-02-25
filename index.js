import express from "express";
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from "body-parser";
import fetch from 'node-fetch';

import { registerValidaation, loginValidator } from './validation.js'

import { UserController } from './controllers/index.js'

import { handleValidationErrors, checkAuth } from './utils/index.js'

import UserModel from './modules/user.js'

const app = express();
const port = 3000;
app.use(cors())
const router = express.Router();
app.use(express.json()); // Read JSON request bodies
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect(
    'mongodb+srv://admin:admin@cluster0.2re14nq.mongodb.net/finalProject'
).then(() => {
    console.log('db connection')
}).catch((err) => {
    console.log('error connecting to db', err)
})

const checkAdminRole = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (email === 'admin@gmail.com') {
            req.role = 'admin';
        } else {
            req.role = 'user';
        }
        next();
    } catch (error) {
        console.error('Error checking admin role:', error);
        res.status(500).send('Failed to check admin role.');
    }
};

app.get('/login', (req, res) => {
    res.render('login')
}) 

app.get('/auth/login', (req, res) => {
    res.render('login')
})
app.get('/signup', (req, res) => {
    res.render('register')
})

app.post('/auth/login', loginValidator, handleValidationErrors, checkAdminRole,UserController.login, (req, res) => {
    res.render('movies', {
        movies: data.results,
        IMG_URL: IMG_URL,
        getColor: getColor,
        genres: genres,
        currentPage: parseInt(page || 1),
        totalPages: data.total_pages
    });
}) 
app.get('/admin', async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await UserModel.find();

        // Assign roles based on email
        users.forEach(user => {
            if (user.email === 'admin@gmail.com') {
                user.role = 'admin';
            } else {
                user.role = 'user';
            }
        });

        // Render the admin.ejs template with the users data
        res.render('admin', { users: users }); // Ensure that the variable name matches the one used in the template
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Failed to fetch users.');
    }
});
// Route to handle user editing
app.post('/edit-user', async (req, res) => {
    const { userId, newName } = req.body;
    try {
        // Update user's name in the database
        await UserModel.findByIdAndUpdate(userId, { fullName: newName });
        res.redirect('/admin'); // Redirect to the users page after editing
    } catch (error) {
        console.error('Error editing user:', error.message);
        res.status(500).send('Failed to edit user.');
    }
});

// Route to handle user deletion
app.post('/admin/delete-user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        // Delete user from the database
        await UserModel.findByIdAndDelete(userId);
        res.redirect('/admin'); // Redirect to the users page after deletion
        
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).send('Failed to delete user.');
    }
});

/* get Login and password through json  */ 
app.post('/auth/register', registerValidaation, handleValidationErrors, UserController.register,(req, res) => {
    res.render('login')
})
 
/* Function middleware(посредник) checkAuth */
app.get('/auth/me', checkAuth, UserController.getMe, (req, res) => {
    res.send("work")
})



function getColor(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

// List of genres
const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
];

/* app.get('/movies', async (req, res) => {
    // Render the movies.ejs template
    const data = await response.json();
    res.render('movies', {
        movies: data.results,
        IMG_URL: IMG_URL,
        getColor: getColor,
        genres: genres,
        currentPage: parseInt(page || 1),
        totalPages: data.total_pages
    });
});
 */app.get('/', async (req, res) => {
    try {
        const { page, query, genre } = req.query;
        let url = '';
        if (query) {
            url = `https://api.themoviedb.org/3/search/movie?api_key=3329c2a65cf5820d22458d06284c19ae&query=${query}&page=${page || 1}`;
        } else if (genre) {
            url = `https://api.themoviedb.org/3/discover/movie?api_key=3329c2a65cf5820d22458d06284c19ae&with_genres=${genre}&page=${page || 1}`;
        } else {
            url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3329c2a65cf5820d22458d06284c19ae&page=${page || 1}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        

        const IMG_URL = 'https://image.tmdb.org/t/p/w500';
        // Assuming data.results contains the movie data
        res.render('movies', {
            movies: data.results, // Pass movie data to the EJS template
            IMG_URL: IMG_URL,
            getColor: getColor,
            genres: genres,
            currentPage: parseInt(page || 1),
            totalPages: data.total_pages
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.render('error', { message: 'An error occurred while fetching data from the API.' });
    }
});


app.get('/search', (req, res) => {
    const { query } = req.query;
    res.redirect(`/?query=${query}`);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
