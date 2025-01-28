// Import configuration and required modules
import './config.mjs';
import './db.mjs';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import sanitize from 'mongo-sanitize';
import session from 'express-session';
import * as auth from './auth.mjs';
import { fetchAndPopulateAlbums } from './spotify.mjs';
import hbs from 'hbs';
import './config.mjs'; 

// Set up paths and initialize Express app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Connect to MongoDB
console.log(process.env.DSN)
mongoose.connect(process.env.DSN);

// Configure Express app
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
    })
);

// Load Mongoose models
const User = mongoose.model('User');
const Album = mongoose.model('Album');

// ES6 Class for Featured Albums
class FeaturedAlbums {
    constructor(albums) {
        this.albums = albums;
    }

    getHighRatedAlbums(threshold) {
        return this.albums.filter((album) => album.averageRating >= threshold);
    }
}

// Middleware to set user in response locals for templates
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Middleware to enforce authentication on certain routes
const authRequiredPaths = ['/review/new'];
app.use((req, res, next) => {
    if (authRequiredPaths.includes(req.path) && !req.session.user) {
        return res.redirect('/login');
    }
    next();
});

// Routes

// Home route
app.get('/', async (req, res) => {
    try {
        const allAlbums = await Album.find({}).sort({ averageRating: -1 }).exec();
        const featured = new FeaturedAlbums(allAlbums);
        const featuredAlbums = featured.getHighRatedAlbums(4); 
        res.render('home', {
            user: req.session.user,
            featuredAlbums,
        });
    } catch (error) {
        console.error('Error fetching featured albums:', error);
        res.render('home', {
            user: req.session.user,
            featuredAlbums: [],
        });
    }
});

// Display all albums
app.get('/albums', async (req, res) => {
    const albums = await Album.find({}).sort('-releaseDate').exec();
    res.render('albumList', { albums });
});

// Search for albums
app.post('/albums/search', async (req, res) => {
    const searchQuery = req.body.query;
    let albums;

    if (searchQuery) {
        albums = await Album.find({
            $or: [
                { title: new RegExp(searchQuery, 'i') },
                { artist: new RegExp(searchQuery, 'i') },
            ],
        }).sort('-releaseDate').exec();
    } else {
        albums = await Album.find({}).sort('-releaseDate').exec();
    }

    res.render('albumList', { albums });
});

// Display a specific album by ID
app.get('/album/:id', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id).populate('reviews.user').exec();
        if (!album) {
            return res.status(404).render('404', { message: 'Album not found' });
        }
        res.render('albumDetail', { album });
    } catch (error) {
        console.error('Error fetching album:', error);
        res.status(500).render('error', { message: 'Error retrieving album' });
    }
});

// Show form to add a new review
app.get('/review/new', async (req, res) => {
    try {
        const album = await Album.findById(req.query.albumId).exec();
        if (!album) {
            return res.render('reviewForm', { error: 'Album not found' });
        }
        res.render('reviewForm', { album });
    } catch (err) {
        console.error('Error fetching album:', err);
        res.render('reviewForm', { error: 'Error loading review form' });
    }
});

// Handle form submission to add a new review
app.post('/review/new', async (req, res) => {
    try {
        const album = await Album.findById(req.body.albumId);
        if (!album) {
            return res.render('reviewForm', { error: 'Album not found' });
        }

        const review = {
            user: req.session.user._id,
            rating: sanitize(req.body.rating),
            comment: sanitize(req.body.comment),
        };

        album.reviews.push(review);

        const totalRatings = album.reviews.reduce((sum, r) => sum + r.rating, 0);
        album.averageRating = totalRatings / album.reviews.length;

        await album.save();
        res.redirect(`/album/${album._id}`);
    } catch (err) {
        console.error('Error adding review:', err);
        res.render('reviewForm', { error: 'Error adding review' });
    }
});

// User registration
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const newUser = await auth.register(
            sanitize(req.body.username),
            sanitize(req.body.email),
            req.body.password
        );
        await auth.startAuthenticatedSession(req, newUser);
        res.redirect('/');
    } catch (err) {
        console.error('Registration Error:', err);
        res.render('register', { message: err.message });
    }
});

// User login
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    try {
        const user = await auth.login(
            sanitize(req.body.username),
            req.body.password
        );
        await auth.startAuthenticatedSession(req, user);
        res.redirect('/');
    } catch (err) {
        console.error('Login Error:', err);
        res.render('login', { message: err.message });
    }
});

// User logout
app.get('/logout', async (req, res) => {
    try {
        await auth.endAuthenticatedSession(req);
        res.redirect('/');
    } catch (err) {
        console.error('Logout Error:', err);
        res.render('error', { message: 'Error logging out' });
    }
});

// Start server
const server = app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server running on port ${process.env.PORT ?? 3000}`);
});

// Sample album data for testing purposes (will remove later)
const albumData =[
    {
        title: 'Abbey Road',
        artist: 'The Beatles',
        releaseDate: new Date('1969-09-26'),
        genre: 'Rock',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg',
        averageRating: 5,
    },
    {
        title: 'Thriller',
        artist: 'Michael Jackson',
        releaseDate: new Date('1982-11-30'),
        genre: 'Pop',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png',
        averageRating: 4.8,
    },
    {
        title: 'The Dark Side of the Moon',
        artist: 'Pink Floyd',
        releaseDate: new Date('1973-03-01'),
        genre: 'Rock',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png',
        averageRating: 4.9,
    },
    {
        title: 'Astroworld',
        artist: 'Travis Scott',
        releaseDate: new Date('2018-08-03'),
        genre: 'Hip Hop',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/4/4b/Travis_Scott_-_Astroworld.png',
        averageRating: 4.7,
    },
    {
        title: 'Rumours',
        artist: 'Fleetwood Mac',
        releaseDate: new Date('1977-02-04'),
        genre: 'Rock',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG',
        averageRating: 4.9,
    },
];




// Insert sample albums into database
async function populateAlbums() {
    try {
        for (const album of albumData) {
            const existingAlbum = await Album.findOne({
                title: album.title,
                artist: album.artist,
            });

            if (!existingAlbum) {
                await Album.create(album);
            }
        }
    } catch (error) {
        console.error('Error populating albums:', error);
    }
}

// Rounding function for rating
hbs.registerHelper('roundToTwo', function (value) {
    if (typeof value === 'number') {
        return value.toFixed(2);
    }
    return value;
});

fetchAndPopulateAlbums();
populateAlbums();
export { app, server };