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
            image: "https://images.unsplash.com/photo-1621944190310-e3cca1564bd7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed elit eget elit sodales ultrices. In in massa eros. Vestibulum cursus eu enim vel semper. Praesent pulvinar tortor non lacus eleifend, eu convallis dui accumsan. Pellentesque vulputate lectus sit amet gravida facilisis. Proin nibh orci, auctor a cursus non, dignissim sed ipsum. Duis sed massa pharetra, euismod augue sit amet, iaculis massa.'
        })
        await book.save();
    }
};
// FUNCTION CALL
seedDB().then(() => {
    mongoose.connection.close();
});

