const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/WrapAsync.js');
const Listing = require('../model/listing.js');
const Review = require('../model/review.js');
const {
  isLoggedIn,
  isOwner,
  validateReview,
  isReviewAuthor,
} = require('../middleware/middleware');

const reviewControllre = require('../controllers/review.js');

//reviews rout
router.post(
  '/',
  isLoggedIn,
  validateReview,
  wrapAsync(reviewControllre.createReview),
);

//review delete rout
router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewControllre.deleteReview),
);

module.exports = router;
