// REQUIRES
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Book = require('./models/books')

// EXECUTIONS
const app = express();

// CONNECTING TO MONGOOSE
mongoose.connect('mongodb://localhost:27017/bookclub');

// CONNECT TO DB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('db conected!')
})


// EJS TEMPLATES LINK
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// ROUTES
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/makebook', async (req, res) => {
    const book = new Book({ title: 'Harry Potter' });
    await book.save();
    res.send(book);
})

// LISTENING
app.listen(3000, () => {
    console.log('Serving on port 3000')
});

