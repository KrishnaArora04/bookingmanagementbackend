const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/restaurant';
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Booking Schema
const bookingSchema = new mongoose.Schema({
    name: String,
    contact: String,
    date: String,
    time: String,
    guests: Number,
});
const Booking = mongoose.model('Booking', bookingSchema);

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Restaurant Backend!');
});

// Fetch Bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).send('Error fetching bookings: ' + err.message);
    }
});

// Create Booking
app.post('/api/bookings/create', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.json({ message: 'Booking created successfully!' });
    } catch (err) {
        res.status(500).send('Error creating booking: ' + err.message);
    }
});

// Fetch Available and Booked Slots
app.get('/api/slots', async (req, res) => {
    const { date } = req.query;

    // Example: Predefined slots (these can be customized)
    const predefinedSlots = [
        "12:00",
        "12:30",
        "1:00",
        "1:30",
        "2:00",
        "2:30",
        "3:00",
    ];

    try {
        // Find all bookings for the given date
        const bookings = await Booking.find({ date });

        // Get all booked times
        const bookedTimes = bookings.map((booking) => booking.time);

        // Calculate available slots
        const availableSlots = predefinedSlots.filter(
            (slot) => !bookedTimes.includes(slot)
        );

        res.json({
            date,
            bookedSlots: bookings,
            availableSlots,
        });
    } catch (err) {
        res.status(500).send('Error fetching slots: ' + err.message);
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
