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
    url: {
      type: String,
      default:
        'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=',
      set: function (v) {
        // Set default only if 'v' is falsy (null, undefined, or empty string)
        return v && v.trim() !== ''
          ? v
          : 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=';
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
