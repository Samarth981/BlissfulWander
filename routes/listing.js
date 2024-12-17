const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/WrapAsync.js');
const Listing = require('../model/listing.js');
const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require('../middleware/middleware');

const listingControllre = require('../controllers/listings.js');
const multer = require('multer');
const { storage } = require('../cloudconfig');
const upload = multer({ storage });

router
  .route('/')
  .get(wrapAsync(listingControllre.index)) //index
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingControllre.CreateListing),
  );

app.get('/', (req, res) => {
  res.redirect('/listings');
});

app.use('/listings', listingRout); // Ensure this is correct

//new routs
router.get('/new', isLoggedIn, listingControllre.renderNewForm);

//show routs
router
  .route('/:id')
  .get(wrapAsync(listingControllre.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingControllre.updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingControllre.destroyListing));

//edit rout
router.get(
  '/:id/edit',
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllre.editListing),
);

module.exports = router;
