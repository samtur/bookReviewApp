const expressError = require('./utils/expressError');
const { bookSchema, reviewSchema } = require('./schemas.js');
const Book = require('./models/books');
const Review = require('./models/reviews')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login')
    }
    next();
};

module.exports.isCreator = async (req, res, next) => {
    const { id } = req.params;
    const item = await Book.findById(id);
    if (!item.creator.equals(req.user._id)) {
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/books/${book._id}`)
    }
    next()
};

module.exports.validateBook = (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
};

module.exports.isReviewCreator = async (req, res, next) => {
    const { reviewId, id } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.creator.equals(req.user._id)) {
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/books/${id}`)
    }
    next()
}