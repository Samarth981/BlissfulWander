// const { model } = require('mongoose');

const mongoose = new require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: {
      type: String,
      default: 'F:\\Project\\BlissfulWander\\No-Image-Placeholder.svg.png', // Default placeholder image
      set: function (v) {
        // If the user provides an empty string, use the default placeholder image
        return v === ''
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
