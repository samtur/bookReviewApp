const Book = require('../models/books');
const Review = require('../models/reviews');

module.exports.makeReview = async (req, res) => {
    const book = await Book.findById(req.params.id);
    const review = new Review(req.body.review);
    review.creator = req.user._id;
    book.review.push(review);
    await review.save();
    await book.save();
    req.flash('success', 'You successfully created a review!');
    res.redirect(`/books/${book._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Book.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'You successfully deleted a review!');
    res.redirect(`/books/${id}`);
};