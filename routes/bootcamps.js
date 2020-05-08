const express = require("express");
const router = express.Router();
const {
  getBootcamps,
  postBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcamp,
  getBootcampsInRadius
} = require("../controllers/bootcamps");

router
  .route('/radius/:zipcode/:distance')
  .get(getBootcampsInRadius);

router
    .route("/")
    .get(getBootcamps)
    .post(postBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

// router.get("/", (req, res) => {
//   getBootcamps(req, res);
// });

// router.get("/:id", (req, res) => {
//   getBootcamp(req, res);
// });

// router.post("/", (req, res) => {
//   postBootcamp(req, res);
// });

// router.put("/:id", (req, res) => {
//   updateBootcamp(req, res);
// });

// router.delete("/:id", (req, res) => {
//   deleteBootcamp(req, res);
// });

module.exports = router;
