const express = require("express");
const router = express.Router();

const {
  addInstitution,
  deleteInstitution,
  updateInstitution,
} = require("../controllers/institutionController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router
  .route("/admin/addInstitution")
  .post(isAuthenticatedUser, authorizeRoles("admin"), addInstitution);
router.route("admin/updateInstitution/:id").put(
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateInstitution
);
router
  .route("/admin/deleteInstitution/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteInstitution)
  
module.exports = router;

