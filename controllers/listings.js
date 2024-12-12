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
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; //owner id save in db
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

  req.flash('success', 'Listing updated!');
  res.render('listings/edit.ejs', { listing });
};

//update
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  // Check if the image.url is empty and replace it with the default value
  //   if (!req.body.listing.image || !req.body.listing.image.url.trim()) {
  //     req.body.listing.image = { url: 'F:\Project\BlissfulWander-\public\images\No-Image-Placeholder.svg.png' };
  //   }
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash('success', 'listing updated!');
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findOneAndDelete({ _id: id });
  req.flash('success', 'listing successfully deleted!');
  res.redirect('/listings');
};
