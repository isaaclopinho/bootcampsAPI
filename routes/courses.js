const express = require("express");
const router = express.Router({ mergeParams: true });
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require("../controllers/courses");
const advancedResults = require("../middlewares/advancedResults");
const Course = require("../models/Course");
const {protect, authorize} = require('../middlewares/authorization');

router
    .route("/")
    .get(advancedResults(Course, {
        path: "bootcamp",
        select: "name description",
      }),getCourses)
    .post(protect, authorize('admin', 'publisher'), addCourse);
    

router
    .route("/:id")
    .get(getCourse)
    .put(protect, authorize('admin', 'publisher'), updateCourse)
    .delete(protect, authorize('admin', 'publisher'), deleteCourse);

module.exports = router;
