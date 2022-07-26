const Book = require('../models/books');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res, next) => {
    let noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const books = await Book.find({ title: regex });
        if (books.length < 1) {
            noMatch = "Sorry we couldn't find anything, please try again..."
        }
        return res.render('books/index', { books, noMatch });
    } else {
        const books = await Book.find({});
        res.render('books/index', { books, noMatch });
    }
};


module.exports.renderNewForm = (req, res) => {
    res.render('books/new');
};

module.exports.addNewBook = async (req, res, next) => {
    const book = new Book(req.body.book);
    book.image = (({ path, filename }) => ({ path, filename }))(req.file);
    book.creator = req.user._id;
    await book.save();
    console.log(book);
    req.flash('success', 'Successfully added a new book!');
    res.redirect(`/books/${book._id}`)
};

module.exports.renderEditForm = async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render('books/edit', { book });
};

module.exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, { ...req.body.book }, { new: true });
    const img = (({ path, filename }) => ({ path, filename }))(req.file);
    book.image = img;
    await book.save();
    req.flash('success', 'Successfully updated book!');
    res.redirect(`/books/${book._id}`);
};

module.exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(req.params.id);
    await Book.findByIdAndDelete(id);
    await cloudinary.uploader.destroy(book.image.filename);
    req.flash('success', 'You successfully deleted a book!');
    res.redirect('/books');
};

module.exports.showBook = async (req, res) => {
    const book = await Book.findById(req.params.id).populate({
        path: 'review',
        populate: {
            path: 'creator'
        }
    }).populate('creator');
    console.log(book)
    if (!book) {
        req.flash('error', 'Cannot find that book!');
        return res.redirect('/books');
    }
    res.render('books/show', { book });
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};