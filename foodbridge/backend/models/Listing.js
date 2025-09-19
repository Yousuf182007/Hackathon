const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  quantity: String,
  pickupLocation: {
    address: String,
    lat: Number,
    lng: Number
  },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['available','claimed','picked'], default: 'available' },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
  pickupTime: Date
});

module.exports = mongoose.model('Listing', listingSchema);