const mongoose = require("mongoose");
const validator = require("validator");


const requestorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  patientName: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Your name cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please enter your phone number"],
    unique: true,
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
});

module.exports = mongoose.model("Requestor", requestorSchema);
