const Listing = require('../model/listing.js');

//index
module.exports.index = async (req, res) => {
  const listingAll = await Listing.find({});
  res.render('listings/index.ejs', { listingAll });
};

//new
module.exports.renderNewForm = (req, res) => {
  res.render('listings/new.ejs');
};

module.exports.CreateListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; //owner id save in db
  newListing.image = { url, filename };
  await newListing.save();

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
  if (typeof req.file !== 'undefined') {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save(); //agine update if image is update
  }
  req.flash('success', 'listing updated!');
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findOneAndDelete({ _id: id });
  req.flash('success', 'listing successfully deleted!');
  res.redirect('/listings');
};
