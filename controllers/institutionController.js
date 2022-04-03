const Institution = require("../models/institution");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
//add institution -admin
exports.addInstitution = catchAsyncErrors(async (req, res, next) => {
  const { institutionName, email, phoneNumber, address, location, referCode } =
    req.body;
  const institution = await Institution.create({
    institutionName,
    email,
    phoneNumber,
    address,
    location,
    referCode,
    createBy: req.user._id,
  });
  res.status(201).json({
    status: "success",
    data: {
      institution,
    },
  });
});

//update institution -admin
exports.updateInstitution = catchAsyncErrors(async (req, res, next) => {
  const { institutionName, email, phoneNumber, address, location, referCode } =
    req.body;
  const institution = await Institution.findByIdAndUpdate(
    req.params.id,
    {
      institutionName,
      email,
      phoneNumber,
      address,
      location,
      referCode,
      updateBy: req.user._id,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    status: "success",

    institution,
  });
});

//delete institution -admin
exports.deleteInstitution = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const institution = await Institution.findByIdAndDelete(id);

  sendToken(institution, 200, res);
});

//get all institution list
exports.getAllInstitution = catchAsyncErrors(async (req, res, next) => {
  const institutions = await Institution.find();
  res.status(200).json({
    status: "success",
    institutions,
  });
});
