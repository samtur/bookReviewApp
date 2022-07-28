const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Book = require('../models/books');
const { isLoggedIn, validateBook, isCreator } = require('../middleware');
const books = require('../controllers/books');


router.route('/')
    .get(wrapAsync(books.index))
    .post(isLoggedIn, validateBook, wrapAsync(books.addNewBook))

router.get('/new', isLoggedIn, books.renderNewForm);

router.route('/:id')
    .put(isLoggedIn, isCreator, validateBook, wrapAsync(books.updateBook))
    .delete(isLoggedIn, isCreator, wrapAsync(books.deleteBook))
    .get(wrapAsync(books.showBook))

router.get('/:id/edit', isCreator, isLoggedIn, wrapAsync(books.renderEditForm));

module.exports = router;