// REQUIRES
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const expressError = require('./utils/expressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// DOTENV REQUIREMENTS
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// ROUTE REQUIREMENTS
const booksRoutes = require('./routes/books');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')

// EXECUTIONS
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// CONNECTING TO MONGOOSE
mongoose.connect('mongodb://localhost:27017/bookclub');

// CONNECT TO DB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('db conected!')
})

// EJS TEMPLATES LINK
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// SESSIONS
const sessionConfig = {
    secret: 'thisissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
}

app.use(session(sessionConfig));

// FLASH
app.use(flash());

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// MIDDLEWARE
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})

// ROUTES
app.use('/', userRoutes);
app.use('/books', booksRoutes);
app.use('/books/:id/reviews', reviewsRoutes)


app.get('/', (req, res) => {
    res.render('home');
});



// ERROR HANDLER
app.all('*', (req, res, next) => {
    next(new expressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    if (!err.message) err.message = 'Oh no! You have an error!';
    res.status(statusCode).render('errors', { err });
})

// LISTENING
app.listen(3000, () => {
    console.log('Serving on port 3000')
});

