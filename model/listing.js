// const { model } = require('mongoose');

const mongoose = new require('mongoose');
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
    url: {
      type: String,
      default: '/images/No-Image-Placeholder.svg.png',
      set: function (v) {
        return v ? v : '/images/No-Image-Placeholder.svg.png';
      },
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

//create meddlewere for delete then delete all review
listingSchema.post('findOneAndDelete', async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model('Listing', listingSchema);
