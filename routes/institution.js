const express = require("express");
const router = express.Router();

const {
  addInstitution,
  deleteInstitution,
  updateInstitution,
  getAllInstitution,
} = require("../controllers/institutionController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

//get institutions list without login
router.route("/getAllInstitution").get(getAllInstitution);
//add institution by admin
router
  .route("/admin/addInstitution")
  .post(isAuthenticatedUser, authorizeRoles("admin"), addInstitution);
//update institution by admin
router.route("admin/updateInstitution/:id").put(
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateInstitution
);
//delete institution by admin
router
  .route("/admin/deleteInstitution/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteInstitution)

  
module.exports = router;

