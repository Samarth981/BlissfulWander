const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./model/listing.js');
const Review = require('./model/review.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/WrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');

main()
  .then(() => {
    console.log('connected to DB');
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/blissfulWander');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate); //ejs mate
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('hii I am root');
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); // Validate schema
  if (error) {
    let errorMessage = error.details.map((d) => d.message).join(','); // Combine error messages
    throw new ExpressError(400, errorMessage); // Pass error to next middleware
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body); // Validate schema
  if (error) {
    let errorMessage = error.details.map((d) => d.message).join(','); // Combine error messages
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};

//Index route
app.get(
  '/listings',
  wrapAsync(async (req, res) => {
    const listingAll = await Listing.find({});
    res.render('listings/index.ejs', { listingAll });
  }),
);

//create routs
app.get('/listings/new', (req, res) => {
  res.render('listings/new.ejs');
});

//show routs
app.get(
  '/listings/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    console.log('Populated listing:', listing);
    res.render('listings/show.ejs', { listing });
  }),
);

// Create route
app.post(
  '/listings',
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
  }),
);

//edit routs
app.get(
  '/listings/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
  }),
);

app.put(
  '/listings/:id',
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  }),
);

//delet routs
app.delete(
  '/listings/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log('delete success');
    res.redirect('/listings');
  }),
);

//reviews rout
app.post(
  '/listings/:id/reviews',
  validateReview,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    await newReview.save();

    listing.reviews.push(newReview._id); // Push review ID
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  }),
);

app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page not found!'));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render('error.ejs', { message });
});

app.listen(8080, () => {
  console.log('server is start in port 8080');
});

// app.get('/testlisting', (req, res) => {
//   let sampleListing = new Listing({
//     title: 'home',
//     description: 'By the new',
//     price: 12200,
//     location: 'Surat',
//     country: 'USA',
//   });
//   sampleListing
//     .save()
//     .then(() => console.log('image is save'))
//     .catch((err) => console.log(err));
// });

// // Remove duplicates document if exist in mongodb
// async function removeDuplicateTitles() {
//   const duplicates = await Listing.aggregate([
//     {
//       $group: {
//         _id: '$title',
//         ids: { $push: '$_id' },
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $match: {
//         count: { $gt: 1 },
//       },
//     },
//   ]);

//   for (const duplicate of duplicates) {
//     // Keep the first ID and delete the rest
//     const idsToDelete = duplicate.ids.slice(1); // all but the first

//     await Listing.deleteMany({
//       _id: { $in: idsToDelete },
//     });
//   }
// }

// // Call the function to remove duplicates
// removeDuplicateTitles()
//   .then(() => console.log('Duplicate titles removed'))
//   .catch((err) => console.log(err));
