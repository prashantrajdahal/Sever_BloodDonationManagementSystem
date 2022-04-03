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
      institutionid: institution._id,
      institutionName: institution.name,
      institutionAddress: institution.address,
      institutionPhoneNumber: institution.phoneNumber,
      institutionEmail: institution.email,
      institutionReferCode: institution.referCode,
      institutionLocation : institution.location,
      donorIsSelected: false,
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
    const requestors = await Requestor.findOne({
      user: req.user._id,
    });
    const donor = await User.find({
      donate: true,
      bloodType: requestors.requireBloodType,
      covidStatus: requestors.covidStatus
    });
    res.status(200).json({
      success: true,
      donor,
    });
  }
);

//find ideal donor
exports.getIdealDonor = catchAsyncErrors(async (req, res, next) => {
  const requestors = await Requestor.findOne({
    user: req.user._id,
  });
  const donor = await User.find({
    donate: true,
    bloodType: requestors.requireBloodType,
    covidStatus: requestors.covidStatus,
  });
  const donorLocation= donor.map(point => {
    return {
      _id: point._id,
      latitude: point.location.coordinates[1],
      longitude: point.location.coordinates[0]
    
    }
  })
  const requestorPoint = {
    latitude: requestors.institutionLocation.coordinates[1],
    longitude: requestors.institutionLocation.coordinates[0]
  }
  const HaversineGeolocation = require("haversine-geolocation");
  const getClosetDistance = HaversineGeolocation.getClosestPoint(donorLocation, requestorPoint);
  const idealDonor = await User.findById(getClosetDistance._id);
  res.status(200).json({
    success: true,
    idealDonor,
    requestors,
    
});
});

//select a user to donate
exports.selectDonor = catchAsyncErrors(async (req, res, next) => {
  const { donor, status } = req.body;
  console.log(`donor is ${status}`);
  const donorUser = await User.findById(donor);
  console.log(donorUser);
  const updateRequestor = await Requestor.findOneAndUpdate(
    { user: req.user._id },
    { donor: donorUser._id, donorLocation: donorUser.location, donorIsSelected: true, status: status },
    { new: true }
  );
  const updatedDonor = await User.findByIdAndUpdate(
    donorUser._id,
    { requestor: updateRequestor._id, referBy: req.user._id,status:"booked" },
    { new: true }
  );

  res.status(200).json({
    success: true,
    updatedDonor,
  });
});

//get user requestor details
exports.getRequestorDetails = catchAsyncErrors(async (req, res, next) => {
  const requestor = await Requestor.findOne({ user: req.user._id });
  const donor = await User.findById(requestor.donor);
  res.status(200).json({
    success: true,
    donor,
  });
} );

//delete user requestor details
exports.deleteRequestorDetails = catchAsyncErrors(async (req, res, next) => {
  const requestor = await Requestor.findById({ user: req.body._id });
  const donor = await User.findOneAndUpdate(
    { _id: requestor.donor },
    { requestor: null, status: "notUsed" },
  )
  await Requestor.findOneAndDelete({ user: req.user._id });

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

