// REQUIRES
const mongoose = require('mongoose');

// SHORTENING OF SCHEMA SYNTAX
const Schema = mongoose.Schema;

// SCHEMA
const BookSchema = new Schema({
    title: String,
    author: String,
    genre: String,
    country: String,
    language: String,
    description: String,
    pages: Number,
    year: Number,
});

// EXPORT
module.exports = mongoose.model('Book', BookSchema);