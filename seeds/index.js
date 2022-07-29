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
            creator: '62e0de6f532fb04b301ee581',
            author: `${books[random].author}`,
            country: `${books[random].country}`,
            language: `${books[random].language}`,
            pages: `${books[random].pages}`,
            year: `${books[random].year}`,
            image: {
                path: 'https://res.cloudinary.com/denecgcsf/image/upload/v1659078305/BookClub/mediamodifier-kML003ksO_0-unsplash_mwbntu.jpg',
                filename: 'BookClub/mediamodifier-kML003ksO_0-unsplash_mwbntu',
            },
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed elit eget elit sodales ultrices. In in massa eros. Vestibulum cursus eu enim vel semper. Praesent pulvinar tortor non lacus eleifend, eu convallis dui accumsan. Pellentesque vulputate lectus sit amet gravida facilisis. Proin nibh orci, auctor a cursus non, dignissim sed ipsum. Duis sed massa pharetra, euismod augue sit amet, iaculis massa.'
        })
        await book.save();
    }
};
// FUNCTION CALL
seedDB().then(() => {
    mongoose.connection.close();
});

