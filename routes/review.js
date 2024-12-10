const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/WrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');
const Listing = require('../model/listing.js');
const Review = require('../model/review.js');
const {
  isLoggedIn,
  isOwner,
  validateReview,
  isReviewAuthor,
} = require('../middleware/middleware');

// const validateReview = (req, res, next) => {
//   const { error } = reviewSchema.validate(req.body);
//   if (error) {
//     let errorMessage = error.details.map((d) => d.message).join(','); // Combine error messages
//     throw new ExpressError(400, errorMessage);
//   } else {
//     next();
//   }
// };

//reviews rout
router.post(
  '/',
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    // listing.reviews.push(newReview._id); // Push review ID
    listing.reviews.push(newReview); // Push review ID

    await newReview.save();
    await listing.save();
    req.flash('success', 'new review created!');

    res.redirect(`/listings/${listing._id}`);
  }),
);

//review delete rout
router.delete(
  '/:reviewId',
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'review successfully deleted!');
    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
