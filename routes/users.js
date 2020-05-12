const User = require("../models/User");
const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
} = require("../controllers/users");

const advancedResults = require("../middlewares/advancedResults");
const { protect, authorize } = require("../middlewares/authorization");

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
