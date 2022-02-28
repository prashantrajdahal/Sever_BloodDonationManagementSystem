const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Requestor = require('../models/requestor');

// Request for donation a user   => /api/v1/requestDonation
exports.requestDonation = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        donate: req.body.donate,
        location: {
            type: 'Point',
            coordinates: [req.body.longitude, req.body.latitude],
        },
    }
     
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })

})

//disable donation
exports.disableDonation = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        donate: req.body.donate,
        location: {
            type: 'Point',
            coordinates: null,
        },
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    
    res.status(200).json({
        success: true,
        user
    })
})

//check if user has requested for donation
exports.checkIfRequested = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if(user.requestor) {
        const requestor = await Requestor.findById(user.requestor);
        res.status(200).json({
            success: true,
            requestor
        })
    } else {
        res.status(200).json({
            success: true,
            requestor: null
        })
    }
})




// Get all donars   =>   /api/v1/admin/donars
exports.getDonarsDetails = catchAsyncErrors(async (req, res, next) => {
    const donars = await User.find({ donate:true }).exec();

    res.status(200).json({
        success: true,
        donars
    })
})