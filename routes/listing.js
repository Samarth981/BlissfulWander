const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/WrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require('../schema.js');
const Listing = require('../model/listing.js');
// const {
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   validateReview,
//   isReviewAuthor,
// } = require('../middleware/middleware');

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); // Validate schema
  if (error) {
    let errorMessage = error.details.map((d) => d.message).join(','); // Combine error messages
    throw new ExpressError(400, errorMessage); // Pass error to next middleware
  } else {
    next();
  }
};

//Index route
router.get(
  '/',
  wrapAsync(async (req, res) => {
    const listingAll = await Listing.find({});
    res.render('listings/index.ejs', { listingAll });
  }),
);

//new routs
router.get('/new', (req, res) => {
  res.render('listings/new.ejs');
});

//show routs
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    if (!listing) {
      req.flash('error', 'listing is does not exist!');
      res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listing });
  }),
);

// Create route
router.post(
  '/',
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash('success', 'new listing created!');
    res.redirect('/listings');
  }),
);

//edit rout
router.get(
  '/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash('error', 'Listing does not exist!');
      return res.redirect('/listings');
    }

    req.flash('success', 'Listing updated!');
    res.render('listings/edit.ejs', { listing });
  }),
);

//Update rout
router.put(
  '/:id',
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash('success', 'listing updated!');
    res.redirect(`/listings/${id}`);
  }),
);

//delete routs
router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findOneAndDelete({ _id: id });
    req.flash('success', 'listing successfully deleted!');
    res.redirect('/listings');
  }),
);

module.exports = router;
