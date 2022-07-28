const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const { validateReview, isLoggedIn, isReviewCreator } = require('../middleware');
const reviews = require('../controllers/reviews');


router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.makeReview));

router.delete('/:reviewId', isReviewCreator, isLoggedIn, wrapAsync(reviews.deleteReview));

module.exports = router;
