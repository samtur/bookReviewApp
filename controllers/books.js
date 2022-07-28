const Book = require('../models/books');

module.exports.index = async (req, res, next) => {
    const books = await Book.find({});
    res.render('books/index', { books });
};

module.exports.renderNewForm = (req, res) => {
    res.render('books/new');
};

module.exports.addNewBook = async (req, res, next) => {
    const book = new Book(req.body.book);
    book.creator = req.user._id;
    await book.save();
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
    req.flash('success', 'Successfully updated book!');
    res.redirect(`/books/${book._id}`);
};

module.exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
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