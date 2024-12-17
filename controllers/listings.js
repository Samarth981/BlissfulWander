const Listing = require('../model/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index
module.exports.index = async (req, res, next) => {
  const { category } = req.query; // Get the category from the query params

  let listingAll;

  if (category) {
    listingAll = await Listing.find({ category: category });
  } else {
    listingAll = await Listing.find({});
  }

  // Render the listings page with filtered listings and category info
  res.render('listings/index.ejs', { listingAll, category });
};

//new
module.exports.renderNewForm = (req, res) => {
  res.render('listings/new.ejs');
};

module.exports.CreateListing = async (req, res, next) => {
  //Geocoding
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  // console.log(response.body.features[0].geometry);
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);

  newListing.owner = req.user._id; //owner id save in db
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry; //this is come through mapbox
  let saveListing = await newListing.save();
  // console.log(saveListing);
  req.flash('success', 'new listing created!');
  res.redirect('/listings');
};

//show
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('owner');
  if (!listing) {
    req.flash('error', 'listing is does not exist!');
    res.redirect('/listings');
  }
  res.render('listings/show.ejs', { listing });
};

//edit
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash('error', 'Listing does not exist!');
    return res.redirect('/listings');
  }
  let orignalImageUrl = listing.image.url;
  orignalImageUrl = orignalImageUrl.replace('/upload', '/upload/h_250,w_300'); //size is change for image
  req.flash('success', 'Listing updated!');
  res.render('listings/edit.ejs', { listing, orignalImageUrl });
};

//update
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing, //all are update with body
  });

  // Check if the location is updated, fetch new coordinates
  if (req.body.listing.location) {
    const response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();
    listing.geometry = response.body.features[0].geometry; // Update geometry
  }

  // If a new image is uploaded, update the image
  if (typeof req.file !== 'undefined') {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save(); //agine update if image is update
  }

  // Save the updated listing
  let savelisting = await listing.save();

  req.flash('success', 'listing updated!');
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findOneAndDelete({ _id: id });
  req.flash('success', 'listing successfully deleted!');
  res.redirect('/listings');
};
