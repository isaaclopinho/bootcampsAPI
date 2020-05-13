const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/Review");

const { getReviews, getReview, addReview, updateReview, deleteReview } = require("../controllers/reviews");

const advancedResults = require("../middlewares/advancedResults");
const { protect, authorize } = require("../middlewares/authorization");

router.route("/").get(
  advancedResults(Review, {
    path: "bootcamp",
    select: "name description",
  }),
  getReviews
).post(protect, authorize('user', 'admin'), addReview);

router.route("/:id")
    .get(getReview)
    .put(protect, authorize('user', 'admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview);
module.exports = router;
