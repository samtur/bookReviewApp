// REQUIRES
const Book = require('../models/books');
const mongoose = require('mongoose');
const books = require('./booksData')
// MONGOOSE CONNECTION
mongoose.connect('mongodb://localhost:27017/bookclub');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('db conected!')
});
// FUNCTION TO SEED DB
const seedDB = async () => {
    await Book.deleteMany();
    for (let i = 0; i < 20; i++) {
        const random = Math.floor(Math.random() * 99);
        const book = new Book({
            title: `${books[random].title}`,
            author: String,
            genre: String,
            country: String,
            language: String,
            description: String,
            pages: Number,
            year: Number,
        });
    }

    await book.save();
};
// FUNCTION CALL
seedDB();

