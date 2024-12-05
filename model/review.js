const mongoose = new require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');
// const { ref } = require('joi');

const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Review', reviewSchema);
