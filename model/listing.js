// const { model } = require('mongoose');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');
const User = require('./user.js');
// const { ref } = require('joi');

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  category: {
    type: String,
    enum: [
      'Rooms',
      'Iconic cities',
      'Castle',
      'Village',
      'Mountrest',
      'Junglehut',
      'Farms',
      'Beach',
      'ski-in/out',
      'Amazing pools',
      'Arctic',
    ],
    required: true,
  },
});

//create meddlewere for delete then delete all review
listingSchema.post('findOneAndDelete', async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model('Listing', listingSchema);
