require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/foodbridge';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connect error', err);
    process.exit(1);
  });