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
    image: String,
    description: String,
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// EXPORT
module.exports = mongoose.model('Book', BookSchema);