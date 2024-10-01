const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../model/listing.js');

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

const initDB = async () => {
  await Listing.insertMany(initData.data); //initData-> obj and key data
  console.log('data was initialized');
};

initDB();
