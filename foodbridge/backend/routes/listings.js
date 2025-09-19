const express = require('express');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'donor') return res.status(403).json({ message: 'Only donors can create listings' });

    const { title, description, quantity, pickupLocation, pickupTime } = req.body;
    const listing = await Listing.create({
      title, description, quantity,
      pickupLocation,
      donor: req.user._id,
      pickupTime
    });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const listings = await Listing.find().populate('donor', 'name email phone').sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/claim', auth, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') return res.status(403).json({ message: 'Only NGOs can claim' });

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.status !== 'available') return res.status(400).json({ message: 'Already claimed' });

    listing.status = 'claimed';
    listing.claimedBy = req.user._id;
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/picked', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (!listing.claimedBy?.equals(req.user._id) && !listing.donor.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    listing.status = 'picked';
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;