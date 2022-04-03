const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false
    },
    phoneNumber: {  
        type: String,
        required: [true, 'Please enter your phone number'],
        unique: true,
        validate: [validator.isMobilePhone, 'Please enter valid phone number']
    },
    bloodType: {
        type: String,
        required: [true, 'Please enter your blood type']
    },
    weight :{
        type: String,
        required: [true, 'Please enter your weight']
    },
    
    avatar: {
        public_id: {
            type: String,
            required: false
        },
        url: {
            type: String,
            required: false
        }
    }, 
    covidStatus: {
        type: String,
        required: [true, 'Please enter your covid status']
    },
    donate: {
        type: Boolean,
        default: false,
    },
    status:{
        type: String,
        default: 'notUsed',
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    requestor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Requestor',
        default: null
    },
    referBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    status: {
        type: String,
        default: 'pending'
    },
    donorIsSelected: {
        default: false,
    }
});


// Encrypting password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Return JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken

}

module.exports = mongoose.model('User', userSchema);