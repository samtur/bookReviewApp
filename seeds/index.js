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
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 99);
        const book = new Book({
            title: `${books[random].title}`,
            author: `${books[random].author}`,
            country: `${books[random].country}`,
            language: `${books[random].language}`,
            pages: `${books[random].pages}`,
            year: `${books[random].year}`,
        })
        await book.save();
    }
};
// FUNCTION CALL
seedDB().then(() => {
    mongoose.connection.close();
});

