const express = require("express");
const router = express.Router();

const {
  requestDonation,
  getDonarsDetails,
  disableDonation,
  checkIfRequested,
} = require("../controllers/donationController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/enableDonation").put(isAuthenticatedUser, requestDonation);
router.route("/getDonarsDetails").get(isAuthenticatedUser, getDonarsDetails);
router.route("/disableDonation").get(isAuthenticatedUser, disableDonation);
router.route("/checkIfRequested").get(isAuthenticatedUser, checkIfRequested);

router
  .route("/admin/donars")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getDonarsDetails);

module.exports = router;
