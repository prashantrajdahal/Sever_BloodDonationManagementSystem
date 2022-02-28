const User = require("../models/user");
const Institution = require("../models/institution");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Requestor = require("../models/requestor");

//register requestor details
exports.registerRequestor = catchAsyncErrors(async (req, res, next) => {
  const { patientName, email, phoneNumber, requireBloodType, covidStatus, institutionId, referCode } =
    req.body;
  const institution = await Institution.findById(institutionId);
  if (!institution) {
    return next(new ErrorHandler(404, "Institution not found"));
  }
  if (institution.referCode !== referCode) {
    return next(new ErrorHandler(400, "Invalid Refer Code"));
  }
  else{
    const requestor = await Requestor.create({
      patientName,
      email,
      phoneNumber,
      requireBloodType,
      covidStatus,
      user: req.user._id,
      institutionid: institutionId,
      institutionName: institution.name,
      institutionAddress: institution.address,
      institutionPhoneNumber: institution.phoneNumber,
      institutionEmail: institution.email,
      institutionReferCode: institution.referCode,
      institutionLocation : institution.location
    });
  
    res.status(200).json({
      success: true,
      requestor,
    });
  }
  
});

//find all user who is able to donate
exports.getAbleToDonateDonarDetails = catchAsyncErrors(
  async (req, res, next) => {
    const requestors = await Requestor.find({
      requireBloodType: req.user.bloodType,
      covidStatus: req.user.covidStatus,
    });
    const donor = await User.find({
      donate: true,
      bloodType: req.user.bloodType,
      covidStatus: req.user.covidStatus,
    });
    res.status(200).json({
      success: true,
      donor,
      requestors,
    });
  }
);

//select a user to donate
exports.selectDonor = catchAsyncErrors(async (req, res, next) => {
  const { donor } = req.body;
  const donorUser = await User.findById(donor);
  const updateRequestor = await Requestor.findOneAndUpdate(
    { user: req.user._id },
    { donor: donorUser._id, donorLocation: donorUser.location },
    { new: true }
  );
  const updatedDonor = await User.findByIdAndUpdate(
    donorUser._id,
    { requestor: updateRequestor._id, referBy: req.user._id },
    { new: true }
  );

  res.status(200).json({
    success: true,
    updateRequestor,
  });
});


//get user requestor details
exports.getRequestorDetails = catchAsyncErrors(async (req, res, next) => {
  const requestor = await Requestor.findOne({ user: req.user._id });
  res.status(200).json({
    success: true,
    requestor,
  });
} );

//delete user requestor details
exports.deleteRequestorDetails = catchAsyncErrors(async (req, res, next) => {
  const requestor = await Requestor.findOneAndDelete({ user: req.user._id });
  res.status(200).json({
    success: true,
    requestor,
  });
} );

//get all requestor details-admin
exports.getAllRequestorDetails = catchAsyncErrors(async (req, res, next) => {
  const requestors = await Requestor.find({});
  res.status(200).json({
    success: true,
    requestors,
  });
} );

