// REQUIRES
const mongoose = require('mongoose');
const Review = require('./reviews');

// SHORTENING OF SCHEMA SYNTAX
const Schema = mongoose.Schema;



// SCHEMA
const BookSchema = new Schema({
    title: String,
    author: String,
    image:
    {
        path: String,
        filename: String
    },
    genre: String,
    country: String,
    language: String,
    description: String,
    pages: Number,
    year: Number,
    description: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});


// MIDDLEWARE TO DELETE
BookSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.review,
            }
        })
    }
});

// EXPORT
module.exports = mongoose.model('Book', BookSchema);