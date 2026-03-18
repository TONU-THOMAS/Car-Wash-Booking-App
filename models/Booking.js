const mongoose = require("mongoose")

const BookingSchema = new mongoose.Schema({
service: String,
date: String,
time: String,
mobile: String,
location: String
})

module.exports = mongoose.model("Booking", BookingSchema)