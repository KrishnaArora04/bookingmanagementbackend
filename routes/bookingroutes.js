const express = require('express');
const Booking = require('../models/Booking');
const router = express.Router();

// Create a booking
router.post('/create', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).send({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    res.status(400).send({ error: 'Error creating booking' });
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).send(bookings);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching bookings' });
  }
});

// Delete a booking
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(400).send({ error: 'Error deleting booking' });
  }
});

module.exports = router;
