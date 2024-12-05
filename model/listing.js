// const { model } = require('mongoose');

const mongoose = new require('mongoose');
const Schema = mongoose.Schema;
// const Review = require('./review.js');
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
      default: 'F:\\Project\\BlissfulWander\\No-Image-Placeholder.svg.png',
      set: function (v) {
        return !v
          ? 'F:\\Project\\BlissfulWander\\No-Image-Placeholder.svg.png'
          : v;
      },
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
});

module.exports = mongoose.model('Listing', listingSchema);
