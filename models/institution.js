const mongoose = require('mongoose');
const validator = require('validator');

const institutionSchema = new mongoose.Schema({
    institutionName: {
        type: String,
        required: [true, "Please enter your institution name"],
        maxLength: [30, "Your institution name cannot exceed 30 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email address"],
    },
    phoneNumber: {
        type: String,
        required: [true, "Enter your phone number"],
        unique: true,
        validate: [validator.isMobilePhone, "Please enter valid phone number"],
    },
    address: {
        type: String,
        required: [true, "Please enter your address"],
        maxLength: [30, "Your address cannot exceed 30 characters"],
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
            unique: true,
        },
    },
    referCode: {
        type: String,
        required: [true, "Please enter your refer code"],
        length: [6, "Your refer code cannot exceed 6 characters"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        
    },
});

module.exports = mongoose.model('Institution', institutionSchema);


