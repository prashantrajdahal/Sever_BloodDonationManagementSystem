const mongoose = require("mongoose");
const validator = require("validator");
const institution = require("./institution");


const requestorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  patientName: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Your name cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: [true, "This email is already registered"],
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please enter your phone number"],
    unique: [true, "This phone number is already registered"],
    validate: [validator.isMobilePhone, "Please enter valid phone number"],
  },
  requireBloodType: {
    type: String,
    required: [true, "Please enter your blood type"],
    
  },
  covidStatus: {
    type: String,
    required: [true, "Please enter your covid status"],
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  donorLocation:{
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    },
  },
  institutionId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
  },
  institutionName:{
    type:String
  },
  institutionAddress:{
    type:String
  },
  institutionPhoneNumber:{
    type:String
  },
  institutionEmail:{
    type:String
  },
  institutionReferCode:{
    type:String
  },
  institutionLocation:{
    type: {
      type: String,
      enum: ['Point'],
      required: true,
  },
  coordinates: {
      type: [Number],
      required: true,
  },
  },
});

module.exports = mongoose.model("Requestor", requestorSchema);
