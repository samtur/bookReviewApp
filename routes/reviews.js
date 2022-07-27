const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const Book = require('../models/books');
const Review = require('../models/reviews');
const expressError = require('../utils/expressError');
const { bookSchema, reviewSchema } = require('../schemas.js');

// JOI NIDDLEWARE
const validateBook = (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
};
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
};

router.post('/', validateReview, wrapAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    const review = new Review(req.body.review);
    book.review.push(review);
    await review.save();
    await book.save();
    req.flash('success', 'You successfully created a review!');
    res.redirect(`/books/${book._id}`);
}));

router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Book.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'You successfully deleted a review!');
    res.redirect(`/books/${id}`);
}));

module.exports = router;
