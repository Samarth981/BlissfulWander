const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js");
const {
  isLoggedIn,
  isOwner,
  validateReview,
  isReviewAuthor,
} = require("../middleware/middleware");

const reviewController = require("../controllers/review.js");

//reviews rout
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//review delete rout
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
