const slots = [
"09:00 AM","10:00 AM","11:00 AM","12:00 PM",
"01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"
]

// DATE PICKER
flatpickr("#datePicker", {
  minDate: "today",
  dateFormat: "Y-m-d",
  onChange: function(selectedDates, dateStr) {
    console.log("Date selected:", dateStr)
    loadSlots(dateStr)
  }
})

// LOAD SLOTS
async function loadSlots(date){

if(!date) return

const timeSelect = document.getElementById("timeSlots")
timeSelect.innerHTML = ""

// Default option
const defaultOption = document.createElement("option")
defaultOption.text = "Select Time Slot"
defaultOption.disabled = true
defaultOption.selected = true
timeSelect.appendChild(defaultOption)

try{

const res = await fetch("http://localhost:5000/bookedSlots?date=" + date)
const booked = await res.json()

slots.forEach(slot=>{

const option = document.createElement("option")
option.value = slot
option.text = slot

if(booked.includes(slot)){
option.disabled = true
option.text = slot + " (Booked)"
}

timeSelect.appendChild(option)

})

}catch(error){

console.log("Error loading slots:", error)

// fallback (show all slots)
slots.forEach(slot=>{
const option = document.createElement("option")
option.value = slot
option.text = slot
timeSelect.appendChild(option)
})

}

}

// BOOK APPOINTMENT
async function book(){

const service = document.getElementById("service").value
const date = document.getElementById("datePicker").value
const time = document.getElementById("timeSlots").value
const mobile = document.getElementById("mobile").value
const location = document.getElementById("location").value

// VALIDATION
if(!service || !date || !time || !mobile || !location){
alert("Please fill all fields")
return
}

// mobile validation
if(mobile.length !== 10 || isNaN(mobile)){
alert("Enter valid 10-digit mobile number")
return
}

try{

const res = await fetch("http://localhost:5000/booking",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
service,
date,
time,
mobile,
location
})
})

const data = await res.json()
alert(data.message)

}catch(error){
console.log(error)
alert("Booking failed")
}

}

// GET LOCATION
function getLocation(){

if(!navigator.geolocation){
alert("Geolocation not supported")
return
}

navigator.geolocation.getCurrentPosition(

async (position)=>{

const lat = position.coords.latitude
const lon = position.coords.longitude

console.log("Lat:", lat, "Lon:", lon)

try{

const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
const data = await res.json()

document.getElementById("location").value = data.display_name

}catch(err){
console.log(err)
alert("Failed to fetch location")
}

},

(error)=>{

console.log(error)

if(error.code === 1){
alert("Permission denied. Allow location access.")
}else{
alert("Unable to get location")
}

}

)

}