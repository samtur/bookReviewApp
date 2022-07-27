const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const expressError = require('../utils/expressError');
const { bookSchema, reviewSchema } = require('../schemas.js');
const Book = require('../models/books');
const { isLoggedIn } = require('../middleware');

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
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
};


router.get('/new', isLoggedIn, (req, res) => {
    res.render('books/new');
});

router.post('/', isLoggedIn, validateBook, wrapAsync(async (req, res, next) => {
    const book = new Book(req.body.book);
    await book.save();
    req.flash('success', 'Successfully added a new book!');
    res.redirect(`/books/${book._id}`)
}));

router.get('/:id/edit', isLoggedIn, wrapAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render('books/edit', { book });
}));

router.put('/:id', isLoggedIn, validateBook, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, { ...req.body.book }, { new: true });
    req.flash('success', 'Successfully updated book!');
    res.redirect(`/books/${book._id}`);
}));

router.delete('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    req.flash('success', 'You successfully deleted a book!');
    res.redirect('/books');
}));

router.get('/', wrapAsync(async (req, res) => {
    const books = await Book.find({});
    res.render('books/index', { books });
}));

router.get('/:id', wrapAsync(async (req, res) => {
    const book = await Book.findById(req.params.id).populate('review');
    if (!book) {
        req.flash('error', 'Cannot find that book!');
        return res.redirect('/books');
    }
    res.render('books/show', { book });
}));

module.exports = router;