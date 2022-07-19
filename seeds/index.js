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
    const b = new Book({ title: 'How to Kill a Mocking Bird' });
    await b.save();
};
// FUNCTION CALL
seedDB();

