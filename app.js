// REQUIRES
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Book = require('./models/books');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const expressError = require('./utils/expressError');
const { bookSchema } = require('./schemas.js')

// EXECUTIONS
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// JOI NIDDLEWARE
const validateBook = (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
};


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

// ROUTES
app.get('/books/new', (req, res) => {
    res.render('books/new');
});

app.post('/books', validateBook, wrapAsync(async (req, res, next) => {
    // if (!req.body.book) throw new expressError('Invalid Data', 400);
    const book = new Book(req.body.book);
    await book.save();
    res.redirect(`/books/${book._id}`)
}));

app.get('/books/:id/edit', wrapAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render('books/edit', { book });
}));

app.put('/books/:id', validateBook, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, { ...req.body.book }, { new: true });
    res.redirect(`/books/${book._id}`);
}));

app.delete('/books/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.redirect('/books');
}));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/books', wrapAsync(async (req, res) => {
    const books = await Book.find({});
    res.render('books/index', { books });
}));

app.get('/books/:id', wrapAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render('books/show', { book });
}));

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

