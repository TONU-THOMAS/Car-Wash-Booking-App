const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

/* MIDDLEWARE */
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

/* DATABASE CONNECTION */

// Use environment variable (for deployment)
// fallback to local connection (for testing)
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://tonutonuthomas:Giny%402003@cluster0.eziel.mongodb.net/carwashDB?retryWrites=true&w=majority"

mongoose.connect(MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err))

/* MODELS */
const Booking = require("./models/Booking")

/* BOOK APPOINTMENT */
app.post("/booking", async (req,res)=>{
try{

const {service,date,time,mobile,location} = req.body

if(!service || !date || !time || !mobile || !location){
return res.json({message:"All fields required"})
}

const existing = await Booking.findOne({date,time})

if(existing){
return res.json({message:"Slot already booked"})
}

const booking = new Booking({
service,
date,
time,
mobile,
location
})

await booking.save()

res.json({message:"Booking Saved Successfully"})

}catch(error){
console.log(error)
res.status(500).json({message:"Booking failed"})
}
})

/* GET BOOKED SLOTS */
app.get("/bookedSlots", async (req,res)=>{
try{

const date = req.query.date

const bookings = await Booking.find({date})
const bookedSlots = bookings.map(b => b.time)

res.json(bookedSlots)

}catch(error){
res.status(500).json({message:"Error loading slots"})
}
})

/* SERVER */
const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
console.log(`Server running on port ${PORT}`)
})