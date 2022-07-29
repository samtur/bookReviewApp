const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Book = require('../models/books');
const { isLoggedIn, validateBook, isCreator } = require('../middleware');
const books = require('../controllers/books');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(wrapAsync(books.index))
    .post(isLoggedIn, upload.single('image'), validateBook, wrapAsync(books.addNewBook));
// .post(upload.single('image'), (req, res) => {
//     console.log(req.body, req.file);
//     res.send('image')
// })

router.get('/new', isLoggedIn, books.renderNewForm);

router.route('/:id')
    .put(isLoggedIn, isCreator, upload.single('image'), validateBook, wrapAsync(books.updateBook))
    .delete(isLoggedIn, isCreator, wrapAsync(books.deleteBook))
    .get(wrapAsync(books.showBook));

router.get('/:id/edit', isCreator, isLoggedIn, wrapAsync(books.renderEditForm));

module.exports = router;