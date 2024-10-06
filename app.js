const express = new require('express');
const app = express();
const mongoose = new require('mongoose');
const Listing = require('./model/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
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

//Index route
app.get('/listings', async (req, res) => {
  const listingAll = await Listing.find({});
  res.render('listings/index.ejs', { listingAll });
});

//create routs
app.get('/listings/new', (req, res) => {
  res.render('listings/new.ejs');
});

app.post('/listings', async (req, res) => {
  // console.log(req.body);

  let newListing = new Listing(req.body.listing);
  console.log(newListing);
  await newListing.save();
  res.redirect('/listings');
});

//show routs
app.get('/listings/:id', async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/show.ejs', { listing });
});

//edit routs
app.get('/listings/:id/edit', async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', { listing });
});

app.put('/listings/:id', async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect('/listings');
});

//delet routs

app.delete('/listings/:id', async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log('delete success');
  res.redirect('/listings');
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

app.listen(8080, () => {
  console.log('server is start in port 8080');
});
