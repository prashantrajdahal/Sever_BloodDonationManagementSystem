const express = require("express");
const router = express.Router();

const {
  registerRequestor,
  getAbleToDonateDonarDetails,
  selectDonor,
  getRequestorDetails,
  deleteRequestorDetails,
  getAllRequestorDetails
} = require("../controllers/requestorController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

//Done by user
router.route("/request/new").post(isAuthenticatedUser, registerRequestor);
router
  .route("/request/donar")
  .get(isAuthenticatedUser, getAbleToDonateDonarDetails);
router.route("/request/donar/select").put(isAuthenticatedUser, selectDonor);
router.route("/request/details").get(isAuthenticatedUser, getRequestorDetails);
router
  .route("/request/delete")
  .delete(isAuthenticatedUser, deleteRequestorDetails);

//Done by admin
router.route("/request/all").get(authorizeRoles("admin"), getAllRequestorDetails);

module.exports = router;
