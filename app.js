const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json()); // Parses JSON data
app.use(express.urlencoded({ extended: true }));

const Listing = require('./model/listing.js');
const Review = require('./model/review.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const wrapAysnc = require('./utils/WrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));

//ejs mate
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/', (req, res) => {
  res.send('hii I am root');
});

//this is Schema validation convert as a middleware
const valideteListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errorMessage = error.details.map((d) => d.message).join(',');
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error) {
    console.log(error);
    let errorMessage = error.details.map((d) => d.message).join(',');
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};

//Index route
app.get(
  '/listings',
  wrapAysnc(async (req, res) => {
    const listingAll = await Listing.find({});
    res.render('listings/index.ejs', { listingAll });
  }),
);

//create routs
app.get('/listings/new', (req, res) => {
  res.render('listings/new.ejs');
});
// Create route
app.post(
  '/listings',
  valideteListing,
  wrapAysnc(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
  }),
);

//show routs
app.get(
  '/listings/:id',
  wrapAysnc(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs', { listing });
  }),
);

//edit routs
app.get(
  '/listings/:id/edit',
  wrapAysnc(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
  }),
);

app.put(
  '/listings/:id',
  valideteListing,
  wrapAysnc(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect('/listings');
  }),
);

//delet routs
app.delete(
  '/listings/:id',
  wrapAysnc(async (req, res) => {
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
  wrapAysnc(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); //creat new review

    listing.reviews.push(newReview); //push this new review in listing-> review arr

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  }),
);

app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page not found!'));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong!' } = err;
  res.status(statusCode).render('listings/Error.ejs', { message });
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
